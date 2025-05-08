import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
const chartData = [
  { browser: "verySatisfied", level: 42, fill: "var(--color-verySatisfied)" },
  { browser: "satisfied", level: 28, fill: "var(--color-satisfied)" },
  { browser: "neutral", level: 15, fill: "var(--color-neutral)" },
  { browser: "dissatisfied", level: 10, fill: "var(--color-dissatisfied)" },
  { browser: "veryDissatisfied", level: 4, fill: "var(--color-veryDissatisfied)" },
];
const chartConfig = {
  level: {
    label: "Satisfaction Level",
  },
  verySatisfied: {
    label: "Very Satisfied",
    color: "hsl(var(--chart-1))",
  },
  satisfied: {
    label: "Satisfied",
    color: "hsl(var(--chart-2))",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--chart-3))",
  },
  dissatisfied: {
    label: "Dissatisfied",
    color: "hsl(var(--chart-4))",
  },
  veryDissatisfied: {
    label: "Very Dissatisfied",
    color: "hsl(var(--chart-5))",
  },
};

const SatisfactionDistributionChart = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Satisfaction Distribution</CardTitle>
        <CardDescription>Overall satisfaction levels</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[500px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="level" />
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SatisfactionDistributionChart;
