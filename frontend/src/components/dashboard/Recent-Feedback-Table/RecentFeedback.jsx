import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../../ui/button";
import { ArrowRight } from "lucide-react";
import RecentFeedbackTable from "./recent-feedback-table";
import { recentFeedbackColumns } from "./columns";
import { Link } from "react-router";

// Recent feedback data
const recentFeedbackData = [
  {
    id: "12340",
    memberName: "David Lee",
    resort: "Balqis Residence",
    checkOutDate: "April 18, 2025",
    overallRating: 4.2,
    comment:
      "Great experience overall. The staff was very helpful and accommodating.",
  },
  {
    id: "12412",
    memberName: "Sarah Johnson",
    resort: "Balqis Residence",
    checkOutDate: "April 17, 2025",
    overallRating: 3.8,
    comment: "Room was clean but had issues with the air conditioning.",
  },
  {
    id: "12545",
    memberName: "Michael Chen",
    resort: "Balqis Residence",
    checkOutDate: "April 15, 2025",
    overallRating: 4.5,
    comment: "Exceptional service and beautiful views. Will definitely return!",
  },
  {
    id: "12633",
    memberName: "Emily Rodriguez",
    resort: "Balqis Residence",
    checkOutDate: "April 14, 2025",
    overallRating: 3.5,
    comment: "Good stay but the check-in process took longer than expected.",
  },
];

const RecentFeedback = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Recent Feedbacks</CardTitle>
        <CardDescription>Latest questionnaire submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <RecentFeedbackTable
          columns={recentFeedbackColumns}
          data={recentFeedbackData}
        />
      </CardContent>
      <CardFooter>
        <Link to={"/admin/questionnaires"}>
          <Button variant="ghost" className="text-fountain-blue-400">
            View All Feedback Responses
            <ArrowRight className=" size-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentFeedback;
