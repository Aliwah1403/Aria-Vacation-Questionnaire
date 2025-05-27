import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router";
import { LoadingButton } from "@/components/ui/loading-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { formSubmissionApi } from "@/api/formSubmissions";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const emojiOptions = [
  { emoji: "1f603", label: "Satisfied" },
  { emoji: "1f642", label: "Somewhat Satisfied" },
  { emoji: "1f610", label: "Neither Satisfied nor Dissatisfied" },
  { emoji: "1f641", label: "Somewhat Dissatisfied" },
  { emoji: "1f614", label: "Very Dissatisfied" },
];

// Dynamic schema based on questions
const createFeedbackSchema = (questions) => {
  return z.object({
    answers: z.array(
      z.object({
        questionId: z.string(),
        answer: z.string().min(1, "Please provide an answer"),
      })
    ),
    testimonialConsent: z.enum(["agree", "anonymous"]),
  });
};

const FeedbackFromDB = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentLang = searchParams.get("lng") || "en";

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const maxLength = 4000;
  const { value, characterCount, handleChange } = useCharacterLimit({
    maxLength,
  });

  const {
    data: formData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["formSubmission", id, currentLang],
    queryFn: () => formSubmissionApi.getById(id, currentLang),
    enabled: !!id,
  });

  const form = useForm({
    resolver: zodResolver(
      createFeedbackSchema(formData?.data?.formDetails?.questions || [])
    ),
    defaultValues: {
      answers:
        formData?.data?.responses?.map((response) => ({
          questionId: response.questionId,
          answer: "",
        })) || [],
      testimonialConsent: undefined,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formattedResponses = data.answers.map((answer, index) => ({
        questionId: questions[index]._id,
        question: questions[index].questionText,
        response: answer.answer,
      }));

      const submissionData = {
        responses: formattedResponses,
        testimonialConsent: data.testimonialConsent === "agree", // Convert to boolean here
        language: currentLang,
      };

      console.log("Submitting data:", submissionData); // Debug log

      await formSubmissionApi.submitResponses(id, submissionData);
      navigate(`/feedback/${id}/success?lng=${currentLang}`);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-screen mx-0 bg-red">
        Loading...
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  // Move these after the loading/error checks
  const questions = formData?.data?.formDetails?.questions || [];
  const ratingOptions = formData?.data?.formDetails?.ratingOptions || [];

  // Add these debug logs
  // console.log("Full form data:", formData);
  // console.log("Form status:", formData?.data?.status);
  // console.log("Form data structure:", {
  //   status: formData?.data?.status,
  //   formDetails: formData?.data?.formDetails,
  //   responses: formData?.data?.responses,
  // });

  const renderEmoji = (unified) => {
    return (
      <img
        src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${unified}.png`}
        alt=""
        className="w-8 h-8"
      />
    );
  };

  const handleNext = async () => {
    const currentAnswer = form.getValues(`answers.${currentStep - 1}.answer`);

    if (!currentAnswer) {
      form.setError(`answers.${currentStep - 1}.answer`, {
        type: "manual",
        message: `${t("pleaseProvideAnswer")}`,
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

  // QuestionStepper component
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
                      {questions[currentStep - 1].questionText}
                    </h2>

                    {questions[currentStep - 1].questionType === "emoji" ? (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-4">
                        {ratingOptions.map((option) => {
                          const isSelected = field.value === option.value;
                          return (
                            <motion.button
                              type="button"
                              key={option._id}
                              className={`relative flex flex-row sm:flex-col items-center p-2 sm:p-4 rounded-lg ${
                                isSelected
                                  ? "bg-[#F0FBFA] border-2 border-fountain-blue-400"
                                  : "bg-gray-50 hover:bg-gray-100"
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAnswer(option.value)}
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
                                {option.value}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    ) : (
                      <div>
                        <p className="text-muted-foreground mb-2 text-right text-xs">
                          <span className="tabular-nums">
                            {maxLength - characterCount}
                          </span>{" "}
                          {t("charactersLeft")}
                        </p>
                        <Textarea
                          {...field}
                          value={value}
                          maxLength={maxLength}
                          onChange={(e) => {
                            handleChange(e);
                            handleAnswer(e.target.value);
                            field.onChange(e);
                          }}
                          className="min-h-[150px] sm:min-h-[200px] text-sm sm:text-base p-3 sm:p-4 [resize:none]"
                          placeholder={t("shareThoughts")}
                        />

                        {currentStep === questions.length && (
                          <FormField
                            control={form.control}
                            name="testimonialConsent"
                            render={({ field }) => (
                              <div className="mt-4  bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-700 mb-4 leading-relaxed">
                                  By submitting this form, you agree that your
                                  feedback may be used, in whole or in part, as
                                  a testimonial on our website. We may edit your
                                  comments for clarity, grammar, or length
                                  without changing the intended meaning. Unless
                                  you request anonymity, your first name and
                                  general location (e.g., city or state) may be
                                  shown.
                                </p>

                                <div className="space-y-3">
                                  <div className="flex items-start space-x-3">
                                    <RadioGroup
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        console.log("Consent changed:", value);
                                      }}
                                      value={field.value || ""}
                                      className="space-y-3"
                                    >
                                      <div className="flex items-start space-x-3">
                                        <RadioGroupItem
                                          value="agree"
                                          id="agree"
                                          className="size-[18px] border-2"
                                        />
                                        <Label
                                          htmlFor="agree"
                                          className="text-sm font-medium leading-relaxed cursor-pointer"
                                        >
                                          I agree to the user of my feedback as
                                          testimonial under the terms stated
                                          above.
                                        </Label>
                                      </div>

                                      <div className="flex items-start space-x-3">
                                        <RadioGroupItem
                                          value="anonymous"
                                          id="anonymous"
                                          className="size-[18px] border-2"
                                        />
                                        <Label
                                          htmlFor="anonymous"
                                          className="text-sm font-medium leading-relaxed cursor-pointer"
                                        >
                                          I prefer my feedback to remain
                                          anonymous.
                                        </Label>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                </div>
                                <FormMessage />
                              </div>
                            )}
                          />
                        )}
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

export default FeedbackFromDB;
