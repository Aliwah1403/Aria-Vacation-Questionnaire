import React, { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  { emoji: "😔", label: "Very Dissatisfied" },
  { emoji: "🙁", label: "Somewhat Dissatisfied" },
  { emoji: "😐", label: "Neither Satisfied nor Dissatisfied" },
  { emoji: "🙂", label: "Somewhat Satisfied" },
  { emoji: "😄", label: "Satisfied" },
];

const Feedback = () => {
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
      <div className="max-w-3xl mx-auto px-4 py-8">
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
            className="mb-12 text-left"
          >
            <span className="text-gray-500 mb-2 block">
              Question {currentStep}
            </span>
            <h2 className="text-2xl font-medium mb-8">
              {questions[currentStep - 1].text}
            </h2>

            {questions[currentStep - 1].type === "emoji" ? (
              <div className="flex flex-col sm:grid sm:grid-cols-5 gap-4">
                {emojiOptions.map((option, index) => {
                  const isSelected = answers[currentStep] === option.label;
                  return (
                    <motion.button
                      key={index}
                      className={`relative flex flex-col items-center p-4 rounded-lg mb-2 sm:mb-0 ${
                        isSelected
                          ? "bg-[#F0FBFA] border-2 border-[#4ABEC6]"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.label)}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#4ABEC6] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="text-3xl mb-2">{option.emoji}</span>
                      <span className="text-sm text-gray-600">
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
                  onChange={handleChange}
                  aria-describedby={`${id}-description`}
                  className="min-h-[200px] [resize:none]"
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

        <div className="flex justify-between">
          <Button
            size="lg"
            variant="outline"
            onClick={handlePrevious}
            className="cursor-pointer px-6 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            className="cursor-pointer px-6 py-2 rounded-lg bg-[#4ABEC6] text-white hover:bg-[#4ABEC6]/80 transition-colors"
            disabled={currentStep === questions.length}
          >
            {currentStep === questions.length ? "Submit" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
