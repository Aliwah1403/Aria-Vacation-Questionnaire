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
} from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";

const defaultEmojiMappings = [
  { score: 5, value: "", emoji: "1f603" }, // 😃
  { score: 4, value: "", emoji: "1f642" }, // 🙂
  { score: 3, value: "", emoji: "1f610" }, // 😐
  { score: 2, value: "", emoji: "1f641" }, // 🙁
  { score: 1, value: "", emoji: "1f614" }, // 😔
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
  onSave,
  onCancel,
}) {
  const [questions, setQuestions] = useState([]);
  const [ratingOptions, setRatingOptions] = useState([...defaultEmojiMappings]);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    questionType: "emoji",
    required: true,
    order: 1,
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(false);

  const handleAddQuestion = () => {
    if (newQuestion.questionText) {
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
        questionText: "",
        questionType: "emoji",
        required: true,
        order: highestOrder + 2,
      });
    }
  };

  const handleEditQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setNewQuestion({ ...questions[index] });
    setEditingQuestion(true);
  };

  const handleUpdateQuestion = () => {
    if (newQuestion.questionText && currentQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = { ...newQuestion };
      setQuestions(updatedQuestions);

      // Reset form
      const highestOrder = Math.max(
        ...updatedQuestions.map((q) => q.order || 0)
      );
      setNewQuestion({
        questionText: "",
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
      questionText: "",
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
      questionText: "",
      questionType: "emoji",
      required: true,
      order: 1,
    });
    onCancel();
  };

  const handleSave = () => {
    if (questions.length === 0) return;

    const templateData = {
      formCode: selectedFormType,
      questions: questions.map((q) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        required: q.required,
        order: q.order,
      })),
      ratingOptions: questions.some((q) => q.questionType === "emoji")
        ? ratingOptions.map((option) => ({
            value: option.value,
            score: option.score,
            emoji: option.emoji,
          }))
        : undefined,
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

  // Return the same JSX structure
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
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Template Name
                </h3>
                <p className="font-medium">{templateName}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Questions
              </h3>
              <p className="font-medium">{questions.length} added</p>
            </div>

            <div className="space-y-4 mt-8">
              <LoadingButton
                loading={mutation.isPending}
                className="w-full justify-start"
                variant="outline"
                onClick={handleSave}
                disabled={questions.length === 0}
              >
                {mutation.isPending ? "Saving" : "Save Template"}
              </LoadingButton>

              <Button
                className="w-full justify-start"
                variant="ghost"
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
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-lg">
                              {question.questionText}
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              {getQuestionTypeIcon(question.questionType)}
                              {getQuestionTypeLabel(question.questionType)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditQuestion(index)}
                          >
                            <Pencil className="h-4 w-4" />
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
                            <Trash2 className="h-4 w-4" />
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
                        {newQuestion.questionText || "New Question"}
                      </h3>
                    </div>
                    <div className="text-sm font-medium">
                      {getQuestionTypeLabel(newQuestion.questionType)}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="question-text" className="mb-2 block">
                        Question
                      </Label>
                      <Input
                        id="question-text"
                        placeholder="Enter your question"
                        value={newQuestion.questionText}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            questionText: e.target.value,
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
                                  {option.value}
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
                            <h4 className="font-medium mb-3">Rating Options</h4>
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
                                      value={option.value}
                                      onChange={(e) => {
                                        const newOptions = [...ratingOptions];
                                        newOptions[index].value =
                                          e.target.value;
                                        setRatingOptions(newOptions);
                                      }}
                                      placeholder="Rating label"
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
                      className="bg-fountain-blue-400"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Update question
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddQuestion}
                      disabled={!newQuestion.questionText}
                      className="bg-fountain-blue-400"
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
