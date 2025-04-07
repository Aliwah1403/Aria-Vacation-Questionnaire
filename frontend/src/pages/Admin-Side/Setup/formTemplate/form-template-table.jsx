import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table";
import FacetedDataFilter from "@/components/faceted-data-filter";
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
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "text",
    options: [""],
    required: true,
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
    if (newQuestion.text) {
      setQuestions([...questions, { ...newQuestion }]);
      setNewQuestion({
        text: "",
        type: "text",
        options: [""],
        required: true,
      });
    }
  };

  const handleSaveTemplate = () => {
    // Here you would save the template with questions
    console.log("Saving template:", {
      name: templateName || formTypeDetails[selectedFormType]?.name,
      formType: selectedFormType,
      questions,
    });

    // Reset and return to list view
    setShowQuestionBuilder(false);
    setSelectedFormType(null);
    setTemplateName("");
    setQuestions([]);
  };

  const handleCancel = () => {
    setShowQuestionBuilder(false);
    setSelectedFormType(null);
    setTemplateName("");
    setQuestions([]);
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

          {/* Right Column - Question Builder */}
          <div className="w-3/4 p-8 overflow-auto">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Question Builder</h2>
                <p className="text-muted-foreground">
                  Add and configure questions for your form template
                </p>
              </div>

              {/* Question List */}
              {questions.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Added Questions</h3>
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 bg-white shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-muted-foreground">
                                Q{index + 1}
                              </span>
                              <h4 className="font-medium">{question.text}</h4>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {question.type === "multiple_choice"
                                ? "Multiple Choice"
                                : question.type === "text"
                                ? "Text Input"
                                : question.type === "rating"
                                ? "Rating Scale"
                                : "Question"}
                              {question.required && " • Required"}
                            </div>

                            {question.type === "multiple_choice" &&
                              question.options?.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {question.options.map((option, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                                    >
                                      {option || `Option ${optIndex + 1}`}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setNewQuestion({ ...questions[index] });
                                setCurrentQuestionIndex(index);
                                // Remove the question to replace it with edited version
                                const newQuestions = [...questions];
                                newQuestions.splice(index, 1);
                                setQuestions(newQuestions);
                              }}
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
                  </div>
                </div>
              )}

              {/* Add Question Form */}
              <div className="border rounded-lg p-6 bg-white shadow-sm">
                <h3 className="text-lg font-medium mb-4">
                  {currentQuestionIndex !== null
                    ? "Edit Question"
                    : "Add New Question"}
                </h3>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="question-text">Question Text</Label>
                    <Input
                      id="question-text"
                      placeholder="Enter your question"
                      value={newQuestion.text}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          text: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="question-type">Question Type</Label>
                      <Select
                        value={newQuestion.type}
                        onValueChange={(value) =>
                          setNewQuestion({
                            ...newQuestion,
                            type: value,
                            options:
                              value === "multiple_choice" ? [""] : undefined,
                            scale: value === "rating" ? 5 : undefined,
                          })
                        }
                      >
                        <SelectTrigger id="question-type">
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text Input</SelectItem>
                          <SelectItem value="multiple_choice">
                            Multiple Choice
                          </SelectItem>
                          <SelectItem value="rating">Rating Scale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2 pt-8">
                      <Label
                        htmlFor="required"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          id="required"
                          checked={newQuestion.required}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              required: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        Required question
                      </Label>
                    </div>
                  </div>

                  {newQuestion.type === "multiple_choice" && (
                    <div className="grid gap-2 mt-2">
                      <Label>Options</Label>
                      <div className="space-y-2">
                        {newQuestion.options?.map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [
                                  ...(newQuestion.options || []),
                                ];
                                newOptions[index] = e.target.value;
                                setNewQuestion({
                                  ...newQuestion,
                                  options: newOptions,
                                });
                              }}
                              placeholder={`Option ${index + 1}`}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (newQuestion.options.length > 1) {
                                  const newOptions = [
                                    ...(newQuestion.options || []),
                                  ];
                                  newOptions.splice(index, 1);
                                  setNewQuestion({
                                    ...newQuestion,
                                    options: newOptions,
                                  });
                                }
                              }}
                              disabled={newQuestion.options.length <= 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-fit"
                        onClick={() => {
                          const newOptions = [
                            ...(newQuestion.options || []),
                            "",
                          ];
                          setNewQuestion({
                            ...newQuestion,
                            options: newOptions,
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                  )}

                  {newQuestion.type === "rating" && (
                    <div className="grid gap-2">
                      <Label htmlFor="rating-scale">Rating Scale</Label>
                      <Select
                        value={newQuestion.scale?.toString() || "5"}
                        onValueChange={(value) =>
                          setNewQuestion({
                            ...newQuestion,
                            scale: Number.parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger id="rating-scale">
                          <SelectValue placeholder="Select scale" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">1-5 Scale</SelectItem>
                          <SelectItem value="10">1-10 Scale</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="mt-2">
                        <Label className="mb-2 block">Preview</Label>
                        <div className="flex gap-2 mt-2">
                          {[
                            ...Array(
                              Number.parseInt(
                                newQuestion.scale?.toString() || "5"
                              )
                            ),
                          ].map((_, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <div className="h-10 w-14 border rounded-md flex items-center justify-center">
                                {i + 1}
                              </div>
                              {i === 0 && (
                                <div className="text-xs mt-1">Low</div>
                              )}
                              {i ===
                                Number.parseInt(
                                  newQuestion.scale?.toString() || "5"
                                ) -
                                  1 && <div className="text-xs mt-1">High</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-4">
                    {currentQuestionIndex !== null ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setNewQuestion({
                              text: "",
                              type: "text",
                              options: [""],
                              required: true,
                            });
                            setCurrentQuestionIndex(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            if (newQuestion.text) {
                              const newQuestions = [...questions];
                              newQuestions.splice(currentQuestionIndex, 0, {
                                ...newQuestion,
                              });
                              setQuestions(newQuestions);
                              setNewQuestion({
                                text: "",
                                type: "text",
                                options: [""],
                                required: true,
                              });
                              setCurrentQuestionIndex(null);
                            }
                          }}
                          disabled={!newQuestion.text}
                        >
                          Update Question
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={handleAddQuestion}
                        disabled={!newQuestion.text}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              {questions.length > 0 && (
                <div className="mt-8 border rounded-lg p-6 bg-white shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Form Preview</h3>
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <h4 className="text-xl font-bold mb-6">
                      {templateName || formTypeDetails[selectedFormType]?.name}
                    </h4>

                    {questions.map((question, index) => (
                      <div key={index} className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{question.text}</span>
                          {question.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </div>

                        {question.type === "text" && (
                          <Input placeholder="Text answer" disabled />
                        )}

                        {question.type === "multiple_choice" && (
                          <div className="flex flex-wrap gap-2">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className="border rounded-md px-4 py-2 bg-white"
                              >
                                {option || `Option ${optIndex + 1}`}
                              </div>
                            ))}
                          </div>
                        )}

                        {question.type === "rating" && (
                          <div className="flex gap-2">
                            {[
                              ...Array(
                                Number.parseInt(
                                  question.scale?.toString() || "5"
                                )
                              ),
                            ].map((_, i) => (
                              <div
                                key={i}
                                className="h-10 w-14 border rounded-md flex items-center justify-center bg-white"
                              >
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <Button className="mt-4" disabled>
                      Continue
                    </Button>
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

            {/* Filter by Form Name */}
            {/* <div className="relative">
              <Input
                id={`${tableId}-input`}
                ref={inputRef}
                className={cn(
                  "peer min-w-80 ps-9",
                  Boolean(globalFilter) && "pe-9"
                )}
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Filter by Name, Email or Member ID..."
                type="text"
                aria-label="Filter by Name, Email or Member ID"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <ListFilterIcon size={16} aria-hidden="true" />
              </div>
              {Boolean(globalFilter) && (
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Clear filter"
                  onClick={() => {
                    setGlobalFilter("");
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  <CircleXIcon size={16} aria-hidden="true" />
                </button>
              )}
            </div> */}

            {/* Filter by Status */}
            {/* /* <FacetedDataFilter
                    column={table.getColumn("isActive")}
                    title="Status"
                  /> */}
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
