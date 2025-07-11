"use client";

import {
  AlertTriangle,
  RefreshCw,
  Home,
  Mail,
  Clock,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FormUnavailable = ({
  title = "Form Not Available",
  primaryReason = "url-error",
  customMessage,
  showActions = true,
  onRetry,
  onGoHome,
  onContactSupport,
}) => {
  const reasons = {
    "url-error": {
      icon: AlertTriangle,
      title: "Invalid or Incorrect URL",
      description:
        "The form link you're trying to access may be incorrect or has been moved.",
      color: "amber",
    },
    expired: {
      icon: Clock,
      title: "Form Has Expired",
      description:
        "This form is no longer accepting responses. The submission deadline may have passed.",
      color: "red",
    },
    restricted: {
      icon: Lock,
      title: "Access Restricted",
      description:
        "You may not have permission to access this form, or it's only available to specific users.",
      color: "purple",
    },
    maintenance: {
      icon: RefreshCw,
      title: "Temporary Unavailable",
      description:
        "The form is temporarily unavailable due to maintenance or technical issues.",
      color: "blue",
    },
  };

  const currentReason = reasons[primaryReason] || reasons["url-error"];
  const IconComponent = currentReason.icon;

  const colorClasses = {
    amber: {
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      border: "border-amber-200",
      accent: "text-amber-700",
    },
    red: {
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      border: "border-red-200",
      accent: "text-red-700",
    },
    purple: {
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      border: "border-purple-200",
      accent: "text-purple-700",
    },
    blue: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      border: "border-blue-200",
      accent: "text-blue-700",
    },
  };

  const colors = colorClasses[currentReason.color];

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-4 py-4 sm:py-8 md:mt-32 mt-24 font-arial">
      <div className={`p-8`}>
        {/* Main Icon */}
        <div className="text-center mb-6">
          <div
            className={`mx-auto w-20 h-20 rounded-full ${colors.iconBg} flex items-center justify-center mb-4 shadow-sm`}
          >
            <IconComponent className={`w-10 h-10 ${colors.iconColor}`} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.iconBg} ${colors.accent}`}
          >
            {currentReason.title}
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto">
            {customMessage || currentReason.description}
          </p>
        </div>

        {/* Possible Issues */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-gray-600 mr-2" />
            What might have happened?
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-600">
                  The form URL may be incorrect or outdated
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-600">
                  The form may have reached its response limit
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-600">
                  Access permissions may be required
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-600">
                  Temporary server or maintenance issues
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onRetry || (() => window.location.reload())}
              className="flex items-center space-x-2"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>

            {/* <Button
              onClick={onGoHome || (() => (window.location.href = "/"))}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Button> */}

            {/* <Button
              onClick={
                onContactSupport ||
                (() => (window.location.href = "mailto:support@example.com"))
              }
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Support</span>
            </Button> */}
          </div>
        )}

        {/* Help Text */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you continue to experience issues, please check the URL or
            contact the form administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormUnavailable;
