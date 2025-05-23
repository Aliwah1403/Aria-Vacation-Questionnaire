import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { multiColumnFilterFn } from "@/lib/utils";
import { multiSelectFilter } from "@/lib/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisIcon,
  PencilIcon,
  BellRingIcon,
  LoaderIcon,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const overviewColumns = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      // Only show expander for completed rows with responses
      return row.original.status === "completed" &&
        row.original.responses?.length > 0 ? (
        <Button
          {...{
            className: "size-7 shadow-none text-muted-foreground",
            onClick: row.getToggleExpandedHandler(),
            "aria-expanded": row.getIsExpanded(),
            "aria-label": row.getIsExpanded()
              ? `Collapse responses for ${row.original.memberName}`
              : `View responses for ${row.original.memberName}`,
            size: "icon",
            variant: "ghost",
          }}
        >
          {row.getIsExpanded() ? (
            <ChevronUpIcon
              className="opacity-60"
              size={16}
              aria-hidden="true"
            />
          ) : (
            <ChevronDownIcon
              className="opacity-60"
              size={16}
              aria-hidden="true"
            />
          )}
        </Button>
      ) : null;
    },
  },
  {
    accessorKey: "memberId",
    header: "Member ID",
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "memberName",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("memberName");
      return <div className="capitalize">{name}</div>;
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "memberEmail",
    header: "Email",
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "resort",
    header: "Resort",
    cell: ({ row }) => {
      const resort = row.getValue("resort");
      return <div className="capitalize">{resort}</div>;
    },
  },
  {
    accessorKey: "unitNo",
    header: "Unit No",
  },
  {
    accessorKey: "checkIn",
    header: "Check In",
    cell: ({ row }) => {
      return new Date(row.getValue("checkIn")).toLocaleDateString();
    },
  },
  {
    accessorKey: "checkOut",
    header: "Check Out",
    cell: ({ row }) => {
      return new Date(row.getValue("checkOut")).toLocaleDateString();
    },
  },
  //   {
  //     accessorKey: "completedAt",
  //     header: "Submitted",
  //     cell: ({ row }) => {
  //       const date = row.getValue("completedAt");
  //       return date ? new Date(date).toLocaleDateString() : "-";
  //     },
  //   },
  {
    accessorKey: "averageRating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("averageRating");
      const status = row.getValue("status");
      return (
        <div className="flex items-center gap-1">
          {status === "completed" && rating != null ? (
            <>
              <Star className="size-4 fill-fountain-blue-400 stroke-fountain-blue-400" />
              <span>{`${rating.toFixed(1)}`}</span>
            </>
          ) : (
            <span>N/A</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: multiSelectFilter,
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge
          variant="outline"
          className="capitalize flex items-center gap-1.5 w-fit"
        >
          {status === "completed" ? (
            <CheckIcon
              className="text-emerald-500"
              size={12}
              aria-hidden="true"
            />
          ) : status === "pending" ? (
            <LoaderIcon className="size-1.5 text-amber-500" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          )}
          {status}
        </Badge>
      );
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const status = row.getValue("status");
  //     if (status != "completed") {
  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0">
  //               <EllipsisIcon className="h-4 w-4" />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="middle">
  //             <DropdownMenuLabel>Actions</DropdownMenuLabel>

  //             <DropdownMenuSeparator />

  //             <DropdownMenuItem>
  //               <BellRingIcon className="size-4" />
  //               Send Reminder
  //             </DropdownMenuItem>

  //             <DropdownMenuItem>
  //               <PencilIcon className="size-4" />
  //               Edit stay details
  //             </DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       );
  //     }
  //   },
  // },
];
