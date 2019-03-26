import { formatDate, parseDate, isDateObject, isDate } from 'element-ui/packages/date-picker/src/util';

/**
 * 日期格式器
 * @param value
 * @param format
 * @returns {*}
 * @constructor
 */
const DATE_FORMATTER = function(value, format) {
  if (format === 'timestamp') return value.getTime();
  return formatDate(value, format);
};

const DATE_PARSER = function(text, format) {
  if (format === 'timestamp') return new Date(Number(text));
  return parseDate(text, format);
};

/**
 * 日期区间格式器
 * @param value
 * @param format
 * @returns {*}
 * @constructor
 */
const RANGE_FORMATTER = function(value, format) {
  if (Array.isArray(value) && value.length === 2) {
    const start = value[0];
    const end = value[1];

    if (start && end) {
      return [DATE_FORMATTER(start, format), DATE_FORMATTER(end, format)];
    }
  }
  return '';
};
const RANGE_PARSER = function(array, format, separator) {
  let rangeArray = array;

  if (!Array.isArray(rangeArray)) {
    rangeArray = rangeArray.split(separator);
  }
  if (rangeArray.length === 2) {
    const range1 = rangeArray[0];
    const range2 = rangeArray[1];

    return [DATE_PARSER(range1, format), DATE_PARSER(range2, format)];
  }
  return [];
};

// const getWeekNumber2 = function(src) {
//   if (!isDate(src)) return null;
//
//   const date = new Date(src.getTime());
//   date.setHours(0, 0, 0, 0);
//
//   const week1 = new Date(date.getFullYear(), 0, 1);
//   week1.setHours(0, 0, 0, 0);
//
//   const days = (date.getTime() - week1.getTime()) / 86400000;
//
//   return (days / 7 >> 0) + 1;
// };
export const getWeekNumber = function(src) {
  if (!isDate(src)) return null;
  const date = new Date(src.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
  // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
  const r = ((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7;
  return 1 + (r >> 0);
};

/**
 * 根据年份取得第一周首日的日期对象
 * @param year
 */
export const getFirstWeekDate = function(year) {
  const dt = new Date();
  dt.setFullYear(year, 0, 1);
  dt.setHours(0, 0, 0, 1);

  // 包含本年度第一个星期四的周为本年度第一周，否则向后推算到下一周作为该年第一周
  // 本周编号： 0（周日） 到 6（周六） 之间的一个整数
  const weekDay = dt.getDay();
  if (weekDay > 0 && weekDay <= 4) {
    // 若包含本年度第一个星期四直接返回
  }
  else {
    const increment = Math.abs(weekDay - 7) % 7 + 1;
    dt.setTime(dt.getTime() + increment * 86400000);
  }
  return dt;
};

const TYPE_VALUE_RESOLVER_MAP = {
  default: {
    formatter(value) {
      if (!value) return '';
      return '' + value;
    },
    parser(text) {
      if (text === undefined || text === '') return null;
      return text;
    }
  },
  week: {
    formatter(value, format) {
      let week = getWeekNumber(value);
      let month = value.getMonth();

      const trueDate = new Date(value);
      if (week === 1 && month === 11) {
        trueDate.setHours(0, 0, 0, 0);
        trueDate.setDate(trueDate.getDate() + 3 - (trueDate.getDay() + 6) % 7);
      }
      let date = formatDate(trueDate, format);
      date = /WW/.test(date)
        ? date.replace(/WW/, week < 10 ? '0' + week : week)
        : date.replace(/W/, week);
      return date;
    },
    parser(text) {
      const array = (text || '').split('第');

      if (array.length === 2) {
        const year = Number(array[0]);
        const month = Number(array[1]);

        if (!isNaN(year) && !isNaN(month) && month < 54) {
          return text;
        }
      }
      return null;
    }
  },
  date: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  datetime: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  daterange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  datetimerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  timerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  time: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  month: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  year: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  number: {
    formatter(value) {
      if (!value) return '';
      return '' + value;
    },
    parser(text) {
      let result = Number(text);

      if (!isNaN(text)) {
        return result;
      }

      return null;
    }
  }
};

const DEFAULT_FORMATS = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  time: 'HH:mm:ss',
  week: 'yyyy 第 WW 周',
  timerange: 'HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  year: 'yyyy'
};

/**
 * 转换日期字符串为日期对象
 * @param value
 * @param customFormat
 * @param type
 * @param rangeSeparator
 * @returns {null}
 */
const parseAsFormatAndType = (value, customFormat, type, rangeSeparator = '-') => {
  if (!value) return null;

  const parser = (
    TYPE_VALUE_RESOLVER_MAP[type] ||
    TYPE_VALUE_RESOLVER_MAP['default']
  ).parser;

  const format = customFormat || DEFAULT_FORMATS[type];
  return parser(value, format, rangeSeparator);
};

/**
 * 格式化日期对象为指定格式字符串
 * @param value
 * @param customFormat
 * @param type
 * @returns {null}
 */
const formatAsFormatAndType = (value, customFormat, type) => {
  if (!value) return null;
  const formatter = (
    TYPE_VALUE_RESOLVER_MAP[type] ||
    TYPE_VALUE_RESOLVER_MAP['default']
  ).formatter;
  const format = customFormat || DEFAULT_FORMATS[type];
  return formatter(value, format);
};

export default {
  methods: {
    parseAsFormatAndType,
    formatAsFormatAndType,
    isDateObject,
    DATE_PARSER,
    DATE_FORMATTER
  }
};
