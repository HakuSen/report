import { isAbsoluteURL, isFunction } from 'vue-simple';

/**
 * 动态路由管理器
 */
class DynamicRouter {
  _urlMap = null;
  // 默认父级路由
  base = null;
  // 默认路由
  default = '/default';
  // url 格式化方法
  urlTransform = null;

  constructor(urlmap = null) {
    this.setUrlMap(urlmap);
  }

  // 生成单条 URL 数据结构
  static createRouterUrl() {
    return {
      path: null, // 路由 path
      name: null, // 路由 name
      component: null, // 路由对应本地组件
      meta: null // 元数据（缓存后台传回菜单数据，除去 children）
    };
  }

  /**
   * 解析需要制作成路由的菜单
   * @param {Array} menuList 后端菜单数据源
   * @param {Object} parent 上一级的菜单数据，顶层父级为null
   * @returns {Array}
   */
  static fullpath(menuList, parent = null) {
    const length = menuList.length;

    for (let i = 0; i < length; i++) {
      const menu = menuList[i];

      // 当前菜单向下传递
      menu.fullpath = (parent.fullpath || '') + menu.url;

      // 如果存在子级菜单则递归处理
      if (menu.children) {
        DynamicRouter.fullpath(menu.children, menu);
      }
    }
  }

  /**
   * 解析需要制作成路由的菜单
   * @param {Array<{is_enter,id,url,children}>} menuList 后端菜单数据源
   * @param {Object} [parent] 父级菜单数据，其 fullpath 包含从根级到其自身的完整路径
   * @returns {Array}
   */
  parse(menuList, parent = null) {
    if (!this._urlMap) throw new Error('the urlMap is not define.');

    let map = [];
    const length = menuList.length;

    for (let i = 0; i < length; i++) {
      const menu = menuList[i];

      // 不管该层级是否能打开页面，都正常拼接 URL 向下传递
      // menu.parent = parent;
      menu.fullpath = (parent && parent.fullpath || '') + menu.url;

      // is_enter 为 true 代表该层级需要路由支持，打开对应页面组件
      if (menu.is_enter) {
        if (isAbsoluteURL(menu.url)) {
          menu.url = this.parseUrl(menu);
        }
        else {
          const data = DynamicRouter.createRouterUrl();
          const { children, ...metaData } = menu;

          data.path = menu.fullpath;
          data.name = 'Menu' + menu.gu_code;
          data.meta = metaData;
          data.component = this._urlMap[menu.fullpath] || this._urlMap[this.default];
          map.push(data);
        }
      }
      // 如果存在子级菜单则递归处理
      if (menu.children) {
        map = [...map, ...this.parse(menu.children, menu)];
      }
    }
    return map;
  }

  parseUrl(menu) {
    let u = menu.url;

    // isAbsoluteURL()
    if (isAbsoluteURL(u) && isFunction(this.urlTransform)) {
      u = this.urlTransform(menu);
    }

    return u;
  }

  /**
   * 设置该动态路由所使用的 UrlMap 映射表
   * @param {Object} urlmap url到组件的映射表，如 { '/user/login': Login }
   */
  setUrlMap(urlmap) {
    this._urlMap = urlmap;
  }

  /**
   * 将解析后的URL映射表动态安装到指定的路由器
   * @param {VueRouter} router 路由器实例
   * @param {Array} parseMap 经由DynamicRouter解析后的 URL 映射表
   */
  install(router, parseMap) {
    if (this.base) {
      // 作为子级路由时去除前置 斜杠/
      parseMap.forEach(item => {
        item.path = item.path.replace(/^\/+/ig, '');
        // item.path = item.path.replace(/\//ig, '-');
      });

      // 作为子级路由插入
      this.base.children = [...parseMap];
      router.matcher.addRoutes([this.base]);
    }
    else {
      router.addRoutes(parseMap);
    }
  }
}

const DynamicRouterInstaller = vue => {
  vue.$dynamicRouter = new DynamicRouter();
};

export { DynamicRouter, DynamicRouterInstaller };
