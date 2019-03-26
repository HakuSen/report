function getStandardEndTime(times) { // 获取参数需要的时间类型
  let intermediateVariable = new Date(times);
  let endMonth = intermediateVariable.getMonth() + 1;
  let year = intermediateVariable.getFullYear();
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    return 2419200000;
  }
  switch (endMonth) {
    case 2:
      return 2332800000;
    case 4:
    case 6:
    case 9:
    case 11:
      return 2505600000;
    default:
      return 2592000000;
  }
}

function getNeedTime(needTime) {
  let times = new Date(needTime);
  let year = times.getFullYear();
  let month = times.getMonth() + 1;
  let day = times.getDate();
  return year + '-' + (month >= 10 ? month : '0' + month) + '-' + (day >= 10 ? day : '0' + day);
}

function setQueryTimes(value) {
  if (value) {
    let needStart = value[2];
    let needEnd = value[3];
    let typeDate = value[4];
    let needStarts = null;
    let needEnds = null;
    if (typeDate === 'week' || typeDate === 'shop-week') {
      needStarts = needStart - 86400000;
      needEnds = needEnd + 432000000;
      needStart = getNeedTime(needStarts);
      needEnd = getNeedTime(needEnds);
      return { needStart, needEnd, typeDate };
    }
    else if (typeDate === 'month' || typeDate === 'shop-month') {
      needStarts = needStart;
      let intervalTime = getStandardEndTime(needEnd);
      needEnds = needEnd + intervalTime;
      needStart = getNeedTime(needStarts);
      needEnd = getNeedTime(needEnds);
      return { needStart, needEnd, typeDate };
    }
    needStart = getNeedTime(needStart);
    needEnd = getNeedTime(needEnd);
    return { needStart, needEnd, typeDate };
  }
}

export default setQueryTimes;
