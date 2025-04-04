import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Pencil,
  Trash2,
  EllipsisIcon,
  XIcon,
  CheckIcon,
} from "lucide-react";

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
    cell: ({ row }) => {
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
            Edit form type
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Trash2 className="size-4" />
            Delete form type
          </DropdownMenuItem>

          {/* <AlertDialogTrigger>
              <DropdownMenuItem>
                <BanIcon className="mr-2 size-5" />
                Disable vehicle
              </DropdownMenuItem>
            </AlertDialogTrigger> */}
        </DropdownMenuContent>
      </DropdownMenu>;
    },
  },
];
