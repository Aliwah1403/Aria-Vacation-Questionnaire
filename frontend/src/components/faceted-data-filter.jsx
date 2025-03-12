import { useCallback, useMemo } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FilterIcon } from "lucide-react";

const FacetedDataFilter = ({ title, column }) => {
  // Get unique values for the column
  const facetedValues = useMemo(() => {
    if (!column) return [];
    return Array.from(column.getFacetedUniqueValues().keys()).sort();
  }, [column?.getFacetedUniqueValues()]);

  // Get selected values
  const selectedValues = useMemo(() => {
    return column?.getFilterValue() ?? [];
  }, [column?.getFilterValue()]);

  // Get counts for each value
  const facetedCounts = useMemo(() => {
    return column?.getFacetedUniqueValues();
  }, [column?.getFacetedUniqueValues()]);

  // Handle checkbox changes
  const handleCheckboxChange = useCallback(
    (checked, value) => {
      if (!column) return;

      const filterValue = column.getFilterValue() ?? [];
      let newFilterValue = [...filterValue];

      if (checked) {
        newFilterValue.push(value);
      } else {
        newFilterValue = newFilterValue.filter((v) => v !== value);
      }

      column.setFilterValue(newFilterValue.length ? newFilterValue : []);
    },
    [column]
  );

  if (!column || !facetedValues.length) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-dashed">
          <FilterIcon
            className="-ms-1 opacity-60"
            size={16}
            aria-hidden="true"
          />
          {title}
          {selectedValues.length > 0 && (
            <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
              {selectedValues.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-36 p-3" align="start">
        <div className="space-y-3">
          <div className="text-muted-foreground text-xs font-medium">
            Filters
          </div>
          <div className="space-y-3">
            {facetedValues.map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedValues.includes(value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(checked, value)
                  }
                />
                <Label className="flex grow justify-between gap-2 font-normal capitalize">
                  <span>{value}</span>
                  <span className="text-muted-foreground ms-2 text-xs">
                    {facetedCounts?.get(value)}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FacetedDataFilter;
