// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';

import { ApiInstaller, PersistedRestore, setUnique, HttpErrorInfo } from 'vue-simple';
import Promise from 'promise-polyfill';
import 'babel-polyfill';

import { Container, Header, Row, Col, Dropdown, DropdownMenu, DropdownItem, Aside, Main, Card, Button } from 'element-ui';

import interceptors from './interceptor';
import HttpErrorInfoMsg from './conf/HttpErrorInfo';

// Store
import store from './store';

// 图标组件
import Icon from '../src/components/icons/Icon';

// 批量注册多个图标，若发布后需要动态更换图标，必须提前注册未首次使用的图标
import './components/icons/icon-register';

import router from './router';

// 动态路由
import { DynamicRouterInstaller } from './router/DynamicRouter';
import AsyncStarter from './plugins/AsyncStarter';
import Guard from './guard';

Vue.use(Vuex);
Vue.config.productionTip = false;
Vue.prototype.$yselect = [];
Vue.prototype.$debug = process.env.NODE_ENV === 'development';

Vue.batch.use(Container, Header, Row, Col, Dropdown, DropdownMenu, DropdownItem, Aside, Main, Card, Button);

// 图标（SVG）组件模块
Vue.component('icon', Icon);

// 兼容 360/IE 等不支持 Promise 浏览器
if (!window.Promise) window.Promise = Promise;

// 异步加载配置，而后启动
AsyncStarter.startup([
  import(/* webpackChunkName: "axios.conf" */ './conf/axios.conf'),
  () => import('./App')
]).then(mods => {
  // API通信模块初始化
  /**
   * @type {{LocalConf,SrvConf}}
   */
  const config = mods[0];

  // 设置应用识别码
  setUnique(config.LocalConf.unique);

  // 初始化完成
  Vue.use(ApiInstaller, { local: config.LocalConf, srv: config.SrvConf, interceptors });

  // 动态路由
  Vue.use(DynamicRouterInstaller);

  // 初始化路由导航
  Vue.use(Guard);

  // 覆盖 HTTP 错误信息
  HttpErrorInfo.merge(HttpErrorInfoMsg);

  // 尝试恢复登录数据
  PersistedRestore.restore(store, 'tokenInfo/setLogInfo');

  // 由登录状态管理器来检测是否需要加载菜单
  // （首次进入无登录数据不加载，刷新页面后内在数据丢失，但存储于本地缓存中，此时会加载菜单数据）
  // LoginStateRunner().then(() => {
  function appCreater() {
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      store,
      render: h => h(mods[1])
    });
  }

  appCreater();

  // if (store.getters['tokenInfo/token']) {
  //   store.dispatch('menu/getMenuList').then(() => {
  //     appCreater();
  //   }).catch(() => {
  //     // 菜单数据请求失败（token 超时或菜单请求失败等）
  //     appCreater();
  //   });
  // }
  // else {
  //   appCreater();
  // }
});
