<!-------------------------
  会员卡统计报表
 ----------------------- -->
<template>
  <div class="income" @click="closePayList">
    <adaptive-block :memberCardTotalStatistics="memberCardTotalStatistics" v-if="memberCardTotalStatistics.flag"></adaptive-block>
    <el-card class="box-card">
      <!--头部-->
      <div class="query-container">
        <form @submit.prevent="submitHandler" @reset.prevent="resetHandler" onkeydown="if(event.keyCode === 13){return false;}">
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
                       v-model="formData[child.fieldName]"
                       :queryParams="everyTableParams"
                       :ref="'payList'">
            </component>
          </yh-layout-item>
        </form>
      </div>
    </el-card>
    <div class="table-warp" style="background: #fff;">
      <base-table :tableAllData="tableData" :queryParams="tableParams" :tableShowParams="needParams" :tableQueryParams="everyTableParams" @tableShow="tableShow" :loadingFlag="MembershipReportLoadingFlag" :loadingName="'MembershipReportLoading'" :tableFlag="tableFlag" :newPageing="newPageingParams" :formData="formData"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Vue from 'vue';
import YhLayoutItem from '../../../components/base/yinhe/YhLayoutItem';
import YhButton from '../../../components/base/yinhe/functional-unit/YhButton';
import YhQueryItem from '../../../components/base/yinhe/YhQueryItem';
import YhSingleShopChoice from '../../../components/base/yinhe/YhSingleShopChoice';
import YhDatePicker from '../../../components/base/yinhe/YhDatePicker';
import YhShopChoice from '../../../components/base/yinhe/YhShopChoice';
import YhRadioButton from '../../../components/base/yinhe/YhRadioButton';
import BaseTable from '../../../components/base/table/BaseTable';
import setQueryParams from '../../../utils/setQueryParams';
import setQueryTimeAddTail from '../../../utils/setQueryTimeAddTail';
import dropdownBoxBack from '../../../utils/dropdownBoxBack';
import alertQueryConditionWrong from '../../../utils/alertQueryConditionWrong';
import sendOnceQuery from '../../../utils/sendOnceQuery';
import { ComponentSize, LayoutWidthBase } from '../../../components/base/yinhe/setting';
import AdaptiveBlock from '../../../components/base/AdaptiveBlock';
import PathConf from '../../../conf/api.conf';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
/**
 * 当某些特殊组件需要固定格式的默认值时使用
 */
const CompDefaultValue = {
  'yh-chooser': []
};

export default {
  name: 'MembershipReport',
  components: {
    YhButton,
    YhLayoutItem,
    BaseTable,
    AdaptiveBlock,
    YhSingleShopChoice,
    YhRadioButton,
    YhDatePicker,
    YhShopChoice,
    YhQueryItem
  },
  data() {
    return {
      memberCardTotalStatistics: {
        list: {},
        flag: false
      },
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
        contentText: '会员卡统计报表(会员)',
        contentShopShow: false, // 是否显示店铺-日周月报表
        contentShow: false, // 是否显示日周月报表
        shopShowFlag: false,
        mergeTextArray: ['cityName', 'shopperName']
      },
      pageNum: 0, // 用来判断是直接请求还是分页请求
      tableFlag: false,
      newPageingParams: {},
      totalData: [],
      shopSingle: false,
      urlParams: {
        interfaceAddress: 'findMemberCardPryList',
        dataName: 'tableMembershipReport'
      } // 接口请求 方法映射
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
      tableData: State => State.info.tableMembershipReport,
      tableParams: State => State.info.params.MembershipReport.MembershipReportNewParams,
      needTimes: State => State.info.needTime,
      titleArray: State => State.info.titleArray,
      ifNewTitleArray: State => State.info.ifNewTitleArray,
      everyTableParams: State => State.info.params.MembershipReport.MembershipReportParams,
      MembershipReportLoadingFlag: State => State.info.MembershipReportLoading
    }),
    syncConfig() {
      return {
        key: 'two',
        width: LayoutWidthBase,
        config: [
          {
            name: 'yh-layout-item',
            size: 0.7,
            children: [
              {
                name: 'yh-radio-button',
                label: '报表类型：',
                fieldName: 'tableType',
                value: '1',
                options: [
                  { label: '会员', value: '1' },
                  { label: '门店', value: '2' }
                ],
                attrs: {
                  size: ComponentSize
                }
              }
            ]
          },
          {
            name: 'yh-layout-item',
            size: 1.5,
            children: [
              {
                name: 'yh-query-item',
                label: '查询项：',
                fieldName: 'queryitem',
                value: [],
                options: [],
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
                name: 'yh-single-shop-choice',
                label: '店铺选择：',
                fieldName: 'singleShop',
                value: [],
                url: '/shopinfo/findStructureStores',
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
                  loading: this.MembershipReportLoadingFlag
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
    tableShow(val) {
      this.tableFlag = val;
    },
    // 返回循环组件中为店铺选择的index
    getShopIndex() {
      let l = this.totalData.length;
      if (this.userinfo['user_type'] && this.userinfo['type'] && this.userinfo['user_type'] === 'child_shop' && this.userinfo['type'] === 'SHOP') {
        for (let i = 0; i < l; i++) {
          if (this.totalData[i] && this.totalData[i].children[0].name === 'yh-radio-button' || this.totalData[i] && this.totalData[i].children[0].name === 'yh-single-shop-choice' || this.totalData[i] && this.totalData[i].children[0].name === 'yh-org-shop') {
            this.totalData.splice(i, 1);
          }
        }
      }
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
    submitHandler() {
      this.tableFlag = false;
      this.$store.commit('info/setQueryLoading', { loadingFlag: 'MembershipReportLoading', loading: true });
      // params 公用部分提出
      let params = setQueryParams(this.formData, this.$store);
      if (this.formData['tableType'] === '1') {
        let myDate = new Date();
        myDate.getYear();
        myDate.getFullYear();
        let month = myDate.getMonth() + 1;
        myDate.getDate();
        params['start_date'] = myDate.getFullYear() + '-' + month + '-' + myDate.getDate() + ' 00:00:00';
        params['end_date'] = myDate.getFullYear() + '-' + month + '-' + myDate.getDate() + ' 23:59:59';
        if (this.formData['singleShop'].length === 0) {
          params['shopper_id'] = '';
        }
        else if (this.formData['singleShop'].length === 1) {
          params['shopper_id'] = this.formData['singleShop'][0] + '';
        }
        else {
          params['shopper_id'] = this.formData['singleShop'][2] + '';
        }
        params['type'] = this.formData['tableType']; // 报表类型刷新用
        params['single_shop'] = this.formData['singleShop']; // 店铺刷新用
        params['member_info'] = this.formData.queryitem[0] || null;
        params['member_info_value'] = this.formData.queryitem[1] || null;
        this.urlParams['interfaceAddress'] = 'findMemberCardPryList';
        let newParams = {
          url: 'findMemberCardPryList',
          tableData: 'tableMembershipReport',
          pageingFlag: ++this.pageNum
        };
        this.newPageingParams = newParams;
        this.$store.dispatch('info/getParams', { newParams, oneTableName: 'MembershipReportNewParams', newParamsName: 'MembershipReport' });
      }
      else {
        let { start_date, end_date } = setQueryTimeAddTail(this.formData);
        params['start_date'] = start_date;
        params['end_date'] = end_date;
        params['type'] = this.formData['tableType']; // 报表类型刷新用
        this.urlParams['interfaceAddress'] = 'findMemberCardShopPayList';
        let newParams = {
          url: 'findMemberCardShopPayList',
          tableData: 'tableMembershipReport',
          pageingFlag: ++this.pageNum
        };
        this.newPageingParams = newParams;
        this.$store.dispatch('info/getParams', { newParams, oneTableName: 'MembershipReportNewParams', newParamsName: 'MembershipReport' });
      }
      /**
       * 导出需要使用的地址和分页请求的info.js的地址
       */
      if (this.formData) {
        this.$store.dispatch('info/formData', this.formData);
      }
      /*
       * 如果时间有空，不查询接口
       * */
      alertQueryConditionWrong(params, this.$store, this.urlParams, ['MembershipReportLoading', 'MembershipReportParams', 'MembershipReport']);
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
    this.resetFormData(this.syncConfig.config);
    if (this.userinfo['user_type'] === 'parent_shop' && this.userinfo['type'] === 'SHOP') {
      let params = this.userinfo['shopper_id'];
      Vue.$api.post({ getway: PathConf.report.$getway, api: PathConf.report['findMemberCardTotalStatistics'] }, params).then(res => {
        if (res) {
          this.memberCardTotalStatistics['list'] = res.data.data || [];
          this.memberCardTotalStatistics['flag'] = true;
        }
      }).catch(() => {});
    }
  },
  mounted() {
    sendOnceQuery(this.$store, 'MembershipReport', 'MembershipReportParams', this.tableData, this.urlParams, 'MembershipReportLoading');
    this.totalData = this.syncConfig.config;
    // 判断店铺是否显示
    this.getShopIndex();
  },
  updated() {
    let l = this.totalData.length;
    this.totalData[l - 2].children[0].attrs['loading'] = this.MembershipReportLoadingFlag;
    if (this.formData && this.formData['tableType'] === '2') {
      this.shopSingle = true;
      this.contentShow = true; // 表身显示统计日期
      this.needParams.contentText = '会员卡统计报表（门店）';
    }
    else if (this.formData && this.formData['tableType'] === '1') {
      this.shopSingle = false;
      this.needParams.contentText = '会员卡统计报表（会员）';
    }
  },
  watch: {
    shopSingle(val) {
      let len = this.totalData.length;
      if (val) {
        for (let i = 0; i < len; i++) {
          if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-query-item') {
            this.totalData.splice(i, 1, {
              name: 'yh-layout-item',
              size: 2,
              children: [
                {
                  name: 'yh-date-picker',
                  label: '报表日期：',
                  fieldName: 'datetime',
                  value: [],
                  attrs: {
                    'start-placeholder': '开始日期',
                    'end-placeholder': '结束日期',
                    type: 'date',
                    size: ComponentSize
                  }
                }
              ]
            });
            break;
          }
        }
        for (let i = 0; i < len; i++) {
          if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-shop-choice') {
            break;
          }
          else if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-single-shop-choice') {
            this.totalData.splice(i, 1, {
              name: 'yh-layout-item',
              size: 0.8,
              children: [
                {
                  name: 'yh-shop-choice',
                  label: '店铺选择：',
                  fieldName: 'shop',
                  value: [],
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
      else {
        for (let i = 0; i < len; i++) {
          if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-date-picker') {
            this.totalData.splice(i, 1, {
              name: 'yh-layout-item',
              size: 1.5,
              children: [
                {
                  name: 'yh-query-item',
                  label: '查询项：',
                  fieldName: 'queryitem',
                  value: [],
                  options: [],
                  attrs: {
                    size: ComponentSize
                  }
                }
              ]
            });
            break;
          }
        }
        for (let i = 0; i < len; i++) {
          if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-shop-choice') {
            this.totalData.splice(i, 1, {
              name: 'yh-layout-item',
              size: 0.8,
              children: [
                {
                  name: 'yh-single-shop-choice',
                  label: '店铺选择：',
                  fieldName: 'singleShop',
                  value: [],
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
          vm.$store.commit('info/setTableData', { response: null, dataName: 'tableMembershipReport' });
        }
      }
      vm.titleArrayNum = 0;
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('info/setQueryLoading', { loadingFlag: 'MembershipReportLoading', loading: false });
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
