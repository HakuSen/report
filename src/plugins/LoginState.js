import { MessageBox } from 'element-ui';
import store from '../store';
import router from '../router';

/**
 * 登录状态维护
 * <p>用于管理登录状态数据的缓存，以及恢复，另外可以作为意外情况下刷新浏览器重新做全局性的数据加载（如动态菜单数据）</p>
 */
const LoginState = {
  _state: null, // 缓存的数据
  _isLogin: null, // 用于检测是否登录的逻辑函数

  setState(state) {
    this._state = state;
    localStorage.setItem('userinfo', JSON.stringify(this._state));
  },

  resetState() {
    this._state = null;
    localStorage.removeItem('userinfo');
  },

  setisLogin(func) {
    if (typeof func === 'function') this._isLogin = func;
  },

  restore() {
    let state = localStorage.getItem('userinfo');

    if (state) {
      this._state = JSON.parse(state);
      store.commit('tokenInfo/setUserInfo', this._state);
    }
  },

  /**
   * 启动管理器
   * @returns {Promise<any>}
   */
  running(force) {
    // 若已登录状态下保留有数据，刷新页面则恢复登录数据
    this.restore();

    // 检测是否已经登录
    let logged = false;

    if (force) {
      logged = true;
    }
    else {
      logged = (typeof this._isLogin === 'function') ? this._isLogin(this._state) : false;
    }

    // 已经登录或者未登录的逻辑业务
    return new Promise(resolve => {
      resolve(logged);
    });
  }
};

// 当已经登录需要处理的业务逻辑
const LoginStateRunner = force => {
  LoginState.setisLogin(() => (store.getters['tokenInfo/token']));

  return new Promise((resolve, reject) => {
    LoginState.running(force).then(logged => {
      if (logged) {
        // 请求菜单（重复请求，但从第二次请求开始会被忽略，除非刷新页面）
        store.dispatch('menu/getMenuList').then(() => {
          resolve(logged);
        }).catch(reason => {
          reject(reason);
          MessageBox.confirm('菜单数据请求失败，是否重新登录进行重试。', '提示', { type: 'warning' }).then(() => {
            store.dispatch('tokenInfo/logout').then(() => {
              this.$store.dispatch('info/getTitleArray', { titleArray: -1 });
              router.push({ path: '/login' });
              window.location.reload();
            });
          }).catch(() => {
            router.back();
          });
        });
      }
      else {
        resolve(logged);
      }
    });
  });
};

export { LoginState, LoginStateRunner };
