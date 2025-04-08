import { Fragment, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  PlusCircle,
  Pencil,
  Trash2,
  XCircle,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileText,
  ArrowLeft,
  Plus,
  Check,
  Smile,
  MessageSquare,
  Type,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
// import FormTypeForm from "./add-formtype-form";

const formTypeDetails = {
  "stay-experience": {
    name: "Stay Experience Survey",
    description:
      "Gather feedback about members' resort experience, including room quality, cleanliness, and overall satisfaction.",
  },
  amenities: {
    name: "Amenities Feedback",
    description:
      "Collect feedback on resort amenities such as pools, restaurants, spa services, and recreational activities.",
  },
  "customer-service": {
    name: "Customer Service Rating",
    description:
      "Rate the quality of customer service provided by staff members during the guest's stay.",
  },
};

// Default emoji mappings based on your backend model
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

export function FormTemplateTable({ columns, data }) {
  // 1. Declare ALL hooks at the top of component
  const tableId = useId();
  const inputRef = useRef(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState(null);
  const [templateName, setTemplateName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);
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

  // 2. Initialize table after all hooks
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      columnFilters,
    },
    pageCount: Math.ceil(data.length / pagination.pageSize),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  // 3. Handler functions after hooks and table initialization
  const handleContinueToQuestions = () => {
    setIsLoading(true);
    setIsCreateDialogOpen(false);

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      setShowQuestionBuilder(true);
    }, 1000);
  };

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

  const handleSaveTemplate = () => {
    // Prepare data for backend
    const templateData = {
      formCode: selectedFormType,
      questions: questions.map((q) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        required: q.required,
        order: q.order,
      })),
      ratingOptions: ratingOptions.map((option) => ({
        value: option.value,
        score: option.score,
        emoji: option.emoji,
      })),
    };

    console.log("Saving template:", templateData);

    // Reset and return to list view
    setShowQuestionBuilder(false);
    setSelectedFormType(null);
    setTemplateName("");
    setQuestions([]);
  };

  // const handleCancel = () => {
  //   setShowQuestionBuilder(false);
  //   setSelectedFormType(null);
  //   setTemplateName("");
  //   setQuestions([]);
  //   setEditingQuestion(false);
  // };

  const handleCancel = () => {
    // If editing a question, just reset the question form
    if (editingQuestion) {
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
    } else {
      // If cancelling the entire form, reset everything
      setShowQuestionBuilder(false);
      setSelectedFormType(null);
      setTemplateName("");
      setQuestions([]);
      setEditingQuestion(false);
      setCurrentQuestionIndex(null);
      setRatingOptions([...defaultEmojiMappings]);
      setNewQuestion({
        questionText: "",
        questionType: "emoji",
        required: true,
        order: 1,
      });
    }
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
        return <Smile className="h-4 w-4 mr-2" />;
      case "text":
        return <Type className="h-4 w-4 mr-2" />;
      case "comments":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  // 4. Render conditions AFTER all hooks and initialization
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Preparing question builder...</p>
        </div>
      </div>
    );
  }

  if (showQuestionBuilder) {
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
                  {formTypeDetails[selectedFormType]?.name}
                </h2>
                <p className="text-muted-foreground">
                  {formTypeDetails[selectedFormType]?.description}
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
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handleSaveTemplate}
                  disabled={questions.length === 0}
                >
                  Save Template
                </Button>

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
                          <div className="size-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
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
                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center mr-3">
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
                              <SelectItem value="emoji">
                                Emoji Rating
                              </SelectItem>
                              <SelectItem value="text">Text Input</SelectItem>
                              <SelectItem value="comments">Comments</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label
                            htmlFor="question-order"
                            className="mb-2 block"
                          >
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
                              <h4 className="font-medium mb-3">
                                Rating Options
                              </h4>
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
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (currentQuestionIndex !== null) {
                          setCurrentQuestionIndex(null);
                        }
                        setEditingQuestion(false);
                        setNewQuestion({
                          questionText: "",
                          questionType: "emoji",
                          required: true,
                          order:
                            questions.length > 0
                              ? Math.max(...questions.map((q) => q.order)) + 1
                              : 1,
                        });
                      }}
                    >
                      Cancel
                    </Button>

                    {currentQuestionIndex !== null ? (
                      <Button
                        onClick={handleUpdateQuestion}
                        disabled={!newQuestion.questionText}
                        className="bg-primary"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Update question
                      </Button>
                    ) : (
                      <Button
                        onClick={handleAddQuestion}
                        disabled={!newQuestion.questionText}
                        className="bg-primary"
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
  const isFiltered = table.getState().columnFilters.length > 0;
  // 5. Main return
  return (
    <Card>
      <CardHeader>
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Filter input field */}
            <Input
              placeholder="Filter by Template Name..."
              className="max-w-sm h-8"
              value={
                table.getColumn("formTemplateName")?.getFilterValue() ?? ""
              }
              onChange={(e) => {
                table
                  .getColumn("formTemplateName")
                  ?.setFilterValue(e.target.value);
              }}
            />

            {isFiltered && (
              <Button
                aria-label="Reset filters"
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <XCircle className="size-3.5" aria-hidden="true" />
              </Button>
            )}
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80">
                <PlusCircle />
                Create Form Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create Form Template</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="form-type">Form Type</Label>
                  <Select onValueChange={(value) => setSelectedFormType(value)}>
                    <SelectTrigger id="form-type">
                      <SelectValue placeholder="Select form type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stay-experience">
                        Stay Experience Survey
                      </SelectItem>
                      <SelectItem value="amenities">
                        Amenities Feedback
                      </SelectItem>
                      <SelectItem value="customer-service">
                        Customer Service Rating
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="template-name">
                    Template Name (Optional)
                  </Label>
                  <Input
                    id="template-name"
                    placeholder="Custom template name"
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    If left blank, the form type name will be used.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
                  onClick={handleContinueToQuestions}
                  disabled={!selectedFormType}
                >
                  Continue to Questions
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-background/90 sticky top-0 z-10 backdrop-blur-xs">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No recent responses
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className={cn("!flex-col !items-stretch")}>
        {/* Pagination */}
        <div className="flex items-center justify-between gap-8">
          {/* Results per page */}
          <div className="flex items-center gap-3">
            <Label htmlFor={tableId} className="max-sm:sr-only">
              Rows per page
            </Label>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger id={tableId} className="w-fit whitespace-nowrap">
                <SelectValue placeholder="Select number of results" />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                {[5, 10, 25, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Page number information */}
          <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
            <p
              className="text-muted-foreground text-sm whitespace-nowrap"
              aria-live="polite"
            >
              <span className="text-foreground">
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
                -
                {Math.min(
                  Math.max(
                    table.getState().pagination.pageIndex *
                      table.getState().pagination.pageSize +
                      table.getState().pagination.pageSize,
                    0
                  ),
                  table.getRowCount()
                )}
              </span>{" "}
              of{" "}
              <span className="text-foreground">
                {table.getRowCount().toString()}
              </span>
            </p>
          </div>

          {/* Pagination buttons */}
          <div>
            <Pagination>
              <PaginationContent>
                {/* First page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to first page"
                  >
                    <ChevronFirstIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                {/* Previous page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeftIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                {/* Next page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to next page"
                  >
                    <ChevronRightIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                {/* Last page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to last page"
                  >
                    <ChevronLastIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
