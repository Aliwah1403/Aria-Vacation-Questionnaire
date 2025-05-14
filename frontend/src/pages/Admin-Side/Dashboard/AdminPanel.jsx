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

  // Filter testimonials data
  const comments =
    formSubmissionData
      ?.filter(
        (submission) =>
          submission.additionalComments !== null &&
          submission.testimonialConsent === true &&
          submission.status === "completed"
      )
      ?.map((submission) => ({
        name: submission.memberName,
        comment: submission.additionalComments,
      })) || [];

  // Recent feedback data
  const recentFeedback =
    formSubmissionData
      ?.filter((submission) => submission.status === "completed")
      ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      ?.slice(0, 5) || [];

  // Average rating data
  const averageRatingData = formSubmissionData?.filter(
    (submission) => submission.status === "completed"
  );

  // Calculate response rates
  const responseRatesData = useMemo(() => {
    if (!formSubmissionData?.length) return [];

    const monthlyData = {};

    formSubmissionData.forEach((submission) => {
      const date = new Date(submission.createdAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          total: 0,
          completed: 0,
          responseRate: 0,
        };
      }

      monthlyData[monthKey].total++;
      if (submission.status === "completed") {
        monthlyData[monthKey].completed++;
      }
    });

    return Object.values(monthlyData)
      .map((data) => ({
        ...data,
        responseRate: Math.round((data.completed / data.total) * 100),
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [formSubmissionData]);

  // Calculate overall average satisfaction rating
  const overallSatisfactionData = useMemo(() => {
    if (!averageRatingData?.length)
      return {
        averageSatisfaction: 0,
        totalResponses: 0,
      };

    const validRatings = averageRatingData.filter(
      (submission) =>
        submission.averageRating !== null &&
        submission.averageRating !== undefined
    );

    const sum = validRatings.reduce(
      (acc, submission) => acc + submission.averageRating,
      0
    );

    return {
      averageSatisfaction:
        validRatings.length > 0 ? (sum / validRatings.length).toFixed(1) : 0,
      totalResponses: validRatings.length,
    };
  }, [averageRatingData]);

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
            <DashboardDataExport />
          </>
        }
      />

      <div className="flex flex-col gap-4 py-4 lg:px-6 px-4 md:gap-6 md:py-6">
        {/* Pass both response rates and satisfaction data to MetricCard */}
        <MetricCard
          responseRates={responseRatesData}
          satisfactionData={overallSatisfactionData}
        />

        {/* Response Rate and Satisfaction Distribution charts */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            {/* Response Rate Chart */}
            <ResponseRateChart data={responseRatesData} />
          </div>
          <div>
            {" "}
            {/* Satisfaction Distribution Chart */}
            <SatisfactionDistributionChart data={averageRatingData} />
          </div>
        </div>

        {/* Recent Feedback Table */}
        <RecentFeedback data={recentFeedback} />

        {/* Recent comments */}
        <RecentComments comments={comments} />

        {/* <FeedbackCategories /> */}
      </div>
    </>
  );
}
