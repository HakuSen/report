// import Vue from 'vue';
import { MessageBox } from 'element-ui';
import store from '../store';
// import router from '../router';
let surpriseFlag = false;
export default {
  before(to, from, next) {
    if (/^\/frame/i.test(to.path)) {
      // 非法进入
      if (!store.getters['tokenInfo/token']) {
        if (!surpriseFlag) {
          surpriseFlag = true;
          MessageBox.alert('未登录或登录超时，请登录！', '提示', { type: 'warning' }).then(() => {
            store.dispatch('info/getTitleArray', { titleArray: -1 });
            surpriseFlag = false;
            next({ path: '/login' });
          }).catch(() => {
            surpriseFlag = false;
          });
        }
      }
    }

    next();

    // 决定是否继续跳转到原定路由
    // next();

    // 回退到 from 路由地址
    // next(false);

    // 中转到指定新的地址
    // next({ path: '/' });
  }
};

