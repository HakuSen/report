import setQueryTimes from './setQueryTimes';

const setQueryTimeAddTail = formData => {
  let nowData = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
  let nowMonth = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
  let nowHours = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
  let nowMinutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
  let nowSeconds = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
  let myDate = new Date().getFullYear() + '-' + nowMonth + '-' + nowData;
  let todayTime = nowHours + ':' + nowMinutes + ':' + nowSeconds;
  let { start_date, end_date } = { start_date: '', end_date: '' };
  if (formData.typedate) {
    let { needStart, needEnd } = setQueryTimes(formData.typedate[1]);
    start_date = needStart + ' 00:00:00';
    end_date = needEnd === myDate ? needEnd + ' ' + todayTime : needEnd + ' 23:59:59';
    return { start_date, end_date };
  }
  if (formData.period) {
    let { needStart, needEnd } = setQueryTimes(formData.period[1]);
    let last_start_date;
    let last_end_date;
    let needStart1 = setQueryTimes(formData.period[2]).needStart;
    let needEnd1 = setQueryTimes(formData.period[2]).needEnd;
    start_date = needStart + ' 00:00:00';
    end_date = needEnd === myDate ? needEnd + ' ' + todayTime : needEnd + ' 23:59:59';
    last_start_date = needStart1 + ' 00:00:00';
    last_end_date = needEnd1 === myDate ? needEnd1 + ' ' + todayTime : needEnd1 + ' 23:59:59';
    return { start_date, end_date, last_start_date, last_end_date };
  }
  if (formData['equalityInterval']) {
    let { needStart, needEnd } = setQueryTimes(formData['equalityInterval'][0]);
    let last_start_date;
    let last_end_date;
    let needStart1 = setQueryTimes(formData['equalityInterval'][1]).needStart;
    let needEnd1 = setQueryTimes(formData['equalityInterval'][1]).needEnd;
    start_date = needStart + ' 00:00:00';
    end_date = needEnd === myDate ? needEnd + ' ' + todayTime : needEnd + ' 23:59:59';
    last_start_date = needStart1 + ' 00:00:00';
    last_end_date = needEnd1 === myDate ? needEnd1 + ' ' + todayTime : needEnd1 + ' 23:59:59';
    return { start_date, end_date, last_start_date, last_end_date };
  }
  if (formData.datetime && !formData['lastdatetime']) {
    let { needStart, needEnd } = setQueryTimes(formData.datetime);
    start_date = needStart + ' 00:00:00';
    end_date = needEnd === myDate ? needEnd + ' ' + todayTime : needEnd + ' 23:59:59';
    return { start_date, end_date };
  }
  let { needStart, needEnd } = setQueryTimes(formData.datetime);
  let last_start_date = setQueryTimes(formData['lastdatetime']).needStart + ' 00:00:00';
  let last_end_date = setQueryTimes(formData['lastdatetime']).needEnd === myDate ? needEnd + ' ' + todayTime : needEnd + ' 23:59:59';
  start_date = needStart + ' 00:00:00';
  end_date = needEnd === myDate ? needEnd + ' ' + todayTime : needEnd + ' 23:59:59';
  return { start_date, end_date, last_start_date, last_end_date };
};
export default setQueryTimeAddTail;
