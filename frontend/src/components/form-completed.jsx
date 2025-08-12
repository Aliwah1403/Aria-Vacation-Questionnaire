// import { AlertCircle } from "lucide-react";
// import { useTranslation } from "react-i18next";

// const FormCompleted = ({
//   title,
//   submissionDate,
//   customMessage,
//   showActions = true,
//   onGoHome,
//   onViewResults,
//   onContactSupport,
// }) => {
//   const { t } = useTranslation();

//   return (
//     <div className="max-w-4xl mx-auto px-5 sm:px-4 py-4 sm:py-8 md:mt-32 mt-24 font-arial">
//       <div className="p-8">
//         {/* Main Icon */}
//         <div className="text-center mb-6">
//           <div className="mx-auto w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mb-4 shadow-sm">
//             <AlertCircle className="w-10 h-10 text-teal-600" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             {title || t("formSubmittedHeader") || "Form Already Submitted"}
//           </h1>
//         </div>

//         {/* Description */}
//         <div className="text-center mb-8">
//           <p className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto">
//             {customMessage ||
//               t("formSubmittedText") ||
//               "You have already completed this feedback form. Thank you for your response!"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormCompleted;

"use client";

import { CheckCircle, Calendar, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const FormCompleted = ({
  title = "Form Already Submitted",
  submissionDate,
  customMessage,
  showActions = true,
  onGoHome,
  onViewResults,
  onContactSupport,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-4 py-4 sm:py-8 md:mt-32 mt-24 font-arial">
      <div className="p-8">
        {/* Main Icon */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 shadow-sm">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            Submission Complete
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto">
            {customMessage ||
              "Thank you! Your response has already been recorded. You can only submit this form once."}
          </p>
        </div>

        {/* Submission Details */}
        {/* <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 text-gray-600 mr-2" />
            Submission Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-gray-700">
                Your response has been successfully recorded
              </p>
            </div>
            {submissionDate && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-medium">Submitted on:</span>{" "}
                  {formatDate(submissionDate)}
                </p>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <p className="text-gray-700">
                No further action is required from you
              </p>
            </div>
          </div>
        </div> */}

        {/* What happens next */}
        {/* <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What happens next?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-700">
                Your response is being processed by our team
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-700">
                You'll be notified if any follow-up is needed
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-700">
                Keep this page bookmarked for future reference
              </p>
            </div>
          </div>
        </div> */}

        {/* Actions */}
        {/* {showActions && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onGoHome || (() => (window.location.href = "/"))}
              className="flex items-center space-x-2"
              variant="default"
            >
              <span>Return Home</span>
            </Button>

            {onViewResults && (
              <Button
                onClick={onViewResults}
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
                <FileText className="w-4 h-4" />
                <span>View My Response</span>
              </Button>
            )}

            {onContactSupport && (
              <Button
                onClick={onContactSupport}
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
                <span>Contact Support</span>
              </Button>
            )}
          </div>
        )} */}

        {/* Help Text */}
        {/* <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe this is an error or need to update your response,
            please contact support.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default FormCompleted;
