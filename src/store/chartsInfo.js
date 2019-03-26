import Vue from 'vue';
import PathConf from '../conf/api.conf';
import makeChartsData from '../utils/makeChartsData';

const State = {
  chartsObject: {
    barVolumeData: {},
    barSaleroomData: {},
    mapData: {},
    lineData: {},
    pieData: {},
    topTenData: {}
  }
};
// 同步立即更新
const MutAtions = {
  setChartsData(state, { response, dataName }) {
    state.chartsObject[dataName] = response.data.data;
  }
};

// 异步请求数据
const Actions = {
  // charts所有接口请求方法
  getChartsData({ commit }, { params, dataName }) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: PathConf.report.$getway, api: PathConf.report['chartStatisticsList'] }, params).then(response => {
        commit('setChartsData', { response, dataName });
        // 提供在组件中的返回处理时机
        resolve();
      }).catch(reason => {
        const response = makeChartsData(dataName);
        if (response) {
          commit('setChartsData', { response, dataName });
        }
        reject(reason);
      });
    });
  }
};

const Getters = {};

export default {
  namespaced: true,
  strict: true,
  state: State,
  getters: Getters,
  mutations: MutAtions,
  actions: Actions
};

