/**
 * 路由管理器
 * <p>主要解决以下问题：
 * <ul>
 * <li>1、跳转路由时缓存相关路由信息到 localstorage 中</li>
 * <li>2、当刷新页面时，能从指定的路由开始加载数据，并自动恢复跳转到之前的路由页面</li>
 * </ul>
 * </p>
 */
const RouteManager = {

  /**
   * 安装方法
   * @param Vue Vue全局对象
   * @param home 目标路由如 {name:'', path:''}，name 和 path 必须具备其一
   * @param other 其它扩展参数（备用）
   */
  install(Vue, { home, ...other }) {
    Vue.$rm = this;
  }
};

export default RouteManager;
