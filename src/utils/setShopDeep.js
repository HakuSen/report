const setShopDeep = (refs, totalData, formData = null) => {
  if (formData) {
    for (let i = 0; i < totalData.length; i++) {
      if (totalData[i] && totalData[i].children[0].name === 'yh-shop-choice') {
        refs['payList'][i].setParames(formData.organize[1].deep);
        refs['payList'][i].urlData();
      }
    }
  }
};
export default setShopDeep;
