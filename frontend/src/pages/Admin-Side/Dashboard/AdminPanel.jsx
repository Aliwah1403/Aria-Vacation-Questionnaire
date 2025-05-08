import AdminPageHeader from "@/components/admin-page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SatisfactionByResort } from "@/components/dashboard/satisfaction-by-resort";
import { CompletionOverview } from "@/components/dashboard/completion-overview";
import { ResponseRateByForm } from "@/components/dashboard/response-rate-by-form";
import { FeedbackCategories } from "@/components/dashboard/feedback-categories";
import { ServiceQualityInsights } from "@/components/dashboard/service-quality-insights";

import RecentFeedbackTable from "@/components/dashboard/recent-feedback-table";
import ResponseRateChart from "@/components/dashboard/response-rate-chart";
import SatisfactionDistributionChart from "@/components/dashboard/satisfaction-distribution-chart";

// Question group ratings data
const questionGroupData = [
  { group: "Service Quality", rating: 85 },
  { group: "Accommodation", rating: 78 },
  { group: "Facilities", rating: 82 },
  { group: "Location & Views", rating: 90 },
  { group: "Health & Safety", rating: 75 },
];

// Form completion data
const formCompletionData = [
  { formType: "Check-in", completionRate: 68 },
  { formType: "Mid-Stay", completionRate: 57 },
  { formType: "Check-out", completionRate: 62 },
  { formType: "Post-Stay", completionRate: 78 },
];

export default function AdminDashboard() {
  return (
    <>
      <AdminPageHeader
        header="Dashboard"
        description="Monitor and analyze member feedback"
      />

      {/* Layout 2 */}
      <div className=" flex flex-col gap-4 py-4 lg:px-6 px-4 md:gap-6 md:py-6">
        {/* KPI Cards */}
        <MetricCard />

        {/* Response Rate and Satisfaction Distribution charts */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            {/* Response Rate Chart */}
            <ResponseRateChart />
          </div>
          <div>
            {" "}
            {/* Satisfaction Distribution Chart */}
            <SatisfactionDistributionChart />
          </div>
        </div>

        {/* Question Group Ratings Bar Chart */}
        <FeedbackCategories />

        {/* Two Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {/* Completion by Form Type */}
          {/* <ResponseRateByForm /> */}

          {/* Completion Overview */}
          {/* <CompletionOverview /> */}
        </div>

        {/* Recent Feedback Table */}
        <RecentFeedbackTable />
      </div>
    </>
  );
}
