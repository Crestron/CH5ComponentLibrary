export const offsetTimeHours = (date: Date, minutes: number) => {
  const resultDate = new Date(date);
  resultDate.setMinutes(resultDate.getMinutes() + minutes);
  return resultDate;
}

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

const appendZeroForSingleDigit = (value: number, stringLength: number) => {
  let output = String(value);
  while (output.length < stringLength) {
    output = '0' + value;
  }
  return output;
}

const getReplaceMap = (date: Date) => {
  const hours = (date.getHours() % 12) ? date.getHours() % 12 : 12;
  return {
    'YYYY': date.getFullYear(),
    'YY': String(date.getFullYear()).slice(-2),
    'MMMM': monthsFull[date.getMonth()],
    'MMM': monthsAbbr[date.getMonth()],
    'MM': appendZeroForSingleDigit(date.getMonth() + 1, 2),
    'MI': appendZeroForSingleDigit(date.getMinutes(), 2),
    'M': date.getMonth() + 1,
    'DDDD': daysFull[date.getDay()],
    'DDD': daysAbbr[date.getDay()],
    'DD': appendZeroForSingleDigit(date.getDate(), 2),
    'D': date.getDate(),
    'HH24': appendZeroForSingleDigit(date.getHours(), 2),
    'HH': appendZeroForSingleDigit(hours, 2),
    'H': hours,
    'SS': appendZeroForSingleDigit(date.getSeconds(), 2),
    'PP': (date.getHours() >= 12) ? 'PM' : 'AM',
    'P': (date.getHours() >= 12) ? 'pm' : 'am',
    'LL': appendZeroForSingleDigit(date.getMilliseconds(), 3)
  };
};

// Main function toFormat
export const toFormat = (date: Date, format: string) => {
  const replaceMap = getReplaceMap(date);
  const formattedString = processFormat(format, replaceMap);
  return joinFormattedString(formattedString);
};

// Function to process the format string and apply replacements
const processFormat = (format: string, replaceMap: any) => {
  let formattedString: any[] = [format];

  const replace = (str: any, rep: any) => {
    let i: number = 0;
    const stringLength = formattedString.length;
    let j: number;
    let splitByIdentifierString: string;
    let splitByIdentifierStringInnerLoopLength: number;
    const formattedOutput: any = [];

    for (; i < stringLength; i++) {
      if (typeof formattedString[i] === 'string') {
        splitByIdentifierString = formattedString[i].split(str);
        for (j = 0, splitByIdentifierStringInnerLoopLength = splitByIdentifierString.length - 1; j < splitByIdentifierStringInnerLoopLength; j++) {
          formattedOutput.push(splitByIdentifierString[j]);
          formattedOutput.push([rep]); // replacement pushed as non-string
        }
        formattedOutput.push(splitByIdentifierString[splitByIdentifierStringInnerLoopLength]);
      } else {
        // must be a replacement, don't process, just push
        formattedOutput.push(formattedString[i]);
      }
    }
    formattedString = formattedOutput;
  };

  for (const i in replaceMap) {
    if (replaceMap.hasOwnProperty(i)) {
      replace(i, replaceMap[i]);
    }
  }

  return formattedString;
};

// Function to join the formatted string parts into the final string
const joinFormattedString = (formattedString: any[]) => {
  let finalFormattedString = '';

  for (let i = 0, l = formattedString.length; i < l; i++) {
    finalFormattedString += typeof formattedString[i] === 'string' ? formattedString[i] : formattedString[i][0];
  }

  return finalFormattedString;
};