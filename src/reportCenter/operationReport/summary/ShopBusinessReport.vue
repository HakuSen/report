<!-------------------------
  营业汇总报表
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
      <Table :tableAllData="tableData" :queryParams="tableParams" :tableShowParams="needParams" :tableQueryParams="everyTableParams" @tableShow="tableShow" :loadingFlag="storeBusinessTimeLoadingFlag" :tableFlag="tableFlag" :loadingName="'storeBusinessTimeLoading'" :newPageing="newPageingParams" :formData="formData"></Table>
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
import YhShopMachine from '../../../components/base/yinhe/YhShopMachine';
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
  name: 'ShopBusinessReport',
  components: {
    YhSelect,
    YhButton,
    YhLayoutItem,
    YhShopChoice,
    YhShopMachine,
    Table,
    YhTypeDate,
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
        contactArray2: [], // 合计合并 横向
        contactArray3: [], // 区域或者城市合并 横向
        contactArray4: [], // 门店合并 横向
        contentText: '营业汇总报表',
        contentShopShow: true, // 是否显示店铺-日周月报表
        contentShow: false, // 是否显示日周月报表
        totleShowFlag: true, // 是否显示统计
        machineShow: true, // 是否显示机器选择
        mergeTextArray: ['cityName', 'shopperName'],
        shopShowFlag: false
      },
      tableFlag: false,
      newPageingParams: {},
      pageNum: 0,
      totalData: [],
      urlParams: {
        interfaceAddress: 'getStoreBusinessTimeList',
        dataName: 'tableStoreBusinessTime'
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
      tableData: State => State.info.tableStoreBusinessTime,
      tableParams: State => State.info.params.storeTimeBusiness.tableStoreBusinessTimeNewParams,
      needTimes: State => State.info.needTime,
      titleArray: State => State.info.titleArray,
      ifNewTitleArray: State => State.info.ifNewTitleArray,
      everyTableParams: State => State.info.params.storeTimeBusiness.tableStoreBusinessTimeParams,
      storeBusinessTimeLoadingFlag: State => State.info.storeBusinessTimeLoading
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
                name: 'yh-select',
                label: '订单类型：',
                fieldName: 'indent',
                value: '2',
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
            size: 1.6,
            children: [
              {
                name: 'yh-shop-machine',
                label: ['店铺选择：', '机器选择：'],
                fieldName: 'shopMachine',
                value: [],
                isEmployees: false,
                isMachine: true,
                url: ['/shopinfo/findStructureStores', '/machine/findMachineList'],
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
                fieldName: 'checkGroup',
                value: [],
                options: [
                  { label: '混合支付拆分统计', value: '1' }
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
                  loading: this.storeBusinessTimeLoadingFlag
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
      this.$store.commit('info/setQueryLoading', { loadingFlag: 'storeBusinessTimeLoading', loading: true });
      let params = setQueryParams(this.formData, this.$store);
      params['view_statistics'] = 1;
      let { start_date, end_date } = setQueryTimeAddTail(this.formData);
      params['start_date'] = start_date;
      params['end_date'] = end_date;
      if (this.formData['shopMachine'].length > 0 && this.formData['shopMachine'][1] !== '' && this.formData['shopMachine'][1] !== 'all;全部') {
        params['machine_id'] = Number(this.formData['shopMachine'][1].split(';')[0]);
      }
      if (this.userinfo['user_type'] === 'parent_shop') {
        if (this.formData['shopMachine'][0][0] === '全部') {
          params['shopper_id_list'] = null;
        }
        else {
          params['shopper_id_list'] = this.formData['shopMachine'][0];
        }
      }
      alertQueryConditionWrong(params, this.$store, this.urlParams, ['storeBusinessTimeLoading', 'tableStoreBusinessTimeParams',
        'storeTimeBusiness']);
      let newParams = {
        url: 'getStoreBusinessTimeList',
        tableData: 'tableStoreBusinessTime',
        pageingFlag: ++this.pageNum
      };
      this.newPageingParams = newParams;
      this.$store.dispatch('info/getParams', { newParams, oneTableName: 'tableStoreBusinessTimeNewParams', newParamsName: 'storeTimeBusiness' });
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
    sendOnceQuery(this.$store, 'storeTimeBusiness', 'tableStoreBusinessTimeParams', this.tableData, this.urlParams, 'storeBusinessTimeLoading');
    this.totalData = this.syncConfig.config;
    this.getShopIndex();
    if (this.userinfo['user_type'] === 'child_shop') {
      let len = this.totalData.length;
      for (let i = 0; i < len; i++) {
        if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-shop-machine') {
          this.totalData[i].size = 0.85;
        }
      }
    }
  },
  updated() {
    let l = this.totalData.length;
    this.totalData[l - 2].children[0].attrs['loading'] = this.storeBusinessTimeLoadingFlag;
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
          vm.$store.commit('info/setTableData', { response: null, dataName: 'tableStoreBusinessTime' });
        }
      }
      vm.titleArrayNum = 0;
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('info/setQueryLoading', { loadingFlag: 'storeBusinessTimeLoading', loading: false });
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
