/**
 * 异步化的项目启动器
 * @param {[Promise]} promises 需要异步加载和打包模块表
 * @returns {Promise<any>} 返回包含各个模块的表
 * @constructor
 */
const AsyncStarer = {
  startup: promises => new Promise((resolve, reject) => {
    if (promises.length > 0) {
      Promise.all(promises).then(loaded => {
        resolve(loaded);
      }).catch(reason => {
        reject(reason);
      });
    }
  })
};

export default AsyncStarer;
