<!-------------------------
 消费统计报表
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
                       :queryParams="everyTableParams"
                       v-model="formData[child.fieldName]"
                       :ref="'payList'">
            </component>
          </yh-layout-item>
        </form>
      </div>
    </el-card>
    <div class="table-warp" style="background: #fff;">
      <Table :tableAllData="tableData" :queryParams="tableParams" :tableShowParams="needParams" :tableQueryParams="everyTableParams" @tableShow="tableShow" :loadingName="'shopTimeRevenueLoading'" :loadingFlag="shopTimeRevenueLoadingFlag" :tableFlag="tableFlag" :newPageing="newPageingParams" :formData="formData"></Table>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Vue from 'vue';
import YhLayoutItem from '../../../components/base/yinhe/YhLayoutItem';
import YhSelect from '../../../components/base/yinhe/YhSelect';
import YhFilter from '../../../components/base/yinhe/YhFilter';
import YhButton from '../../../components/base/yinhe/functional-unit/YhButton';
import YhShopChoice from '../../../components/base/yinhe/YhShopChoice';
import YhTypeDate from '../../../components/base/yinhe/YhTypeDate';
import CheckboxGroup from '../../../components/base/yinhe/functional-unit/checkboxGroup';
import Table from '../../../components/base/table/Table';
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
  name: 'ShopRevenueReport',
  components: {
    YhSelect,
    YhFilter,
    YhButton,
    YhLayoutItem,
    YhShopChoice,
    Table,
    CheckboxGroup,
    YhTypeDate
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
        contactArray2: [], // 合计合并
        contactArray3: [], // 区域或者城市合并
        contactArray4: [], // 门店合并
        contentText: '消费统计报表',
        shopShowFlag: false,
        contentShopShow: true, // 是否显示店铺-日周月报表
        mergeTextArray: ['cityName', 'shopperName'],
        contentShow: false // 是否显示日周月报表
      },
      pageNum: 0,
      tableFlag: false,
      newPageingParams: {},
      totalData: [],
      urlParams: {
        interfaceAddress: 'getRevenueTimeList',
        dataName: 'tableRevenueTime'
      } // 接口请求
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
      tableData: State => State.info.tableRevenueTime,
      tableParams: State => State.info.params.shopTimeRevenue.tableRevenueTimeNewParams,
      needTimes: State => State.info.needTime,
      titleArray: State => State.info.titleArray,
      ifNewTitleArray: State => State.info.ifNewTitleArray,
      everyTableParams: State => State.info.params.shopTimeRevenue.tableRevenueTimeParams,
      shopTimeRevenueLoadingFlag: State => State.info.shopTimeRevenueLoading
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
            size: 0.85,
            children: [
              {
                name: 'yh-filter',
                label: '过滤订单：',
                fieldName: 'filter',
                value: '0',
                options: [
                  { label: '低于5元', value: '5' },
                  { label: '低于10元', value: '10' },
                  { label: '低于20元', value: '20' },
                  { label: '低于50元', value: '50' },
                  { label: '不过滤', value: '0' }
                ],
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
                  loading: this.shopTimeRevenueLoadingFlag
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
      this.$store.commit('info/setQueryLoading', { loadingFlag: 'shopTimeRevenueLoading', loading: true });
      let params = setQueryParams(this.formData, this.$store);
      let { start_date, end_date } = setQueryTimeAddTail(this.formData);
      params['start_date'] = start_date;
      params['end_date'] = end_date;
      if (this.formData.filter !== '0') {
        params['filter_amount'] = Number(this.formData.filter);
      }
      alertQueryConditionWrong(params, this.$store, this.urlParams, ['shopTimeRevenueLoading', 'tableRevenueTimeParams', 'shopTimeRevenue']);
      let newParams = {
        url: 'getRevenueTimeList',
        tableData: 'tableRevenueTime',
        pageingFlag: ++this.pageNum
      };
      this.newPageingParams = newParams;
      this.$store.dispatch('info/getParams', { newParams, oneTableName: 'tableRevenueTimeNewParams', newParamsName: 'shopTimeRevenue' });
      if (this.formData) {
        this.$store.dispatch('info/formData', this.formData);
      }
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
  },
  mounted() {
    sendOnceQuery(this.$store, 'shopTimeRevenue', 'tableRevenueTimeParams', this.tableData, this.urlParams, 'shopTimeRevenueLoading');
    this.totalData = this.syncConfig.config;
    this.getShopIndex();
  },
  updated() {
    let l = this.totalData.length;
    this.totalData[l - 2].children[0].attrs['loading'] = this.shopTimeRevenueLoadingFlag;
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
          vm.$store.commit('info/setTableData', { response: null, dataName: 'tableRevenueTime' });
        }
      }
      vm.titleArrayNum = 0;
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('info/setQueryLoading', { loadingFlag: 'shopTimeRevenueLoading', loading: false });
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
