<!-------------------------
  电子交易对账
 ----------------------- -->
<template>
  <div class="income" @click="closePayList" v-loading.fullscreen.lock="fullscreenLoading">
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
       <warn-text :message="message"/>
      <Table :tableAllData="tableData" :queryParams="tableParams" :tableShowParams="needParams" :tableQueryParams="everyTableParams" @tableShow="tableShow" :loadingFlag="electronicLoadingFlag" :tableFlag="tableFlag" :loadingName="'electronicLoading'" :newPageing="newPageingParams" :formData="formData" :surchargeNameList="surchargeNameList" @dialogEvent="dialogChanges"></Table>
    </div>
    <yh-dialog
      title="订单明细"
      width="60%"
      :visible="dialogShow"
      @close="closeDialog()"
      @open="openDialog()"
      center
      append-to-body
    >
    <p style="font-size:14px;color: #f55041;text-align:left;margin-bottom:5px">口碑支付宝和口碑微信只支持按订单号在商家中心查询</p>
      <surcharBaseTable :surchargeList="surchargeList" :surchargeName="surchargeName" :dialogMassage="dialogMassage" :surcharParams="surcharParams" :surchargeNameList="surchargeNameList"/>
    </yh-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Vue from 'vue';
import PathConf from '../../../conf/api.conf';
import baseFn from '../../../utils/baseFunction';
import YhLayoutItem from '../../../components/base/yinhe/YhLayoutItem';
import YhSelect from '../../../components/base/yinhe/YhSelect';
import YhButton from '../../../components/base/yinhe/functional-unit/YhButton';
import YhShopChoice from '../../../components/base/yinhe/YhShopChoice';
import YhTypeDate from '../../../components/base/yinhe/YhTypeDate';
import CheckboxGroup from '../../../components/base/yinhe/functional-unit/checkboxGroup';
import Table from '../../../components/base/table/Table';
import WarnText from '../../../components/base/WarnText';
import YhDialog from '../../../components/base/yinhe/dialog/YhDialog';
import SurcharBaseTable from '../../../components/base/table/SurcharBaseTable';
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
  name: 'ElectronicTrading',
  components: {
    YhSelect,
    YhButton,
    YhLayoutItem,
    YhShopChoice,
    Table,
    YhTypeDate,
    CheckboxGroup,
    WarnText,
    SurcharBaseTable,
    YhDialog
  },
  data() {
    return {
      fullscreenLoading: false,
      surchargeList: {
        table_data: [],
        table_config: []
      }, // 弹窗数据
      surchargeName: 'electronicDetailList',
      surchargeNameList: ['操作'],
      dialogMassage: '订单明细',
      dialogShow: false, // dialog控制显示隐藏
      dialogMassageName: '',
      surcharParams: {},
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
        contentText: '电子交易对账',
        contentShopShow: false, // 是否显示店铺-日周月报表
        contentShow: false, // 是否显示日周月报表
        totleShowFlag: false, // 是否显示统计
        mergeTextArray: ['', ''],
        shopShowFlag: true,
        shopNodeFlag: false
      },
      tableFlag: false,
      message: '注意：单笔订单可能会存在多笔电子交易记录。口碑支付宝和口碑微信的数据可从消费订单中进行查询。',
      newPageingParams: {},
      pageNum: 0,
      totalData: [],
      urlParams: {
        interfaceAddress: 'getelectronicList',
        dataName: 'electronic'
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
      tableData: State => State.info.electronic,
      tableParams: State => State.info.params.electronic.electronicNewParams,
      needTimes: State => State.info.needTime,
      titleArray: State => State.info.titleArray,
      ifNewTitleArray: State => State.info.ifNewTitleArray,
      everyTableParams: State => State.info.params.electronic.electronicParams,
      electronicLoadingFlag: State => State.info.electronicLoading
    }),
    syncConfig() {
      return {
        key: 'two',
        width: LayoutWidthBase,
        config: [
          {
            name: 'yh-layout-item',
            size: 2.7,
            children: [
              {
                name: 'yh-type-date',
                label: ['报表类型：', '报表日期：'],
                fieldName: 'typedate',
                value: [],
                options: [
                  { label: '日', value: 'date' },
                  { label: '周', value: 'week' },
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
            size: 0.3,
            children: [
              {
                name: 'yh-button',
                label: '查询',
                action: 'submit',
                attrs: {
                  type: 'primary',
                  size: ComponentSize,
                  loading: this.electronicLoadingFlag
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
    openDialog() {
    },
    closeDialog() {
      this.dialogShow = false;
      this.everyTableParams['download'] = '';
    },
    // 弹窗组件
    dialogChanges({ row, column }) {
      this.everyTableParams['page_num'] = 1;
      this.everyTableParams['is_sync'] = 1;
      if (row['shopperId'] && row['dateType'] || row['weekForHuman']) {
        this.everyTableParams.shopper_id = row['shopperId'];
        this.everyTableParams.shopper_id_list = [row['shopperId']];
        if (row['dateType'] && this.everyTableParams['type'] === 1) {
          this.everyTableParams.start_date = row['dateType'].replace(/\//g, '-') + ' 00:00:00';
          this.everyTableParams.end_date = row['dateType'].replace(/\//g, '-') + ' 23:59:59';
        }
        else if (row['weekForHuman']) {
          let arr = row['weekForHuman'].split('~');
          this.everyTableParams.start_date = arr[0].replace(/\//g, '-') + ' 00:00:00';
          this.everyTableParams.end_date = arr[1].replace(/\//g, '-') + ' 23:59:59';
        }
        else if (row['dateType'] && this.everyTableParams['type'] === 3) {
          let monArr = row['dateType'].split('/');
          this.everyTableParams.start_date = baseFn.getLastDay(Number(monArr[0]), Number(monArr[1]))[0];
          this.everyTableParams.end_date = baseFn.getLastDay(Number(monArr[0]), Number(monArr[1]))[1];
        }
        this.everyTableParams.page_size = 10000;
        this.surcharParams = this.everyTableParams;
        if (column['label'].indexOf('操作') !== -1) {
          this.fullscreenLoading = true;
          Vue.$api.post({ getway: PathConf.report.$getway, api: PathConf.report[this.surchargeName] }, this.everyTableParams).then(res => {
            this.surchargeList = res.data || [];
            if (res) {
              this.fullscreenLoading = false;
              this.dialogShow = true;
              this.surchargeLoading = false;
            }
          }).catch(() => {
            this.dialogShow = true;
            this.surchargeLoading = false;
          });
          // 该方法属于打开dialog时可以进行其他操作
          this.openDialog();
        }
      }
      else {
        this.dialogShow = false;
      }
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
      this.$store.commit('info/setQueryLoading', { loadingFlag: 'electronicLoading', loading: true });
      let params = setQueryParams(this.formData, this.$store);
      let { start_date, end_date } = setQueryTimeAddTail(this.formData);
      params['start_date'] = start_date;
      params['end_date'] = end_date;
      alertQueryConditionWrong(params, this.$store, this.urlParams, ['electronicLoading', 'electronicParams',
        'electronic']);
      let newParams = {
        url: 'getelectronicList',
        tableData: 'electronic',
        pageingFlag: ++this.pageNum
      };
      this.newPageingParams = newParams;
      this.$store.dispatch('info/getParams', { newParams, oneTableName: 'electronicNewParams', newParamsName: 'electronic' });
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
    // 判断子店铺时 reportHeader 中的 店铺不显示
    if (this.userinfo['user_type'] === 'child_shop') {
      this.needParams['shopShowFlag'] = false;
    }
  },
  mounted() {
    // 判断子店铺时 reportHeader 中的 店铺不显示
    if (this.userinfo['user_type'] === 'child_shop') {
      this.needParams['shopShowFlag'] = false;
    }
    sendOnceQuery(this.$store, 'electronic', 'electronicParams', this.tableData, this.urlParams, 'electronicLoading');
    this.totalData = this.syncConfig.config;
    this.getShopIndex();
  },
  updated() {
    let l = this.totalData.length;
    this.totalData[l - 2].children[0].attrs['loading'] = this.electronicLoadingFlag;
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
          vm.$store.commit('info/setTableData', { response: null, dataName: 'electronic' });
        }
      }
      vm.titleArrayNum = 0;
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('info/setQueryLoading', { loadingFlag: 'electronicLoading', loading: false });
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
