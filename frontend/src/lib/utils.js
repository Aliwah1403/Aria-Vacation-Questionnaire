import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Custom filter function for multi-column searching
export const multiColumnFilterFn = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.memberName} ${row.original.memberId} ${row.original.memberEmail}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

// Faceted column filtering
export const multiSelectFilter = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  return !filterValue.length || filterValue.includes(value);
};
