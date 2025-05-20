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
  XCircle,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
import { QuestionBuilder } from "./question-builder";
import { useCreateFormTemplate } from "@/mutations/formTemplate/formTemplateMutations";
import { toast } from "sonner";
import { LoaderComponent } from "@/components/data-loader";

export function FormTemplateTable({ columns, data, formTypes }) {
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

  const createMutation = useCreateFormTemplate();

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
    if (!selectedFormType) return;

    setIsLoading(true);
    setIsCreateDialogOpen(false);

    setTimeout(() => {
      setIsLoading(false);
      setShowQuestionBuilder(true);
    }, 1000);
  };

  const handleSaveTemplate = (templateData) => {
    createMutation.mutate(templateData, {
      onSuccess: () => {
        // Reset states
        setShowQuestionBuilder(false);
        setSelectedFormType(null);
        setTemplateName("");
        setIsCreateDialogOpen(false);
        toast.success("Form template created successfully");
      },
      onError: () => {
        toast.error("Failed to create form template. Please try again");
      },
    });
  };

  const handleCancel = () => {
    // Reset all states when cancelling
    setShowQuestionBuilder(false);
    setSelectedFormType(null);
    setTemplateName("");
    setIsCreateDialogOpen(false);
  };

  // 4. Render conditions AFTER all hooks and initialization
  if (isLoading) {
    return <LoaderComponent text="Preparing question builder" />;
  }

  // Valid formTypes
  const validFormTypes = formTypes.filter((formType) => formType.isActive);

  if (showQuestionBuilder) {
    return (
      <QuestionBuilder
        formTypeDetails={{
          [selectedFormType]: validFormTypes.find(
            (ft) => ft.formCode === selectedFormType
          ),
        }}
        mutation={createMutation}
        selectedFormType={selectedFormType}
        templateName={templateName}
        onSave={handleSaveTemplate}
        onCancel={handleCancel}
      />
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
                      {validFormTypes.map((formType) => (
                        <SelectItem
                          key={formType._id}
                          value={formType.formCode}
                        >
                          {formType.formName}
                        </SelectItem>
                      ))}
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
