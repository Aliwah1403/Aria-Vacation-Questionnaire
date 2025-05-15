import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const dateRanges = [
  {
    label: "7D",
    days: 7,
    date: `${formatDate(
      new Date(new Date().setDate(new Date().getDate() - 7))
    )} – ${formatDate(new Date())}`,
  },
  {
    label: "30D",
    days: 30,
    date: `${formatDate(
      new Date(new Date().setDate(new Date().getDate() - 30))
    )} – ${formatDate(new Date())}`,
  },
  {
    label: "60D",
    days: 60,
    date: `${formatDate(
      new Date(new Date().setDate(new Date().getDate() - 60))
    )} – ${formatDate(new Date())}`,
  },
  {
    label: "1YR",
    days: 365,
    date: `${formatDate(
      new Date(new Date().setDate(new Date().getDate() - 365))
    )} – ${formatDate(new Date())}`,
  },
];

const DateRangeSelector = ({ selectedRange, onRangeChange }) => {
  return (
    <TooltipProvider>
      <div className="inline-flex items-center rounded-md text-sm font-medium shadow-sm">
        {dateRanges.map((range, index) => (
          <Tooltip key={range.label}>
            <TooltipTrigger asChild>
              <Button
                variant={selectedRange === range.days ? "default" : "outline"}
                className={cn(
                  "px-4 py-2 focus:z-10",
                  selectedRange === range.days &&
                    "bg-fountain-blue-400 hover:bg-fountain-blue-400/80",
                  index === 0
                    ? "rounded-l-md rounded-r-none"
                    : index === dateRanges.length - 1
                    ? "rounded-r-md rounded-l-none -ml-px"
                    : "rounded-none -ml-px"
                )}
                onClick={() => onRangeChange(range.days)}
              >
                {range.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {range.date}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default DateRangeSelector;
