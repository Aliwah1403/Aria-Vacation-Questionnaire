import { Badge } from "@/components/ui/badge";

export const columns = [
  {
    accessorKey: "memberName",
    header: "Member Name",
  },
  {
    accessorKey: "stayDate",
    header: "Stay Date",
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("rating")}/5</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge variant={status === "completed" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
];
