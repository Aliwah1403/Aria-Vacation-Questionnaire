import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  responseRate: {
    label: "Rate",
    color: "hsl(var(--chart-1))",
  },
};

const ResponseRateChart = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Rate Trend</CardTitle>
        <CardDescription>Monthly response rate percentage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[500px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              dataKey="responseRate"
              axisLine={false}
              tickLine={false}
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, props) => [
                    `${value}%`,
                    "Response Rate",
                    `${props.payload.completed} out of ${props.payload.total} responses`,
                  ]}
                />
              }
            />
            <Line
              dataKey="responseRate"
              type="natural"
              stroke="var(--color-responseRate)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-responseRate)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
};

export default ResponseRateChart;
