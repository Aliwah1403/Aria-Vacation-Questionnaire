import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock } from "lucide-react";

export function CompletionOverview() {
  const completionRate = 100;
  const completedCount = 4;
  const pendingCount = 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 
              This would be a component showing completion statistics
              Could include a progress bar, completion percentages, etc.
            */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Form Completion</span>
              <span className="text-sm font-medium">68%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-fountain-blue-400 h-2.5 rounded-full"
                style={{ width: "68%" }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Completed</span>
              </div>
              <span className="font-medium">124</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                <span>Pending Response</span>
              </div>
              <span className="font-medium">32</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Viewed</span>
              </div>
              <span className="font-medium">18</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
