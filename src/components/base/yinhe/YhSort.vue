<!----
  排序数量
---->
<template>
  <div class="yh-sort">
    <yh-label :value="label" :style="labelStyles" :alignment="labelAlign"/>
    <el-radio-group v-bind="attrs" v-model="typeData.radio">
      <el-radio-button v-for="(item,key) in options" :label="item.value" :key="key">{{item.label}}</el-radio-button>
    </el-radio-group>
    <el-radio-group v-model="typeData.rank" size="small">
      <el-radio-button label="desc">降序</el-radio-button>
      <el-radio-button label="asc">升序</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>

import Vue from 'vue';
import { Select, Option, RadioButton, RadioGroup } from 'element-ui';
import YhLabel from './indirectness-unit/YhLabel';
import Validator from './validator/Validator';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Select, Option, RadioButton, RadioGroup);
export default {
  name: 'YhSort',
  components: {
    YhLabel
  },
  props: {
    attrs: {},
    label: String,
    options: Array,
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
      typeData: {
        radio: '',
        rank: 'desc'
      },
      option: this.options
    };
  },
  computed: {
    labelStyles() {
      let stl = {};
      if (this.labelWidth) {
        stl.flex = `0 0 ${this.labelWidth}px`;
      }
      return stl;
    }
  },
  inheritAttrs: false,
  mounted() {
    if (JSON.stringify(this.queryParams) !== '{}' && this.queryParams !== undefined) { // 刷新时保留已选数据
      if (this.queryParams['buy_price_sort']) {
        this.typeData.radio = 'buy_price_sort';
        this.typeData.rank = this.queryParams['buy_price_sort'];
      }
      if (this.queryParams['buy_count_sort']) {
        this.typeData.radio = 'buy_count_sort';
        this.typeData.rank = this.queryParams['buy_count_sort'];
      }
    }
    else {
      this.typeData.radio = this.value[0];
    }
  },
  watch: {
    typeData: {
      handler() {
        this.$emit('input', [this.typeData.radio, this.typeData.rank]);
      },
      // 监听属性  的子属性变化
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.yh-sort{
  display: flex;
  .el-select{
    margin-right: 8px;
  }
  .el-radio-group{
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  .yh-label{
    flex: 0 0 70px;
  }
}
</style>
