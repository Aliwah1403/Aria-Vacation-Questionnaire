import { useMemo } from "react";
import {
  format,
  subDays,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";

export function useDashboardData(formSubmissionData, selectedRange) {
  return useMemo(() => {
    if (!formSubmissionData?.length) {
      return {
        currentData: [],
        previousData: [],
        responseRates: [],
        satisfactionData: { averageSatisfaction: 0, totalResponses: 0 },
        recentFeedback: [],
        testimonials: [],
      };
    }

    const now = new Date();
    const currentStartDate = subDays(now, selectedRange);
    const previousStartDate = subDays(currentStartDate, selectedRange);

    // Split data into current and previous periods
    const currentData = formSubmissionData.filter((submission) =>
      isWithinInterval(new Date(submission.createdAt), {
        start: startOfDay(currentStartDate),
        end: endOfDay(now),
      })
    );

    const previousData = formSubmissionData.filter((submission) =>
      isWithinInterval(new Date(submission.createdAt), {
        start: startOfDay(previousStartDate),
        end: endOfDay(currentStartDate),
      })
    );

    // Calculate response rates with daily/weekly/monthly grouping
    const groupingFormat =
      selectedRange <= 7
        ? "MMM dd"
        : selectedRange <= 30
        ? "MMM dd"
        : "MMM yyyy";

    const responseRates = currentData.reduce((acc, submission) => {
      const dateKey = format(new Date(submission.createdAt), groupingFormat);

      if (!acc[dateKey]) {
        acc[dateKey] = { total: 0, completed: 0 };
      }

      acc[dateKey].total++;
      if (submission.status === "completed") {
        acc[dateKey].completed++;
      }

      return acc;
    }, {});

    // Transform response rates for chart
    const responseRatesData = Object.entries(responseRates).map(
      ([date, data]) => ({
        date,
        total: data.total,
        completed: data.completed,
        responseRate: Math.round((data.completed / data.total) * 100),
      })
    );

    // Calculate satisfaction data
    const completedSubmissions = currentData.filter(
      (submission) =>
        submission.status === "completed" && submission.averageRating
    );

    const satisfactionData = {
      averageSatisfaction: completedSubmissions.length
        ? (
            completedSubmissions.reduce((sum, s) => sum + s.averageRating, 0) /
            completedSubmissions.length
          ).toFixed(1)
        : 0,
      totalResponses: completedSubmissions.length,
    };

    // Get recent feedback
    const recentFeedback = currentData
      .filter((submission) => submission.status === "completed")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Get testimonials
    const testimonials = currentData
      .filter(
        (submission) =>
          submission.additionalComments &&
          submission.testimonialConsent &&
          submission.status === "completed"
      )
      .map((submission) => ({
        name: submission.memberName,
        comment: submission.additionalComments,
      }));

    return {
      currentData,
      previousData,
      responseRates: responseRatesData,
      satisfactionData,
      recentFeedback,
      testimonials,
    };
  }, [formSubmissionData, selectedRange]);
}
