import { Badge } from "@/components/ui/badge";

export const columns = [
  {
    accessorKey: "memberName",
    header: "Member Name",
  },
  {
    accessorKey: "resort",
    header: "Resort",
  },
  {
    accessorKey: "unitNo",
    header: "Unit",
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
  {
    accessorKey: "completedAt",
    header: "Submitted",
    cell: ({ row }) => {
      const date = row.getValue("completedAt");
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  },
  {
    accessorKey: "averageRating",
    header: "Rating",
    cell: ({ row }) => {
      // Calculate average rating from responses
      const responses = row.original.responses;
      const satisfactionMap = {
        "Very Satisfied": 5,
        Satisfied: 4,
        "Somewhat Satisfied": 3,
        "Neither Satisfied nor Dissatisfied": 2,
        Dissatisfied: 1,
      };
      const numericResponses = responses
        .filter((r) => satisfactionMap[r.response])
        .map((r) => satisfactionMap[r.response]);
      const average =
        numericResponses.reduce((a, b) => a + b, 0) / numericResponses.length;
      return <div className="font-medium">{average.toFixed(1)}/5</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge
          variant={status === "completed" ? "default" : "secondary"}
          className={status === "completed" ? "bg-green-500" : "bg-yellow-500"}
        >
          {status}
        </Badge>
      );
    },
  },
];
