/**
 * 路由全局导航守卫管理器
 */
class RouteGuard {
  _route = null;
  _config = null;
  _global = null;
  _hooks = null;
  _inited = false;

  /**
   * 构建新的导航守卫管理器
   * @param {VueRouter} route 路由实例
   * @param {Object} config 配置
   */
  constructor(route, config) {
    this._route = route;
    this._config = config;

    this.init();
  }

  init() {
    if (this._inited) return;

    const { global, ...other } = this._config;
    this._global = global;
    this._hooks = other;

    this.globalSetup(this._global);
    this.localSetup(this._hooks);
    this._inited = true;
  }

  globalSetup(config) {
    if (config && Array.isArray(config)) {
      for (let i = 0; i < config.length; i++) {
        const hook = config[i];

        if (hook.before) this._route.beforeEach(hook.before);
        if (hook.after) this._route.afterEach(hook.after);
      }
    }
  }

  localSetup(config) {
    // 暂时将局部针对性的路由按全局处理，后续结合动态菜单路由设置专属拦截器勾子

    if (config) {
      Object.keys(config).forEach(path => {
        const hook = config[path];

        if (hook.before) this._route.beforeEach(hook.before);
        if (hook.after) this._route.afterEach(hook.after);
      });
    }
  }

  _beforeEach(to, from, next) {
    Object.keys(this._hooks).forEach(path => {
      const hooks = this._hooks[path];

      if (to.fullPath === path && hooks.before) hooks.before(to, from, next);
    });
  }

  _afterEach(to, from) {
    Object.keys(this._hooks).forEach(path => {
      const hooks = this._hooks[path];

      if (to.fullPath === path && hooks.after) hooks.after(to, from);
    });
  }
}

export default RouteGuard;
