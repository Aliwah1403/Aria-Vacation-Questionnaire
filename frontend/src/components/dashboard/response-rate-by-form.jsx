import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { name: "Feedback", value: 68 },
  { name: "Mid-Stay", value: 57 },
  { name: "Check-out", value: 62 },
  { name: "Post-Stay", value: 78 },
];

export function ResponseRateByForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion by Form Type</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 
              Bar Chart Component would go here
              This would be a vertical bar chart showing completion rates by form type
              Example implementation:
              <BarChart
                data={formCompletionData}
                index="formType"
                categories={["completionRate"]}
                colors={["fountain-blue-400"]}
                valueFormatter={(value) => `${value}%`}
              />
            */}
        <div className="h-60 w-full bg-gray-50 flex items-center justify-center">
          <p className="text-muted-foreground">
            Bar Chart: Completion by Form Type
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
