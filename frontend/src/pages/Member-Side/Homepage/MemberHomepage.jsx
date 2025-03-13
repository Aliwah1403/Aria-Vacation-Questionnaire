import React, { useState } from "react";
import Navbar from "./Navigation/Navbar";
import { ClockIcon, User2Icon, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

// Translations (same as before)
const translations = {
  welcome: {
    en: "Share Your Resort Experience With Us",
    ar: "شارك تجربتك في المنتجع",
    fr: "Partagez votre expérience au resort",
  },
  subtitle: {
    en: "Thank you for taking the time to share your thoughts with us. Your feedback helps us improve our services.",
    ar: "شكراً لك على أخذ الوقت لمشاركة أفكارك معنا. ملاحظاتك تساعدنا على تحسين خدماتنا.",
    fr: "Merci de prendre le temps de partager vos réflexions avec nous. Vos commentaires nous aident à améliorer nos services.",
  },
  clientInfo: {
    en: "Client Information",
    ar: "معلومات العميل",
    fr: "Informations client",
  },
  questionnaireDetails: {
    en: "Questionnaire Details",
    ar: "تفاصيل الاستبيان",
    fr: "Détails du questionnaire",
  },
  whatToExpect: {
    en: "What to expect",
    ar: "ما يمكن توقعه",
    fr: "À quoi s'attendre",
  },
  simpleQuestions: {
    en: "Simple Questions",
    ar: "أسئلة بسيطة",
    fr: "Questions simples",
  },
  quickCompletion: {
    en: "Quick Completion",
    ar: "إكمال سريع",
    fr: "Achèvement rapide",
  },
  valuableImpact: {
    en: "Valuable Impact",
    ar: "تأثير قيم",
    fr: "Impact précieux",
  },
  simpleQuestionsDesc: {
    en: "Easy to answer multiple choice questions",
    ar: "أسئلة اختيار من متعدد سهلة الإجابة",
    fr: "Questions à choix multiples faciles à répondre",
  },
  quickCompletionDesc: {
    en: "Takes only 5 minutes of your time",
    ar: "يستغرق 5 دقائق فقط من وقتك",
    fr: "Ne prend que 5 minutes de votre temps",
  },
  valuableImpactDesc: {
    en: "Your feedback directly influences our improvements",
    ar: "ملاحظاتك تؤثر مباشرة على تحسيناتنا",
    fr: "Vos commentaires influencent directement nos améliorations",
  },
  startQuestionnaire: {
    en: "Start Questionnaire",
    ar: "ابدأ الاستبيان",
    fr: "Commencer le questionnaire",
  },
  selectLanguage: {
    en: "Select Language",
    ar: "اختر اللغة",
    fr: "Choisir la langue",
  },
  type: {
    en: "Type",
    ar: "النوع",
    fr: "Type",
  },
  estimatedTime: {
    en: "Estimated time",
    ar: "الوقت المقدر",
    fr: "Temps estimé",
  },
  questions: {
    en: "Questions",
    ar: "الأسئلة",
    fr: "Questions",
  },
};

const MemberHomepage = () => {
  // Fix the useState syntax
  const [language, setLanguage] = useState("en");

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 ${language === "ar" ? "rtl" : "ltr"}`}
    >
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {translations.welcome[language]}
            {/* <span className="block text-indigo-600 text-2xl md:text-3xl mt-2">
              Curtis Aliwah
            </span> */}
          </h1>
          <p className="text-gray-600 md:text-lg max-w-3xl mx-auto">
            {translations.subtitle[language]}
          </p>
        </div>

        {/* Info Panel */}
        <div className="mb-16">
          <div className="bg-indigo-50/50 rounded-lg p-6 max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <User2Icon className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations.clientInfo[language]}
              </h2>
            </div>
            <div className="space-y-2 text-gray-600">
              <p className="flex justify-between">
                <span>Name:</span> <span>Curtis Aliwah</span>
              </p>
              <p className="flex justify-between">
                <span>Member ID:</span> <span>88930</span>
              </p>
              <p className="flex justify-between">
                <span>Resort:</span> <span>Balqis Residence - B3045</span>
              </p>
              <p className="flex justify-between">
                <span>Check-in:</span>
                <span>08-03-2025</span>
              </p>
              <p className="flex justify-between">
                <span>Check-out:</span>
                <span>15-03-2025</span>
              </p>
            </div>
          </div>
        </div>

        {/* what to expect */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {translations.whatToExpect[language]}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  {translations.simpleQuestions[language]}
                </h3>
                <p className="text-gray-600 text-sm">
                  {translations.simpleQuestionsDesc[language]}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  {translations.quickCompletion[language]}
                </h3>
                <p className="text-gray-600 text-sm">
                  {translations.quickCompletionDesc[language]}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  {translations.valuableImpact[language]}
                </h3>
                <p className="text-gray-600 text-sm">
                  {translations.valuableImpactDesc[language]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <Link to={"/feedback"}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-full">
              {translations.startQuestionnaire[language]}
            </Button>
          </Link>
        </div>
      </main>
      <footer className=" text-center text-sm text-gray-400">
        <p>
          Your privacy is important to us. All responses are confidential and
          will be used only for service improvement purposes
        </p>
      </footer>
    </div>
  );
};

export default MemberHomepage;
