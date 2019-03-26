<!-------------------------
  商品规格分析
 ------------------------ -->
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
      <warn-text v-if="isWarn" :message="message"/>
      <Table :tableAllData="tableData" :queryParams="tableParams" :tableShowParams="needParams" :tableQueryParams="everyTableParams" @tableShow="tableShow" :loadingFlag="goodsSaleSizeLoadingFlag" :loadingName="'goodsSaleSizeLoading'" :tableFlag="tableFlag" :newPageing="newPageingParams" :formData="formData"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Vue from 'vue';
import YhLayoutItem from '../../../components/base/yinhe/YhLayoutItem';
import YhSelect from '../../../components/base/yinhe/YhSelect';
import YhButton from '../../../components/base/yinhe/functional-unit/YhButton';
import YhShopChoice from '../../../components/base/yinhe/YhShopChoice';
import YhQuickLook from '../../../components/base/yinhe/YhQuickLook';
import YhPropertyAnalyze from '../../../components/base/yinhe/YhPropertyAnalyze';
import Table from '../../../components/base/table/Table';
import YhDatePicker from '../../../components/base/yinhe/YhDatePicker';
import WarnText from '../../../components/base/WarnText';
import setQueryParams from '../../../utils/setQueryParams';
import notShowShop from '../../../utils/notShowShop';
import dropdownBoxBack from '../../../utils/dropdownBoxBack';
import setQueryTimeAddTail from '../../../utils/setQueryTimeAddTail';
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
  name: 'SizePropAnalysis',
  components: {
    YhSelect,
    YhButton,
    YhLayoutItem,
    YhShopChoice,
    Table,
    YhQuickLook,
    YhPropertyAnalyze,
    YhDatePicker,
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
        contentText: '商品规格分析',
        contentShopShow: false, // 是否显示店铺-日周月报表
        contentShow: false, // 是否显示日周月报表
        shopShowFlag: true,
        mergeTextArray: ['goodsName', ''],
        slotFlag: false // 是否显示hover
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
        interfaceAddress: 'getGoodsSaleSizeAnalyzeList',
        dataName: 'tableGoodsSaleSize'
      } // 接口请求 方法映射
    };
  },
  computed: {
    formDataStr() {
      return JSON.stringify(this.formData);
    },
    isWarn() {
      return this.tableData && this.tableData.data && this.tableData.data.data && this.tableData.data.data.table_data && this.orderTypeIsAll
    },
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    }),
    ...mapState({
      tableData: State => State.info.tableGoodsSaleSize,
      tableParams: State => State.info.params.goodsSaleSize.goodsSaleSizeNewParams,
      needTimes: State => State.info.needTime,
      titleArray: State => State.info.titleArray,
      ifNewTitleArray: State => State.info.ifNewTitleArray,
      everyTableParams: State => State.info.params.goodsSaleSize.goodsSaleSizeParams,
      goodsSaleSizeLoadingFlag: State => State.info.goodsSaleSizeLoading
    }),
    syncConfig() {
      return {
        key: 'two',
        width: LayoutWidthBase,
        config: [
          {
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
            size: 0.7,
            children: [
              {
                name: 'yh-property-analyze',
                label: '',
                fieldName: 'propertyAnalyze',
                value: [],
                url: '/property/findClassSelect',
                options: [
                  { label: '总占比', value: 'proportion' },
                  { label: '属性分类', value: 'type' }
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
                  loading: this.goodsSaleSizeLoadingFlag
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
      this.$store.commit('info/setQueryLoading', { loadingFlag: 'goodsSaleSizeLoading', loading: true });
      // params 公用部分提出
      let params = setQueryParams(this.formData, this.$store);
      let nowData = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      let nowMonth = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
      let nowHours = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
      let nowMinutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
      let nowSeconds = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
      let myDate = new Date().getFullYear() + '-' + nowMonth + '-' + nowData;
      let todayTime = nowHours + ':' + nowMinutes + ':' + nowSeconds;
      if (this.formData['quickLook']) {
        if (this.formData['quickLook'][1][0]) {
          params['start_date'] = this.formData['quickLook'][1][0] + ' 00:00:00';
        }
        if (this.formData['quickLook'][1][1] === myDate) {
          params['end_date'] = this.formData['quickLook'][1][1] + ' ' + todayTime;
        }
        else {
          params['end_date'] = this.formData['quickLook'][1][1] + ' 23:59:59';
        }
      }
      let { start_date, end_date } = setQueryTimeAddTail(this.formData);
      params['start_date'] = start_date;
      params['end_date'] = end_date;
      params['type'] = null;
      if (this.formData['shop'] && this.formData['shop'][0] && Array.isArray(this.formData['shop'][0])) {
        params.shopper_id_list = this.formData.shop[0];
      }
      this.orderTypeIsAll = !params['order_type'];
      if (this.isContainProp) {
        params['is_contain_prop'] = 1;
        this.needParams.mergeTextArray = ['goodsName', 'sizeType'];
        if (this.formData['propertyAnalyze'][1] !== '') {
          params['prop_class_id'] = this.formData['propertyAnalyze'][1] + '';
        }
      }
      else {
        params['is_contain_prop'] = 0;
        this.needParams.mergeTextArray = ['goodsName', ''];
      }
      if (this.isTotalProportion) {
        params['total_proportion'] = 1;
      }
      else {
        params['total_proportion'] = 0;
      }
      /**
       * 导出需要使用的地址和分页请求的info.js的地址
       */
      let newParams = {
        url: 'getGoodsSaleSizeAnalyzeList',
        tableData: 'tableGoodsSaleSize',
        pageingFlag: ++this.pageNum
      };
      this.newPageingParams = newParams;
      this.$store.dispatch('info/getParams', { newParams, oneTableName: 'goodsSaleSizeNewParams', newParamsName: 'goodsSaleSize' });
      if (this.formData) {
        this.$store.dispatch('info/formData', this.formData);
      }
      /*
       * 如果时间有空，不查询接口
       * */
      alertQueryConditionWrong(params, this.$store, this.urlParams, ['goodsSaleSizeLoading', 'goodsSaleSizeParams', 'goodsSaleSize']);
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
    sendOnceQuery(this.$store, 'goodsSaleSize', 'goodsSaleSizeParams', this.tableData, this.urlParams, 'goodsSaleSizeLoading');
    this.totalData = this.syncConfig.config;
    // 判断店铺是否显示
    this.getShopIndex();
  },
  updated() {
    let l = this.totalData.length;
    this.totalData[l - 2].children[0].attrs['loading'] = this.goodsSaleSizeLoadingFlag;
    const propertyAnalyzeString = JSON.stringify(this.formData['propertyAnalyze']);
    if (propertyAnalyzeString.indexOf('type') !== -1) {
      this.totalData[l - 3].size = 1.4;
      this.isContainProp = true;
    }
    else {
      this.totalData[l - 3].size = 0.7;
      this.isContainProp = false;
    }
    this.isTotalProportion = (propertyAnalyzeString.indexOf('proportion') !== -1);
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
          vm.$store.commit('info/setTableData', { response: null, dataName: 'tableGoodsSaleSize' });
        }
      }
      vm.titleArrayNum = 0;
      if (from.fullPath === '/frame/home') {
        vm.$store.commit('info/setTableData', { response: null, dataName: 'tableGoodsSaleSize' });
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('info/setQueryLoading', { loadingFlag: 'goodsSaleSizeLoading', loading: false });
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
  .warnimg-text{
    background-color: #ffeedd;
    box-shadow: 0 1px 2px 0 rgba(179, 91, 4, 0.18);
    height: 16px;
    margin: -20px -20px 6px -20px;
    border-radius: 4px 4px 0 0;
    font-size: 12px;
    line-height: 16px;
    padding: 4px 0 4px 20px;
    color: #f55041;
    display: flex;
  }
}
</style>

