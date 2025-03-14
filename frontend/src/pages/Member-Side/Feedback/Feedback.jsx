import React, { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router";
import { LoadingButton } from "@/components/ui/loading-button";
import { questions } from "./Questions/Questions";
import AriaLogo from "@/assets/AriaLogo.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const emojiOptions = [
  { emoji: "1f603", label: "Satisfied" },
  { emoji: "1f642", label: "Somewhat Satisfied" },
  { emoji: "1f610", label: "Neither Satisfied nor Dissatisfied" },
  { emoji: "1f641", label: "Somewhat Dissatisfied" },
  { emoji: "1f614", label: "Very Dissatisfied" },
];

const Feedback = () => {
  const navigate = useNavigate();

  // Emojis
  const renderEmoji = (unified) => {
    return (
      <img
        src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${unified}.png`}
        alt=""
        className="w-8 h-8"
      />
    );
  };

  // Stepper
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentStep]: answer });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Collect all answers
      const formattedAnswers = questions.map((question) => ({
        questionId: question.id,
        questionText: question.text,
        answer: answers[question.id] || "",
      }));

      // Log the answers to console
      console.log("Feedback Answers:", formattedAnswers);

      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Here you could add error handling UI
      alert("There was an error submitting your feedback. Please try again.");
    } finally {
      setLoading(false);
      // Navigate to success page
      navigate("/success");
    }
  };

  //Textarea character limit
  const id = useId();
  const maxLength = 4000;
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({ maxLength });

  // First, create a Stepper component to avoid code duplication
  const QuestionStepper = ({ currentStep, totalSteps }) => (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-2 md:hidden">
        <span className="text-sm text-gray-600">
          {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < currentStep ? "bg-fountain-blue-400" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* change to width of 80 for mobile device */}
            <img src={AriaLogo} alt="Company Logo" width={100} height={50} />
          </div>

          {/* Hide on mobile, show on desktop */}
          <div className="hidden md:block w-[500px]">
            <QuestionStepper
              currentStep={currentStep}
              totalSteps={questions.length}
            />
          </div>

          <Select>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="English" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8 md:mt-32 mt-24">
        {/* Show on mobile, hide on desktop */}
        <div className="mb-12 md:hidden">
          <QuestionStepper
            currentStep={currentStep}
            totalSteps={questions.length}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 sm:mb-12 text-left"
          >
            <span className="text-gray-500 mb-1 sm:mb-2 block text-sm">
              Question {currentStep}
            </span>
            <h2 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-8">
              {questions[currentStep - 1].text}
            </h2>

            {questions[currentStep - 1].type === "emoji" ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-4">
                {emojiOptions.map((option, index) => {
                  const isSelected = answers[currentStep] === option.label;
                  return (
                    <motion.button
                      key={index}
                      className={`relative flex flex-row sm:flex-col items-center p-2 sm:p-4 rounded-lg ${
                        isSelected
                          ? "bg-[#F0FBFA] border-2 border-fountain-blue-400"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.label)}
                    >
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-fountain-blue-400 rounded-full flex items-center justify-center">
                          <Check className="size-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      )}
                      <span className="text-2xl sm:text-3xl sm:mb-2 mr-3 sm:mr-0">
                        {renderEmoji(option.emoji)}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 flex-1 sm:flex-none text-left sm:text-center">
                        {option.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <>
                <Textarea
                  id={id}
                  value={value}
                  maxLength={maxLength}
                  onChange={(e) => {
                    handleChange(e);
                    handleAnswer(e.target.value);
                  }}
                  aria-describedby={`${id}-description`}
                  className="min-h-[150px] sm:min-h-[200px] text-sm sm:text-base p-3 sm:p-4 [resize:none]"
                  placeholder="Share your thoughts with us... "
                />
                <p
                  id={`${id}-description`}
                  className="text-muted-foreground mt-2 text-right text-xs"
                  role="status"
                  aria-live="polite"
                >
                  <span className="tabular-nums">{limit - characterCount}</span>{" "}
                  characters left
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* <textarea
                className="w-full p-4 border border-gray-200 rounded-lg focus:border-fountain-blue-400 focus:ring-1 focus:ring-fountain-blue-400 outline-none min-h-[200px] resize-none"
                placeholder="Please share your thoughts with us..."
                value={answers[currentStep] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
              /> */}

        <div className="flex justify-between gap-3 sm:gap-4">
          <Button
            // size="lg"
            variant="outline"
            onClick={handlePrevious}
            className="cursor-pointer px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg border border-gray-200 hover:border-gray-300 transition-colors min-w-[100px] sm:min-w-[120px]"
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          {currentStep === questions.length ? (
            <LoadingButton
              loading={loading}
              size="default"
              onClick={handleSubmit}
              className="cursor-pointer px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg bg-fountain-blue-400 text-white hover:bg-fountain-blue-400/80 transition-colors min-w-[100px] sm:min-w-[120px]"
            >
              Submit
            </LoadingButton>
          ) : (
            <Button
              size="default"
              onClick={handleNext}
              className="cursor-pointer px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg bg-fountain-blue-400 text-white hover:bg-fountain-blue-400/80 transition-colors min-w-[100px] sm:min-w-[120px]"
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
