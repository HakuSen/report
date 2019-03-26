<!-------------------------
  门店营业日报表页面
 ----------------------- -->
<template>
  <div class="income" @click="closePayList">
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
      <base-table :tableAllData="tableData" :queryParams="tableParams" :tableShowParams="needParams" :tableQueryParams="everyTableParams" @tableShow="tableShow" :loadingFlag="ShopBusinessReportFlag" :loadingName="'ShopBusinessReportLoading'" :tableFlag="tableFlag" :newPageing="newPageingParams" :formData="formData"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Vue from 'vue';
import YhLayoutItem from '../../../components/base/yinhe/YhLayoutItem';
import YhButton from '../../../components/base/yinhe/functional-unit/YhButton';
import YhTypeDate from '../../../components/base/yinhe/YhTypeDate';
import YhShopChoice from '../../../components/base/yinhe/YhShopChoice';
import BaseTable from '../../../components/base/table/BaseTable';
import CheckboxGroup from '../../../components/base/yinhe/functional-unit/checkboxGroup';
import setQueryParams from '../../../utils/setQueryParams';
import setQueryTimeAddTail from '../../../utils/setQueryTimeAddTail';
import notShowShop from '../../../utils/notShowShop';
import dropdownBoxBack from '../../../utils/dropdownBoxBack';
import alertQueryConditionWrong from '../../../utils/alertQueryConditionWrong';
import sendOnceQuery from '../../../utils/sendOnceQuery';
import { ComponentSize, LayoutWidthBase } from '../../../components/base/yinhe/setting';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
/**
 * 当某些特殊组件需要固定格式的默认值时使用
 */
const CompDefaultValue = {
  'yh-chooser': []
};

export default {
  name: 'ShopBusinessReport',
  components: {
    YhButton,
    YhLayoutItem,
    YhTypeDate,
    YhShopChoice,
    BaseTable,
    CheckboxGroup
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
        contentText: '门店营业日报',
        contentShopShow: false, // 是否显示店铺-日周月报表
        contentShow: true, // 是否显示日周月报表
        shopShowFlag: true,
        mergeTextArray: ['cityName', 'shopperName'],
        slotFlag: false // 是否显示hover
      },
      pageNum: 0, // 用来判断是直接请求还是分页请求
      tableFlag: false,
      newPageingParams: {},
      totalData: [],
      urlParams: {
        interfaceAddress: 'findStoreBusinessDailyReportList',
        dataName: 'tableShopBusinessReport'
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
      tableData: State => State.info.tableShopBusinessReport,
      tableParams: State => State.info.params.ShopBusinessReport.shopBusinessReportNewParams,
      needTimes: State => State.info.needTime,
      titleArray: State => State.info.titleArray,
      ifNewTitleArray: State => State.info.ifNewTitleArray,
      everyTableParams: State => State.info.params.ShopBusinessReport.shopBusinessReportParams,
      ShopBusinessReportFlag: State => State.info.ShopBusinessReportLoading
    }),
    syncConfig() {
      return {
        key: 'two',
        width: LayoutWidthBase,
        config: [
          {
            name: 'yh-layout-item',
            size: 3,
            children: [
              {
                name: 'yh-type-date',
                label: ['报表类型：', '报表日期：'],
                fieldName: 'typedate',
                value: [],
                options: [
                  { label: '店铺-日', value: 'date-shop' },
                  { label: '店铺-周', value: 'week-shop' },
                  { label: '店铺-月', value: 'month-shop' }
                ],
                attrs: {
                  'start-placeholder': '开始日期',
                  'end-placeholder': '结束日期',
                  type: 'date-shop',
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
                url: '/shopinfo/findStructureStores',
                attrs: {
                  size: ComponentSize
                }
              }
            ]
          },
          {
            name: 'yh-layout-item',
            size: 0.5,
            children: [
              {
                name: 'checkbox-group',
                label: '',
                fieldName: 'Distribution',
                value: [],
                options: [
                  { label: '配送费不计入营业额', value: '1' }
                ],
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
                  loading: this.ShopBusinessReportFlag
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
    submitHandler() {
      this.tableFlag = false;
      this.$store.commit('info/setQueryLoading', { loadingFlag: 'ShopBusinessReportLoading', loading: true });
      // params 公用部分提出
      let params = setQueryParams(this.formData, this.$store);
      let { start_date, end_date } = setQueryTimeAddTail(this.formData);
      params['start_date'] = start_date;
      params['end_date'] = end_date;
      // params['deliverypay_flag'] =
      /**
       * 导出需要使用的地址和分页请求的info.js的地址
       */
      let newParams = {
        url: 'findStoreBusinessDailyReportList',
        tableData: 'tableShopBusinessReport',
        pageingFlag: ++this.pageNum
      };
      this.newPageingParams = newParams;
      this.$store.dispatch('info/getParams', { newParams, oneTableName: 'shopBusinessReportNewParams', newParamsName: 'ShopBusinessReport' });
      if (this.formData) {
        this.$store.dispatch('info/formData', this.formData);
      }
      /*
       * 如果时间有空，不查询接口
       * */
      alertQueryConditionWrong(params, this.$store, this.urlParams, ['ShopBusinessReportLoading', 'shopBusinessReportParams', 'ShopBusinessReport']);
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
    sendOnceQuery(this.$store, 'ShopBusinessReport', 'shopBusinessReportParams', this.tableData, this.urlParams, 'ShopBusinessReportLoading');
    this.totalData = this.syncConfig.config;
    // 判断店铺是否显示
    this.getShopIndex();
  },
  updated() {
    let l = this.totalData.length;
    this.totalData[l - 2].children[0].attrs['loading'] = this.ShopBusinessReportFlag;
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
          vm.$store.commit('info/setTableData', { response: null, dataName: 'tableShopBusinessReport' });
        }
      }
      vm.titleArrayNum = 0;
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('info/setQueryLoading', { loadingFlag: 'ShopBusinessReportLoading', loading: false });
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
