// --------------------------------------------------------------------------
//
// 对指定路由如登录等进行拦截导向到统一的欢迎页面
//
// --------------------------------------------------------------------------

// 需要跳转的目标路由
const TargetRoute = {
  path: '/welcome'
};

// 需要进行拦截和跳转的路由
const HoldRoutes = [
  { path: '/login' }
];

export default {
  before(to, from, next) {

    const has = HoldRoutes.some(item => {
      if (typeof item === 'string') {
        return item === to.path;
      }
      else if (item.path) {
        return item.path === to.path;
      }

      return false;
    });

    // 若包含满足条件的路由，则需要进行拦截
    // from.path === '/' 一般表现于页面直接刷新的情况
    if (has && from.path === '/') {

      // 此处将原目标路由缓存到 meta 中以方便在目标路由中进行运用
      // TargetRoute.meta = TargetRoute.meta || {};
      // TargetRoute.meta.to = to;

      next(TargetRoute);
    }
    else {
      next();
    }

  }
  // after(to, from) {
  //   console.warn('after:', to, from);
  // }
};
