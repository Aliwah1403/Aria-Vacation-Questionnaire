/* eslint-disable react-refresh/only-export-components */
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
import { LoadingButton } from "@/components/ui/loading-button";
import { useDeleteFormType } from "@/mutations/formType/formTypeMutations";
import { toast } from "sonner";

// First create a separate component for actions
const FormTypeActions = ({ row }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const mutation = useDeleteFormType();
  const formType = row.original;

  const handleFormTypeDelete = () => {
    mutation.mutate(formType._id, {
      onSuccess: () => {
        setDialogOpen(false);
        setDropdownOpen(false);
        toast.success("Form type deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete form type");
      },
    });
  };

  // return (
  //   <AlertDialog>
  //     <DropdownMenu>
  //       <DropdownMenuTrigger asChild>
  //         <Button variant="ghost" className="h-8 w-8 p-0">
  //           <EllipsisIcon className="h-4 w-4" />
  //         </Button>
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent align="middle">
  //         <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //         <DropdownMenuSeparator />
  //         <DropdownMenuItem>
  //           <Pencil className="size-4" />
  //           Edit form type
  //         </DropdownMenuItem>
  //         {/* Confirmation Dialog */}
  //         <AlertDialogTrigger>
  //           <DropdownMenuItem>
  //             <BanIcon className="size-4" />
  //             Disable form type
  //           </DropdownMenuItem>
  //           <DropdownMenuItem>
  //             <Trash2 className="size-4 text-red-500" />
  //             Delete form type
  //           </DropdownMenuItem>
  //         </AlertDialogTrigger>
  //         {/* Confirmation Dialog End */}
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //     <AlertDialogContent>
  //       <AlertDialogHeader>
  //         <AlertDialogTitle>
  //           <p>Confirm Form Type Deletion</p>
  //         </AlertDialogTitle>
  //         <AlertDialogDescription>
  //           You are about to delete this Form Type from your data. Do you
  //           want to proceed?
  //           {/* Proceeding will change the driver's status to inactive. Their
  //           data will be preserved, but they won't be available for trips. */}
  //         </AlertDialogDescription>
  //       </AlertDialogHeader>
  //       <AlertDialogFooter>
  //         <AlertDialogCancel>Cancel</AlertDialogCancel>
  //         <LoadingButton
  //           variant="destructive"
  //           // className={cn("bg-tiber-950 hover:bg-tiber-950/90 text-white")}
  //           // onClick={() => toggleDriverStatus(driver._id)}
  //         >
  //           Proceed
  //         </LoadingButton>
  //       </AlertDialogFooter>
  //     </AlertDialogContent>
  //   </AlertDialog>
  // );

  return (
    // <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
    //   <DropdownMenu>
    //     <DropdownMenuTrigger asChild>
    //       <Button variant="ghost" className="h-8 w-8 p-0">
    //         <EllipsisIcon className="h-4 w-4" />
    //       </Button>
    //     </DropdownMenuTrigger>
    //     <DropdownMenuContent align="middle">
    //       <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //       <DropdownMenuSeparator />
    //       {/* Add a disable/inactive action button - will trigger loading sonner to show its making this inactive/active */}
    //       <DropdownMenuItem>
    //         <Pencil className="size-4" />
    //         Edit form type
    //       </DropdownMenuItem>
    //       <AlertDialogTrigger asChild>
    //         <DropdownMenuItem className="text-red-600">
    //           <Trash2 className="size-4" />
    //           Delete form type
    //         </DropdownMenuItem>
    //       </AlertDialogTrigger>
    //     </DropdownMenuContent>
    //   </DropdownMenu>

    //   <AlertDialogContent>
    //     <AlertDialogHeader>
    //       <AlertDialogTitle>Confirm Form Type Deletion</AlertDialogTitle>
    //       <AlertDialogDescription>
    //         You are about to delete this Form Type from your data. Do you want
    //         to proceed?
    //       </AlertDialogDescription>
    //     </AlertDialogHeader>
    //     <AlertDialogFooter>
    //       <AlertDialogCancel onClick={() => setDialogOpen(false)}>
    //         Cancel
    //       </AlertDialogCancel>
    //       <LoadingButton
    //         variant="destructive"
    //         onClick={handleFormTypeDelete}
    //         loading={mutation.isPending}
    //       >
    //         {mutation.isPending ? "Deleting" : "Delete"}
    //       </LoadingButton>
    //     </AlertDialogFooter>
    //   </AlertDialogContent>
    // </AlertDialog>

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
          <DropdownMenuItem>
            <Pencil className="size-4" />
            Edit form type
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => {
              setDropdownOpen(false);
              setDialogOpen(true);
            }}
          >
            <Trash2 className="size-4" />
            Delete form type
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
