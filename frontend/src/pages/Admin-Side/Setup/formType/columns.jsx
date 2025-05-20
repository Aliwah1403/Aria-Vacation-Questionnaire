"use client";

/* eslint-disable react-refresh/only-export-components */
import { useState, useContext } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { multiSelectFilter } from "@/lib/utils";
import {
  BanIcon,
  Pencil,
  Trash2,
  EllipsisIcon,
  XIcon,
  CheckIcon,
} from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  useDeleteFormType,
  useToggleFormTypeStatus,
} from "@/mutations/formType/formTypeMutations";
import { toast } from "sonner";
import { FormTypeContext } from "./form-type-table";

// First create a separate component for actions
const FormTypeActions = ({ row }) => {
  const [dialogType, setDialogType] = useState(null); // 'delete' or 'disable'
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { setEditingFormType, setSheetOpen } = useContext(FormTypeContext);

  const deleteMutation = useDeleteFormType();
  const toggleStatusMutation = useToggleFormTypeStatus();

  const formType = row.original;

  const handleFormTypeDelete = () => {
    deleteMutation.mutate(formType._id, {
      onSuccess: () => {
        setDialogType(null);
        setDropdownOpen(false);
        toast.success("Form type deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete form type");
      },
    });
  };

  const handleStatusToggle = () => {
    toggleStatusMutation.mutate(
      {
        id: formType._id,
        isActive: !formType.isActive,
      },
      {
        onSuccess: () => {
          setDialogType(null);
          setDropdownOpen(false);
          toast.success(
            `Form type ${
              formType.isActive ? "disabled" : "enabled"
            } successfully`
          );
        },
        onError: () => {
          toast.error(
            `Failed to ${formType.isActive ? "disable" : "enable"} form type`
          );
        },
      }
    );
  };

  const handleEditClick = () => {
    setEditingFormType(formType);
    setSheetOpen(true);
    setDropdownOpen(false);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <EllipsisIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="middle">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEditClick}>
            <Pencil className="size-4" />
            Edit form type
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setDropdownOpen(false);
              setDialogType("disable");
            }}
          >
            <BanIcon className="size-4" />
            {formType.isActive ? "Disable" : "Enable"} Form Type
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-500"
            onClick={() => {
              setDropdownOpen(false);
              setDialogType("delete");
            }}
          >
            <Trash2 className="size-4 text-red-500" />
            Delete form type
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={dialogType === "delete"}
        onOpenChange={() => setDialogType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Form Type Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {formType.formName}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <LoadingButton
              variant="destructive"
              onClick={handleFormTypeDelete}
              loading={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={dialogType === "disable"}
        onOpenChange={() => setDialogType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {formType.isActive ? "Disable" : "Enable"} Form Type
            </AlertDialogTitle>
            <AlertDialogDescription>
              {formType.isActive
                ? "This form type will no longer be available for use after disabling."
                : "This form type will be available for use after enabling."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <LoadingButton
              variant={formType.isActive ? "destructive" : "default"}
              onClick={handleStatusToggle}
              loading={toggleStatusMutation.isPending}
              className={!formType.isActive && "bg-fountain-blue-400 hover:bg-fountain-blue-400/80"}
            >
              {toggleStatusMutation.isPending
                ? "Processing..."
                : formType.isActive
                ? "Disable"
                : "Enable"}
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Then use it in your columns definition
export const formTypeColumns = [
  {
    accessorKey: "formName",
    header: "Form Name",
  },
  {
    accessorKey: "formDescription",
    header: "Description",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    filterFn: multiSelectFilter,
    accessorFn: (row) => (row.isActive ? "Active" : "Inactive"),
    cell: ({ row }) => {
      const status = row.original.isActive;
      return (
        <Badge
          variant="outline"
          className="capitalize flex items-center gap-1.5 w-fit"
        >
          {status ? (
            <CheckIcon
              className="text-emerald-500"
              size={12}
              aria-hidden="true"
            />
          ) : (
            <XIcon className="text-red-500" size={12} aria-hidden="true" />
          )}
          {status ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <FormTypeActions row={row} />,
  },
];
