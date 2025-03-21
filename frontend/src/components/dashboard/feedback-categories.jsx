import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const categories = [
  { name: "Service & Staff", value: 95 },
  { name: "Accommodation", value: 83 },
  { name: "Facilities", value: 88 },
  { name: "Location & Views", value: 92 },
  { name: "Health & Safety", value: 91 },
];

export function FeedbackCategories() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ratings by Question Group</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 
            Bar Chart Component would go here
            This would be a horizontal bar chart showing ratings for each question group
            Example implementation:
            <BarChart
              data={questionGroupData}
              index="group"
              categories={["rating"]}
              colors={["fountain-blue-400"]}
              valueFormatter={(value) => `${value}%`}
            />
          */}
        <div className="h-80 w-full bg-gray-50 flex items-center justify-center">
          <p className="text-muted-foreground">
            Bar Chart: Ratings by Question Group
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
