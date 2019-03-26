/**
 * 简化 Vue 操作
 */
const SimpleVue = {

  /**
   * 安装方法
   * @param Vue
   */
  install(Vue) {
    Vue.batch = {
      /**
       * 批量注册多个 VUE 插件
       * @param plugins
       */
      use(...plugins) {
        plugins.forEach(plugin => {
          Vue.use(plugin);
        });
      },

      /**
       * 批量注册多个全局 VUE 组件
       * @param components
       */
      component(...components) {
        components.forEach(component => {
          Vue.component(component);
        });
      }
    };
  }
};

export default SimpleVue;
