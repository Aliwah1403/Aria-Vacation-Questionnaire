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

export function MetricCard({
  responseRates,
  satisfactionData,
  previousData,
  selectedRange,
}) {
  // Calculate current period totals
  const currentTotals = responseRates.reduce(
    (acc, curr) => ({
      total: acc.total + curr.total,
      completed: acc.completed + curr.completed,
    }),
    { total: 0, completed: 0 }
  );

  // Calculate previous period totals
  const previousTotals = previousData.reduce(
    (acc, curr) => ({
      total: acc.total + curr.total,
      completed: acc.completed + curr.completed,
    }),
    { total: 0, completed: 0 }
  );

  // Calculate response rates
  const currentResponseRate = currentTotals.total
    ? Math.round((currentTotals.completed / currentTotals.total) * 100)
    : 0;
  const previousResponseRate = previousTotals.total
    ? Math.round((previousTotals.completed / previousTotals.total) * 100)
    : 0;

  // Calculate changes
  const responseRateChange = currentResponseRate - previousResponseRate;
  const responseRateTrend = responseRateChange >= 0 ? "up" : "down";

  // Calculate pending responses
  const totalSent = currentTotals.total;
  const completedResponses = currentTotals.completed;
  const pendingResponses = totalSent - completedResponses;

  // Calculate total sent change
  const totalSentChange = previousTotals.total
    ? ((totalSent - previousTotals.total) / previousTotals.total) * 100
    : 0;

  return (
    <div className="*:data-[slot=card]:from-neutral-50 *:data-[slot=card]:to-fountain-blue-50/50 grid grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between gap-2">
            Response Rate
            {responseRateChange !== 0 && (
              <CardAction>
                <Badge variant="outline">
                  {responseRateTrend === "up" ? (
                    <TrendingUp />
                  ) : (
                    <TrendingDown />
                  )}
                  {Math.abs(responseRateChange)}%
                </Badge>
              </CardAction>
            )}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currentResponseRate}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {responseRateChange !== 0 ? (
              <>
                {responseRateTrend === "up" ? "Improved" : "Decreased"} from
                previous period
                {responseRateTrend === "up" ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
              </>
            ) : (
              "No change from previous period"
            )}
          </div>
          <div className="text-muted-foreground">
            {selectedRange === 365 ? (
              <span> Comparing with previous 1 year</span>
            ) : (
              <span> Comparing with previous {selectedRange} days</span>
            )}
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
