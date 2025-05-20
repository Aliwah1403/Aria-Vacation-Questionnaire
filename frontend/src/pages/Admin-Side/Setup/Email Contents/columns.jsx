import { useState } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  PlusCircle,
  BanIcon,
  Pencil,
  Trash2,
  EllipsisIcon,
  XIcon,
  CheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useDeleteEmailTemplate } from "@/mutations/emailTemplate/emailTemplateMutations";
import { toast } from "sonner";

const EmailTemplateActions = ({ row }) => {
  const [dialogType, setDialogType] = useState(null); // 'delete' or 'disable'
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const deleteMutation = useDeleteEmailTemplate();
  // const toggleStatusMutation = useToggleEmailTemplateStatus();
  const emailTemplate = row.original;

  const handleEmailTemplateDelete = () => {
    deleteMutation.mutate(emailTemplate._id, {
      onSuccess: () => {
        setDialogType(null);
        setDropdownOpen(false);
        toast.success("Email Template deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete Email Template");
      },
    });
  };

  // const handleStatusToggle = () => {
  //   toggleStatusMutation.mutate(emailTemplate._id, {
  //     onSuccess: () => {
  //       setDialogType(null);
  //       setDropdownOpen(false);
  //       toast.success(
  //         `Email Template ${
  //           emailTemplate.isActive ? "disabled" : "enabled"
  //         } successfully`
  //       );
  //     },
  //     onError: () => {
  //       toast.error("Failed to update Email Template status");
  //     },
  //   });
  // };

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
            Edit email template
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={() => {
              setDropdownOpen(false);
              setDialogType("disable");
            }}
          >
            <BanIcon className="size-4" />
            {emailTemplate.isActive ? "Disable" : "Enable"} template
          </DropdownMenuItem> */}
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => {
              setDropdownOpen(false);
              setDialogType("delete");
            }}
          >
            <Trash2 className="size-4 text-red-500" />
            Delete email template
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={dialogType === "delete"}
        onOpenChange={() => setDialogType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Email Template Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {emailTemplate.emailTemplateName}. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <LoadingButton
              variant="destructive"
              onClick={handleEmailTemplateDelete}
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
              {emailTemplate.isActive ? "Disable" : "Enable"} Email Template
            </AlertDialogTitle>
            <AlertDialogDescription>
              {emailTemplate.isActive
                ? "This template will no longer be available for use after disabling."
                : "This template will be available for use after enabling."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <LoadingButton
              variant={emailTemplate.isActive ? "destructive" : "default"}
              onClick={() => {
                console.log("toggle");
              }}
              // loading={toggleStatusMutation.isPending}
            >
              Proceed
              {/* {toggleStatusMutation.isPending
                ? "Processing..."
                : emailTemplate.isActive
                ? "Disable"
                : "Enable"} */}
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const emailTemplateColumns = [
  {
    accessorKey: "formTypeName",
    header: "Form Type",
  },
  {
    accessorKey: "emailTemplateName",
    header: "Template name",
  },
  {
    accessorKey: "emailSubject",
    header: "Email Subject",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    // filterFn: multiSelectFilter,
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
    cell: ({ row }) => <EmailTemplateActions row={row} />,
  },
];
