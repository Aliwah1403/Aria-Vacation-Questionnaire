import { useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin-page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SatisfactionByResort } from "@/components/dashboard/satisfaction-by-resort";
import { CompletionOverview } from "@/components/dashboard/completion-overview";
import { ResponseRateByForm } from "@/components/dashboard/response-rate-by-form";
import { FeedbackCategories } from "@/components/dashboard/feedback-categories";
import { ServiceQualityInsights } from "@/components/dashboard/service-quality-insights";

import ResponseRateChart from "@/components/dashboard/response-rate-chart";
import SatisfactionDistributionChart from "@/components/dashboard/satisfaction-distribution-chart";
import RecentFeedback from "@/components/dashboard/Recent-Feedback-Table/RecentFeedback";
import RecentComments from "@/components/dashboard/recent-comments";
import { useQuery } from "@tanstack/react-query";
import { formSubmissionApi } from "@/api/formSubmissions";
import { LoaderComponent } from "@/components/data-loader";
import DateRangeSelector from "@/components/dashboard/date-range-selector";
import DashboardDataExport from "@/components/dashboard/Data-Export/data-export";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function AdminDashboard() {
  const [selectedRange, setSelectedRange] = useState(30);

  const {
    data: formSubmissionData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["formSubmissions", null],
    queryFn: () => formSubmissionApi.getAll(),
    staleTime: 1000 * 60 * 2,
  });

  const {
    responseRates,
    satisfactionData,
    recentFeedback,
    testimonials,
    currentData,
    previousData,
  } = useDashboardData(formSubmissionData, selectedRange);

  if (isPending) return <LoaderComponent />;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <>
      <AdminPageHeader
        header="Dashboard"
        description="Monitor and analyze member feedback"
        action={
          <>
            <DateRangeSelector
              selectedRange={selectedRange}
              onRangeChange={setSelectedRange}
            />
            <DashboardDataExport data={currentData} />
          </>
        }
      />

      <div className="flex flex-col gap-4 py-4 lg:px-6 px-4 md:gap-6 md:py-6">
        <MetricCard
          responseRates={responseRates}
          satisfactionData={satisfactionData}
          previousData={previousData}
        />

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <ResponseRateChart
              data={responseRates}
              selectedRange={selectedRange}
            />
          </div>
          <div>
            <SatisfactionDistributionChart data={currentData} />
          </div>
        </div>

        <RecentFeedback data={recentFeedback} />
        <RecentComments comments={testimonials} />
      </div>
    </>
  );
}
