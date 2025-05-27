import {
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
  createContext,
} from "react";
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table";
import FormTypeForm from "./add-formtype-form";
import {
  useCreateFormType,
  useUpdateFormType,
} from "@/mutations/formType/formTypeMutations";
import { toast } from "sonner";
import { LoadingButton } from "@/components/ui/loading-button";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { formTypeApi } from "@/api/formTypes";

export const FormTypeContext = createContext(null);

export function FormTypeTable({ columns, data }) {
  // const queryClient = useQueryClient();

  const tableId = useId();
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingFormType, setEditingFormType] = useState(null);

  const inputRef = useRef(null);

  const table = useReactTable({
    data,
    columns,

    state: {
      pagination,
      columnFilters,
      //   globalFilter,
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

  const isFiltered = table.getState().columnFilters.length > 0;
  const createMutation = useCreateFormType();
  const updateMutation = useUpdateFormType();

  const handleFormSubmit = async (formData) => {
    if (editingFormType) {
      // Update existing form type
      updateMutation.mutate(
        {
          id: editingFormType._id,
          formName: formData.formName,
          formDescription: formData.formDescription,
          formCode: formData.formCode,
        },
        {
          onSuccess: () => {
            setSheetOpen(false);
            setEditingFormType(null);
            toast.success("Form Type updated successfully");
          },
          onError: () => {
            toast.error("Failed to update Form Type. Please try again");
          },
        }
      );
    } else {
      // Create new form type
      createMutation.mutate(formData, {
        onSuccess: () => {
          setSheetOpen(false);
          toast.success("Form Type created successfully");
        },
        onError: () => {
          toast.error("Failed to add Form Type. Please try again");
        },
      });
    }
  };

  // Reset editing form type when sheet is closed
  useEffect(() => {
    if (!sheetOpen) {
      setEditingFormType(null);
    }
  }, [sheetOpen]);

  const contextValue = {
    setEditingFormType,
    setSheetOpen,
  };

  return (
    <FormTypeContext.Provider value={contextValue}>
      <Card>
        <CardHeader>
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Filter input field */}
              <Input
                placeholder="Filter by Form Name..."
                className="max-w-sm h-8"
                value={table.getColumn("formName")?.getFilterValue() ?? ""}
                onChange={(e) => {
                  table.getColumn("formName")?.setFilterValue(e.target.value);
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
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80">
                  <PlusCircle />
                  Create New Form Type
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    {editingFormType
                      ? "Edit Form Type"
                      : "Create New Form Type"}
                  </SheetTitle>
                  <SheetDescription>
                    {editingFormType
                      ? "Update the form type details below."
                      : "Add a new form type to the system. Fill in the required details below."}
                  </SheetDescription>
                </SheetHeader>
                <div className="p-4">
                  {" "}
                  <FormTypeForm
                    onSubmit={handleFormSubmit}
                    initialData={editingFormType}
                  />
                </div>

                <SheetFooter>
                  <div className="flex items-center justify-end space-x-2">
                    {" "}
                    <SheetClose asChild>
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </SheetClose>
                    <LoadingButton
                      loading={
                        createMutation.isPending || updateMutation.isPending
                      }
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                      type="submit"
                      form="add-form-type"
                      className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? "Saving"
                        : editingFormType
                        ? "Update"
                        : "Save changes"}
                    </LoadingButton>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
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
    </FormTypeContext.Provider>
  );
}
