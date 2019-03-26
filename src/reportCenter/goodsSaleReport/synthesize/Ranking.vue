<!-------------------------
  商品销售排行
 ----------------------- -->
<template>
  <div class="income" @click="closePayList" v-loading.fullscreen.lock="fullscreenLoading">
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
      </div>
    </el-card>
    <div class="table-warp" style="background: #fff;">
      <warn-text v-if="isWarn" :message="message"/>
      <base-table :tableAllData="tableData" :queryParams="tableParams" :tableShowParams="needParams" :tableQueryParams="everyTableParams" @tableShow="tableShow" :loadingFlag="goodsRankingsLoadingFlag" :loadingName="'goodsRankingsLoading'" :tableFlag="tableFlag" :newPageing="newPageingParams" :formData="formData" :surchargeNameList="surchargeNameList" @dialogEvent="dialogChanges" @getSortChange="getSortChange"/>
    </div>
     <yh-dialog
      :title="dialogMassageName"
      width="60%"
      :visible="dialogShow"
      @close="closeDialog()"
      @open="openDialog()"
      center
      append-to-body
    >
      <p style="font-size:14px;color: #f55041;text-align:center;margin-bottom:20px">附加费统计仅支持智能POS4.0.5.3、智能POS6.0.0.4、手持POS1.3.9、智能ERP
        1.0.3.0以上版本查看，此外版本的客户端该数据仅供参考</p>
      <surcharBaseTable :surchargeList="surchargeList" :surchargeName="surchargeName" :dialogMassage="dialogMassage" :surcharParams="surcharParams"/>
    </yh-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Vue from 'vue';
import PathConf from '../../../conf/api.conf';
import YhLayoutItem from '../../../components/base/yinhe/YhLayoutItem';
import YhSelect from '../../../components/base/yinhe/YhSelect';
import YhButton from '../../../components/base/yinhe/functional-unit/YhButton';
import CheckboxGroup from '../../../components/base/yinhe/functional-unit/checkboxGroup';
import YhShopChoice from '../../../components/base/yinhe/YhShopChoice';
import BaseTable from '../../../components/base/table/BaseTable';
import WarnText from '../../../components/base/WarnText';
import YhDatePicker from '../../../components/base/yinhe/YhDatePicker';
import YhRadioButton from '../../../components/base/yinhe/YhRadioButton';
import YhSort from '../../../components/base/yinhe/YhSort';
import YhGoods from '../../../components/base/yinhe/YhGoods';
import YhOrgShop from '../../../components/base/yinhe/YhOrgShop';
import YhPay from '../../../components/base/yinhe/YhPay';
import YhRankNum from '../../../components/base/yinhe/YhRankNum';
import YhDialog from '../../../components/base/yinhe/dialog/YhDialog';
import SurcharBaseTable from '../../../components/base/table/SurcharBaseTable';
import setQueryParams from '../../../utils/setQueryParams';
import notShowShop from '../../../utils/notShowShop';
import dropdownBoxBack from '../../../utils/dropdownBoxBack';
import alertQueryConditionWrong from '../../../utils/alertQueryConditionWrong';
import sendOnceQuery from '../../../utils/sendOnceQuery';
import setQueryTimeAddTail from '../../../utils/setQueryTimeAddTail';
import serverIdHiddenGoods from '../../../utils/serverIdHiddenGoods';
import showReportType from '../../../utils/showReportType';
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
  name: 'Ranking',
  mixins: [mixinsReport],
  components: {
    YhSelect,
    YhButton,
    YhLayoutItem,
    YhShopChoice,
    YhPay,
    BaseTable,
    YhDatePicker,
    YhRadioButton,
    YhSort,
    YhOrgShop,
    CheckboxGroup,
    YhRankNum,
    WarnText,
    YhGoods,
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
      surchargeName: 'getGoodsSaleRankingTotleList',
      surchargeNameList: ['附加费'],
      dialogMassage: '',
      dialogMassageName: '',
      dialogShow: false, // dialog控制显示隐藏
      surcharParams: {},
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
        contentText: '商品销售排行（总排行）',
        contentShopShow: false, // 是否显示店铺-日周月报表
        contentShow: false, // 是否显示日周月报表
        shopShowFlag: true,
        mergeTextArray: ['', ''],
        slotFlag: false, // 是否显示hover
        showRankNum: true // 是否显示排行数量
      },
      pageNum: 0, // 用来判断是直接请求还是分页请求
      tableFlag: false,
      newPageingParams: {},
      totalData: [],
      orderTypeIsAll: true,
      hasGoodsParams: true,
      urlParams: {
        interfaceAddress: 'getGoodsSaleRankingList',
        dataName: 'tableGoodsRankings'
      }, // 接口请求 方法映射
      shopSingle: false,
      message: '请务必保证外卖平台与堂食的“商品名称”，“规格”，“属性”完全一致，否则外卖商品无法与堂食商品合并统计！',
      // isWarn: false,
      singleName: false,
      rankNum: '20'
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
      tableData: State => State.info.tableGoodsRankings,
      tableParams: State => State.info.params.goodsRankings.goodsRankingsNewParams,
      needTimes: State => State.info.needTime,
      titleArray: State => State.info.titleArray,
      ifNewTitleArray: State => State.info.ifNewTitleArray,
      everyTableParams: State => State.info.params.goodsRankings.goodsRankingsParams,
      goodsRankingsLoadingFlag: State => State.info.goodsRankingsLoading
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
                  { label: '总排行', value: '1' },
                  { label: '组织排行', value: '2' }
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
            size: 0.5,
            children: [
              {
                name: 'checkbox-group',
                label: '',
                fieldName: 'checkGroup',
                value: [],
                options: [
                  { label: '拆分套餐商品', value: '1' }
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
                  loading: this.incomeLoadingFlag
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
      let detailInfo = JSON.parse(sessionStorage.getItem('vuex')).info.params.goodsRankings.goodsRankingsParams;
      this.getDetailDudge(column, detailInfo);
    },
    tableShow(val) {
      this.tableFlag = val;
    },
    openDialog() {
    },
    closeDialog() {
      this.dialogShow = false;
      this.everyTableParams['download'] = '';
    },
    dialogChanges({ row, column }) {
      this.everyTableParams['page_num'] = 1;
      this.everyTableParams.page_size = 10000;
      this.everyTableParams['is_sync'] = 1;
      const dialogAjax = {
        附加费: {
          url: 'getGoodsSaleRankingTotleList',
          title: '附加费明细'
        }
      };
      if (!dialogAjax[column['label']]) {
        return;
      }
      const { url, title } = dialogAjax[column['label']];
      if (url) {
        this.everyTableParams.goods_name = row['goodsName'];
        if (String(row['row_id']).indexOf('合计') !== -1) {
          if (this.userinfo.user_type === 'child_shop') {
            this.everyTableParams.shopper_id_list = [this.userinfo.shopper_id];
          }
          else {
            this.everyTableParams.shopper_id_list = this.formData.shop[0] === '全部' ? null : this.formData.shop;
          }
        }
        this.surcharParams = this.everyTableParams;
        this.dialogMassageName = title;
        this.dialogMassage = title;
        this.fullscreenLoading = true;
        Vue.$api.post({ getway: PathConf.report.$getway, api: PathConf.report[url] }, this.surcharParams).then(res => {
          this.surchargeList = res.data || [];
          if (res) {
            this.fullscreenLoading = false;
            this.dialogShow = true;
            this.surchargeLoading = false;
          }
        }).catch(() => {
          this.dialogShow = true;
        });
        // 该方法属于打开dialog时可以进行其他操作
        this.openDialog();
      }
    },
    // 返回循环组件中为店铺选择的index
    getShopIndex() {
      notShowShop(this.totalData, this.userinfo);
    },
    // 解决支付方式原生下拉框无法回弹bug(点击空白处收起下拉框)
    closePayList() {
      dropdownBoxBack(this.totalData, this.$refs, ['yh-pay', 'yh-property', 'yh-goods']);
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
    submitHandler(buy, rank, rankNum = 20) {
      this.tableFlag = false;
      this.$store.commit('info/setQueryLoading', { loadingFlag: 'goodsRankingsLoading', loading: true });
      // params 公用部分提出
      let params = setQueryParams(this.formData, this.$store);
      let { start_date, end_date } = setQueryTimeAddTail(this.formData);
      params['start_date'] = start_date;
      params['end_date'] = end_date;
      if (this.formData['checkGroup'].length > 0) {
        params['is_contain_package'] = 1;
      }
      else {
        params['is_contain_package'] = 0;
      }
      if (this.formData.source[0] === '全部') {
        params['outer_support_ids'] = [];
      }
      else {
        params['outer_support_ids'] = this.formData.source;
      }
      let nowData = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      let nowMonth = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
      let nowHours = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
      let nowMinutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
      let nowSeconds = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
      let myDate = new Date().getFullYear() + '-' + nowMonth + '-' + nowData;
      let todayTime = nowHours + ':' + nowMinutes + ':' + nowSeconds;
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
      params['type'] = this.$store.getters['tokenInfo/userinfo']['type'] === 'SERVICE' ? 1 : Number(this.formData['tableType']); // 临时修复服务商登录
      if (this.formData['shop'] && this.formData['shop'][0] && Array.isArray(this.formData['shop'][0])) {
        params.shopper_id_list = this.formData.shop[0];
      }
      params[buy] = rank;
      if (this.hasGoodsParams) {
        // if (this.formData.property[0] !== '') {
        //   params['category_id'] = this.formData.property[0];
        // }
        if (this.formData.property[0].length > 0 && this.formData.property[0][0] !== '全部') {
          params['category_ids'] = this.formData.property[0];
        }
        // if (this.formData.property[1] !== '') {
        //   params['size_type_num'] = this.formData.property[1];
        // }
        if (this.formData.property[2].length > 0 && this.formData.property[2][0] !== '全部') {
          params['goods_id'] = typeof (this.formData.property[2]) === 'string'
            ? this.formData.property[2]
            : String(this.formData.property[2].join(','));
        }
        else if (this.singleName && this.formData.property[2][0] === '全部' || this.formData.property[2] === '') {
          params['goods_id'] = '';
        }
        else {
          params['goods_id'] = null;
        }
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
        url: 'getGoodsSaleRankingList',
        tableData: 'tableGoodsRankings',
        pageingFlag: ++this.pageNum
      };
      this.newPageingParams = newParams;
      this.$store.dispatch('info/getParams', { newParams, oneTableName: 'goodsRankingsNewParams', newParamsName: 'goodsRankings' });
      if (this.formData) {
        this.$store.dispatch('info/formData', this.formData);
      }
      /*
       * 如果时间有空，不查询接口
       * */
      alertQueryConditionWrong(params, this.$store, this.urlParams, ['goodsRankingsLoading', 'goodsRankingsParams', 'goodsRankings']);
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
    sendOnceQuery(this.$store, 'goodsRankings', 'goodsRankingsParams', this.tableData, this.urlParams, 'goodsRankingsLoading');
    this.totalData = this.syncConfig.config;
    // 判断店铺是否显示
    this.getShopIndex();
    serverIdHiddenGoods(this.totalData, this.userinfo['service_id']);
    // 服务商登录临时隐藏报表类型
    showReportType(this.totalData, this.$store);
    this.hasGoodsParams = !this.userinfo['service_id'];
  },
  updated() {
    let len = this.totalData.length;
    this.totalData[len - 2].children[0].attrs['loading'] = this.goodsRankingsLoadingFlag;
    if (this.formData && this.formData['tableType'] === '2') {
      this.shopSingle = true;
      this.needParams.contentText = '商品销售排行（组织排行）';
    }
    else if (this.formData && this.formData['tableType'] === '1') {
      this.shopSingle = false;
      this.needParams.contentText = '商品销售排行（总排行）';
    }
  },
  watch: {
    shopSingle(val) {
      let len = this.totalData.length;
      if (val) {
        this.singleName = true;
        for (let i = 0; i < len; i++) {
          if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-goods') {
            this.totalData.splice(i, 1, {
              name: 'yh-layout-item',
              size: 1.7,
              children: [
                {
                  name: 'yh-goods',
                  getSingle: true, // 单选时为true，多选时为false
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
            });
            break;
          }
        }
        for (let i = 0; i < len; i++) {
          if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-org-shop') {
            break;
          }
          else if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-shop-choice') {
            this.formData.shop = [];
            this.totalData.splice(i, 1, {
              name: 'yh-layout-item',
              size: 1.7,
              children: [
                {
                  name: 'yh-org-shop',
                  label: ['组织类别：', '店铺选择：'],
                  fieldName: 'orgShop',
                  value: [],
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
        this.singleName = false;
        for (let i = 0; i < len; i++) {
          if (this.totalData[i].children && this.totalData[i].children[0].name === 'yh-goods') {
            this.totalData.splice(i, 1, {
              name: 'yh-layout-item',
              size: 1.7,
              children: [
                {
                  name: 'yh-goods',
                  getSingle: false, // 单选时为true，多选时为false
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
            });
            break;
          }
        }
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
          vm.$store.commit('info/setTableData', { response: null, dataName: 'tableGoodsRankings' });
        }
      }
      vm.titleArrayNum = 0;
      if (from.fullPath === '/frame/home') {
        vm.$store.commit('info/setTableData', { response: null, dataName: 'tableGoodsRankings' });
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('info/setQueryLoading', { loadingFlag: 'goodsRankingsLoading', loading: false });
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

