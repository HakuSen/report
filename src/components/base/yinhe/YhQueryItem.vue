<!--------------------------------------------------
  查询项
---------------------------------------------------->
<template>
  <div class="yh-query-item" :ref="'yselect'">
    <yh-label :value="label" :style="labelStyles" :alignment="labelAlign"/>
    <el-select v-bind="attrs" size="small" v-model="queryValue.checkedVal" @change="queryNape">
      <el-option
        v-for="(item,key) in listData"
        :key="key"
        :label="item.label"
        :value="item.id + ''"
        :disabled="item.disabled">
      </el-option>
    </el-select>
    <el-input v-model="queryValue.nape" :type="styleType" size="small" :placeholder="'请输入'+napeVal" clearable></el-input>
  </div>
</template>

<script>
import Vue from 'vue';
import { Select, Option } from 'element-ui';
import YhLabel from './indirectness-unit/YhLabel';
import Validator from './validator/Validator';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Select, Option);
export default {
  name: 'YhQueryItem',
  components: {
    YhLabel
  },
  props: {
    queryParams: Object,
    attrs: Object,
    options: Array,
    label: String,
    url: String,
    value: Array,
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
      listData: [
        { label: '用户名', id: 'userName' },
        { label: '手机号码', id: 'mobile' },
        { label: '物理卡号', id: 'cardId' }
      ],
      queryValue: {
        checkedVal: 'userName',
        nape: ''
      },
      napeVal: '用户名',
      styleType: 'text'
    };
  },
  inheritAttrs: false,
  computed: {
    labelStyles() {
      let stl = {};

      if (this.labelWidth) {
        stl.flex = `0 0 ${this.labelWidth}px`;
      }

      return stl;
    }
  },
  methods: {
    refreshData() {
      if (this.queryParams['member_info']) {
        this.queryValue.checkedVal = this.queryParams['member_info'];
      }
      else {
        this.queryValue.checkedVal = 'userName';
      }
      if (this.queryParams['member_info_value']) {
        this.queryValue.nape = this.queryParams['member_info_value'];
      }
      else {
        this.queryValue.nape = '';
      }
    },
    queryNape(val) {
      this.listData.find(item => {
        if (String(item.id) === val) {
          this.napeVal = item.label;
        }
        return false;
      });
      this.queryValue.nape = '';
      if (val === 'mobile') {
        this.styleType = 'number';
      }
      else {
        this.styleType = 'text';
      }
    }
  },
  mounted() {
    this.refreshData();
  },
  watch: {
    value(val) {
      if (val.length === 0) { // 重置
        this.queryValue.checkedVal = 'userName';
        this.queryValue.nape = '';
        this.napeVal = '用户名';
        this.styleType = 'text';
      }
    },
    queryValue: {
      handler(val) {
        this.$emit('input', [val.checkedVal, val.nape]);
      },
      // 监听属性  的子属性变化
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.yh-query-item{
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
<style lang="less">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
input[type="number"]{
  -moz-appearance: textfield;
}
</style>
