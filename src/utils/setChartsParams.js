// 设置基本的请求参数
const setChartsParams = (store, zones = null, timeAry) => {
  let params = {
    start_date: timeAry[0],
    end_date: timeAry[1],
    id: store.getters['tokenInfo/userinfo']['id'],
    user_type: store.getters['tokenInfo/userinfo']['user_type'],
    type: store.getters['tokenInfo/userinfo']['type'],
    service_id: store.getters['tokenInfo/userinfo']['service_id'],
    shopper_id: store.getters['tokenInfo/userinfo']['shopper_id'],
    shopper_pid: store.getters['tokenInfo/userinfo']['parent_id']
      ? store.getters['tokenInfo/userinfo']['parent_id']
      : store.getters['tokenInfo/userinfo'].shopper_id,
    org_id: store.getters['tokenInfo/userinfo']['org_id']
  };
  if (zones && zones.length && zones) {
    params['order_by'] = zones[1];
    params['deep'] = zones[2] ? zones[2] : null;
    params['dropdown_type'] = zones[2] ? '2' : '1';
  }
  else {
    params['dropdown_type'] = '1';
    params['order_by'] = 'saleCountSum';
  }
  return params;
};

export default setChartsParams;
