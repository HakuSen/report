// 普通时间 转 Unix时间戳(Unix timestamp)
// 2015-10-19 16:05:00 → 1445270671200

let timestampToUnix = e => {
  let date = e;
  date = new Date(Date.parse(date.replace(/-/g, '/')));
  let timestampDate = date.getTime();
  return timestampDate;
};
// Unix时间戳(Unix timestamp) 转 普通时间
// 1445241900000 → 2015-10-19 16:05:00

let unixToTime = e => {
  let date = new Date(e);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
  let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
  return Y + M + D + h + m + s;
};
// 每周的第一天（+1天）
let showWeekFirstDay = (quick = false) => {
  let today = new Date();
  let d = new Date().getDay();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  let WeekFirstDay;
  if (quick) {
    WeekFirstDay = new Date(today - (d - 1) * 86400000);
  }
  else {
    WeekFirstDay = new Date(today - (d - 2) * 86400000);
  }
  // if (quick) {
  //   WeekFirstDay = new Date(today - (today.getDay() - 1) * 86400000);
  // }
  // else if (!quick && d === 1) {
  //   WeekFirstDay = new Date(today - (today.getDay() + 5) * 86400000); // 如果逢周一就要默认选择上周
  // }
  // else {
  //   WeekFirstDay = new Date(today - (today.getDay() - 2) * 86400000);
  // }
  return WeekFirstDay;
};
// 每周的最后一天（-5天）
let showWeekLastDay = () => {
  let today = new Date();
  let d = new Date().getDay();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  let WeekFirstDay;
  WeekFirstDay = new Date(today - (d - 2) * 86400000);
  // if (d === 1) {
  //   WeekFirstDay = new Date(today - (today.getDay() + 5) * 86400000); // 如果逢周一就要默认选择上周
  // }
  // else {
  //   WeekFirstDay = new Date(today - (today.getDay() - 2) * 86400000);
  // }
  let WeekLastDay = new Date((WeekFirstDay / 1000) * 1000);
  return WeekLastDay;
};
// 上周的开始/结束日期
let getLastDate = n => {
  let now = new Date();
  let nowDayOfWeek = now.getDay();
  let nowDay = now.getDate();
  let nowMonth = now.getMonth();
  let nowYear = now.getFullYear();
  let weekDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - n);
  return weekDate;
};
// 每月的第一天
let getCurrentMonthFirst = () => {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  if (month === 0) {
    month = 12;
    year -= 1;
  }
  if (month < 10) {
    month = '0' + month;
  }
  today.setDate(1);
  // if (today.getDate() === 1) { //  每个月1号时默认选择上个月
  //   let firstDay = year + '-' + month + '-01';
  //   today = new Date(firstDay);
  // }
  // else {
  //   today.setDate(1);
  // }
  return today;
};

// 获得某月的天数
let getMonthDays = myMonth => {
  let nowYear = new Date().getFullYear();
  let monthStartDate = new Date(nowYear, myMonth, 1);
  let monthEndDate = new Date(nowYear, myMonth + 1, 1);
  let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
};

// 上月的开始/结束日期
let getLastMonthDate = (type, monthNum = 1) => {
  let now = new Date();
  let nowYear = now.getFullYear();
  let lastMonthDate = new Date();
  if (monthNum === 1 || monthNum === 2) {
    nowYear--;
  }
  lastMonthDate.setDate(1);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - monthNum);
  let lastMonth = lastMonthDate.getMonth();
  let lastMonthStartDate = new Date(nowYear, lastMonth, 1);
  let lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
  if (type === 'mStart') {
    return lastMonthStartDate;
  }
  return lastMonthEndDate;
};

// 今天的时间戳（ms）
let todayUnix = () => new Date().setHours(0, 0, 0, 0);
let lastDayUnix = () => new Date().setHours(0, 0, 0, 0) - 86400000;
// 根据value值拿到日周月
let getDateType = val => {
  switch (val) {
    case 1:
      return 'date';
    case 2:
      return 'week';
    case 3:
      return 'month';
    case 4:
      return 'date-shop';
    case 5:
      return 'week-shop';
    case 6:
      return 'month-shop';
  }
};
let numTotime = a => {
  if (a < 10) {
    return '0' + a + ':00';
  }
  return a + ':00';
};
let refreshTime = a => new Date(String(a).split(' ')[0] + ' 00:00:00');

let refreshDate = (a, b) => new Date(new Date(String(a).split(' ')[0] + ' 00:00:00').getTime() + 86400000 * b);

// 类似店铺日'date-shop' ==> 'date'
let cutStr = a => {
  if (a.indexOf('-') !== -1) {
    let pattern = /(.+?)-/g;
    let text = a.match(pattern);
    return text.toString().replace(/(-)/g, '');
  }
  return a;
};
// 根据年、月转换成该月的第一天和最后一天的数组['2018-08-01', '2018-08-31']
let getLastDay = (year, month) => {
  let new_year = year;
  let new_month = month++;
  // if (month > 12) {
  //   new_month -= 12;
  //   new_year++;
  // }
  let nowData = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
  let nowMonth = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
  let nowHours = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
  let nowMinutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
  let nowSeconds = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
  let myDate = new Date().getFullYear() + '-' + nowMonth + '-' + nowData;
  let todayTime = nowHours + ':' + nowMinutes + ':' + nowSeconds;
  let new_date = new Date(new_year, new_month, 1);
  let today = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();
  let lastDay = '';
  if (today === myDate) {
    lastDay = year + '-' + (new_month < 10 ? '0' + new_month : new_month) + '-' + today + ' ' + todayTime;
  }
  else {
    lastDay = year + '-' + (new_month < 10 ? '0' + new_month : new_month) + '-' + today + ' 23:59:59';
  }
  let firstDay = year + '-' + (new_month < 10 ? '0' + new_month : new_month) + '-01 00:00:00';
  return [firstDay, lastDay];
};
const baseFn = {};

baseFn.timestampToUnix = timestampToUnix;
baseFn.unixToTime = unixToTime;
baseFn.getMonthDays = getMonthDays;
baseFn.getLastMonthDate = getLastMonthDate;
baseFn.getCurrentMonthFirst = getCurrentMonthFirst;
baseFn.getLastDate = getLastDate;
baseFn.showWeekLastDay = showWeekLastDay;
baseFn.showWeekFirstDay = showWeekFirstDay;
baseFn.todayUnix = todayUnix;
baseFn.lastDayUnix = lastDayUnix;
baseFn.getDateType = getDateType;
baseFn.numTotime = numTotime;
baseFn.refreshTime = refreshTime;
baseFn.refreshDate = refreshDate;
baseFn.cutStr = cutStr;
baseFn.getLastDay = getLastDay;

export default baseFn;
