import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

// KPI card data
const kpiData = [
  {
    name: "Average Rating",
    stat: "4.5",
    change: "+1.3%",
    color: "bg-fountain-blue-400",
    isPositive: true,
  },
  {
    name: "Response Rate",
    stat: "68",
    change: "+9.1%",
    color: "bg-fountain-blue-500",
    isPositive: true,
  },
  {
    name: "Recommendation",
    stat: "5.1%",
    change: "-4.8%",
    color: "bg-fountain-blue-600",
    isPositive: false,
  },
  {
    name: "Questionnaires Sent",
    stat: "78",
    change: "-4.8%",
    color: "bg-fountain-blue-600",
    isPositive: false,
  },
];

export function MetricCard() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((item) => (
        <Card key={item.name} className="overflow-hidden">
          <CardContent>
            <div className="flex space-x-3">
              <div className={cn(item.color, "w-1 shrink-0 rounded")} />
              <dt className="flex w-full items-center justify-between space-x-3 truncate text-sm text-muted-foreground">
                <span className="truncate">{item.name}</span>
                <span
                  className={cn(
                    "font-medium",
                    item.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {item.change}
                </span>
              </dt>
            </div>
            <div className="mt-2 pl-4">
              <dd className="text-3xl font-semibold text-foreground">
                {item.stat}
              </dd>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
