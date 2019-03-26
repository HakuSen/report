import Vue from 'vue';
import { PersistedClear, PersistedAction, PersistedConfig, STORAGE_TYPE, merge } from 'vue-simple';

import ApiConf from '../conf/api.conf';

let storage = STORAGE_TYPE.localStorage;
if (process.env.NODE_ENV !== 'development') storage = STORAGE_TYPE.cookie;

PersistedConfig.batch([
  // { type: `shop/${types.SET_PAGE_CONFIG}`, storage: STORAGE_TYPE.localStorage },
  { type: 'tokenInfo/setLogInfo', storage, expire: 31536000 } // cookie 设置一年有效期
]);

const State = {
  // 登录基础信息
  loginfo: null,

  // 用户详细信息
  userinfo: null
};

// 同步立即更新
const MutAtions = {
  /**
   * 登录成功基础信息
   * @param state
   * @param loginfo
   */
  setLogInfo(state, loginfo) {
    // loginfo
    state.loginfo = loginfo;

    // 设置 Ajax 请求时所需要的 token
    // Vue.$api.token = loginfo.login_resp_to.token;
    Vue.$api.token = loginfo.token;
  },

  /**
   * 用户身份详细信息
   * @param state
   * @param userinfo 新的用户信息
   */
  setUserInfo(state, userinfo) {
    // userinfo
    state.userinfo = merge(state.userinfo || {}, userinfo);
  },
  // 退出登录
  setLogout(state) {
    // loginfo
    state.loginfo = null;
    // userinfo
    state.userinfo = null;
    // token
    Vue.$api.token = null;
    // 缓存销毁
    PersistedClear.remove('tokenInfo/setLogInfo');
    // 清除菜单
    PersistedClear.remove('menu/setMenuList');
  }
};

// 异步请求数据
const Actions = {
  persist: PersistedAction,
  // 备用 => 留用于后期登录结构修改
  getUserInfo({ commit }, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.get({ getway: ApiConf.user.$getway, api: ApiConf.user.getUserByToken, params }).then(({ data }) => {
        if (data.code === '10000') {
          commit('setUserInfo', data.data);
          resolve(data.data);
        }
        else {
          reject({ data, message: data['sub_msg'] || data.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  login({ dispatch }, params) {
    return dispatch('persist', {
      type: 'tokenInfo/setLogInfo',
      getData() {
        return new Promise((resolve, reject) => {
          Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.login }, params).then(({ data }) => {
            if (data.code === '10000') {
              // 检测 token 有效性
              if (data.data && data.data.token) {
                resolve(data.data);
              }
              else {
                reject({ data, message: '登录失败或服务器异常' });
              }
            }
            else {
              reject({ data, message: data['sub_msg'] || data.msg });
            }
          }).catch(reason => {
            reject(reason);
          });
        });
      }
    });
  },
  oldLogin({ dispatch }, params) {
    return dispatch('persist', {
      type: 'tokenInfo/setLogInfo',
      getData() {
        return new Promise((resolve, reject) => {
          Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.oldLogin }, params).then(({ data }) => {
            if (data.code === '10000') {
              // 检测 token 有效性
              if (data.data && data.data.login_resp_to.token) {
                resolve(data.data.login_resp_to);
              }
              else {
                reject({ data, message: '登录失败或服务器异常' });
              }
            }
            else {
              reject({ data, message: data['sub_msg'] || data.msg });
            }
          }).catch(reason => {
            reject(reason);
          });
        });
      }
    });
  },
  // 修改帐号
  changeAcount(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.changeAcount }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 手机号登录验证手机号
  checkPhoneNum(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.checkPhoneNum }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 获取短信验证码
  getPhoneCode(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.getPhoneCode }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 验证短信验证码
  checkCode(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.checkCode }, params).then(response => {
        // commit('setphonecode', response.data.data.flag);
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 手机号登录
  phoneLoginInfo({ dispatch }, params) {
    return dispatch('persist', {
      type: 'tokenInfo/setLogInfo',
      getData() {
        return new Promise((resolve, reject) => {
          Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.phoneLoginInfo }, params).then(({ data }) => {
            if (data.code === '10000') {
              // 检测 token 有效性
              if (data.data && data.data.token) {
                resolve(data.data);
              }
              else {
                reject({ data, message: '登录失败或服务器异常' });
              }
            }
            else {
              reject({ data, message: data['sub_msg'] || data.msg });
            }
          }).catch(reason => {
            reject(reason);
          });
        });
      }
    });
  },
  // 注册帐号验证注册
  acountRegister(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.acountRegister }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          if (res.data.exist) {
            resolve(res.data.exist);
          }
          else {
            reject({ data: res, message: res.msg });
          }
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 注册手机号验证
  phoneRegister(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.phoneRegister }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') { // 如果成功取到数据就存信息
          if (res.data.exist) {
            resolve(res.data.exist);
          }
          else {
            reject({ data: res, message: res.msg });
          }
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 快速注册
  fastRegister(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.fastRegister }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 忘记密码
  findPass(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.findPass }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          // if (res.data.exist) {
          //   resolve(res.data.exist);
          // }
          // else {
          //   reject({ data: res, message: res.msg });
          // }
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 忘记密码，验证手机号和密码
  checkUserAndPhone(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.checkUserAndPhone }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 设置新密码
  editPass(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.editPass }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 认证手机号
  approvePhone(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.approvePhone }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 修改密码
  changePass(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.changePass }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 验证原有手机号是否存在
  checkOriginPhone(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.phoneRegister }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 修改手机号
  changeNum(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.changeNum }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 登出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      // 预留日后需要同步登出到服务端
      const result = true;
      if (result) {
        commit('setLogout');
        resolve();
      }
      else {
        reject();
      }
    });
  },
  // 生成图片验证码
  getImgCode(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.get({ getway: ApiConf.user.$getway, api: ApiConf.user.getImgCode }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 验证图片验证码
  checkImgCode(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: ApiConf.user.$getway, api: ApiConf.user.checkImgCode }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  // 生成二维码
  createQr(context, params) {
    return new Promise((resolve, reject) => {
      Vue.$api.get({ getway: ApiConf.user.$getway, api: ApiConf.user.createQr }, params).then(response => {
        let res = response.data;
        if (res.code === '10000') {
          resolve(res);
        }
        else {
          reject({ data: res, message: res.msg });
        }
      }).catch(reason => {
        reject(reason);
      });
    });
  }
};

const Getters = {
  userinfo: state => state.userinfo,
  first_login(state) {
    return state.loginfo ? state.loginfo.first_login : null;
  },
  token(state) {
    return state.loginfo ? state.loginfo.token : null;
  }
};

export default {
  namespaced: true,
  strict: true,
  state: State,
  getters: Getters,
  mutations: MutAtions,
  actions: Actions
};
