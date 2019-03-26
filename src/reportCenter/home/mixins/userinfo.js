import { PersistedClear } from 'vue-simple';
import { MessageBox } from 'element-ui';

// Store
import store from '../../../store';
import router from '../../../router';

/**
 * 请求用户详细信息
 */
function fetchUserInfo() {
  // 登录接口只返回 token，再通过 getUserInfo 补全用户信息
  return new Promise((resolve, reject) => {
    store.dispatch('tokenInfo/getUserInfo').then(userData => {
      resolve(userData);
    }).catch(reason => {
      reject(reason);
    });
  });
}

/**
 * 请求用户菜单信息
 */
function fetchMenuList() {
  return new Promise((resolve, reject) => {
    // 清除菜单数据缓存
    PersistedClear.remove('menu/setMenuList');

    // 请求菜单数据
    store.dispatch('menu/getMenuList').then(() => {
      resolve();
    }).catch(error => {
      reject(error);
    });
  });
}

const UserInfoMixin = {
  methods: {
    getUserInfo() {
      // 缓存用户名历史记录
      this.saveAcount();

      // 请求用户信息
      fetchUserInfo().then(() => {
        fetchMenuList().then(() => {
          router.push('/frame/home');
        }).catch(reason => {
          if (reason.code === '40011') {
            if (this.userinfo) {
              PersistedClear.remove('tokenInfo/setLogInfo');// 菜单请求不到，该帐号没有分配菜单，清除登录存的缓存用户信息
              MessageBox.alert('用户菜单数据请求失败，请稍后重试！', '提示', { type: 'warning' });
            }
          }
        });
      }).catch(() => {
        MessageBox.alert('用户信息请求失败，请稍后重试！', '提示', { type: 'warning' });
      });
    }
  }
};

export { fetchUserInfo, fetchMenuList, UserInfoMixin };
