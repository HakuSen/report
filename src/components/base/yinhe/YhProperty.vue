<!--------------------------------------------------
  YhProperty.vue
  属性分类/类型/名称
---------------------------------------------------->
<template>
  <div class="yh-property">
    <yh-label :value="label[0]" :style="labelStyles" :alignment="labelAlign"/>
    <!--分类-->
    <select-choice :listData="classifyDatas" v-model="selfVal.classifyVal" @change="changeVal(selfVal.classifyVal, 'classifyLabel', classifyDatas)" @focus="changeEvent" :filterStatus="true"></select-choice>
    <div v-if="typeShow">
      <yh-label :value="label[1]" :style="labelStyles" :alignment="labelAlign"/>
      <!--类型-->
      <select-choice :listData="typeDatas" v-model="selfVal.typeVal" @change="changeVal(selfVal.typeVal, 'typeLabel', typeDatas)" @focus="changeEvent"></select-choice>
    </div>
    <yh-label :value="label[2]" :style="labelStyles" :alignment="labelAlign"/>
    <!--名称单选-->
    <select-choice :listData="nameDatas" :filterStatus="true" v-model="nameVal" v-if="getSingle" @change="singleName"></select-choice>
    <!--名称多选 请选择默认不选-->
    <select-multiply :ref="'multiply'" :isCheckAll="checkAll" :propertyInput="inputVal" :multiplyData="multiplyData" :refreshData="refreshData" v-model="checkedVal" v-else></select-multiply>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Vue from 'vue';
import YhLabel from './indirectness-unit/YhLabel';
import Validator from './validator/Validator';
import SelectMultiply from './functional-unit/selectMultiply';
import SelectChoice from './functional-unit/selectChoice';
import PathConf from '../../../conf/api.conf';

export default {
  name: 'YhProperty',
  components: {
    YhLabel,
    SelectMultiply,
    SelectChoice
  },
  props: {
    attrs: {},
    label: Array,
    options: Array,
    url: Array,
    getSingle: Boolean,
    typeShow: Boolean,
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
      multiplyData: [], // 多选数据
      refreshData: [], // 刷新数据
      checkedVal: [], // 多选选中值
      inputVal: '全部',
      checkAll: false
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
  methods: {
    // 分类/类型API
    getPropertyType() {
      this.selfVal.classifyVal = '';
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
        this.classifyDatas = response.data.data;
        let all = {
          id: '',
          name: '全部'
        };
        this.classifyDatas.unshift(all);
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
      if (this.userinfo['user_type'] && this.userinfo['user_type'] === 'child_shop') {
        params.shopper_id = this.userinfo['parent_id'];
      }
      else {
        params.shopper_id = this.userinfo.shopper_id;
      }
      params.class_id = classId;
      params.type_id = typeId;
      Vue.$api.post({ getway: PathConf.goods.$getway, api: this.url[2] }, params).then(response => {
        if (this.getSingle) {
          this.nameDatas = response.data.data;
        }
        else {
          this.multiplyData = response.data.data || [];
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
    getTypeRefresh(classify, type, name) {
      if (this.queryParams[classify]) {
        this.selfVal.classifyVal = this.queryParams[classify];
      }
      if (this.queryParams[type]) {
        this.selfVal.typeVal = this.queryParams[type];
      }
      if (this.queryParams[name]) {
        if (this.getSingle === false) {
          this.refreshData = this.queryParams[name];
        }
        else {
          this.nameVal = this.queryParams[name];
        }
      }
      else { // 名称刷新字段不存在时表示全选
        this.refreshData = [];
        this.checkAll = true; // 全选
      }
    },
    // 触发时调用父组件事件
    changeEvent() {
      if (this.getSingle === false) {
        this.$emit('parentFn');
      }
    },
    // 属性名称组件点击空白处下拉框消失
    haveSelect() {
      if (!this.getSingle) {
        this.$refs.multiply.haveSelect();
      }
    },
    // INPUT
    toFatherData(multiply) {
      this.$emit('input', [this.selfVal.classifyVal, this.selfVal.typeVal, multiply]);
    }
  },
  inheritAttrs: false,
  created() {
    // 刷新数据
    if (JSON.stringify(this.queryParams) !== '{}' && this.queryParams !== undefined) { // 刷新时保留已选数据
      this.getTypeRefresh('prop_class_id', 'prop_type_id', 'prop_ids');
    }
  },
  mounted() {
    // 页面加载时拿到分类/类型/名称的下拉数据
    this.getPropertyType();
    this.getSingleType(this.selfVal.classifyVal, this.selfVal.typeVal);
  },
  watch: {
    value(val) {
      if (val.length === 0 && !this.getSingle) {
        this.selfVal.classifyVal = '';
        this.$refs.multiply.clearChecked();
        this.getSingleType(this.selfVal.classifyVal, this.selfVal.typeVal);
      }
      if (val.length === 0 && this.getSingle) { // 分类和名称都为单选重置
        this.selfVal.classifyVal = '';
        this.nameVal = '';
        this.classifyLabel = '全部';
        this.nameLabel = '';
        this.getSingleType(this.selfVal.classifyVal, this.selfVal.typeVal);
      }
    },
    selfVal: {
      handler() {
        if (this.getSingle) {
          // 单选框时需要传导给父页面的数据
          this.nameVal = '';
          if (this.queryParams && this.queryParams['prop_id']) { // 刷新时商品名称存在则显示
            this.nameVal = this.queryParams['prop_id'];
          }
          this.$emit('input', [this.selfVal.classifyVal, this.selfVal.typeVal, this.nameVal, [this.classifyLabel, this.typeLabel, this.nameLabel]]);
        }
        else {
          // 多选框时需要传导给父页面的数据
          this.toFatherData(['全部']);
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
      if (curVal.length === 0) {
        this.toFatherData(['全部']);
      }
      else if (curVal.length === this.multiplyData.length) {
        this.toFatherData(['全部']);
      }
      else {
        this.toFatherData(curVal);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.yh-property{
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
}
</style>

