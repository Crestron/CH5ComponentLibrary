import { capitalize } from "lodash";
const monthsAbbr = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec'
];

const monthsFull = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];

const daysAbbr = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat'
];

const daysFull = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
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
  /* convert the first letters of above returned data to capital. For Ex: january 02, 2023 will be January 02, 2023 */
  format = format.split(' ')
    .map(capitalize)
    .join(' ');
  /* since the first letters are capitals, use Pp format to add meridians. */
  format = replaceDateContent(format, 'Pp', (date.getHours() >= 12) ? 'PM' : 'AM');
  return format;
};
