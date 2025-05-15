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
    label: "Response Rate",
    color: "hsl(var(--chart-1))",
  },
};

const ResponseRateChart = ({ data, selectedRange }) => {
  // Determine x-axis format based on selected range
  const xAxisTickFormatter = (value) => {
    if (selectedRange <= 7) {
      return value; // Show full date for weekly view
    } else if (selectedRange <= 30) {
      return value.split(" ")[1]; // Show only day for monthly view
    }
    return value.split(" ")[0]; // Show only month for yearly view
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Rate Trend</CardTitle>
        <CardDescription>
          {selectedRange <= 7
            ? "Daily"
            : selectedRange <= 30
            ? "Weekly"
            : "Monthly"}{" "}
          response rate percentage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[500px] w-full">
          <LineChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={16}
              height={40}
              tickFormatter={xAxisTickFormatter}
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
              defaultIndex={1}
              cursor={false}
              content={
                <ChartTooltipContent
                  labelKey="responses"
                  hideLabel
                  formatter={(value, name) => (
                    <div className="flex min-w-[130px] items-center text-xs text-muted-foreground">
                      {chartConfig[name]?.label || name}
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {value}
                        <span className="font-normal text-muted-foreground">
                          %
                        </span>
                      </div>
                    </div>
                  )}
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
    </Card>
  );
};

export default ResponseRateChart;
