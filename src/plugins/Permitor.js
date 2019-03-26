/**
 * 组件权限支持插件
 * @type {{install(*, *=) : void}}
 */
const Permitor = {
  /**
   * 注册权限控制器方法
   * @param Vue 全局 Vue
   * @param [options] 配置参数
   */
  install(Vue) {
    // 定义指令
    Vue.directive('permit', {
      // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
      bind(el, binding, vnode) {
        console.warn('vnode', vnode);
        // vnode.props.disabled = binding.value.disabled;
      },

      // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
      inserted(el, binding, vnode) {
        console.warn('binding:', el, binding.value, vnode.disabled);
        // vnode.props.disabled = binding.value.disabled;
        el.classList.add('is-disabled');
      },

      // 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。
      // 但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)
      update(el, binding) {
        console.warn('binding:', binding.expression, binding.value);
      },

      // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
      componentUpdated(el, binding) {
        console.warn('binding:', binding.expression, binding.value);
      },

      // 只调用一次，指令与元素解绑时调用
      unbind(el, binding) {
        console.warn('binding:', binding.expression, binding.value);
      }
    });
  }
};

export default Permitor;
