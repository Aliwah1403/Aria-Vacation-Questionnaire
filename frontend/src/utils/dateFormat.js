import moment from "moment";

// format date data cell on tables
export const dateFormat = (date) => {
    return moment(date).format("DD/MM/YYYY");
}