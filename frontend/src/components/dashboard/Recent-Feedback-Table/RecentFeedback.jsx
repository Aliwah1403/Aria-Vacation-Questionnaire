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

const RecentFeedback = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Recent Feedbacks</CardTitle>
        <CardDescription>Latest questionnaire submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <RecentFeedbackTable columns={recentFeedbackColumns} data={data} />
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
