import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
  PlusCircle,
  BanIcon,
  Pencil,
  Trash2,
  EllipsisIcon,
  XIcon,
  CheckIcon,
} from "lucide-react";
import { dateFormat } from "@/utils/dateFormat";
import { LoadingButton } from "@/components/ui/loading-button";
import { useDeleteFormTemplate } from "@/mutations/formTemplate/formTemplateMutations";
import { toast } from "sonner";

const FormTemplateActions = ({ row }) => {
  const [dialogType, setDialogType] = useState(null); // 'delete' or 'disable'
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const deleteMutation = useDeleteFormTemplate();

  const formTemplate = row.original;

  const handleFormTemplateDelete = () => {
    deleteMutation.mutate(formTemplate._id, {
      onSuccess: () => {
        setDialogType(null);
        setDropdownOpen(false);
        toast.success("Form Template deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete Form Template");
      },
    });
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <EllipsisIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="middle">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <Pencil className="size-4" />
            Edit form template
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setDropdownOpen(false);
              setDialogType("disable");
            }}
          >
            <BanIcon className="size-4" />
            {formTemplate.isActive ? "Disable" : "Enable"} form template
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-500"
            onClick={() => {
              setDropdownOpen(false);
              setDialogType("delete");
            }}
          >
            <Trash2 className="size-4 text-red-500" />
            Delete template
          </DropdownMenuItem>

          {/* <AlertDialogTrigger>
              <DropdownMenuItem>
                <BanIcon className="mr-2 size-5" />
                Disable vehicle
              </DropdownMenuItem>
            </AlertDialogTrigger> */}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={dialogType === "delete"}
        onOpenChange={() => setDialogType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Form Template Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {formTemplate.formTypeName}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <LoadingButton
              variant="destructive"
              onClick={handleFormTemplateDelete}
              loading={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const formTemplateColumns = [
  {
    accessorKey: "formTemplateName",
    header: "Template Name",
  },
  // {
  //   accessorKey: "formTypeName",
  //   header: "Template Name",
  // },
  {
    accessorKey: "formTypeName",
    header: "Form Type",
  },
  {
    accessorKey: "questions",
    header: "Questions",
    cell: ({ row }) => {
      const questions = row.getValue("questions");
      return <div>{questions.length}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt");
      return <div>{dateFormat(date)}</div>;
    },
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
    cell: ({ row }) => <FormTemplateActions row={row} />,
  },
];
