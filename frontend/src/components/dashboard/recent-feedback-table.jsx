import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Recent feedback data
const recentFeedbackData = [
  {
    id: "12340",
    memberName: "David Lee",
    resort: "Balqis Residence",
    submittedAt: "April 18, 2025",
    overallRating: 4.2,
    comment:
      "Great experience overall. The staff was very helpful and accommodating.",
  },
  {
    id: "12412",
    memberName: "Sarah Johnson",
    resort: "Balqis Residence",
    submittedAt: "April 17, 2025",
    overallRating: 3.8,
    comment: "Room was clean but had issues with the air conditioning.",
  },
  {
    id: "12545",
    memberName: "Michael Chen",
    resort: "Balqis Residence",
    submittedAt: "April 15, 2025",
    overallRating: 4.5,
    comment: "Exceptional service and beautiful views. Will definitely return!",
  },
  {
    id: "12633",
    memberName: "Emily Rodriguez",
    resort: "Balqis Residence",
    submittedAt: "April 14, 2025",
    overallRating: 3.5,
    comment: "Good stay but the check-in process took longer than expected.",
  },
];

const RecentFeedbackTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>MemberID</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Resort</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-[300px]">Comment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentFeedbackData.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell className="font-medium">{feedback.id}</TableCell>
                <TableCell>{feedback.memberName}</TableCell>
                <TableCell>{feedback.resort}</TableCell>
                <TableCell>{feedback.submittedAt}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        feedback.overallRating >= 4
                          ? "bg-green-100 text-green-800"
                          : feedback.overallRating >= 3
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {feedback.overallRating.toFixed(1)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {feedback.comment}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentFeedbackTable;
