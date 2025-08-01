import { Timestamp } from 'firebase/firestore';


export const getISTTime = ({ seconds, nanoseconds }) => {
  const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1_000_000);
  const date = new Date(milliseconds);

  // Convert to IST by using toLocaleString with 'Asia/Kolkata'
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};




// Helper function to calculate membership end date based on existing membership
export const calculateEndDate = (days, existingEndDate = null) => {
  if (!existingEndDate) return null;

  const daysToAdd = Number(days);
  if (!Number.isFinite(daysToAdd)) return null; // guard against NaN, Infinity

  let startDate;

  if (existingEndDate.seconds) {
    const existingEndDateTime = new Date(existingEndDate.seconds * 1000);
    startDate = existingEndDateTime;
  } else {
    return null; // fallback if existingEndDate is not in expected format
  }

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + daysToAdd);
  return endDate;
};





export const getStartEndDate = (filter) => {
  const today = new Date();
  let startDate, endDate;

  switch (filter) {
    case "today":
      startDate = new Date(today.setHours(0, 0, 0, 0));
      endDate = new Date();
      break;
    case "thisweek":
      startDate = new Date(today.setDate(today.getDate() - today.getDay())); // Start of week (Sunday)
      endDate = new Date();
      break;
    case "lastweek":
      startDate = new Date(today.setDate(today.getDate() - today.getDay() - 7)); // Start of last week
      endDate = new Date(today.setDate(today.getDate() + 7));
      break;
    case "thismonth":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date();
      break;
    case "lastmonth":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "lastsixmonths":
      startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);
      endDate = new Date();
      break;
    case "thisyear":
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date();
      break;
    case "lastyear":
      startDate = new Date(today.getFullYear() - 1, 0, 1);
      endDate = new Date(today.getFullYear() - 1, 11, 31);
      break;
    default:
      return { startDate: null, endDate: null }; // "All Time" option
  }

  return {
    startDate: Timestamp.fromDate(startDate),
    endDate: Timestamp.fromDate(endDate),
  };
};









// Function to find the expiration of an end date
    export const findExpiration = ({ seconds, nanoseconds }) => {
        const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1_000_000);
        const date1 = new Date(milliseconds);

        const date2 = new Date();
        const diff = date1 - date2; // Difference in milliseconds

        return diff;
    }