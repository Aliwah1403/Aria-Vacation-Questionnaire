import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Service & Staff questions data
const serviceData = [
  { question: "Booking Process", rating: 88 },
  { question: "Check-in Experience", rating: 82 },
  { question: "Staff Friendliness", rating: 95 },
  { question: "Staff Knowledge", rating: 87 },
  { question: "Problem Resolution", rating: 79 },
];

// Accommodation questions data
const accommodationData = [
  { question: "Room Cleanliness", rating: 90 },
  { question: "Room Comfort", rating: 85 },
  { question: "Room Amenities", rating: 78 },
  { question: "Room Maintenance", rating: 83 },
  { question: "Room Size", rating: 88 },
];

// Facilities questions data
const facilitiesData = [
  { question: "Pool Area", rating: 92 },
  { question: "Dining Options", rating: 85 },
  { question: "Fitness Center", rating: 78 },
  { question: "Spa Services", rating: 90 },
  { question: "Common Areas", rating: 88 },
];

// Location & Views questions data
const locationData = [
  { question: "Scenic Views", rating: 96 },
  { question: "Proximity to Attractions", rating: 88 },
  { question: "Surrounding Area", rating: 92 },
  { question: "Beach Access", rating: 94 },
  { question: "Transportation Access", rating: 82 },
];

// Health & Safety questions data
const safetyData = [
  { question: "Cleanliness Protocols", rating: 94 },
  { question: "Safety Measures", rating: 91 },
  { question: "Emergency Procedures", rating: 85 },
  { question: "Food Safety", rating: 89 },
  { question: "Security", rating: 93 },
];

// Summary data (average of each category)
const summaryData = [
  { category: "Service & Staff", rating: 86 },
  { category: "Accommodation", rating: 85 },
  { category: "Facilities", rating: 87 },
  { category: "Location & Views", rating: 90 },
  { category: "Health & Safety", rating: 90 },
];

// Chart configurations
const summaryConfig = {
  rating: {
    label: "Rating",
    color: "hsl(var(--chart-1))",
  },
};

const detailConfig = {
  rating: {
    label: "Rating",
    color: "hsl(var(--chart-1))",
  },
};

export function FeedbackCategories() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ratings by Question Group</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="safety">Health & Safety</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Average ratings across all question categories
            </p>
            <div className="">
              <ChartContainer
                config={summaryConfig}
                className="h-[320px] w-full"
              >
                <BarChart accessibilityLayer data={summaryData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent formatter={(value) => `${value}%`} />
                    }
                    cursor={false}
                  />
                  <Bar
                    dataKey="rating"
                    fill="var(--color-rating)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="service" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ratings for service and staff related questions
            </p>
            <div className="h-80">
              <ChartContainer
                config={detailConfig}
                className="h-[320px] w-full"
              >
                <BarChart accessibilityLayer data={serviceData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="question"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent formatter={(value) => `${value}%`} />
                    }
                    cursor={false}
                  />
                  <Bar
                    dataKey="rating"
                    fill="var(--color-rating)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="accommodation" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ratings for accommodation related questions
            </p>
            <div className="h-80">
              <ChartContainer
                config={detailConfig}
                className="h-[320px] w-full"
              >
                <BarChart accessibilityLayer data={accommodationData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="question"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent formatter={(value) => `${value}%`} />
                    }
                    cursor={false}
                  />
                  <Bar
                    dataKey="rating"
                    fill="var(--color-rating)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ratings for resort facilities related questions
            </p>
            <div className="h-80">
              <ChartContainer
                config={detailConfig}
                className="h-[320px] w-full"
              >
                <BarChart accessibilityLayer data={facilitiesData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="question"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent formatter={(value) => `${value}%`} />
                    }
                    cursor={false}
                  />
                  <Bar
                    dataKey="rating"
                    fill="var(--color-rating)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ratings for location and views related questions
            </p>
            <div className="h-80">
              <ChartContainer
                config={detailConfig}
                className="h-[320px] w-full"
              >
                <BarChart accessibilityLayer data={locationData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="question"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent formatter={(value) => `${value}%`} />
                    }
                    cursor={false}
                  />
                  <Bar
                    dataKey="rating"
                    fill="var(--color-rating)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ratings for health and safety related questions
            </p>
            <div className="h-80">
              <ChartContainer
                config={detailConfig}
                className="h-[320px] w-full"
              >
                <BarChart accessibilityLayer data={safetyData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="question"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent formatter={(value) => `${value}%`} />
                    }
                    cursor={false}
                  />
                  <Bar
                    dataKey="rating"
                    fill="var(--color-rating)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
