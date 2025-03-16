import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router";
import Navbar from "./Navigation/Navbar";
import { ClockIcon, User2Icon, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { localesList } from "@/i18n";

const MemberHomepage = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <CheckCircle2 className="h-6 w-6 text-[#2FA5AF]" />,
      title: t("simpleQuestions"),
      description: t("simpleQuestionsDesc"),
    },
    {
      icon: <ClockIcon className="h-6 w-6 text-[#2FA5AF]" />,
      title: t("quickCompletion"),
      description: t("quickCompletionDesc"),
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-[#2FA5AF]" />,
      title: t("valuableImpact"),
      description: t("valuableImpactDesc"),
    },
  ];

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
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
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm"
            >
              {feature.icon}
              <h3 className="mt-4 mb-2 font-medium text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center">
        <Button
          asChild
          size="lg"
          className="bg-[#2FA5AF] hover:bg-[#2FA5AF]/90"
        >
          <Link
            to="/feedback/testID/questionnaire"
            className="inline-flex items-center"
          >
            {t("startQuestionnaire")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MemberHomepage;
