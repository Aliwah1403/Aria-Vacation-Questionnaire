import { Badge } from "@/components/ui/badge";
import { multiColumnFilterFn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export const columns = [
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
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge
          variant={status === "completed" ? "outline" : "outline"}
          className="capitalize"
        >
          {status === "pending" ? (
            <span
              className="size-1.5 rounded-full bg-amber-500"
              aria-hidden="true"
            ></span>
          ) : (
            <CheckIcon
              className="text-emerald-500"
              size={12}
              aria-hidden="true"
            />
          )}
          {status}
        </Badge>
      );
    },
  },
];
