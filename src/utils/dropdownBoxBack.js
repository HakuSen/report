const dropdownBoxBack = (totalData, refs, boxNameArr) => {
  // 解决原生下拉框无法回弹的问题
  if (totalData && totalData.length >= 0) {
    let l = totalData.length;
    for (let i = 0; i < l; i++) {
      if (JSON.stringify(boxNameArr).indexOf(totalData[i].children[0].name) !== -1) {
        if (refs['payList'][i].haveSelect) {
          refs['payList'][i].haveSelect('all');
        }
      }
    }
  }
};

export default dropdownBoxBack;
