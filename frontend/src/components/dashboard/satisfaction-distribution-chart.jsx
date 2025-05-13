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

const calculateSatisfactionDistribution = (submissions) => {
  const distribution = {
    verySatisfied: 0, // rating 5
    satisfied: 0, // rating 4
    neutral: 0, // rating 3
    dissatisfied: 0, // rating 2
    veryDissatisfied: 0, // rating 1
  };

  submissions?.forEach((submission) => {
    if (!submission.averageRating) return;

    const rating = Math.round(submission.averageRating);
    switch (rating) {
      case 5:
        distribution.verySatisfied++;
        break;
      case 4:
        distribution.satisfied++;
        break;
      case 3:
        distribution.neutral++;
        break;
      case 2:
        distribution.dissatisfied++;
        break;
      case 1:
        distribution.veryDissatisfied++;
        break;
    }
  });

  return Object.entries(distribution).map(([satisfaction, count]) => ({
    satisfaction,
    level: count,
    fill: chartConfig[satisfaction].color,
  }));
};

const SatisfactionDistributionChart = ({ data }) => {
  const chartData = calculateSatisfactionDistribution(data);
  const total = chartData.reduce((sum, item) => sum + item.level, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Satisfaction Distribution</CardTitle>
        <CardDescription>{total} Total Responses</CardDescription>
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
                  formatter={(value, name) => [
                    `${value} members (${((value / total) * 100).toFixed(1)}%)`,
                    chartConfig[name].label,
                  ]}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="level"
              nameKey="satisfaction"
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="80%"
            />
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
