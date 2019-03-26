<!------------------------
  分类销售排行页
 ------------------------ -->
<template>
  <div class="income" @click="closePayList">
    <el-card class="box-card">
      <!--头部-->
      <div class="query-container">
        <form @submit.prevent="submitHandler('buy_count_sort', 'desc', '20')" @reset.prevent="resetHandler" onkeydown="if(event.keyCode === 13){return false;}">
          <!--组件循环遍历组件测试-->
          <yh-layout-item v-for="(item,index) in totalData"
                          :key="index"
                          :stand="syncConfig.width"
                          :size="item.size"
                          :alignment="item.alignment">
            <component :is="child.name"
                       v-for="(child,childIdx) in item.children"
                       :key="childIdx"
                       @focus="closePayList"
                       @parentFn="closePayList"
                       v-bind="transmit(child)"
                       :queryParams="everyTableParams"
                       v-model="formData[child.fieldName]"
                       :ref="'payList'">
            </component>
          </yh-layout-item>
        </form>
        <el-input type="textarea" :value="formDataStr" style="font-family:'Courier New',sans-serif" v-if="$debug"></el-input>
      </div>
    </el-card>
    <div class="table-warp" style="background: #fff;">
      <warn-text v-if="tableData && tableData.data && tableData.data.data && tableData.data.data.table_data && orderTypeIsAll" :message="message"/>
      <Table :tableAllData="tableData" :queryParams="tableParams" :tableShowParams="needParams" :tableQueryParams="everyTableParams" @tableShow="tableShow" :loadingFlag="classifySaleRankingLoadingFlag" :loadingName="'classifySaleRankingLoading'" :tableFlag="tableFlag" :newPageing="newPageingParams" :formData="formData" @getSortChange="getSortChange"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Vue from 'vue';
import YhLayoutItem from '../../../components/base/yinhe/YhLayoutItem';
import YhSelect from '../../../components/base/yinhe/YhSelect';
import YhButton from '../../../components/base/yinhe/functional-unit/YhButton';
import YhPay from '../../../components/base/yinhe/YhPay';
import YhShopChoice from '../../../components/base/yinhe/YhShopChoice';
import YhOrgShop from '../../../components/base/yinhe/YhOrgShop';
import YhDatePicker from '../../../components/base/yinhe/YhDatePicker';
import YhRadioButton from '../../../components/base/yinhe/YhRadioButton';
import YhRankNum from '../../../components/base/yinhe/YhRankNum';
import YhSort from '../../../components/base/yinhe/YhSort';
import Table from '../../../components/base/table/Table';
import WarnText from '../../../components/base/WarnText';
import setQueryParams from '../../../utils/setQueryParams';
import notShowShop from '../../../utils/notShowShop';
import dropdownBoxBack from '../../../utils/dropdownBoxBack';
import alertQueryConditionWrong from '../../../utils/alertQueryConditionWrong';
import sendOnceQuery from '../../../utils/sendOnceQuery';
import { ComponentSize, LayoutWidthBase } from '../../../components/base/yinhe/setting';
import SimpleVue from '../../../plugins/SimpleVue';
import mixinsReport from '../../mixins/mixinsReport';

Vue.use(SimpleVue);
/**
 * 当某些特殊组件需要固定格式的默认值时使用
 */
const CompDefaultValue = {
  'yh-chooser': []
};

export default {
  name: 'ClassifyRanking',
  mixins: [mixinsReport],
  components: {
    YhSelect,
    YhButton,
    YhLayoutItem,
    YhPay,
    YhShopChoice,
    YhOrgShop,
    Table,
    YhDatePicker,
    YhRadioButton,
    YhRankNum,
    YhSort,
    WarnText
  },
  data() {
    return {
      formData: {},
      needParams: {
        contactArray: [],
        contactDot: 0,
        arrayKey: '',
        contactArray1: [],
        contactDot1: 0,
        arrayKey1: '',
        contactArray2: [],
        contactArray3: [],
        contactArray4: [],
        contentText: '分类销售排行（总排行）',
        contentShopShow: false, // 是否显示店铺-日周月报表
        contentShow: false, // 是否显示日周月报表
        shopShowFlag: true,
        mergeTextArray: ['categoryName', ''],
        slotFlag: false, // 是否显示hover
        showRankNum: true // 是否显示排行数量
      },
      pageNum: 0, // 用来判断是直接请求还是分页请求
      tableFlag: false,
      newPageingParams: {},
      totalData: [],
      isContainProp: null,
      isTotalProportion: null,
      orderTypeIsAll: true,
      message: '请务必保证外卖平台与堂食的“商品名称”，“规格”，“属性”完全一致，否则外卖商品无法与堂食商品合并统计！',
      urlParams: {
        interfaceAddress: 'classifySaleRankingList',
        dataName: 'tableClassifySaleRanking'
      }, // 接口请求 方法映射
      isOrgShop: false,
      rankNum: '20'
    };
  },
  computed: {
    formDataStr() {
      return JSON.stringify(this.formData);
    },
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    }),
    ...mapState({
      tableData: State => State.info.tableClassifySaleRanking,
      tableParams: State => State.info.params.classificationRankings.classifySaleRankingNewParams,
      needTimes: State => State.info.needTime,
      titleArray: State => State.info.titleArray,
      ifNewTitleArray: State => State.info.ifNewTitleArray,
      everyTableParams: State => State.info.params.classificationRankings.classifySaleRankingParams,
      classifySaleRankingLoadingFlag: State => State.info.classifySaleRankingLoading
    }),
    syncConfig() {
      return {
        key: 'two',
        width: LayoutWidthBase,
        config: [
          {
            name: 'yh-layout-item',
            size: 1.1,
            children: [
              {
                name: 'yh-radio-button',
                label: '报表类型：',
                fieldName: 'tableType',
                isReportType: true,
                value: '1',
                options: [
                  { label: '总排行', value: '1' },
                  { label: '明细排行', value: '2' },
                  { label: '组织排行', value: '3' }
                ],
                attrs: {
                  size: ComponentSize
                }
              }
            ]
          },
          {
            name: 'yh-layout-item',
            size: 2,
            children: [
              {
                name: 'yh-date-picker',
                label: '报表日期：',
                fieldName: 'datetime',
                value: [],
                options: [],
                attrs: {
                  'start-placeholder': '开始日期',
                  'end-placeholder': '结束日期',
                  type: 'date',
                  size: ComponentSize
                }
              }
            ]
          },
          {
            name: 'yh-layout-item',
            size: 0.85,
            children: [
              {
                name: 'yh-shop-choice',
                label: '店铺选择：',
                fieldName: 'shop',
                value: [],
                needShopName: true,
                url: '/shopinfo/findStructureStores',
                attrs: {
                  size: ComponentSize
                }
              }
            ]
          },
          {
            name: 'yh-layout-item',
            size: 0.8,
            children: [
              {
                name: 'yh-pay',
                label: '订单来源：',
                fieldName: 'source',
                value: [],
                options: [
                  { name: '云POS系统', id: '1' },
                  { name: '会员APP', id: '2' },
                  { name: '简易付', id: '3' },
                  { name: '支付宝口碑', id: '4' },
                  { name: '扫码下单', id: '5' },
                  { name: '自助售货机', id: '6' },
                  { name: '扫码付', id: '7' },
                  { name: '第三方交易', id: '8' },
                  { name: '秒付订单', id: '9' },
                  { name: '餐饮ERP', id: '10' },
                  { name: '淘点点外卖', id: '11' },
                  { name: '口碑商品', id: '12' },
                  { name: '采购订单', id: '14' },
                  { name: '商家APP', id: '17' },
                  { name: '美团外卖', id: '21' },
                  { name: '饿了么外卖', id: '31' },
                  { name: '便利宝POS', id: '41' },
                  { name: '网页收银', id: '51' },
                  { name: '平板简易付', id: '61' },
                  { name: '智能pos', id: '71' },
                  { name: '智能pos正餐', id: '72' },
                  { name: '自助点餐屏', id: '73' },
                  { name: '银盒子外卖', id: '81' },
                  { name: '白盒子', id: '91' },
                  { name: '口碑预点单', id: '101' },
                  { name: '智能零售柜订单', id: '102' },
                  { name: '会员用户端', id: '110' },
                  { name: '机器序列号', id: '3306' },
                  { name: '其他', id: '9999' }
                ],
                url: '',
                attrs: {
                  size: ComponentSize
                }
              }
            ]
          },
          {
            name: 'yh-layout-item',
            size: 0.85,
            children: [
              {
                name: 'yh-select',
                label: '订单类型：',
                fieldName: 'indent',
                value: '',
                options: [
                  { label: '全部', value: '2' },
                  { label: '堂食', value: '0' },
                  { label: '外卖', value: '1' }
                ],
                attrs: {
                  size: ComponentSize
                }
              }
            ]
          },
          {
            name: 'yh-layout-item',
            size: 0.8,
            children: [
              {
                name: 'yh-pay',
                label: '商品分类：',
                isGoods: true,
                fieldName: 'goodsType',
                value: [],
                options: [],
                url: '/category/findCategoryByNameLike',
                attrs: {
                  size: ComponentSize
                }
              }
            ]
          },
          {
            name: 'yh-layout-item',
            size: 0.3,
            children: [
              {
                name: 'yh-button',
                label: '查询',
                action: 'submit',
                attrs: {
                  type: 'primary',
                  size: ComponentSize,
                  loading: this.classifySaleRankingLoadingFlag
                }
              }
            ]
          },
          {
            name: 'yh-layout-item',
            size: 0.3,
            children: [
              {
                name: 'yh-button',
                label: '重置',
                action: 'reset',
                attrs: {
                  type: 'primary',
                  size: ComponentSize
                }
              }
            ]
          }
        ]
      };
    }
  },
  methods: {
    getSortChange(column) {
      let detailInfo = JSON.parse(sessionStorage.getItem('vuex')).info.params.classificationRankings.classifySaleRankingParams;
      this.getDetailDudge(column, detailInfo);
    },
    tableShow(val) {
      this.tableFlag = val;
    },
    // 返回循环组件中为店铺选择的index
    getShopIndex() {
      notShowShop(this.totalData, this.userinfo);
    },
    // 解决支付方式原生下拉框无法回弹bug(点击空白处收起下拉框)
    closePayList() {
      dropdownBoxBack(this.totalData, this.$refs, ['yh-pay', 'yh-property']);
    },
    /**
     * 过滤不需要向组件内部传递的Props属性
     * @param conf
     * @returns {*}
     * @constructor
     */
    transmit: conf => {
      const { name, fieldName, value, ...other } = conf;
      return other;
    },

    /**
     * 提交数据
     */
    submitHandler(buy, rank, rankNum) {
      this.tableFlag = false;
      this.$store.commit('info/setQueryLoading', { loadingFlag: 'classifySaleRankingLoading', loading: true });
      // params 公用部分提出
      let nowData = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      let nowMonth = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
      let nowHours = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
      let nowMinutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
      let nowSeconds = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
      let myDate = new Date().getFullYear() + '-' + nowMonth + '-' + nowData;
      let todayTime = nowHours + ':' + nowMinutes + ':' + nowSeconds;
      let params = setQueryParams(this.formData, this.$store);
      if (this.formData['datetime'][0]) {
        params['start_date'] = this.formData['datetime'][0] + ' 00:00:00';
      }
      if (this.formData['datetime'][1] === myDate) {
        params['end_date'] = this.formData['datetime'][1] + ' ' + todayTime;
      }
      else {
        params['end_date'] = this.formData['datetime'][1] + ' 23:59:59';
      }
      this.orderTypeIsAll = !params['order_type'];
      params['type'] = Number(this.formData['tableType']);
      if (this.formData.source[0] === '全部') {
        params['outer_support_ids'] = [];
      }
      else {
        params['outer_support_ids'] = this.formData.source;
      }
      if (params['type'] === 1) {
        this.needParams.mergeTextArray = ['', ''];
        this.needParams.contentText = '分类销售排行（总排行）';
      }
      else if (params['type'] === 2) {
        this.needParams.contentText = '分类销售排行（明细排行）';
        this.needParams.mergeTextArray = ['categoryName', ''];
      }
      else {
        this.needParams.contentText = '分类销售排行（组织排行）';
        this.needParams.mergeTextArray = ['categoryName', ''];
      }
      // params[this.formData['rank'][0]] = this.formData['rank'][1];
      params[buy] = rank;
      if (this.formData['shop'] && this.formData['shop'][0] && Array.isArray(this.formData['shop'][0])) {
        params.shopper_id_list = this.formData.shop[0];
      }
      if (this.formData['goodsType'][0] !== '全部') {
        params['category_id'] = String(this.formData['goodsType'].join(',')) === '' ? null : String(this.formData['goodsType'].join(','));
      }
      // if (this.formData['rankNum'] !== '') {
      //   params['top_num'] = Number(this.formData['rankNum']);
      // }
      // else {
      //   params['top_num'] = null;
      // }
      params['top_num'] = Number(rankNum) === 0 ? null : Number(rankNum);
      /**
       * 导出需要使用的地址和分页请求的info.js的地址
       */
      let newParams = {
        url: 'classifySaleRankingList',
        tableData: 'tableClassifySaleRanking',
        pageingFlag: ++this.pageNum
      };
      this.newPageingParams = newParams;
      this.$store.dispatch('info/getParams', { newParams, oneTableName: 'classifySaleRankingNewParams', newParamsName: 'classificationRankings' });
      if (this.formData) {
        this.$store.dispatch('info/formData', this.formData);
      }
      /*
       * 如果时间有空，不查询接口
       * */
      alertQueryConditionWrong(params, this.$store, this.urlParams, ['classifySaleRankingLoading', 'classifySaleRankingParams',
        'classificationRankings']);
    },
    /**
     * 重置表单数据
     */
    resetHandler() {
      this.resetFormData(this.syncConfig.config);
    },

    resetFormData(conf) {
      /**
       * 初始化绑定属性数据，取决于服务端接受数据对字段的要求，是否可选条件也要传空数据
       * 一般服务端没这么蠢，可选条件可以不传
       * 以下仅作为思路参考：在创建或者请求配置下来时复用 Vue.set 进行设置初始属性
       */
      const self = this;
      Object.values(conf).forEach(item => {
        Object.values(item.children).forEach(child => {
          if (child.fieldName) {
            // 组件默认值来源：配置数据中组件的 value，其次本地设置默认值，最后无特殊要求的组件默认设置为null
            self.$set(
              self.formData, child.fieldName,
              child.value || CompDefaultValue[child.name] || ''
            );
          }
        });
      });
    }
  },
  created() {
    this.needParams.shopShowFlag = !(this.userinfo['user_type'] === 'child_shop' && this.userinfo['type'] === 'SHOP');
    this.resetFormData(this.syncConfig.config);
  },
  mounted() {
    this.orderTypeIsAll = !this.everyTableParams['order_type'];
    sendOnceQuery(this.$store, 'classificationRankings', 'classifySaleRankingParams', this.tableData, this.urlParams, 'classifySaleRankingLoading');
    this.totalData = this.syncConfig.config;
    // 判断店铺是否显示
    this.getShopIndex();
  },
  updated() {
    let l = this.totalData.length;
    this.totalData[l - 2].children[0].attrs['loading'] = this.classifySaleRankingLoadingFlag;
    if (this.formData && this.formData['tableType'] === '3') {
      this.isOrgShop = true;
    }
    else if (this.formData && this.formData['tableType'] === '1' || this.formData['tableType'] === '2') {
      this.isOrgShop = false;
    }
  },
  watch: {
    isOrgShop(val) { // 切换组织排行的时候更改成组织+店铺控件
      let len = this.totalData.length;
      if (val) {
        this.formData.shop = [];
        for (let i = 0; i < len; i++) {
          if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-org-shop') {
            break;
          }
          else if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-shop-choice') {
            this.totalData.splice(i, 1, {
              name: 'yh-layout-item',
              size: 1.7,
              children: [
                {
                  name: 'yh-org-shop',
                  label: ['组织类别：', '店铺选择：'],
                  fieldName: 'orgShop',
                  value: [],
                  node: false,
                  options: [],
                  needShopName: true,
                  url: ['/shopinfo/findStructureStores', '/org/findOrgLevels'],
                  attrs: {
                    size: ComponentSize
                  }
                }
              ]
            });
            break;
          }
        }
      }
      else {
        for (let i = 0; i < len; i++) {
          if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-org-shop') {
            this.totalData.splice(i, 1, {
              name: 'yh-layout-item',
              size: 0.85,
              children: [
                {
                  name: 'yh-shop-choice',
                  label: '店铺选择：',
                  fieldName: 'shop',
                  value: [],
                  needShopName: true,
                  url: '/shopinfo/findStructureStores',
                  attrs: {
                    size: ComponentSize
                  }
                }
              ]
            });
            break;
          }
        }
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.titleArray && vm.titleArray.length > 1) {
        for (let i = 0; i < vm.titleArray.length - 1; i++) {
          if (vm.titleArray[i].url === to.fullPath) {
            vm.titleArrayNum += 1;
          }
        }
        if (vm.titleArrayNum === 0 && !vm.ifNewTitleArray) {
          vm.$store.commit('info/setTableData', { response: null, dataName: 'tableClassifySaleRanking' });
        }
      }
      vm.titleArrayNum = 0;
      if (from.fullPath === '/frame/home') {
        vm.$store.commit('info/setTableData', { response: null, dataName: 'tableClassifySaleRanking' });
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('info/setQueryLoading', { loadingFlag: 'classifySaleRankingLoading', loading: false });
    next(true);
  }
};
</script>

<style lang="less" scoped>
.income{
  padding: 0 20px;
  .clearFix{
    margin: 20px 20px 0 11px;
    padding-bottom: 24px;
  }
  .el-card{
    overflow: visible !important;
  }
  .inquire{
    line-height: 40px;
    color: #409eff;
    cursor: pointer;
    margin-left: 20px;
  }
  .el-table.el-table--fit.el-table--border.el-table--group.el-table--fluid-height{
    display: none;
  }
  .query-container form{
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
<style lang="less">
.income{
  .el-card{
    box-shadow: none !important;
    border: 1px solid #e6ebf0 !important;
  }
}
</style>
