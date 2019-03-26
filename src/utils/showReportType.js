const showReportType = (totalData, store) => {
  let l = totalData.length;
  if (store.getters['tokenInfo/userinfo']['type'] === 'SERVICE') {
    for (let i = 0; i < l; i++) {
      if (totalData[i] && totalData[i].children[0].name === 'yh-radio-button') {
        totalData.splice(i, 1);
      }
    }
  }
};

export default showReportType;
