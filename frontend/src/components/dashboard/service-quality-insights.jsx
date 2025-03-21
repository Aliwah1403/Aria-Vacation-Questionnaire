import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const serviceQualityData = [
  { name: "Reservation Process", value: 85 },
  { name: "Staff Service", value: 78 },
  { name: "Check-in/out Experience", value: 82 },
  { name: "Member Services", value: 88 },
];

const accommodationData = [
  { name: "Cleanliness", value: 90 },
  { name: "Comfort", value: 85 },
  { name: "Amenities", value: 75 },
  { name: "Maintenance", value: 80 },
];

const resortData = [
  { name: "Facilities", value: 82 },
  { name: "Activities", value: 70 },
  { name: "Dining", value: 85 },
  { name: "Overall Experience", value: 88 },
];

export function ServiceQualityInsights() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Quality Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="service">
          <TabsList className="mb-4">
            <TabsTrigger value="service">Service Quality</TabsTrigger>
            <TabsTrigger value="accommodation">
              Accommodation Quality
            </TabsTrigger>
            <TabsTrigger value="resort">Resort Experience</TabsTrigger>
          </TabsList>

          <TabsContent value="service" className="space-y-4">
            <p className="text-sm text-gray-500">
              Member feedback on booking process, staff, and service experiences
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceQualityData}>
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
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Rating"]}
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
          </TabsContent>

          <TabsContent value="accommodation" className="space-y-4">
            <p className="text-sm text-gray-500">
              Member feedback on room quality, cleanliness, and comfort
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accommodationData}>
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
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Rating"]}
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
          </TabsContent>

          <TabsContent value="resort" className="space-y-4">
            <p className="text-sm text-gray-500">
              Member feedback on resort facilities, activities, and overall
              experience
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resortData}>
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
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Rating"]}
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
