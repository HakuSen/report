// 页面刷新后，发送一次请求

const sendOnceQuery = (store, pageName, pageParams, tableData, urlParams, loadingFlagName) => {
  const vuexAllParams = JSON.parse(sessionStorage.getItem('vuex')).info.params;
  if (JSON.stringify(vuexAllParams[pageName][pageParams]) !== '{}' && JSON.stringify(tableData) === '{}') {
    store.dispatch('info/getRequestDataList', {
      params: vuexAllParams[pageName][pageParams],
      urlParams,
      loadingFlag: loadingFlagName,
      loading: false
    });
  }
};
export default sendOnceQuery;
