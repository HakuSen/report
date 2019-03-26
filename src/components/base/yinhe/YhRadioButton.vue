<!----
  报表类型
---->
<template>
  <div class="yh-radioButton">
    <yh-label :value="label" :style="labelStyles" :alignment="labelAlign"/>
    <el-radio-group v-bind="attrs" v-on="$listeners" v-model="typeData.radio">
      <el-radio-button v-for="(item,key) in options" :label="item.value" :key="key">{{item.label}}</el-radio-button>
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
  name: 'YhRadioButton',
  components: {
    YhLabel
  },
  props: {
    attrs: {},
    label: String,
    options: Array,
    value: String,
    queryParams: Object,
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
        radio: ''
      }
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
    if (JSON.stringify(this.queryParams) !== '{}') {
      this.typeData.radio = this.queryParams['type'] + '';
    }
    else {
      this.typeData.radio = this.value;
    }
  },
  watch: {
    value() {
      this.typeData.radio = this.value;
    }
  }
};
</script>

<style lang="less" scoped>
.yh-radioButton{
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
