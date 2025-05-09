import { Star } from "lucide-react";

export const recentFeedbackColumns = [
  {
    accessorKey: "id",
    header: "Member ID",
  },
  {
    accessorKey: "memberName",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("memberName");
      return <div className="capitalize">{name}</div>;
    },
  },
  {
    accessorKey: "resort",
    header: "Resort",
  },
  {
    accessorKey: "checkOutDate",
    header: "Check out",
    cell: ({ row }) => {
      const date = row.getValue("checkOutDate");
      return <div>{date}</div>;
    },
  },
  {
    accessorKey: "overallRating",
    header: "Satisfaction",
    cell: ({ row }) => {
      const rating = row.getValue("overallRating");
      return (
        <div className="flex items-center gap-1">
        <Star className="size-4 fill-fountain-blue-400 stroke-fountain-blue-400"/>
          {rating}
        </div>
      );
    },
  },
];
