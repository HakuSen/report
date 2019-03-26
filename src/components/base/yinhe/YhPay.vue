<!--------------------------------------------------
  Yhpay.vue
  支付方式&&商品分类
---------------------------------------------------->
<template>
  <div class="yh-pay">
    <yh-label :value="label" :style="labelStyles" :alignment="labelAlign"/>
    <select-multiply :ref="'multiply'" :multiplyData="multiplyData" :refreshData="refreshData" v-model="checkedVal" :propertyInput="isFilter ? '未选择过滤商品' : '全部'"></select-multiply>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Vue from 'vue';
import { Checkbox } from 'element-ui';
import YhLabel from './indirectness-unit/YhLabel';
import Validator from './validator/Validator';
import SelectMultiply from './functional-unit/selectMultiply';
import SimpleVue from '../../../plugins/SimpleVue';
import PathConf from '../../../conf/api.conf';

Vue.use(SimpleVue);
Vue.batch.use(Checkbox);
export default {
  name: 'YhPay',
  components: {
    YhLabel,
    SelectMultiply
  },
  props: {
    label: String,
    options: Array,
    url: String,
    value: Array,
    isGoods: Boolean, // 表示多选商品
    isClient: Boolean, // 表示客户
    isVoucher: Boolean, // 表示卡券名称
    isFilter: Boolean, // 过滤项目
    queryParams: Object,
    labelWidth: {
      type: Number,
      default: 70
    },
    labelAlign: {
      type: String,
      default: 'right',
      validator: Validator.optional(['left', 'center', 'right'])
    },
    attrs: {}
  },
  data() {
    return {
      multiplyData: [], // 多选数据
      checkedVal: [], // v-model
      refreshData: [], // 刷新数据
      ary: [] // 卡券名称全选或者不选的时候id集合
    };
  },
  computed: {
    labelStyles() {
      let stl = {};
      if (this.labelWidth) {
        stl.flex = `0 0 ${this.labelWidth}px`;
      }
      return stl;
    },
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    })
  },
  inheritAttrs: false,
  methods: {
    urlData() { // 初始数据
      this.$emit('input', ['全部']);
      if (this.options && this.options.length > 0) {
        this.multiplyData = this.options;
      }
      else if (this.url !== '') {
        let pathWay = this.isGoods ? PathConf.goods.$getway : PathConf.config.$getway;
        if (this.isClient) {
          pathWay = PathConf.shop.$getway;
        }
        let params = { shopper_id: this.userinfo['shopper_id'], service_id: this.userinfo['service_id'] ? this.userinfo['service_id'] : '' };
        if (this.isGoods) {
          params.shopper_id = null;
        }
        if (this.isVoucher) {
          params.shopper_pid = this.userinfo['user_type'] === 'child_shop' ? this.userinfo['parent_id'] : this.userinfo['shopper_id'];
          // params.shopper_pid = 669520;
          params.pay_model_list = [1008];
        }
        if (this.isFilter) {
          pathWay = PathConf.goods.$getway;
        }
        Vue.$api.post({ getway: pathWay, api: this.url }, params).then(response => {
          let data;
          if (this.isGoods) {
            data = response.data.data.list;
          }
          else if (this.isFilter) {
            data = response.data;
          }
          else {
            data = response.data['data'];
          }
          data.forEach(item => { // 将接口请求到的字段转换成组件接收的字段名（prop_value -> id）
            let payObj = {
              id: item['prop_value'] || item['uuid'] || item['id'] || item['pay_code'],
              name: item['descript'] || item['name'] || item['company_name']
            };
            this.multiplyData.push(payObj);
            this.ary.push(payObj.id);
          });
          if (this.ary.length > 0 && this.isVoucher) {
            this.$emit('input', this.ary);
          }
          else if (this.isVoucher && this.ary.length === 0) {
            this.$emit('input', ['全部']); // data为空时
          }
          if (this.isFilter) {
            this.$emit('input', []);
          }
        });
      }
    },
    refreshFn() {
      if (JSON.stringify(this.queryParams) !== '{}' && this.queryParams['pay_model_list'] && this.queryParams !== undefined) {
        if (this.queryParams['category_id']) { // 商品分类
          this.refreshData = this.queryParams['category_id'];
        }
        if (this.queryParams['pay_model_list']) { // 支付方式
          this.refreshData = this.queryParams['pay_model_list'];
        }
      }
    },
    // 属性名称组件点击空白处下拉框消失
    haveSelect() {
      this.$refs.multiply.haveSelect();
    }
  },
  mounted() {
    this.urlData();
    this.refreshFn();
  },
  watch: {
    value(val) {
      if (val.length === 0) { // 重置
        this.checkedVal = [];
        this.$refs.multiply.clearChecked(); // 清除并赋默认值
      }
    },
    checkedVal(curVal) {
      if (curVal.length === 0 || curVal.length === this.multiplyData.length) {
        this.$emit('input', ['全部']);
      }
      else {
        this.$emit('input', curVal);
      }
      if (this.isVoucher) { // 卡券名称选全部的时候必须全部传过去
        if (curVal.length !== 0) {
          this.$emit('input', curVal);
        }
        else {
          this.$emit('input', this.ary);
        }
      }
      if (this.isFilter) { // 过滤商品
        if (curVal.length === 0) {
          this.$emit('input', ['全部']);
        }
        else if (curVal.length === this.multiplyData.length) {
          this.$emit('input', this.ary);
        }
        else {
          this.$emit('input', curVal);
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
::-webkit-scrollbar{ width: 0 !important }

.el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
  background-color: #fff;
}

.yh-pay{
  position: relative;
  display: flex;

  > *{
    flex: 1;
  }

  .yh-label{
    flex: 0 0 70px;
  }
  .el-icon-arrow-down{
    line-height: 30px;
    margin-right: 5px;
    color: #ccc;
  }
  .input-box{
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: #c0c4cc;
    padding-left: 12px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    span{
      line-height: 30px;
      color: #606266;
      font-size: 14px;
    }
  }

  .difference{
    position: absolute;
    left: 158px;
    border: 1px solid #90939980;
    border-radius: 100%;
    width: 10px;
    height: 10px;
    top: 14px;
    line-height: 10px;
    text-align: center;
    background: #909399bf;
    color: #ffffff;
  }
  .checkbox{
    box-sizing: border-box;
    /*火狐兼容*/
    max-height: 274px !important;
    border: 1px solid #eaeaea;
    position: absolute;
    min-width: 100%;
    height: auto;
    z-index: 999;
    margin-top: 2px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    background: #fff;
    border-radius: 3px;
    overflow-y: scroll;
    overflow-x: hidden;
    left: 0;
    padding: 10px;
    top: 40px;
  }
  .cut{
    position: absolute;
    left: 65px;
    top: 39px;
    z-index: 9999;
    background-color: #fff;
    width: 5px;
    height: 5px;
    border: #eaeaea solid 1px;
    border-left: 0;
    border-bottom: 0;
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
}
</style>
