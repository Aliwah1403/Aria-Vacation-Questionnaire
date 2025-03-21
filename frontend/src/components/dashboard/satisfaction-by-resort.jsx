import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "Seaside Retreat", value: 4.2 },
  { name: "Mountain Lodge", value: 3.8 },
  { name: "Palm Paradise", value: 4.5 },
  { name: "Lake View Resort", value: 4.0 },
  { name: "Desert Oasis", value: 3.9 },
];

export function SatisfactionByResort() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Satisfaction by Resort</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                domain={[0, 5]}
              />
              <Tooltip
                formatter={(value) => [`${value}`, "Rating"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Bar
                dataKey="value"
                fill="var(--fountain-blue-400)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
