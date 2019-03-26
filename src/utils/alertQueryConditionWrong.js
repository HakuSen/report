import { MessageBox } from 'element-ui';

// 查询条件有误时弹窗提示
const alertQueryConditionWrong = (params, store, urlParams, pageVariableArr, alertFlag = false) => {
  if (alertFlag) {
    store.dispatch('info/getQueryParams', { params, tableName: pageVariableArr[1], everyQueryParamsName: pageVariableArr[2] });
    store.dispatch('info/getRequestDataList', { params, urlParams, loadingFlag: pageVariableArr[0], loading: false });
    return;
  }
  if (params.prop_id === '') {
    // 限制必须属性项 单选的
    MessageBox.alert('请选择属性名称', '提示', { type: 'warning', showClose: false });
    store.commit('info/setQueryLoading', { loadingFlag: pageVariableArr[0], loading: false });
  }
  else if (params.goods_id === '') {
    // 限制必须属性项
    MessageBox.alert('请选择商品名称', '提示', { type: 'warning', showClose: false });
    store.commit('info/setQueryLoading', { loadingFlag: pageVariableArr[0], loading: false });
  }
  else {
    store.dispatch('info/getRequestDataList', { params, urlParams, loadingFlag: pageVariableArr[0], loading: false });
    store.dispatch('info/getQueryParams', { params, tableName: pageVariableArr[1], everyQueryParamsName: pageVariableArr[2] });
  }
};

export default alertQueryConditionWrong;
