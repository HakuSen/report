import Vue from 'vue';
import PathConf from '../conf/api.conf';
// import axios from 'axios'; // mock数据用
const baseparms = {
  incomeTotal: {
    tableIncomeTotalParams: {},
    tableIncomeTotalNewParams: {}
  },
  settlementTotal: {
    tableSettlementParams: {},
    tableSettlementNewParams: {}
  },
  accountTotal: {
    tableAccountTotalParams: {},
    tableAccountTotalNewParams: {}
  },
  shopIncome: {
    tableStoreIncomeParams: {},
    tableStoreIncomeNewParams: {}
  },
  shopTimeIncome: {
    shopTimeDataParams: {},
    shopTimeDataNewParams: {}
  },
  revenueIncome: {
    tableRevenueDataParams: {},
    tableRevenueDataNewParams: {}
  },
  revenueShopIncome: {
    tableRevenueShopParams: {},
    tableRevenueShopNewParams: {}
  },
  shopTimeRevenue: {
    tableRevenueTimeParams: {},
    tableRevenueTimeNewParams: {}
  },
  businessPool: {
    tableBusinessPoolParams: {},
    tableBusinessPoolNewParams: {}
  },
  shopReceipts: {
    shopReceiptsParams: {},
    shopReceiptsNewParams: {}
  },
  storeTurnover: {
    storeTurnoverParams: {},
    storeTurnoverNewParams: {}
  },
  storeBusiness: {
    tableStoreBusinessParams: {},
    tableStoreBusinessNewParams: {}
  },
  storeTimeBusiness: {
    tableStoreBusinessTimeParams: {},
    tableStoreBusinessTimeNewParams: {}
  },
  retailCabinet: {
    retailCabinetParams: {},
    retailCabinetNewParams: {}
  },
  management: {
    managementParams: {},
    managementNewParams: {}
  },
  electronic: {
    electronicParams: {},
    electronicNewParams: {}
  },
  refundVegetables: {
    refundVegetablesParams: {},
    refundVegetablesNewParams: {}
  },
  preferentCount: {
    tablePreferentCountParams: {},
    tablePreferentCountNewParams: {}
  },
  storePreferent: {
    tableStorePreferentParams: {},
    tableStorePreferentNewParams: {}
  },
  storeTimePreferent: {
    tableStoreTimePreferentParams: {},
    tableStoreTimePreferentNewParams: {}
  },
  refundCount: {
    tableRefundCountParams: {},
    tableRefundCountNewParams: {}
  },
  kdsStatistics: {
    tableKdsStatisticsParams: {},
    tableKdsStatisticsNewParams: {}
  },
  membershipSynthesis: { // 会员综合统计
    tableMembershipSynthesisParams: {},
    tableMembershipSynthesisNewParams: {}
  },
  storeRefundCount: {
    tableStoreRefundCountParams: {},
    tableStoreRefundCountNewParams: {}
  },
  storeTimeRefund: {
    tableStoreTimeRefundParams: {},
    tableStoreTimeRefundNewParams: {}
  },
  goodsAnalyzeData: {
    tableGoodsDataAnalyzeParams: {},
    tableGoodsDataAnalyzeNewParams: {}
  },
  goodsAnalyzeWeek: {
    tableGoodsWeekAnalyzeParams: {},
    tableGoodsWeekAnalyzeNewParams: {}
  },
  goodsAnalyzeMonth: {
    tableGoodsMonthAnalyzeParams: {},
    tableGoodsMonthAnalyzeNewParams: {}
  },
  goodsStoreAnalyze: {
    tableGoodsStoreAnalyzeParams: {},
    tableGoodsStoreAnalyzeNewParams: {}
  },
  goodsSalesAnalysis: {
    tableSalesAnalysisParams: {},
    tableSalesAnalysisNewParams: {}
  },
  goodsShopAnalysis: {
    tableGoodsShopAnalysisParams: {},
    tableGoodsShopAnalysiNewParams: {}
  },
  goddsColligateAnalysis: {
    tableGoodsColligateParams: {},
    tableGoodsColligateNewParams: {}
  },
  goodsRankings: {
    goodsRankingsNewParams: {},
    goodsRankingsParams: {}
  },
  classificationRankings: {
    classifySaleRankingNewParams: {},
    classifySaleRankingParams: {}
  },
  includeLedger: {
    includeLedgerNewParams: {},
    includeLedgerParams: {}
  },
  takeoutStatistics: {
    takeoutStatisticsNewParams: {},
    takeoutStatisticsParams: {}
  },
  goodsSaleSize: {
    goodsSaleSizeNewParams: {},
    goodsSaleSizeParams: {}
  },
  timeIndexAnalysis: {
    timeIndexAnalysisNewParams: {},
    timeIndexAnalysisParams: {}
  },
  timeComparatAnalysis: {
    timeComparatAnalysisNewParams: {},
    timeComparatAnalysisParams: {}
  },
  shopGoodsTotle: {
    // 门店商品销售统计
    shopGoodsTotleNewParams: {},
    shopGoodsTotleParams: {}
  },
  ShopBusinessReport: {
    shopBusinessReportNewParams: {},
    shopBusinessReportParams: {}
  },
  MembershipReport: {
    MembershipReportNewParams: {},
    MembershipReportParams: {}
  },
  SolidVoucherReport: {
    solidVoucherNewParams: {},
    solidVoucherParams: {}
  },
  BusinessDailyReport: {
    BusinessDailyParams: {},
    BusinessDailyNewParams: {}
  },
  PreferentialDetails: { // 优惠明细日报
    tablePreferentialDetailsParams: {},
    tablePreferentialDetailsNewParams: {}
  },
  StoreTarget: { // 门店指标统计
    tableStoreTargetParams: {},
    tableStoreTargetNewParams: {}
  },
  shopTargetAnalysis: { // 门店指标分析
    tableShopTargetAnalysisParams: {},
    tableShopTargetAnalysisNewParams: {}
  },
  orderClerkCount: { // 点菜员销售统计
    tableOrderClerkCountParams: {},
    tableOrderClerkCountNewParams: {}
  },
  shopStore: {
    shopStoreParams: {},
    shopStoreNewParams: {}
  },

  repairData: {
    findCustomJobList: [], // 数据修复 刷新返回值
    findCustomJobParams: {}
  },
  tableDownload: {
    downloadList: {}
  }
};
const State = {
  params: baseparms,
  /**
   * @type {}
   */
  tableIncomeTotalData: {
    table_data: Array,
    table_config: Array,
    total_row: Number,
    total_cols: Number
  }, // 款项统计(按时间)
  incomeLoading: false,
  tableSettlementTotalData: {}, // 门店结算
  settlementLoading: false,
  tableAccountData: {}, // 挂账统计
  accountLoading: false,
  tableStoreIncome: {}, // 款项统计(按门店)
  shopIncomeLoading: false,

  shopTimeData: {}, // 款项统计报表
  shopTimeIncomeLoading: false,

  shopGoodsTotleData: {}, // 门店商品销售统计
  shopGoodsTotleLoading: false,

  tableRevenueData: {}, // 消费统计(按时间)
  revenueTotalLoading: false,

  tableRevenueShop: {}, // 消费统计(按门店)
  shopRevenueLoading: false,

  tableRevenueTime: {}, // 消费统计报表
  shopTimeRevenueLoading: false,

  tableBusinessPool: {}, // 营业汇总(按时间)
  businPoolLoading: false,

  shopReceipts: {}, // 实收日报
  shopReceiptsLoading: false,

  storeTurnover: {}, // 门店营业额日报
  storeTurnoverLoading: false,

  tableStoreBusiness: {}, // 营业汇总(按门店)
  storeBusinessLoading: false,

  tableStoreBusinessTime: {}, // 营业汇总报表
  storeBusinessTimeLoading: false,

  retailCabinet: {}, // 智能柜零售统计
  retailCabinetLoading: false,

  managementData: {}, // 智能柜零售统计
  managementLoading: false,

  electronic: {}, // 电子交易对账
  electronicLoading: false,

  refundVegetables: {}, // 退菜统计
  refundVegetablesLoading: false,

  tablePreferentCount: {}, // 优惠统计(按时间)
  preferentCountLoading: false,

  tableStorePreferent: {}, // 优惠统计(按门店)
  storePreferentLoading: false,

  tableStoreTimePreferent: {}, // 优惠统计报表
  storeTimePreferentLoading: false,

  tableRefundCount: {}, // 退款统计(按时间)
  refundCountLoading: false,

  tableKdsStatistics: {}, // KDS统计
  kdsStatisticsLoading: false,

  tableStoreRefundCount: {}, // 退款统计(按门店)
  storeRefundCountLoading: false,

  tableStoreTimeRefund: {}, // 退款统计报表
  storeTimeRefundLoading: false,

  tableSalesDataAnalysis: {}, // 商品属性日销售分析
  goodsDataLoading: false,

  tableSalesWeekAnalysis: {}, // 商品属性周销售分析
  goodsWeekLoading: false,

  tableSalesMonthAnalysis: {}, // 商品属性月销售分析
  goodsMonthLoading: false,

  tableGoodsStoreAnalyze: {}, // 商品属性门店分析
  goodsStoreAnalyzeLoading: false,

  tableSalesAnalysis: {}, // 商品销售对比分析
  GoodsSalesAnalysisLoading: false,

  tableGoodsShopAnalysis: {}, // 门店商品销售对比分析
  GoodsShopAnalysisLoading: false,

  tableColligateAnalysis: {}, // 商品综合分析
  ColligateAnalysisLoading: false,

  tableGoodsRankings: {}, // 商品销售排行
  goodsRankingsLoading: false,

  tableClassifySaleRanking: {}, // 分类销售排行
  classifySaleRankingLoading: false,

  tableIncludeLedger: {}, // 收入总账
  includeLedgerLoading: false,

  tableTakeoutStatistics: {}, // 外卖统计
  takeoutStatisticsLoading: false,

  tableGoodsSaleSize: {}, // 商品规格分析
  goodsSaleSizeLoading: false,

  tableTimeIndexAnalysis: {}, // 时段指标分析
  timeIndexAnalysisLoading: false,

  tableTimeComparatAnalysis: {}, // 时段对比分析
  timeComparatAnalysisLoading: false,

  tableShopBusinessReport: {}, // 门店营业日报表
  ShopBusinessReportLoading: false,

  tableBusinessDailyReport: {}, // 综合日报
  BusinessDailyReportLoading: false,

  tableShopStore: {}, // 门店分数对账表
  shopStoreLoading: false,

  tableMembershipSynthesis: {}, // 会员综合统计
  MembershipSynthesisLoading: false,

  tablePreferentialDetails: {}, // 优惠明细日报
  PreferentialDetailsLoading: false,

  tableStoreTarget: {}, // 门店指标统计
  StoreTargetLoading: false,

  tableShopTargetAnalysis: {}, // 门店指标分析
  shopTargetAnalysisLoading: false,

  tableOrderClerkCount: {}, // 点菜员销售统计
  orderClerkCountLoading: false,

  tableMembershipReport: {}, // 会员卡统计服务
  solidVoucher: {},
  MembershipReportLoading: false,
  solidVoucherLoading: false,

  startTime: '',
  endTime: '',
  needTime: {},
  modelData: '',
  queryParamsValue: Object, // 转换请求时间的变量
  /**
   * @type {{payType:String, typedate:Array}}
   */
  formData: {},
  queryLoading: false, // 控制查询按钮的loading,防止并发请求
  titleArray: [{
    menu: {
      name: '首页',
      fullpath: '/home'
    }
  }], // 导航栏路由数组
  OrderTypeName: '', // 展示选择的订单类型
  ifNewTitleArray: false, // 判断是新添加路由还是tab切换
  activeTabs: '0' // 导航头上的active对应标签
};
// 同步立即更新
const MutAtions = {
  setDownloadList(state, res) {
    if (res.data.data) {
      state.params['tableDownload']['downloadList'] = res.data.data;
    }
    else {
      state.params['tableDownload']['downloadList'] = {};
    }
  },
  searchData(state, data) {
    state.modelData = data;
  },
  setGoodsAllParams(state, data) {
    state.goodsAllParams = data;
  },
  initstore(state) {
    state.params = baseparms;
  },
  setPageParams(state, data) {
    state.params = data;
  },
  setActiveTabs(state, data) {
    state.activeTabs = data + '';
  },
  setIfNewTitleArray(state, data) {
    state.ifNewTitleArray = data;
  },
  setRpairData(state, resolve) {
    state.params['repairData']['findCustomJobList'] = resolve.data.data;
  },
  setOrderTypeName(state, data) {
    state.OrderTypeName = data.data;
  },
  // 存储方法
  setTableData(state, { response, dataName }) {
    if (response) {
      state[dataName] = response;
    }
    else if (response === null) {
      state[dataName] = null;
    }
  },
  getTimes(state, data) {
    state.needTime = data;
  },
  setParams(state, { newParams, oneTableName, newParamsName }) {
    state.params[newParamsName][oneTableName] = newParams;
  },
  setQueryParams(state, { params, tableName, everyQueryParamsName }) {
    state.params[everyQueryParamsName][tableName] = params;
  },
  getFormData(state, data) {
    state.formData = data;
  },
  setQueryLoading(state, { loadingFlag, loading }) {
    state[loadingFlag] = loading;
  },
  getQueryParamsValue(state, data) {
    state.queryParamsValue = data;
  },
  setTitleArray(state, { titleArray }) {
    if (titleArray.constructor === Array) {
      state.titleArray = titleArray;
    }
    else if (titleArray.constructor === Object) {
      state.titleArray.push(titleArray);
    }
    else if (titleArray >= 0) {
      state.titleArray.splice(titleArray, 1);
    }
    else {
      state.titleArray.splice(1);
    }
  }
};

// 异步请求数据
const Actions = {
  formData({ commit }, params) {
    return new Promise(resolve => {
      commit('getFormData', params);
      // 提供在组件中的返回处理时机
      resolve();
    });
  },
  // 所有接口请求方法 urlParams = { interfaceAddress: '路由名字', dataName: 'store 数据名' }
  getRequestDataList({ commit }, { params, urlParams, loadingFlag, loading }) {
    return new Promise((resolve, reject) => {
      Vue.$api.post({ getway: PathConf.report.$getway, api: PathConf.report[urlParams.interfaceAddress] }, params).then(response => {
        // mock数据用
        // axios({ method: 'get', url: 'http://localhost:9090/report/api/classifySaleRanking', responseType: 'stream' }).then(response => {
        commit('setTableData', { response, dataName: urlParams.dataName });
        commit('setQueryLoading', { loadingFlag, loading });
        // 提供在组件中的返回处理时机
        resolve();
      }).catch(reason => {
        reject(reason);
        commit('setQueryLoading', { loadingFlag, loading });
        console.error(reason);
      });
    });
  },
  getParams({ commit }, { newParams, oneTableName, newParamsName }) {
    return new Promise(resolve => {
      commit('setParams', { newParams, oneTableName, newParamsName });
      resolve();
    });
  },
  getQueryParams({ commit }, { params, tableName, everyQueryParamsName }) {
    return new Promise(resolve => {
      commit('setQueryParams', { params, tableName, everyQueryParamsName });
      resolve();
    });
  },
  /**
   *获取后端需要时间参数
   */
  getTimes({ commit }, params) {
    return new Promise(resolve => {
      commit('getTimes', params);
      resolve();
    });
  },
  /**
   *控制查询按钮的状态
   */
  setQueryLoading({ commit }, { loadingFlag, loading }) {
    return new Promise(resolve => {
      commit('setQueryLoading', { loadingFlag, loading });
      resolve();
    });
  },
  /**
   *获取查询条件参数
   */
  getQueryParamsValue({ commit }, params) {
    return new Promise(resolve => {
      commit('getQueryParamsValue', params);
      resolve();
    });
  },
  getTitleArray({ commit }, { titleArray }) {
    return new Promise(resolve => {
      commit('setTitleArray', { titleArray });
      resolve();
    });
  },
  getIfNewTitleArray({ commit }, params) {
    return new Promise(resolve => {
      commit('setIfNewTitleArray', params);
      resolve();
    });
  },
  // 修复数据 刷新
  getFindCustomJob({ commit }, params) {
    Vue.$api.post({ getway: PathConf.task.$getway, api: PathConf.task['findCustomJob'] }, params).then(res => {
      commit('setRpairData', res);
    });
  },
  // 获取导出数据列表
  getDownloadList({ commit }, params) {
    Vue.$api.post({ getway: PathConf.config.$getway, api: PathConf.config['downloadList'] }, params).then(res => {
      commit('setDownloadList', res);
    });
  }
};

const Getters = {
  getAuth: state => key => {
    if (!state[key]) console.error(`The permission[${key}] configuration does not exist.`);
    return state[key];
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

