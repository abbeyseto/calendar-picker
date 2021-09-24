export let daysArray = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export let monthsArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getDayMetrics = (props) => {
  let date = props.index - props.firstDay;
  let day = props.index % 7;
  let prevMonth = props.month - 1;
  let prevYear = props.year;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }
  let prevMonthDays = getNumDays(prevYear, prevMonth);
  let _date =
    (date < 0 ? prevMonthDays + date : date % props.numberOfDays) + 1;
  let month = date < 0 ? -1 : date >= props.numberOfDays ? 1 : 0;
  let timestamp = new Date(props.year, props.month, _date).getTime();
  return {
    date: _date,
    day,
    month,
    timestamp,
    dayString: daysArray[day],
  };
};

export const getNumDays = (year, month) => {
  return 40 - new Date(year, month, 40).getDate();
};

export const getMonthMetrics = (year, month) => {
  let firstDay = new Date(year, month).getDay();
  let numberOfDays = getNumDays(year, month);
  let monthArray = [];
  let rows = 6;
  let currentDay = null;
  let index = 0;
  let cols = 7;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      currentDay = getDayMetrics({
        index,
        numberOfDays,
        firstDay,
        year,
        month,
      });
      monthArray.push(currentDay);
      index++;
    }
  }
  return monthArray;
};

export const dateDateString = (dateValue) => {
  let dateData = dateValue.split("-").map((d) => parseInt(d, 10));
  if (dateData.length < 3) return null;

  let year = dateData[0];
  let month = dateData[1];
  let date = dateData[2];
  return { year, month, date };
};

export const getMonthString = (month) =>
  monthsArray[Math.max(Math.min(11, month), 0)] || "Month";

export const dateFromTime = (timestamp) => {
  let dateObject = new Date(timestamp);
  let month = dateObject.getMonth() + 1;
  let date = dateObject.getDate();
  return (
    dateObject.getFullYear() +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    (date < 10 ? "0" + date : date)
  );
};

export const dateToInput = (timestamp, inputRef) => {
  let dateString = dateFromTime(timestamp);
  inputRef.current.value = dateString;
};
