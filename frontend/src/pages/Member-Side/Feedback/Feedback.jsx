"use client";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router";
import { LoadingButton } from "@/components/ui/loading-button";
import { questions } from "./Questions/Questions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackSchema } from "./schemas/feedback-schema";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

const emojiOptions = [
  { emoji: "1f603", label: "Satisfied" },
  { emoji: "1f642", label: "Somewhat Satisfied" },
  { emoji: "1f610", label: "Neither Satisfied nor Dissatisfied" },
  { emoji: "1f641", label: "Somewhat Dissatisfied" },
  { emoji: "1f614", label: "Very Dissatisfied" },
];

const Feedback = () => {
  const { t } = useTranslation();
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
  const [loading, setLoading] = useState(false);
  const [testimonialConsent, setTestimonialConsent] = useState(false);

  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      answers: questions.map((q) => ({
        questionId: q.id,
        answer: "",
      })),
      testimonialConsent: false,
    },
  });

  const handleNext = async () => {
    const currentAnswer = form.getValues(`answers.${currentStep - 1}.answer`);

    if (!currentAnswer) {
      form.setError(`answers.${currentStep - 1}.answer`, {
        type: "manual",
        message: "Please provide an answer before continuing",
      });
      return;
    }

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
    form.setValue(`answers.${currentStep - 1}.answer`, answer);
    form.clearErrors(`answers.${currentStep - 1}.answer`);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formattedAnswers = data.answers.map((answer, index) => ({
        questionId: questions[index].id,
        questionText: questions[index].text,
        answer: answer.answer,
      }));

      console.log("Feedback Answers:", formattedAnswers);
      console.log("Testimonial Consent:", data.testimonialConsent);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/feedback/testID/success");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("There was an error submitting your feedback. Please try again.");
    } finally {
      setLoading(false);
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

  const QuestionStepper = ({ currentStep, totalSteps }) => (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">
          {t("question")} {currentStep} {t("of")} {totalSteps}
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
    <div className="max-w-4xl mx-auto px-5 sm:px-4 py-4 sm:py-8 md:mt-32 mt-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-12">
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
              <FormField
                control={form.control}
                name={`answers.${currentStep - 1}.answer`}
                render={({ field }) => (
                  <FormItem>
                    <span className="text-gray-500 mb-1 sm:mb-2 block text-sm">
                      {t("question")} {currentStep}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-8">
                      {questions[currentStep - 1].text}
                    </h2>

                    {questions[currentStep - 1].type === "emoji" ? (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-4">
                        {emojiOptions.map((option, index) => {
                          const isSelected = field.value === option.label;
                          return (
                            <motion.button
                              type="button"
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
                      <div>
                        <p
                          id={`${id}-description`}
                          className="text-muted-foreground mb-2 text-right text-xs"
                          role="status"
                          aria-live="polite"
                        >
                          <span className="tabular-nums">
                            {limit - characterCount}
                          </span>{" "}
                          characters left
                        </p>
                        <Textarea
                          {...field}
                          id={id}
                          value={value}
                          maxLength={maxLength}
                          onChange={(e) => {
                            handleChange(e);
                            handleAnswer(e.target.value);
                            field.onChange(e);
                          }}
                          aria-describedby={`${id}-description`}
                          className="min-h-[150px] sm:min-h-[200px] text-sm sm:text-base p-3 sm:p-4 [resize:none]"
                          placeholder="Share your thoughts with us... "
                        />

                        {/* Testimonial Consent Checkbox */}
                        <FormField
                          control={form.control}
                          name="testimonialConsent"
                          render={({ field }) => (
                            <div className="flex items-start space-x-2 mt-4">
                              <Checkbox
                                id="testimonialConsent"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1"
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label
                                  htmlFor="testimonialConsent"
                                  className="text-sm font-medium leading-5 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {t("testimonialConsent")}
                                </label>
                                <p className="text-xs text-muted-foreground">
                                  {t("testimonialDisclaimer")}
                                </p>
                              </div>
                            </div>
                          )}
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between gap-3 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="cursor-pointer capitalize px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg border border-gray-200 hover:border-gray-300 transition-colors min-w-[100px] sm:min-w-[120px]"
            >
              {t("previous")}
            </Button>
            {currentStep === questions.length ? (
              <LoadingButton
                type="submit"
                loading={loading}
                size="default"
                className="cursor-pointer px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg bg-fountain-blue-400 text-white hover:bg-fountain-blue-400/80 transition-colors min-w-[100px] sm:min-w-[120px]"
              >
                {t("submit")}
              </LoadingButton>
            ) : (
              <Button
                type="button"
                size="default"
                onClick={handleNext}
                className="cursor-pointer px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg bg-fountain-blue-400 text-white hover:bg-fountain-blue-400/80 transition-colors min-w-[100px] sm:min-w-[120px]"
              >
                {t("continue")}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Feedback;
