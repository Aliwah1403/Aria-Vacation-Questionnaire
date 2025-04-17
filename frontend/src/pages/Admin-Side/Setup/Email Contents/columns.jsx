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
    accessorKey: "emailSubjectLine",
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
    cell: ({ row }) => {
      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <EllipsisIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="middle">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pencil className="size-4" />
                Edit email template
              </DropdownMenuItem>
              {/* Confirmation Dialog */}
              <AlertDialogTrigger>
                <DropdownMenuItem>
                  <Trash2 className="size-4 text-red-500" />
                  Delete email template
                </DropdownMenuItem>
              </AlertDialogTrigger>
              {/* Confirmation Dialog End */}
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <p>Confirm Email Template Deletion</p>
              </AlertDialogTitle>
              <AlertDialogDescription>
                You are about to delete this Email Template from your data. Do
                you want to proceed?
                {/* Proceeding will change the driver's status to inactive. Their
                data will be preserved, but they won't be available for trips. */}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <LoadingButton
                variant="destructive"
                // className={cn("bg-tiber-950 hover:bg-tiber-950/90 text-white")}
                // onClick={() => toggleDriverStatus(driver._id)}
              >
                Proceed
              </LoadingButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
