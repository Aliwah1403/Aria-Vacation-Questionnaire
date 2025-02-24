import React, { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router";

const questions = [
  {
    id: 1,
    text: "How efficient and hassle-free was the reservation and booking process?",
    type: "emoji",
  },
  {
    id: 2,
    text: "How knowledgeable and helpful were the member services personnel in assisting with your booking?",
    type: "emoji",
  },
  {
    id: 3,
    text: "How smoothly and quickly did the check-in and check-out process go?",
    type: "emoji",
  },
  {
    id: 4,
    text: "How friendly and supportive were the resort staff during your stay?",
    type: "emoji",
  },
  {
    id: 5,
    text: "How well-maintained and clean were the outdoor spaces, shared areas, buildings and facilities?",
    type: "emoji",
  },
  {
    id: 6,
    text: "How would you rate the view and overall location of your accommodation?",
    type: "emoji",
  },
  {
    id: 7,
    text: "Was the size of your accommodation comfortable and sufficient for your needs?",
    type: "emoji",
  },
  {
    id: 8,
    text: "How well-maintained were the appliances, furniture, and overall condition of your accommodation?",
    type: "emoji",
  },
  {
    id: 9,
    text: "How clean and ready was your accommodation upon arrival?",
    type: "emoji",
  },
  {
    id: 10,
    text: "How effectively did the resort implement measures to ensure your health and safety during your stay?",
    type: "emoji",
  },
  {
    id: 11,
    text: "Do you have any additional comments or suggestions regarding your experience?",
    type: "text",
  },
];

const emojiOptions = [
  { emoji: "😄", label: "Satisfied" },
  { emoji: "🙂", label: "Somewhat Satisfied" },
  { emoji: "😐", label: "Neither Satisfied nor Dissatisfied" },
  { emoji: "🙁", label: "Somewhat Dissatisfied" },
  { emoji: "😔", label: "Very Dissatisfied" },
];

const Feedback = () => {
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
    try {
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

      // Navigate to success page
      navigate("/success");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Here you could add error handling UI
      alert("There was an error submitting your feedback. Please try again.");
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {currentStep} of {questions.length}
            </span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: questions.length }, (_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i < currentStep ? "bg-[#2FA5AF]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
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
                          ? "bg-[#F0FBFA] border-2 border-[#4ABEC6]"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.label)}
                    >
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-[#4ABEC6] rounded-full flex items-center justify-center">
                          <Check className="size-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      )}
                      <span className="text-2xl sm:text-3xl sm:mb-2 mr-3 sm:mr-0">
                        {option.emoji}
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
                className="w-full p-4 border border-gray-200 rounded-lg focus:border-[#4ABEC6] focus:ring-1 focus:ring-[#4ABEC6] outline-none min-h-[200px] resize-none"
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
            <Button
              size="default"
              onClick={handleSubmit}
              className="cursor-pointer px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg bg-[#4ABEC6] text-white hover:bg-[#4ABEC6]/80 transition-colors min-w-[100px] sm:min-w-[120px]"
            >
              Submit
            </Button>
          ) : (
            <Button
              size="default"
              onClick={handleNext}
              className="cursor-pointer px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg bg-[#4ABEC6] text-white hover:bg-[#4ABEC6]/80 transition-colors min-w-[100px] sm:min-w-[120px]"
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
