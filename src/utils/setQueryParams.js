// 设置基本的请求参数
const setQueryParams = (formData, store) => {
  let params = {
    service_id: store.getters['tokenInfo/userinfo']['service_id'] ? store.getters['tokenInfo/userinfo']['service_id'] : '',
    shopper_pid: store.getters['tokenInfo/userinfo']['parent_id']
      ? store.getters['tokenInfo/userinfo']['parent_id']
      : store.getters['tokenInfo/userinfo'].shopper_id, // 父门店
    page_num: 1,
    page_size: 20
  };
  if (store.getters['tokenInfo/userinfo']['user_type'] === 'child_shop' && store.getters['tokenInfo/userinfo']['type'] === 'SHOP') {
    // 子店铺需传自己shop的一个数组
    let shopArray = [store.getters['tokenInfo/userinfo'].shopper_id];
    params.shopper_id_list = shopArray;
  }
  else {
    params.shopper_id_list = formData.shop && formData.shop[0] !== '全部' ? formData.shop : null;
  }

  if (formData['orgShop'] && formData['orgShop'].length > 0) {
    params['deep_name'] = formData['orgShop'][0][1]['name'];
    formData['orgShop'][0][1]['name'] === '店铺' ? params['deep_id'] = null : params['deep_id'] = formData['orgShop'][0][1]['deep'];
    params['deep_is_parent'] = formData['orgShop'][0][1]['is_parent'];
    if (formData['orgShop'][1] && formData['orgShop'][1][0] !== '全部') {
      params.shopper_id_list = formData['orgShop'][1];
    }
    if (store.getters['tokenInfo/userinfo']['type'] === 'ORG') {
      params['org_id'] = store.getters['tokenInfo/userinfo']['org_id'];
    }
  }

  if (formData.payType && formData.payType[0] !== '全部') {
    params['pay_model_list'] = formData.payType;
  }

  if (formData.indent !== '') {
    params['order_type'] = formData.indent;
  }

  if (params.order_type === '0') {
    store.commit('info/setOrderTypeName', { data: '堂食' });
  }
  else if (params.order_type === '1') {
    store.commit('info/setOrderTypeName', { data: '外卖' });
  }
  else {
    store.commit('info/setOrderTypeName', { data: '全部' });
  }

  if (formData.typedate) {
    let type = formData.typedate[0];
    if (type === 'date') {
      params.type = 1;
    }
    else if (type === 'week') {
      params.type = 2;
    }
    else if (type === 'month') {
      params.type = 3;
    }
    else if (type === 'date-shop') {
      params.type = 4;
    }
    else if (type === 'week-shop') {
      params.type = 5;
    }
    else if (type === 'month-shop') {
      params.type = 6;
    }
  }

  if (formData.period) {
    let type = formData.period[0];
    if (type === 'date') {
      params.type = 1;
    }
    else if (type === 'week') {
      params.type = 2;
    }
    else if (type === 'month') {
      params.type = 3;
    }
    else if (type === 'date-shop') {
      params.type = 4;
    }
    else if (type === 'week-shop') {
      params.type = 5;
    }
    else if (type === 'month-shop') {
      params.type = 6;
    }
  }
  if (formData['checkGroup']) {
    if (formData['checkGroup'].length === 0) {
      params['split_mix_pay'] = 0;
    }
    else {
      params['split_mix_pay'] = 1;
    }
  }
  if (formData['Distribution']) {
    if (formData['Distribution'].length === 0) {
      params['deliverypay_flag'] = 0;
    }
    else {
      params['deliverypay_flag'] = 1;
    }
  }
  return params;
};

export default setQueryParams;
