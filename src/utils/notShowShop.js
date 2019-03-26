const notShowShop = (totalData, userinfo) => {
  // 子店铺登录，不显示店铺控件
  let l = totalData.length;
  if (userinfo['user_type'] && userinfo['type'] && userinfo['user_type'] === 'child_shop' && userinfo['type'] === 'SHOP') {
    for (let i = 0; i < l; i++) {
      if (totalData[i] && totalData[i].children[0].name === 'yh-shop-choice' || totalData[i] && totalData[i].children[0].name === 'yh-org-shop') {
        totalData.splice(i, 1);
      }
    }
  }
};

export default notShowShop;
