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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const mutation = useDeleteEmailTemplate();
  const emailTemplate = row.original;

  const handleEmailTemplateDelete = () => {
    mutation.mutate(emailTemplate._id, {
      onSuccess: () => {
        setDialogOpen(false);
        setDropdownOpen(false);
        toast.success("Email Template deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete Email Template");
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
            Edit email template
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-500"
            onClick={() => {
              setDropdownOpen(false);
              setDialogOpen(true);
            }}
          >
            <Trash2 className="size-4 text-red-500" />
            Delete email template
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <p>Confirm Email Template Deletion</p>
            </AlertDialogTitle>
            <AlertDialogDescription>
              `You are about to delete this Email Template (
              {emailTemplate.emailTemplateName}) from your data. Do you want to
              proceed?`
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <LoadingButton
              variant="destructive"
              onClick={handleEmailTemplateDelete}
              loading={mutation.isPending}
            >
              {mutation.isPending ? "Deleting..." : "Delete"}
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
