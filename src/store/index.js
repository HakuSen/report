import Vue from 'vue';
import Vuex from 'vuex';
import { PersistedPlugin } from 'vue-simple';
import createPersistedState from 'vuex-persistedstate'; // 存储

import Info from './info';
import Menu from './menu';
import TokenInfo from './tokenInfo';
import ChartsInfo from './chartsInfo';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    info: Info,
    menu: Menu,
    tokenInfo: TokenInfo,
    chartsInfo: ChartsInfo
  },
  plugins: [PersistedPlugin, createPersistedState({
    storage: window.sessionStorage,
    paths: ['info.params', 'info.titleArray', 'info.activeTabs']
  })]
});
