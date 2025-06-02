import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  FileText,
  Plus,
  Check,
  Pencil,
  Trash2,
  Smile,
  MessageSquare,
  Type,
  Globe,
} from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "sonner";

const defaultEmojiMappings = [
  { score: 5, value: { en: "", fr: "", ar: "", ru: "" }, emoji: "1f603" }, // 😃
  { score: 4, value: { en: "", fr: "", ar: "", ru: "" }, emoji: "1f642" }, // 🙂
  { score: 3, value: { en: "", fr: "", ar: "", ru: "" }, emoji: "1f610" }, // 😐
  { score: 2, value: { en: "", fr: "", ar: "", ru: "" }, emoji: "1f641" }, // 🙁
  { score: 1, value: { en: "", fr: "", ar: "", ru: "" }, emoji: "1f614" }, // 😔
];

const emojiCodeToEmoji = (unified) => {
  if (!unified) return "😐";
  try {
    // return String.fromCodePoint(Number.parseInt(code, 16));
    return (
      <img
        src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${unified}.png`}
        alt=""
        className="size-7"
      />
    );
  } catch (e) {
    return "😐";
  }
};

export function QuestionBuilder({
  formTypeDetails,
  mutation,
  selectedFormType,
  templateName,
  setTemplateName, // Add this prop
  initialQuestions = [],
  initialRatingOptions = [],
  isEditing = false,
  onSave,
  onCancel,
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [ratingOptions, setRatingOptions] = useState(
    initialRatingOptions.length > 0
      ? initialRatingOptions
      : [...defaultEmojiMappings]
  );
  const [newQuestion, setNewQuestion] = useState({
    questionText: { en: "", fr: "", ar: "", ru: "" },
    questionType: "emoji",
    required: true,
    order: 1,
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [isEditingName, setIsEditingName] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "ar", name: "Arabic" },
    { code: "ru", name: "Russian" },
  ];

  const handleAddQuestion = () => {
    if (newQuestion.questionText[activeLanguage]) {
      // Find the highest order and add 1
      const highestOrder =
        questions.length > 0
          ? Math.max(...questions.map((q) => q.order || 0))
          : 0;

      setQuestions([
        ...questions,
        {
          ...newQuestion,
          order: highestOrder + 1,
        },
      ]);

      setNewQuestion({
        questionText: { en: "", fr: "", ar: "", ru: "" },
        questionType: "emoji",
        required: true,
        order: highestOrder + 2,
      });
    }
  };

  const handleEditQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setNewQuestion({
      ...questions[index],
      _id: questions[index]._id, // Explicitly preserve _id
    });
    setEditingQuestion(true);
  };

  const handleUpdateQuestion = () => {
    if (
      newQuestion.questionText[activeLanguage] &&
      currentQuestionIndex !== null
    ) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = {
        ...newQuestion,
        _id: questions[currentQuestionIndex]._id, // Preserve the original _id
      };
      setQuestions(updatedQuestions);

      // Reset form
      const highestOrder = Math.max(
        ...updatedQuestions.map((q) => q.order || 0)
      );
      setNewQuestion({
        questionText: { en: "", fr: "", ar: "", ru: "" },
        questionType: "emoji",
        required: true,
        order: highestOrder + 1,
      });
      setCurrentQuestionIndex(null);
      setEditingQuestion(false);
    }
  };

  const handleCancelQuestion = () => {
    setEditingQuestion(false);
    setCurrentQuestionIndex(null);
    setNewQuestion({
      questionText: { en: "", fr: "", ar: "", ru: "" },
      questionType: "emoji",
      required: true,
      order:
        questions.length > 0
          ? Math.max(...questions.map((q) => q.order || 0)) + 1
          : 1,
    });
  };

  const handleCancel = () => {
    // Reset local state before calling parent cancel
    setQuestions([]);
    setRatingOptions([...defaultEmojiMappings]);
    setEditingQuestion(false);
    setCurrentQuestionIndex(null);
    setNewQuestion({
      questionText: { en: "", fr: "", ar: "", ru: "" },
      questionType: "emoji",
      required: true,
      order: 1,
    });
    onCancel();
  };

  const handleSave = () => {
    if (questions.length === 0) return;

    // Validate that all questions have a questionText in the active language
    const incompleteQuestions = questions.filter(
      (q) => getIncompleteLanguages(q.questionText).length > 0
    );

    if (incompleteQuestions.length > 0) {
      // All questions must have translations in the various languages
      toast.error(
        `Please complete the question text in ${
          languages.find((l) => l.code === activeLanguage)?.name
        } for all questions.`
      );
      return;
    }

    // For emoji questions, validate rating options have complete translations
    if (questions.some((q) => q.questionType === "emoji")) {
      const incompleteRatings = ratingOptions.filter(
        (option) => getIncompleteLanguages(option.value).length > 0
      );

      if (incompleteRatings.length > 0) {
        toast.error(
          "All rating options must have translations in all languages"
        );
        return;
      }
    }

    const templateData = {
      formCode: selectedFormType,
      formTemplateName: templateName,
      questions: questions.map((q) => ({
        questionText: {
          en: q.questionText.en?.trim(),
          fr: q.questionText.fr?.trim(),
          ar: q.questionText.ar?.trim(),
          ru: q.questionText.ru?.trim(),
        },
        questionType: q.questionType,
        required: q.required,
        order: q.order,
      })),
      // Only include ratingOptions if there are emoji questions
      ...(questions.some((q) => q.questionType === "emoji") && {
        ratingOptions: ratingOptions.map((option) => ({
          value: {
            en: option.value.en?.trim(),
            fr: option.value.fr?.trim(),
            ar: option.value.ar?.trim(),
            ru: option.value.ru?.trim(),
          },
          score: option.score,
          emoji: option.emoji,
        })),
      }),
      // ratingOptions: questions.some((q) => q.questionType === "emoji")
      //   ? ratingOptions.map((option) => ({
      //       value: option.value,
      //       score: option.score,
      //       emoji: option.emoji,
      //     }))
      //   : undefined,
    };

    onSave(templateData);
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case "emoji":
        return "Emoji Rating";
      case "text":
        return "Text Input";
      case "comments":
        return "Comments";
      default:
        return "Question";
    }
  };

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case "emoji":
        return <Smile className="size-4 mr-2" />;
      case "text":
        return <Type className="size-4 mr-2" />;
      case "comments":
        return <MessageSquare className="size-4 mr-2" />;
      default:
        return null;
    }
  };

  const getIncompleteLanguages = (questionText) => {
    return languages.filter((lang) => !questionText[lang.code]?.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-50 overflow-auto"
    >
      <div className="flex h-screen">
        {/* Left Column - Form Info */}
        <div className="w-1/4 bg-gray-50 p-8 border-r overflow-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={handleCancel}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>

            <div className="mb-8">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {formTypeDetails[selectedFormType]?.formName}
              </h2>
              <p className="text-muted-foreground">
                {formTypeDetails[selectedFormType]?.formDescription}
              </p>
            </div>

            {templateName && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Template Name
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  {isEditingName ? (
                    <Input
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="mt-1"
                      placeholder="Enter template name"
                      autoFocus
                      onBlur={() => setIsEditingName(false)}
                    />
                  ) : (
                    <p className="font-medium">{templateName}</p>
                  )}
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-4 hover:cursor-pointer"
                      onClick={() => setIsEditingName(!isEditingName)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Questions
              </h3>
              <p className="font-medium">{questions.length} added</p>
            </div>

            <div className="flex flex-col gap-4">
              <LoadingButton
                loading={mutation.isPending}
                className="w-full justify-start bg-fountain-blue-400 hover:bg-fountain-blue-400/80 text-white hover:text-white "
                variant="outline"
                onClick={handleSave}
                disabled={questions.length === 0}
              >
                {mutation.isPending ? "Saving" : "Save Template"}
              </LoadingButton>

              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Question Builder or Rating Options Editor */}
        <div className="w-3/4 p-8 overflow-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Question Builder</h2>
              <p className="text-muted-foreground">
                Add and configure questions for your form template
              </p>
            </div>

            {/* Question List */}
            {questions.length > 0 && !editingQuestion && (
              <div className="mb-8 space-y-4">
                {questions
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((question, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start">
                        <div className="size-6 rounded-full bg-fountain-blue-400 text-white flex items-center justify-center mr-3 flex-shrink-0">
                          {question.order}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-medium text-lg text-wrap">
                              {question.questionText.en}
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              {getQuestionTypeIcon(question.questionType)}
                              {getQuestionTypeLabel(question.questionType)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 items-center flex-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditQuestion(index)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newQuestions = [...questions];
                              newQuestions.splice(index, 1);
                              setQuestions(newQuestions);
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                <Button
                  className="w-full py-6 border-dashed border-2 bg-transparent hover:bg-gray-50 text-muted-foreground"
                  variant="outline"
                  onClick={() => setEditingQuestion(true)}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Another Question
                </Button>
              </div>
            )}

            {/* Add/Edit Question Form */}
            {(editingQuestion || questions.length === 0) && (
              <div className="border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-fountain-blue-400 text-white flex items-center justify-center mr-3">
                        {currentQuestionIndex !== null
                          ? questions[currentQuestionIndex].order
                          : questions.length > 0
                          ? Math.max(...questions.map((q) => q.order)) + 1
                          : 1}
                      </div>
                      <h3 className="font-medium text-lg">
                        {newQuestion.questionText[activeLanguage] ||
                          "New Question"}
                      </h3>
                    </div>
                    <div className="text-sm font-medium">
                      {getQuestionTypeLabel(newQuestion.questionType)}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="question-text" className="mb-2 block">
                          Question
                        </Label>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {newQuestion.questionText &&
                            getIncompleteLanguages(newQuestion.questionText)
                              .length > 0
                              ? `${
                                  getIncompleteLanguages(
                                    newQuestion.questionText
                                  ).length
                                } language(s) missing`
                              : "All languages complete"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Select
                          value={activeLanguage}
                          onValueChange={setActiveLanguage}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue>
                              {activeLanguage && (
                                <div className="flex items-center">
                                  {
                                    languages.find(
                                      (l) => l.code === activeLanguage
                                    )?.name
                                  }
                                  {newQuestion.questionText &&
                                    !newQuestion.questionText[
                                      activeLanguage
                                    ]?.trim() && (
                                      <span className="ml-2 h-2 w-2 bg-amber-500 rounded-full" />
                                    )}
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                <div className="flex items-center">
                                  {lang.name}
                                  {newQuestion.questionText &&
                                    !newQuestion.questionText[
                                      lang.code
                                    ]?.trim() && (
                                      <span className="ml-2 h-2 w-2 bg-amber-500 rounded-full" />
                                    )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="inline-flex h-2 w-2 bg-amber-500 rounded-full"></span>
                          <span>
                            {newQuestion.questionText &&
                              getIncompleteLanguages(newQuestion.questionText)
                                .length}{" "}
                            incomplete
                          </span>
                        </div>
                      </div>

                      <Input
                        id="question-text"
                        placeholder={`Enter your question in ${
                          languages.find((l) => l.code === activeLanguage)?.name
                        }`}
                        value={newQuestion.questionText[activeLanguage] || ""}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            questionText: {
                              ...newQuestion.questionText,
                              [activeLanguage]: e.target.value,
                            },
                          })
                        }
                        className="text-base"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="question-type" className="mb-2 block">
                          Question type
                        </Label>
                        <Select
                          value={newQuestion.questionType}
                          onValueChange={(value) => {
                            setNewQuestion({
                              ...newQuestion,
                              questionType: value,
                            });
                          }}
                        >
                          <SelectTrigger id="question-type">
                            <SelectValue placeholder="Select question type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="emoji">Emoji Rating</SelectItem>
                            <SelectItem value="text">Text Input</SelectItem>
                            <SelectItem value="comments">Comments</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="question-order" className="mb-2 block">
                          Question order
                        </Label>
                        <Input
                          id="question-order"
                          type="number"
                          min="1"
                          value={newQuestion.order}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              order: Number.parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Format preview</Label>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-lg">
                        {newQuestion.questionType === "text" && (
                          <Input
                            disabled
                            placeholder="Text answer"
                            className="bg-white"
                          />
                        )}

                        {newQuestion.questionType === "comments" && (
                          <Textarea
                            disabled
                            placeholder="Comments"
                            className="bg-white h-24"
                          />
                        )}

                        {newQuestion.questionType === "emoji" && (
                          <div className="flex justify-center gap-6">
                            {ratingOptions.map((option, i) => (
                              <div
                                key={i}
                                className="flex flex-col items-center"
                              >
                                <div
                                  className={`text-2xl cursor-pointer p-2 rounded-full ${
                                    i === 2 ? "bg-primary/10" : ""
                                  }`}
                                >
                                  {emojiCodeToEmoji(option.emoji)}
                                </div>
                                <span className="text-sm mt-1">
                                  {option.value[activeLanguage] || ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Additional options</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="required-question"
                            className="cursor-pointer"
                          >
                            Required question
                          </Label>
                          <Switch
                            id="required-question"
                            checked={newQuestion.required}
                            onCheckedChange={(checked) =>
                              setNewQuestion({
                                ...newQuestion,
                                required: checked,
                              })
                            }
                          />
                        </div>

                        {newQuestion.questionType === "emoji" && (
                          <div className="mt-4 border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">Rating Options</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Globe className="h-4 w-4" />
                                <span>
                                  Showing labels for{" "}
                                  {
                                    languages.find(
                                      (l) => l.code === activeLanguage
                                    )?.name
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              {ratingOptions.map((option, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 p-3 border rounded-lg"
                                >
                                  <div className="text-2xl w-10 h-10 flex items-center justify-center">
                                    {emojiCodeToEmoji(option.emoji)}
                                  </div>
                                  <div className="flex-grow">
                                    <Input
                                      value={option.value[activeLanguage] || ""}
                                      onChange={(e) => {
                                        const newOptions = [...ratingOptions];
                                        newOptions[index].value = {
                                          ...newOptions[index].value,
                                          [activeLanguage]: e.target.value,
                                        };
                                        setRatingOptions(newOptions);
                                      }}
                                      placeholder={`Rating label in ${
                                        languages.find(
                                          (l) => l.code === activeLanguage
                                        )?.name
                                      }`}
                                      className="text-sm"
                                    />
                                  </div>
                                  <div className="w-12 h-10 border rounded-md flex items-center justify-center bg-gray-50 font-medium">
                                    {option.score}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
                  <Button variant="outline" onClick={handleCancelQuestion}>
                    Cancel
                  </Button>

                  {currentQuestionIndex !== null ? (
                    <Button
                      onClick={handleUpdateQuestion}
                      disabled={!newQuestion.questionText}
                      className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Update question
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddQuestion}
                      disabled={!newQuestion.questionText}
                      className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add question
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
