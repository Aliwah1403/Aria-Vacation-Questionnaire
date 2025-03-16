import React, { useCallback } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CheckInOutDatePicker = React.forwardRef(
  ({ value, onChange, disabled, defaultMonth }, ref) => {
    const [open, setOpen] = React.useState(false);

    const handleButtonClick = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    }, []);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            className={cn(
              "w-full pl-3 text-left font-normal",
              !value && "text-muted-foreground"
            )}
            onClick={handleButtonClick}
          >
            {value ? format(value, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          side="bottom"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => {
            e.preventDefault();
            setOpen(false);
          }}
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            disabled={disabled}
            defaultMonth={defaultMonth}
            initialFocus={false}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

CheckInOutDatePicker.displayName = "CheckInOutDatePicker";

export default CheckInOutDatePicker;
