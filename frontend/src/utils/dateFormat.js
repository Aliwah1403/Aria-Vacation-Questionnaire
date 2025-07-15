import moment from "moment";

// format date data cell on tables
export const dateFormat = (date) => {
    return moment(date).format("DD/MM/YYYY");
}

//Update dates in the format: May 09, 2025
export function userTableDateLong(date) {
  if (!date) return "";
  return moment(date).format("MMM DD, YYYY"); 
}