const serverIdHiddenGoods = (totalData, serverId = null) => {
  let len = totalData.length;
  for (let i = 0; i < len; i++) {
    if (serverId && totalData[i] && totalData[i].children[0].name === 'yh-goods') {
      totalData.splice(i, 1);
    }
  }
};

export default serverIdHiddenGoods;
