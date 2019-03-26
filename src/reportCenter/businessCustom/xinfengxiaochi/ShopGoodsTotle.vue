<!-------------------------
  门店商品销售统计页面
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
      <Table :tableAllData="tableData" :queryParams="tableParams" :tableShowParams="needParams" :tableQueryParams="everyTableParams" @tableShow="tableShow" :loadingFlag="shopGoodsTotleFlag" :loadingName="'shopGoodsTotleLoading'" :tableFlag="tableFlag" :newPageing="newPageingParams" :formData="formData"></Table>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Vue from 'vue';
import YhLayoutItem from '../../../components/base/yinhe/YhLayoutItem';
import YhButton from '../../../components/base/yinhe/functional-unit/YhButton';
import YhDatePicker from '../../../components/base/yinhe/YhDatePicker';
import YhShopChoice from '../../../components/base/yinhe/YhShopChoice';
import YhMonthDate from '../../../components/base/yinhe/YhMonthDate';
import YhGoods from '../../../components/base/yinhe/YhGoods';
import YhInput from '../../../components/base/yinhe/functional-unit/YhInput';
import YhSingleDate from '../../../components/base/yinhe/functional-unit/YhSingleDate';
import YhPay from '../../../components/base/yinhe/YhPay';
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
  name: 'shopGoodsTotle',
  components: {
    YhDatePicker,
    YhButton,
    YhLayoutItem,
    YhShopChoice,
    Table,
    YhMonthDate,
    YhInput,
    YhPay,
    YhGoods,
    YhSingleDate
  },
  data() {
    return {
      formData: {},
      needParams: {
        totleShowFlag: false,
        contactArray: [],
        contactDot: 0,
        arrayKey: '',
        contactArray1: [],
        contactDot1: 0,
        arrayKey1: '',
        contactArray2: [], // 合计合并
        contactArray3: [], // 区域或者城市合并
        contentText: '门店商品销售统计',
        contentShow: true,
        shopShowFlag: true,
        contentShopShow: false, // 是否显示店铺-日周月报表
        slotFlag: false, // 是否显示hover
        mergeTextArray: ['storeName', 'categoryName']
      },
      pageNum: 0,
      newPageingParams: {},
      tableFlag: false,
      totalData: [],
      urlParams: {
        interfaceAddress: 'findStoreItemGoodsStatisticsList',
        dataName: 'shopGoodsTotleData'
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
      tableData: State => State.info.shopGoodsTotleData,
      tableParams: State => State.info.params.shopGoodsTotle.shopGoodsTotleNewParams,
      needTimes: State => State.info.needTime,
      titleArray: State => State.info.titleArray,
      ifNewTitleArray: State => State.info.ifNewTitleArray,
      everyTableParams: State => State.info.params.shopGoodsTotle.shopGoodsTotleParams,
      shopGoodsTotleFlag: State => State.info.shopGoodsTotleLoading
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
                name: 'yh-month-date',
                label: ['报表类型：', '报表日期：'],
                fieldName: 'typedate',
                value: [],
                options: [
                  { label: '日', value: 'date' },
                  { label: '月', value: 'month' }
                ],
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
            size: 0.8,
            children: [
              {
                name: 'yh-input',
                label: '商品编码：',
                fieldName: 'shopCode',
                value: '',
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
            size: 0.8,
            children: [
              {
                name: 'yh-pay',
                label: '过滤商品：',
                fieldName: 'payType',
                isFilter: true,
                value: [],
                url: '/goods/findSystemGoodsList',
                attrs: {
                  size: ComponentSize
                }
              }
            ]
          },
          {
            name: 'yh-layout-item',
            size: 1.7,
            children: [
              {
                name: 'yh-goods',
                classifyMulitiple: true, // 商品分类多选时为true，单选时为false
                getSingle: false, // 商品名称单选时为true，多选时为false
                show: false, // 商品类型隐藏
                label: ['商品分类：', '商品类型：', '商品名称：'],
                fieldName: 'property',
                value: [],
                url: ['/category/findCategoryByNameLike', '/goods/findGoodsType', '/goods/findGoodsList'],
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
                  loading: this.shopGoodsTotleFlag
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
      dropdownBoxBack(this.totalData, this.$refs, ['yh-goods', 'yh-pay']);
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
      this.$store.commit('info/setQueryLoading', { loadingFlag: 'shopGoodsTotleLoading', loading: true });
      let params = setQueryParams(this.formData, this.$store);
      if (this.formData.typedate[0] === 'date') {
        let { start_date, end_date } = setQueryTimeAddTail(this.formData);
        params['start_date'] = start_date;
        params['end_date'] = end_date;
      }
      else {
        params['year_month'] = this.formData.typedate[1];
      }
      params['goods_code'] = this.formData['shopCode'];
      params['shopper_pid'] = this.userinfo['parent_id'] ? this.userinfo['parent_id'] : this.userinfo.shopper_id;
      if (this.formData.property[0].length > 0 && this.formData.property[0][0] !== '全部') {
        params['category_ids'] = this.formData.property[0];
      }
      if (this.formData.property[1] !== '') {
        params['size_type_num'] = this.formData.property[1];
      }
      if (this.formData.property[2].length > 0 && this.formData.property[2][0] !== '全部') {
        params['goods_ids'] = this.formData.property[2];
      }
      if (params['goods_code'] !== '') {
        params['category_ids'] = [];
        params['size_type_num'] = '';
        params['goods_ids'] = [];
      }
      if (this.formData.payType) {
        if (this.formData.payType[0] === '全部') {
          params['filter_goods_ids'] = [];
        }
        else {
          params['filter_goods_ids'] = this.formData['payType'];
        }
      }
      params['order_type'] = '';
      alertQueryConditionWrong(params, this.$store, this.urlParams, ['shopGoodsTotleLoading', 'shopGoodsTotleParams',
        'shopGoodsTotle'], this.formData, true);
      let newParams = {
        url: 'findStoreItemGoodsStatisticsList',
        tableData: 'shopGoodsTotleData',
        pageingFlag: ++this.pageNum
      };
      this.newPageingParams = newParams;
      this.$store.dispatch('info/getParams', { newParams, oneTableName: 'shopGoodsTotleNewParams', newParamsName: 'shopGoodsTotle' });
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
    this.needParams.shopShowFlag = !(this.userinfo['user_type'] === 'child_shop' && this.userinfo['type'] === 'SHOP');
    this.resetFormData(this.syncConfig.config);
  },
  mounted() {
    sendOnceQuery(this.$store, 'shopGoodsTotle', 'shopGoodsTotleParams', this.tableData, this.urlParams, 'shopGoodsTotleLoading');
    this.totalData = this.syncConfig.config;
    this.getShopIndex();
  },
  updated() {
    let l = this.totalData.length;
    this.totalData[l - 2].children[0].attrs['loading'] = this.shopGoodsTotleFlag;
    if (this.formData && this.formData['typedate'][0] === 'month') {
      for (let i = 0; i < l; i++) {
        if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-month-date') {
          this.totalData[i].size = 1.4;
        }
      }
    }
    else {
      for (let i = 0; i < l; i++) {
        if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-month-date') {
          this.totalData[i].size = 2;
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
          vm.$store.commit('info/setTableData', { response: null, dataName: 'shopGoodsTotleData' });
        }
      }
      vm.titleArrayNum = 0;
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('info/setQueryLoading', { loadingFlag: 'shopGoodsTotleLoading', loading: false });
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
