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
  ChartTooltipContent,
  ChartTooltip,
} from "@/components/ui/chart";

const chartData = [
  {
    satisfaction: "verySatisfied",
    level: 42,
    fill: "var(--color-verySatisfied)",
  },
  { satisfaction: "satisfied", level: 28, fill: "var(--color-satisfied)" },
  { satisfaction: "neutral", level: 15, fill: "var(--color-neutral)" },
  {
    satisfaction: "dissatisfied",
    level: 10,
    fill: "var(--color-dissatisfied)",
  },
  {
    satisfaction: "veryDissatisfied",
    level: 4,
    fill: "var(--color-veryDissatisfied)",
  },
];
const chartConfig = {
  level: {
    label: "Members",
  },
  verySatisfied: {
    label: "Very Satisfied",
    color: "#22c55eb3",
  },
  satisfied: {
    label: "Satisfied",
    color: "#4ade80b3",
  },
  neutral: {
    label: "Neutral",
    color: "#facc15b3",
  },
  dissatisfied: {
    label: "Dissatisfied",
    color: "#fb923cb3",
  },
  veryDissatisfied: {
    label: "Very Dissatisfied",
    color: "#ef4444b3",
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
          className="mx-auto aspect-square h-[500px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                   nameKey="satisfaction"
                  indicator="line"
                />
              }
            />

            <Pie data={chartData} dataKey="level" />
            <ChartLegend
              content={<ChartLegendContent nameKey="satisfaction" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SatisfactionDistributionChart;
