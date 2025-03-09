import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { multiColumnFilterFn } from "@/lib/utils";
import { multiSelectFilter } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

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
    header: "Member Name",
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
];
