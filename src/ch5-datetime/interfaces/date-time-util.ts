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

const pad = (str: number, length: number) => {
  let str1 = String(str);
  while (str1.length < length) {
    str1 = '0' + str;
  }
  return str1;
}

const getReplaceMap = (date: Date) => {
  const hours = (date.getHours() % 12) ? date.getHours() % 12 : 12;
  return {
    'YYYY': date.getFullYear(),
    'YY': String(date.getFullYear()).slice(-2),
    'MMMM': monthsFull[date.getMonth()],
    'MMM': monthsAbbr[date.getMonth()],
    'MM': pad(date.getMonth() + 1, 2),
    'MI': pad(date.getMinutes(), 2),
    'M': date.getMonth() + 1,
    'DDDD': daysFull[date.getDay()],
    'DDD': daysAbbr[date.getDay()],
    'DD': pad(date.getDate(), 2),
    'D': date.getDate(),
    'HH24': pad(date.getHours(), 2),
    'HH': pad(hours, 2),
    'H': hours,
    'SS': pad(date.getSeconds(), 2),
    'PP': (date.getHours() >= 12) ? 'PM' : 'AM',
    'P': (date.getHours() >= 12) ? 'pm' : 'am',
    'LL': pad(date.getMilliseconds(), 3)
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
    let i = 0;
    const l = formattedString.length;
    let j: any;
    let ll: any;
    let t: any;
    const n: any = [];

    for (; i < l; i++) {
      if (typeof formattedString[i] === 'string') {
        t = formattedString[i].split(str);
        for (j = 0, ll = t.length - 1; j < ll; j++) {
          n.push(t[j]);
          n.push([rep]); // replacement pushed as non-string
        }
        n.push(t[ll]);
      } else {
        // must be a replacement, don't process, just push
        n.push(formattedString[i]);
      }
    }
    formattedString = n;
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