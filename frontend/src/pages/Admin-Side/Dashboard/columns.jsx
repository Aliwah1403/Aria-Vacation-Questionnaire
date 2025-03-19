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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns = [
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
  //   {
  //     accessorKey: "averageRating",
  //     header: "Rating",
  //     cell: ({ row }) => {
  //       // Calculate average rating from responses
  //       const responses = row.original.responses;
  //       const satisfactionMap = {
  //         "Very Satisfied": 5,
  //         Satisfied: 4,
  //         "Somewhat Satisfied": 3,
  //         "Neither Satisfied nor Dissatisfied": 2,
  //         Dissatisfied: 1,
  //       };
  //       const numericResponses = responses
  //         .filter((r) => satisfactionMap[r.response])
  //         .map((r) => satisfactionMap[r.response]);
  //       const average =
  //         numericResponses.reduce((a, b) => a + b, 0) / numericResponses.length;
  //       return <div className="font-medium">{average.toFixed(1)}/5</div>;
  //     },
  //   },
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
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          )}
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (status != "completed") {
        return (
          // <AlertDialog>
          //   <DropdownMenu>
          //     <DropdownMenuTrigger asChild>
          //       <Button variant="ghost" className="h-8 w-8 p-0">
          //         <EllipsisHorizontalIcon className="h-4 w-4" />
          //       </Button>
          //     </DropdownMenuTrigger>
          //     <DropdownMenuContent>
          //       <DropdownMenuLabel>Actions</DropdownMenuLabel>

          //       <DropdownMenuSeparator />

          //       <DropdownMenuItem onSelect={() => handleEdit(vehicle)}>
          //         <Pencil1Icon className="mr-2 size-5" />
          //         Edit vehicle details
          //       </DropdownMenuItem>

          //       <AlertDialogTrigger>
          //         <DropdownMenuItem>
          //           <BanIcon className="mr-2 size-5" />
          //           Disable vehicle
          //         </DropdownMenuItem>
          //       </AlertDialogTrigger>
          //     </DropdownMenuContent>
          //   </DropdownMenu>

          //   <AlertDialogContent>
          //     <AlertDialogHeader>
          //       <AlertDialogTitle>
          //         <p>
          //           Are you sure you want to disable vehicle{" "}
          //           <span className="uppercase">{registration}</span> ?
          //         </p>
          //       </AlertDialogTitle>
          //       <AlertDialogDescription>
          //         This vehicle is about to be disabled. You will still be able to
          //         see the data associated with it
          //       </AlertDialogDescription>
          //     </AlertDialogHeader>
          //     <AlertDialogFooter>
          //       <AlertDialogCancel>Cancel</AlertDialogCancel>
          //       <AlertDialogAction
          //         // make use of loader button
          //         className={cn("bg-tiber-950 hover:bg-tiber-950/90 text-white")}
          //         onClick={() => toggleVehicleStatus(vehicle._id)}
          //       >
          //         Continue
          //       </AlertDialogAction>
          //     </AlertDialogFooter>
          //   </AlertDialogContent>
          // </AlertDialog>

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
                <BellRingIcon className="size-4" />
                Send Reminder
              </DropdownMenuItem>

              <DropdownMenuItem>
                <PencilIcon className="size-4" />
                Edit stay details
              </DropdownMenuItem>

              {/* <AlertDialogTrigger>
              <DropdownMenuItem>
                <BanIcon className="mr-2 size-5" />
                Disable vehicle
              </DropdownMenuItem>
            </AlertDialogTrigger> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    },
  },
];
