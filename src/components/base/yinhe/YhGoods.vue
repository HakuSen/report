<!--------------------------------------------------
  YhGoods.vue
  商品分类/类型（暂时隐藏）/名称 （每一项都包含单多选）
---------------------------------------------------->
<template>
  <div class="yh-goods">
    <!--分类-->
    <yh-label :value="label[0]" :style="labelStyles" :alignment="labelAlign"/>
    <!--分类多选-->
    <select-multiply v-if="classifyMulitiple" :ref="'classifyMultiply'" :multiplyData="classifyMultiplyData" :refreshData="classifyRefreshData" v-model="classifyCheckedVal"></select-multiply>
    <!--分类单选-->
    <select-choice v-else :listData="classifyDatas" v-model="selfVal.classifyVal" @change="changeVal(selfVal.classifyVal, 'classifyLabel', classifyDatas)" @focus="changeEvent" :filterStatus="true"></select-choice>
    <!--类型-->
    <div v-if="show">
      <yh-label :value="label[1]" :style="labelStyles" :alignment="labelAlign"/>
      <select-choice :listData="typeDatas" v-model="selfVal.typeVal" @change="changeVal(selfVal.typeVal, 'typeLabel', typeDatas)" @focus="changeEvent"></select-choice>
    </div>
    <!--名称-->
    <yh-label :value="label[2]" :style="labelStyles" :alignment="labelAlign"/>
    <!--单选-->
    <select-choice :listData="nameDatas" :filterStatus="true" v-model="nameVal" v-if="getSingle" @change="singleName" @focus="changeEvent"></select-choice>
    <!--名称多选-->
    <select-multiply-goods :ref="'multiply'" :multiplyData="multiplyData" :refreshData="refreshData" v-model="checkedVal" v-else></select-multiply-goods>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Vue from 'vue';
import YhLabel from './indirectness-unit/YhLabel';
import Validator from './validator/Validator';
import SelectMultiply from './functional-unit/selectMultiply';
import SelectMultiplyGoods from './functional-unit/selectMultiplyGoods';
import SelectChoice from './functional-unit/selectChoice';
import PathConf from '../../../conf/api.conf';

export default {
  name: 'YhGoods',
  components: {
    YhLabel,
    SelectMultiply,
    SelectMultiplyGoods,
    SelectChoice
  },
  props: {
    attrs: {},
    label: Array,
    options: Array,
    url: Array,
    getSingle: Boolean, // 商品是否单选
    classifyMulitiple: Boolean, // 分类是否单选
    show: Boolean, // 商品类型是否隐藏
    queryParams: Object,
    value: {
      type: Array
    },
    labelWidth: {
      type: Number,
      default: 70
    },
    labelAlign: {
      type: String,
      default: 'right',
      validator: Validator.optional(['left', 'center', 'right'])
    }
  },
  data() {
    return {
      selfVal: {
        classifyVal: '',
        typeVal: ''
      },
      nameVal: '',
      classifyDatas: [], // 分类
      typeDatas: [], // 类型
      nameDatas: [], // 名称单选
      classifyLabel: '全部',
      typeLabel: '全部',
      nameLabel: '',
      classifyMultiplyData: [], // 分类多选数据
      classifyRefreshData: [], // 分类刷新数据
      classifyCheckedVal: ['全部'], // 分类多选选中值
      multiplyData: [], // 多选数据
      refreshData: [], // 刷新数据
      checkedVal: [] // 多选选中值
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
    modelData() {
      //  let modelData = '';
      return this.$store.state.info.modelData;
    },
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    })
  },
  methods: {
    // 分类/类型API
    getPropertyType() {
      let params = {
        service_id: this.userinfo.service_id ? this.userinfo.service_id : ''
      };
      if (this.userinfo['user_type'] && this.userinfo['user_type'] === 'child_shop') {
        params.shopper_id = this.userinfo['parent_id'];
      }
      else {
        params.shopper_id = this.userinfo.shopper_id;
      }
      // 分类
      Vue.$api.post({ getway: PathConf.goods.$getway, api: this.url[0] }, params).then(response => {
        if (this.classifyMulitiple) {
          this.classifyMultiplyData = response.data.data.list;
        }
        else {
          this.classifyDatas = response.data.data.list;
          let all = {
            id: '',
            name: '全部'
          };
          this.classifyDatas.unshift(all);
        }
      });
      // 类型
      Vue.$api.post({ getway: PathConf.goods.$getway, api: this.url[1] }).then(response => {
        this.typeDatas = response.data.data;
        let all = {
          id: '',
          name: '全部'
        };
        this.typeDatas.unshift(all);
      });
    },
    // 商品名称api
    getSingleType(classId, typeId) {
      if (classId === '') {
        classId = null;
      }
      if (typeId === '') {
        typeId = null;
      }
      let params = {};
      if (this.classifyMulitiple && this.classifyCheckedVal && this.classifyCheckedVal.length > 0 && this.classifyCheckedVal[0] !== '全部') {
        params.category_ids = this.classifyCheckedVal;
      }
      else {
        params.category_id = classId;
      }
      params.name_like = this.$store.state.info.modelData || '';
      if (this.userinfo['user_type'] && this.userinfo['user_type'] === 'child_shop') {
        params.shopper_id = this.userinfo['parent_id'];
      }
      else {
        params.shopper_id = this.userinfo.shopper_id;
      }
      if (typeId === '1') {
        params.is_package = 0;
        params.is_weight = 0;
      }
      else if (typeId === '2') {
        params.is_package = 0;
        params.is_weight = 1;
      }
      else if (typeId === '3') {
        params.is_package = 1;
        params.is_weight = 0;
      }
      else { // 全部
        params.is_package = '';
        params.is_weight = '';
      }
      Vue.$api.post({ getway: PathConf.goods.$getway, api: this.url[2] }, params).then(response => {
        if (this.getSingle) {
          this.nameDatas = response.data.data;
        }
        else {
          this.multiplyData = response.data.data;
        }
      });
    },
    // 分类/类型v-modole值改变的时候触发的事件(拿到label重新请求单选api)
    changeVal(val, labelName, selectData) {
      if (val === '') {
        this[labelName] = '全部';
      }
      selectData.find(item => {
        if (String(item.id) === val) {
          this[labelName] = item.name;
        }
        return false;
      });
      this.getSingleType(this.selfVal.classifyVal, this.selfVal.typeVal);
      if (this.getSingle === false) {
        this.$refs.multiply.clearChecked();
      }
    },
    // 名称单选时改变值时获取其label
    singleName(val) {
      this.nameDatas.find(item => {
        if (String(item.id) === val) {
          this.nameLabel = item.name;
        }
        return false;
      });
    },
    getTransData() {
      if (this.queryParams['goods_id'] && this.getSingle === false) { // goods_id拿到的是以逗号分割的字符串
        this.queryParams['goods_id'] = String(this.queryParams['goods_id']).split(',');
      }
      this.getTypeRefresh('category_id', 'size_type_num', 'goods_id');
    },
    getTypeRefresh(classify, type, name) {
      if (this.queryParams[classify]) {
        this.selfVal.classifyVal = this.queryParams[classify];
      }
      if (this.queryParams[type]) {
        this.selfVal.typeVal = this.queryParams[type];
      }
      if (this.queryParams[name]) {
        if (this.getSingle === false) {
          this.refreshData = this.queryParams[name].map(Number);
        }
        else {
          this.nameVal = this.queryParams[name];
        }
      }
      else { // 属性
        this.refreshData = [];
      }
    },
    // 触发时调用父组件事件
    changeEvent() {
      if (!this.getSingle || this.classifyMulitiple) {
        this.$emit('parentFn');
      }
    },
    // 属性名称组件点击空白处下拉框消失
    haveSelect() {
      if (!this.getSingle) {
        this.$refs.multiply.haveSelect();
      }
      if (this.classifyMulitiple) {
        this.$refs['classifyMultiply'].haveSelect();
      }
    }
  },
  inheritAttrs: false,
  created() {
    // 刷新数据
    if (JSON.stringify(this.queryParams) !== '{}' && this.queryParams !== undefined) { // 刷新时保留已选数据
      this.getTransData();
    }
  },
  mounted() {
    // 页面加载时拿到分类/类型/名称的下拉数据
    this.getPropertyType();
    this.getSingleType(this.selfVal.classifyVal, this.selfVal.typeVal);
  },
  watch: {
    value(val) {
      if (val.length === 0 && !this.getSingle) { // 分类和名称都为多选重置
        this.$refs['classifyMultiply'].clearChecked();
        this.classifyCheckedVal = ['全部'];
      }
      if (val.length === 0 && this.getSingle) { // 分类和名称都为单选重置
        this.selfVal.classifyVal = '';
        this.nameVal = '';
        this.classifyLabel = '全部';
        this.nameLabel = '';
        this.getSingleType(this.selfVal.classifyVal, this.selfVal.typeVal);
      }
    },
    getSingle() {
      // 页面加载时拿到分类/类型/名称的下拉数据
      this.getPropertyType();
      this.getSingleType(this.selfVal.classifyVal, this.selfVal.typeVal);
    },
    modelData() {
      this.getSingleType(this.selfVal.classifyVal, this.selfVal.typeVal);
    },
    selfVal: {
      handler() {
        if (this.getSingle) {
          // 单选框时需要传导给父页面的数据
          if (this.queryParams && this.queryParams['prop_ids']) { // 刷新时商品名称存在则显示
            this.nameVal = this.queryParams['prop_ids'];
          }
          else {
            this.nameVal = '';
          }
          this.$emit('input', [this.selfVal.classifyVal, this.selfVal.typeVal, this.nameVal, [this.classifyLabel, this.typeLabel, this.nameLabel]]);
        }
        else {
          // 多选框时需要传导给父页面的数据
          this.$emit('input', [this.selfVal.classifyVal, this.selfVal.typeVal, ['全部']]);
        }
        if (this.classifyMulitiple) {
          this.$emit('input', [['全部'], this.selfVal.typeVal, ['全部']]);
        }
      },
      // 监听属性  的子属性变化
      deep: true,
      immediate: true
    },
    // 监听单选商品名称改变时传导给父页面数据
    nameVal() {
      this.$emit('input', [this.selfVal.classifyVal, this.selfVal.typeVal, this.nameVal, [this.classifyLabel, this.typeLabel, this.nameLabel]]);
    },
    checkedVal(curVal) {
      if (!this.classifyMulitiple) {
        if (curVal.length === 0) {
          this.$emit('input', [this.selfVal.classifyVal, this.selfVal.typeVal, ['全部']]);
        }
        else {
          this.$emit('input', [this.selfVal.classifyVal, this.selfVal.typeVal, curVal]);
        }
      }
      if (this.classifyMulitiple) {
        if (curVal.length === 0) {
          this.$emit('input', [this.classifyCheckedVal, this.selfVal.typeVal, ['全部']]);
        }
        else {
          this.$emit('input', [this.classifyCheckedVal, this.selfVal.typeVal, curVal]);
        }
      }
    },
    classifyCheckedVal(val) {
      if (val.length === 0 || val.length === this.classifyMultiplyData.length) {
        this.$emit('input', [['全部'], this.selfVal.typeVal, ['全部']]);
      }
      else {
        this.$emit('input', [val, this.selfVal.typeVal, ['全部']]);
      }
      this.getSingleType(this.selfVal.classifyVal, this.selfVal.typeVal);
      if (this.getSingle === false) {
        this.$refs.multiply.clearChecked();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.yh-goods{
  display: flex;

  > *{
    flex: 1;
  }

  .yh-label{
    flex: 0 0 70px;
  }
  .el-select{
    margin-right: 20px;
  }
  .yh-select-multiply{
    margin-right: 20px !important;
  }
}
</style>
<style lang="less">
.hold-style{
  .el-input{
    input::-webkit-input-placeholder{
      color: #606266;
    }
    input::-moz-placeholder{ /* Mozilla Firefox 19+ */
      color: #606266;
    }
    input:-moz-placeholder{ /* Mozilla Firefox 4 to 18 */
      color: #606266;
    }
    input:-ms-input-placeholder{ /* Internet Explorer 10-11 */
      color: #606266;
    }
  }
}
</style>
