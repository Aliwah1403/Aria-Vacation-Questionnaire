import {
  Card,
  CardContent,
  CardDescription,
  CardAction,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  TrendingUp,
  TrendingDown,
  Users,
  Download,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MetricCard({ responseRates, satisfactionData }) {
  // Get the most recent month's data
  const currentMonth = responseRates[responseRates.length - 1] || {};
  const previousMonth = responseRates[responseRates.length - 2] || {};

  // Calculate month-over-month change for response rate
  const responseRateChange =
    currentMonth.responseRate - (previousMonth.responseRate || 0);
  const responseRateTrend = responseRateChange >= 0 ? "up" : "down";

  // Calculate total responses and pending
  const totalSent = currentMonth.total || 0;
  const completedResponses = currentMonth.completed || 0;
  const pendingResponses = totalSent - completedResponses;

  // Calculate month-over-month change for total sent
  const previousTotal = previousMonth.total || 0;
  const totalSentChange = ((totalSent - previousTotal) / previousTotal) * 100;

  return (
    <div className="*:data-[slot=card]:from-neutral-50 *:data-[slot=card]:to-fountain-blue-50/50 grid grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between gap-2">
            Response Rate
            <CardAction>
              <Badge variant="outline">
                {responseRateTrend === "up" ? <TrendingUp /> : <TrendingDown />}
                {Math.abs(responseRateChange)}%
              </Badge>
            </CardAction>
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currentMonth.responseRate || 0}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {responseRateTrend === "up" ? "Trending up" : "Trending down"} this
            month
            {responseRateTrend === "up" ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Based on last month's performance
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            Average Satisfaction
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {satisfactionData.averageSatisfaction}/5
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {completedResponses} responses this month
          </div>
          <div className="text-muted-foreground">
            From completed feedback forms
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            Pending Responses
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingResponses}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            From {totalSent} questionnaires sent
          </div>
          <div className="text-muted-foreground">Awaiting member feedback</div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            Questionnaires Sent
            <CardAction>
              <Badge variant="outline">
                {totalSentChange >= 0 ? <TrendingUp /> : <TrendingDown />}
                {Math.abs(totalSentChange).toFixed(1)}%
              </Badge>
            </CardAction>
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalSent}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {totalSentChange >= 0 ? "Increased" : "Decreased"} from last month
            {totalSentChange >= 0 ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Total questionnaires distributed
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
