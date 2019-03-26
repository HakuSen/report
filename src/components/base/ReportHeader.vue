<template>
  <div class="collect"><!--统计的头部-->
    <notification :status="'2'" v-if="notiShow" @show="show"></notification>
    <div class="subtotal-title">
      <h2>{{paramsData.contentText}}
        <Help v-if="helpShow" :contentMessage="contentMessage"/>
        <span v-if="paramsData.contentShow">（{{typeDateCH(everyTableParams.type)}}报表）</span>
        <span v-if="paramsData.contentShopShow">（店铺-{{typeDateCH(everyTableParams.type)}}）</span>
      </h2>
      <el-button class="btnOut" type="primary" @click="submitHandler" style="float: right; padding: 3px 0" :loading="collectLoading">
        <span style="margin-right:6px"><i class="el-icon-download" v-if="!collectLoading"></i></span>导出表格
      </el-button>
    </div>
    <div class="statistics">
      <div>
        <!--门店商品销售统计中日和月显示特殊处理-->
      <span class="statistics-date" v-if="paramsData.contentText === '门店商品销售统计'">
        统计日期：<span v-if="everyTableParams.year_month">{{ everyTableParams.year_month}}</span>
        <span v-else>{{ showTimeTxt }}</span>
      </span>

      <span class="statistics-date" v-if="statisticalDate">
        统计日期：<span v-if="isShowTime">{{ showTimeTxt }}</span>
      </span>

      <span class="current-period" v-if="lastAndNewShow">
        本期：<span v-if="isShowTime">{{ showTimeTxt }}</span>
      </span>

      <span class="last-period" v-if="lastAndNewShow">
        上期：<span v-if="isShowLastTime">{{showLastTimeTxt}}</span>
      </span>

      <span class="statistics-shop" v-if="paramsData.shopShowFlag && formData.shop.length > 0">
        统计店铺：<span v-if="formData.shop && formData.shop[0] !== '全部'"><span v-if="Array.isArray(formData['shop'][0])">1家</span><span v-else>{{formData.shop.length}}家</span></span>
        <span v-if="formData.shop && formData.shop[0] === '全部'">全部</span>
      </span>
      <span class="statistics-shop" v-if="paramsData.shopNodeFlag">
        统计店铺：<span v-if="formData['orgShop'] && formData['orgShop'][2]">{{formData['orgShop'][2]}}家</span>
      </span>
        <!--当店铺为1家时显示店铺名称-->
        <span class="statistics-shop" v-if="oneShop && formData['shop'] && formData['shop'][0] && Array.isArray(formData['shop'][0])">
          店铺名称：<span>{{formData['shop'][1]}}</span>
        </span>
        <span class="statistics-shop" v-if="oneShop && formData['orgShop'] && formData['orgShop'][4]">
          店铺名称：<span>{{formData['orgShop'][4]}}</span>
        </span>

      <span v-if="orderTypeShow" class="order-type">订单类型：{{ setOrderType(everyTableParams.order_type) }}</span>
        <span v-if="paramsData.machineShow" class="order-type">
          机器选择：<span v-if="formData['shopMachine'][1] && formData['shopMachine'][1] !== ''">{{ formData['shopMachine'][1].split(';')[1] }}</span>
          <span v-else>全部</span>
        </span>
        <!--<span v-if="paramsData.orgMachineShow" class="order-type">机器选择：<span v-if="formData['orgShop'][3] && formData['orgShop'][3] !== ''">{{ formData['orgShop'][3].split(';')[1] }}</span><span v-else>全部</span></span>-->
        <span v-if="paramsData.employeesShow" class="order-type">
          员工选择：<span v-if="formData['shopMachine'][2] && formData['shopMachine'][2] !== ''">{{ formData['shopMachine'][2] }}
            </span><span v-else>全部</span>
        </span>
      <span v-if="formData.property && goodsPropShow" class="goods-prop">统计属性：{{formData.property[3][0]}}</span>
      <span v-if="formData.property && goodsPropShow" class="goods-prop">业务类型：{{formData.property[3][1]}}</span>
      <span v-if="formData.property && goodsPropShow" class="goods-prop">属性名称：{{formData.property[3][2]}}</span>

      <span v-if="formData.property && goodsSaleShow" class="goods-sale">商品分类：{{formData.property[3][0]}}</span>
      <span v-if="formData.property && goodsSaleShow" class="goods-sale">商品类型：{{formData.property[3][1]}}</span>
      <span v-if="formData.property && goodsSaleShow" class="goods-sale">商品名称：{{formData.property[3][2]}}</span>
      <span v-if="goodsSaleTimeShow" class="goods-sale">对比周期：{{typeDateCH(everyTableParams.type)}}</span>
      <a class="totle-header" @click="totleShow" href="javascript:;" v-if="paramsData.totleShowFlag">{{ totleShowMagge
        }}<i :class="totleFlag ? 'arrow-icon-down' : 'arrow-icon'"></i></a>
      <el-collapse-transition>
        <div class="totle-show" v-if="totleFlag">
          <ul class="totle__box" v-if="totleData">
            <li class="totle__first__child totle__same">
              <p :key="index" v-for="(item, index) in totleData[0]"><i class="same__font">{{index}}</i><i class="same__color">¥{{item}}</i></p>
            </li>
            <li class="totle__second__child totle__same">
              <p class="totle__second__child__title same__font">营业数据</p>
              <p :key="index" v-for="(item1, index) in totleData[1]" class="width__same">
                <span class="same__font__style">{{index}}:<i class="same_left"></i><i v-if="String(index).indexOf('数') === -1">¥</i><i>{{item1}}</i></span>
              </p>
            </li>
            <li class="totle__second__child totle__third__child totle__same">
              <p class="totle__second__child__title same__font">收款构成</p>
              <p :key="index" v-for="(item2, index) in totleData[2]" class="width__same">
                <span class="same__font__style">{{index}}:<i class="same_left">¥</i><i>{{item2}}</i></span>
              </p>
            </li>
            <li class="totle__second__child totle__same totle__last__child">
              <p class="totle__second__child__title same__font">优惠组成</p>
              <p :key="index" v-for="(item2, index) in totleData[3]" class="width__same">
                <span class="same__font__style">{{index}}:<i class="same_left">¥</i><i>{{item2}}</i></span>
              </p>
            </li>
          </ul>
          <div class="totle__no__show" v-else>
            <span>暂无数据</span>
          </div>
        </div>
      </el-collapse-transition>
      </div>
      <rank-num v-if="paramsData.showRankNum" :attrs="attrs" :options="option" v-model="rankData" @changeData="getChangeData"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Vue from 'vue';
import { Button } from 'element-ui';
import 'element-ui/lib/theme-chalk/base.css';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import { BlobFile, MIME } from 'vue-simple';
import Help from './Help';
import PathConf from '../../conf/api.conf';
import RankNum from './yinhe/YhRankNum';
import Notification from './Notification';
import SimpleVue from '../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.batch.use(Button);
export default {
  name: 'ReportHeader',
  components: {
    Help,
    Notification,
    RankNum
  },
  props: {
    totleData: Array,
    paramsData: {
      shop: Array,
      contentText: String,
      contentShow: Boolean,
      shopShowFlag: Boolean,
      shopNodeFlag: Boolean,
      tableName: String,
      totleShowFlag: Boolean,
      showRankNum: Boolean
    },
    everyTableParams: Object,
    formData: Object
  },
  data() {
    return {
      contentMessage: ['', ''],
      totleShowMagge: '隐藏统计',
      totleFlag: false,
      orderTypeShow: false,
      statisticalDate: false,
      goodsPropShow: false,
      goodsSaleShow: false,
      goodsSaleTimeShow: false,
      lastAndNewShow: false,
      collectLoading: false,
      helpShow: false,
      orderTypeShowArray: [ // 订单类型显示的页面
        '营业汇总',
        '门店营业汇总',
        '门店营业汇总报表',
        '营收统计',
        '门店营收统计',
        '门店营收报表',
        '优惠统计',
        '门店优惠统计',
        '门店优惠报表',
        '退款统计',
        '门店退款统计',
        '门店退款报表',
        '商品销售规格属性分析',
        '商品销售排行',
        '分类销售排行',
        '时段指标分析',
        '时段对比分析',
        '商品销售综合分析'
      ],
      oneShopShow: [
        '商品销售排行（总排行）',
        '商品销售排行（组织排行）',
        '分类销售排行（总排行）',
        '分类销售排行（明细排行）',
        '分类销售排行（组织排行）',
        '商品综合分析 （报表）',
        '商品规格分析'

      ],
      oneShop: false,
      ifDownloadList: false, // 下载时走下载清单
      notiShow: false,
      downloadListArray: [ // 下载时走下载清单页面
        '营业汇总报表',
        '营业汇总(按时间)',
        '营业汇总(按门店)'
      ],
      rankData: '20', // top排行点击拿到的值
      option: [
        { label: 'top20', value: '20' },
        { label: 'top50', value: '50' },
        { label: 'top100', value: '100' },
        { label: '全部', value: null }
      ],
      attrs: {
        size: 'mini',
        type: this.paramsData.contentText
      }
    };
  },
  computed: {
    showTimeTxt() {
      return this.everyTableParams['start_date'].substr(0, 10).replace(/\-/g, '/') + '~' + this.everyTableParams['end_date'].substr(0, 10).replace(/\-/g, '/');
    },
    showLastTimeTxt() {
      return this.everyTableParams['last_start_date'].substr(0, 10).replace(/\-/g, '/') + '~' + this.everyTableParams['last_end_date'].substr(0, 10).replace(/\-/g, '/');
    },
    isShowTime() {
      return String(this.everyTableParams['start_date']).indexOf('NaN') === -1 && String(this.everyTableParams['end_date']).indexOf('NaN') === -1 && String(this.everyTableParams['start_date']).indexOf('1970') === -1 && String(this.everyTableParams['end_date']).indexOf('1970') === -1;
    },
    isShowLastTime() {
      return String(this.everyTableParams['last_start_date']).indexOf('NaN') === -1 && String(this.everyTableParams['last_end_date']).indexOf('NaN') === -1 && String(this.everyTableParams['last_start_date']).indexOf('1970') === -1 && String(this.everyTableParams['last_end_date']).indexOf('1970') === -1;
    },
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    })
  },
  methods: {
    getChangeData(val) {
      if (val === '') {
        val = null;
      }
      this.$parent.getRankNum(val);
    },
    totleShow() {
      this.totleFlag = !this.totleFlag;
      if (this.totleFlag) {
        this.totleShowMagge = '显示统计';
      }
      else {
        this.totleShowMagge = '隐藏统计';
      }
    },
    show(val) {
      this.notiShow = val;
    },
    setOrderType(val) {
      if (val === '0') {
        return '堂食';
      }
      else if (val === '1') {
        return '外卖';
      }
      return '全部';
    },
    typeDateCH(typeDate) {
      if (typeDate === 1 || typeDate === 4) {
        return '日';
      }
      else if (typeDate === 2 || typeDate === 5) {
        return '周';
      }
      else if (typeDate === 3 || typeDate === 6) {
        return '月';
      }
      return '';
    },
    // 导出
    submitHandler() {
      let params = this.everyTableParams;
      this.collectLoading = true;
      params['download'] = 1;
      if (this.ifDownloadList) {
        // 是否是营业报表 是 就走异步导出  is_sync =1
        params['is_sync'] = 1;
        this.notiShow = true;
        let that = this;
        Vue.$api.post({ getway: PathConf.report.$getway, api: PathConf.report[this.paramsData.url] }, params, {
          responseType: 'blob',
          headers: {
            token: this.userinfo.token,
            invoke_source: '2200'
          }
        }).then(() => {
          setTimeout(() => {
            that.notiShow = false;
            that.collectLoading = false;
          }, 5000);
        });
        return;
      }
      Vue.$api.post({ getway: PathConf.report.$getway, api: PathConf.report[this.paramsData.url] }, params, {
        responseType: 'blob',
        headers: {
          token: this.userinfo.token,
          invoke_source: '2200'
        }
      }).then(res => {
        const file = new BlobFile({
          data: res.data,
          filename: this.paramsData.contentText,
          mime: MIME.xls,
          endings: 'native'
        });
        file.download();
        file.destory();
        this.collectLoading = false;
      });
    }
  },
  mounted() {
    // 营业汇总三个页面走下载清单
    if (this.downloadListArray) {
      if (JSON.stringify(this.downloadListArray).indexOf(String(this.paramsData.contentText)) !== -1) {
        this.ifDownloadList = true;
      }
      else {
        this.ifDownloadList = false;
      }
    }
    // 订单类型是否展示
    if (this.orderTypeShowArray) {
      if (JSON.stringify(this.orderTypeShowArray).indexOf(String(this.paramsData.contentText)) !== -1) {
        this.orderTypeShow = true;
      }
      else {
        this.orderTypeShow = false;
      }
    }
    if (JSON.stringify(this.oneShopShow).indexOf(String(this.paramsData.contentText)) !== -1) {
      this.oneShop = true;
    }
    if (this.paramsData.contentText === '门店商品销售统计') {
      this.lastAndNewShow = false;
      this.statisticalDate = false;
      this.helpShow = true;
      this.contentMessage[0] = '商品单价为当前登录帐号设置的该商品单价，每个子门店商品销售单价会根据实际情况存在差异，因此该值值仅供参考';
      this.contentMessage[1] = '';
    }
    else {
      this.statisticalDate = true;
    }
    // 统计日期在商品销售对比分析页没有
    if (this.paramsData.contentText === '商品销售对比分析') {
      this.statisticalDate = false;
    }
    if (this.paramsData.contentText === '会员卡统计报表（会员）') {
      this.statisticalDate = false;
    }
    if (this.paramsData.contentText === '门店商品销售对比分析') {
      this.statisticalDate = false;
      this.lastAndNewShow = true;
    }
    if (this.paramsData.contentText === '时段对比分析') {
      this.statisticalDate = false;
      this.lastAndNewShow = true;
      this.helpShow = true;
      this.contentMessage[0] = '1.单均消费流水=营业金额/开台单数';
      this.contentMessage[1] = '2.单均消费实收=实收金额/结账单数';
    }
    if (this.paramsData.contentText === '时段指标分析') {
      this.helpShow = true;
      this.contentMessage[0] = '1.单均消费流水=营业金额/开台单数';
      this.contentMessage[1] = '2.单均消费实收=实收金额/结账单数';
    }
    if (this.paramsData.contentText === '商品销售综合分析') {
      this.helpShow = true;
      this.contentMessage[0] = '退菜金额：商品退菜的售价总和';
    }
    // 商品属性门店销售分析页展示商品属性信息
    if (this.paramsData.contentText === '商品属性门店销售分析') {
      this.goodsPropShow = true;
    }
    // 商品属性门店销售分析展示商品属性信息
    if (this.paramsData.contentText && String(this.paramsData.contentText).indexOf('商品销售对比分析') !== -1) {
      this.goodsSaleShow = true;
    }
    if (this.paramsData.contentText === '商品销售对比分析') {
      this.goodsSaleTimeShow = true;
    }
  },
  created() {
    if (JSON.stringify(this.downloadListArray).indexOf(String(this.paramsData.contentText)) !== -1) {
      this.totleFlag = true;
    }
    else {
      this.totleFlag = false;
    }
  }
};
</script>
<style lang="less">
.collect{
  .subtotal-title{
    display: flex;
    justify-content: space-between;
    padding-bottom: 18px;
    border-bottom: 1px solid rgb(213, 213, 213);
    h2{
      font-size: 18px;
    }
  }
  .statistics{
    padding: 20px 0 14px 0;
    font-size: 14px;
    line-height: 14px;
    display: flex;
    justify-content: space-between;
    color: #222222;
    .statistics-shop, .statistics-date, .order-type, .goods-sale, .goods-prop, .last-period, .current-period{
      display: inline-block;
      border-left: 3px solid #0a96ff;
      margin: 10px 50px 10px 0;
      text-indent: 11px;
    }
    .totle-header{
      font-size: 14px;
      color: #0a96ff;
      text-decoration: none;
      position: relative;
      .arrow-icon{
        top: 8px;
        left: 65px;
        font-size: 7px;
        width: 7px;
        height: 7px;
        position: absolute;
        border-left: 1px solid #0a96ff;
        border-bottom: 1px solid #0a96ff;
        -webkit-transform: translate(0, -50%) rotate(-135deg);
        transform: translate(0, -50%) rotate(-50deg);
      }
      .arrow-icon-down{
        top: 12px;
        left: 65px;
        font-size: 7px;
        width: 7px;
        height: 7px;
        position: absolute;
        border-left: 1px solid #0a96ff;
        border-bottom: 1px solid #0a96ff;
        -webkit-transform: translate(0, -50%) rotate(-135deg);
        transform: translate(0, -50%) rotate(-225deg);
      }
    }
    .totle-show{
      transition: all 1s;
      width: 100%;
      height: 143px;
      position: relative;
      i{
        font-style: normal;
      }
      .totle__box{
        height: 100%;
        width: 100%;
        display: flex;
        border: 1px solid #ccc;
        .totle__first__child{
          padding: 20px;
          align-content: space-between;
          p{
            display: flex;
            width: 50%;
            height: 38px;
            flex-direction: column;
            justify-content: space-between;
          }
          p:first-child{
            font-weight: 400;
          }
        }
        .totle__second__child{
          width: 278px;
          padding: 10px 12px;
          .totle__second__child__title{
            width: 100%;
            height: 14px;
            margin-bottom: 17px;
          }
          .width__same{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            min-width: 50%;
            .same__font__style{
              display: inline-block;
              font-size: 16px;
              color: #888;
              i{
                color: #343434;
                font-size: 16px;
              }
            }
          }
        }
        .totle__last__child{
          border: 0 !important;
        }
        .same_left{
          margin-left: 8px;
        }
        .totle__same{
          display: flex;
          flex-wrap: wrap;
          overflow: auto;
          width: 25%;
          border-right: 1px solid #ccc;
        }
        .same__font{
          margin-bottom: 14px;
          font-size: 18px;
          font-weight: 900
        }
        .same__color{
          color: #fc7131;
          font-size: 18px;
        }
        .totle__third__child{
          p:last-child{
            position: absolute;
            bottom: -1px;
            width: 23%;
            height: 26px;
            border-top: 1px dashed #ccc;
            background: #fff;
            margin: 0;
            min-width: 0;
          }
        }
      }
      .totle__no__show{
        height: 100%;
        width: 100%;
        font-size: 14px;
        font-weight: 500;
        color: #343434;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
