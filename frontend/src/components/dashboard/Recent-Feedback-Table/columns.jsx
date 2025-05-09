import { Star } from "lucide-react";

export const recentFeedbackColumns = [
  {
    accessorKey: "memberId",
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
    cell: ({ row }) => {
      const resort = row.getValue("resort");
      return <div className="capitalize">{resort}</div>;
    },
  },
  {
    accessorKey: "checkOut",
    header: "Check Out",
    cell: ({ row }) => {
      return new Date(row.getValue("checkOut")).toLocaleDateString();
    },
  },

  //  Will create Function to calculate the overall rating
//   {
//     accessorKey: "overallRating",
//     header: "Satisfaction",
//     cell: ({ row }) => {
//       const rating = row.getValue("overallRating");
//       return (
//         <div className="flex items-center gap-1">
//           <Star className="size-4 fill-fountain-blue-400 stroke-fountain-blue-400" />
//           {rating}
//         </div>
//       );
//     },
//   },
];
