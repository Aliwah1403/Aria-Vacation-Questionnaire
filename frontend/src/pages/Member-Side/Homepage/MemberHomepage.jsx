import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { ClockIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formSubmissionApi } from "@/api/formSubmissions";
import { usePostHog } from "posthog-js/react";
import FormUnavailable from "@/components/form-unavailable";
import FormCompleted from "@/components/form-completed";

const MemberHomepage = () => {
  const posthog = usePostHog();

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const currentLang = searchParams.get("lng") || "en";

  posthog.capture("Questionnaire Opened");

  const {
    data: formData,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["formSubmission", id, currentLang],
    queryFn: () => formSubmissionApi.getById(id, currentLang),
    enabled: !!id,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log("Form Details: ", formData);

  // Check if form is not available in the DB
  const isNotAvailable =
    formData &&
    formData.success === false &&
    formData.message &&
    formData.message.toLowerCase().includes("not found");

  // Check if form is completed (either from 403 response or regular response)
  const isCompleted =
    (formData &&
      formData.success === false &&
      formData.message?.toLowerCase().includes("already completed")) ||
    formData?.data?.status === "completed";

  // Determine the reason for unavailability
  const getUnavailableReason = () => {
    if (!formData || !formData.message) return "url-error";

    const message = formData.message.toLowerCase();

    if (message.includes("not found") || message.includes("invalid")) {
      return "url-error";
    }
    if (message.includes("expired") || message.includes("deadline")) {
      return "expired";
    }
    if (message.includes("permission") || message.includes("access")) {
      return "restricted";
    }
    if (message.includes("maintenance") || message.includes("unavailable")) {
      return "maintenance";
    }

    return "url-error";
  };

  if (isCompleted) {
    return (
      <FormCompleted
        title={t("formSubmittedHeader") || "Form Already Submitted"}
        customMessage={t("formSubmittedText") || formData?.message}
        submissionDate={
          formData?.data?.submittedAt || formData?.data?.createdAt
        }
        onGoHome={() => {
          posthog.capture("Navigate Home from Completed Form");
          navigate("/");
        }}
        onContactSupport={() => {
          posthog.capture("Contact Support from Completed Form");
          window.location.href =
            "mailto:support@yourcompany.com?subject=Form Submission Question&body=I have a question about my form submission (ID: " +
            id +
            ")";
        }}
      />
      // <div className="max-w-4xl mx-auto px-5 sm:px-4 py-4 sm:py-8 md:mt-32 mt-24 font-arial">
      //   <div className="text-center space-y-4 p-6 rounded-lg border border-gray-100 bg-gray-50">
      //     <div className="mx-auto w-12 h-12 rounded-full bg-fountain-blue-100 flex items-center justify-center">
      //       <AlertCircle className="w-6 h-6 text-fountain-blue-600" />
      //     </div>
      //     <h2 className="text-2xl font-semibold text-gray-900">
      //       {t("formSubmittedHeader")}
      //     </h2>
      //     <div className="space-y-2">
      //       <p className="text-gray-600 max-w-md mx-auto">
      //         {t("formSubmittedText")}
      //       </p>
      //     </div>
      //   </div>
      // </div>
    );
  }

  if (isNotAvailable) {
    return (
      <FormUnavailable
        title={"Form Not Available"}
        primaryReason={getUnavailableReason()}
        customMessage={"Feedback questionnaire not found" || formData?.message}
        onRetry={() => {
          posthog.capture("Form Retry Attempted");
          refetch();
        }}
        onLoading={isPending}
        onGoHome={() => {
          posthog.capture("Navigate Home from Unavailable Form");
          navigate("/");
        }}
        onContactSupport={() => {
          posthog.capture("Contact Support from Unavailable Form");
          // You can customize this based on your support system
          window.location.href =
            "mailto:support@yourcompany.com?subject=Form Access Issue&body=I'm having trouble accessing form ID: " +
            id;
        }}
      />
    );
  }

  // Combined feature - merging "Simple Questions" and "Quick Completion"
  const combinedFeature = {
    icon: <ClockIcon className="h-6 w-6 text-[#2FA5AF]" />,
    title: t("quickCompletion"),
    description: `${t("quickCompletionDesc")} ${t("simpleQuestionsDesc")}`,
  };

  const handleStartClick = () => {
    navigate(`/${id}/questionnaire?lng=${currentLang}`);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 max-w-5xl font-arial">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t("welcome")}
        </h1>
        <p className="text-gray-600 md:text-lg max-w-3xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* What to Expect Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          {t("whatToExpect")}
        </h2>
        <div className="flex justify-center">
          <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white shadow-sm max-w-md">
            {combinedFeature.icon}
            <h3 className="mt-4 mb-3 font-medium text-gray-900 text-lg">
              {combinedFeature.title}
            </h3>
            <p className="text-gray-600">{combinedFeature.description}</p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center">
        <Button
          onClick={handleStartClick}
          className="bg-[#2FA5AF] hover:bg-[#2FA5AF]/90"
        >
          {t("startQuestionnaire")}
        </Button>
      </div>
    </div>
  );
};

export default MemberHomepage;
