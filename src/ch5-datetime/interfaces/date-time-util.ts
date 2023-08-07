const monthsAbbr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const monthsFull = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const daysAbbr = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];

const daysFull = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const appendZeroForSingleDigit = (value: number) => {
  if (value < 10) {
    return "0" + value;
  } else {
    return String(value);
  }
};

const replaceDateContent = (dateString: string, format: string, value: number | string): string => {
  if (dateString.indexOf(format) !== -1) {
    return dateString.replace(format, String(value));
  } else {
    return dateString;
  }
};

// Main function toFormat
export const toFormat = (date: Date, format: string) => {
  const hours = (date.getHours() % 12) ? date.getHours() % 12 : 12;
  format = replaceDateContent(format, 'YYYY', date.getFullYear());
  format = replaceDateContent(format, 'YY', String(date.getFullYear()).slice(-2));
  format = replaceDateContent(format, 'MMMM', monthsFull[date.getMonth()]);
  format = replaceDateContent(format, 'MMM', monthsAbbr[date.getMonth()]);
  format = replaceDateContent(format, 'MM', appendZeroForSingleDigit(date.getMonth() + 1));
  format = replaceDateContent(format, 'MI', appendZeroForSingleDigit(date.getMinutes()));
  format = replaceDateContent(format, 'M', date.getMonth() + 1);
  format = replaceDateContent(format, 'DDDD', daysFull[date.getDay()]);
  format = replaceDateContent(format, 'DDD', daysAbbr[date.getDay()]);
  format = replaceDateContent(format, 'DD', appendZeroForSingleDigit(date.getDate()));
  format = replaceDateContent(format, 'D', date.getDate());
  format = replaceDateContent(format, 'HH24', appendZeroForSingleDigit(date.getHours()));
  format = replaceDateContent(format, 'H24', date.getHours());
  format = replaceDateContent(format, 'HH', appendZeroForSingleDigit(hours));
  format = replaceDateContent(format, 'H', hours);
  format = replaceDateContent(format, 'SS', appendZeroForSingleDigit(date.getSeconds()));
  format = replaceDateContent(format, 'PP', (date.getHours() >= 12) ? 'PM' : 'AM');
  return format;
};
