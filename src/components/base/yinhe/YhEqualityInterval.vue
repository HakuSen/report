<!--
  -----本期/上期时间（日）
-->
<template>
  <div class="yh-equalityInterval">
    <yh-label :value="label[0]" :style="labelStyles" :alignment="labelAlign"/>
    <yh-date-interval :ref="'datePick'" v-bind="attrs" type="date" :refreshDates="refreshDates" :defaultDateData="defaultDateData" v-model="typeData.selfValue"/>
    <yh-label :value="label[1]" :style="labelStyles" :alignment="labelAlign" style="margin-left: 20px;"/>
    <yh-date-interval :ref="'datePicks'" v-bind="attrs" type="date" :refreshDates="refreshDates" :defaultDateData="defaultDateData" v-model="typeData.lastSelfValue" @lastIntervalTime="getLastIntervalTime"/>
  </div>
</template>

<script>

import Vue from 'vue';
import { Select, Option, RadioButton, RadioGroup } from 'element-ui';
import YhLabel from './indirectness-unit/YhLabel';
import YhDateInterval from './functional-unit/date-picker/YhDateInterval';
import Validator from './validator/Validator';
import baseFn from '../../../utils/baseFunction';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Select, Option, RadioButton, RadioGroup);
export default {
  name: 'YhEqualityInterval',
  components: {
    YhLabel,
    YhDateInterval
  },
  props: {
    queryParams: Object,
    attrs: {},
    label: Array,
    options: Array,
    value: Array,
    lastDefault: Boolean,
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
        selfValue: [],
        lastSelfValue: []
      },
      clearData: false,
      refreshDates: [],
      defaultDateData: []
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
  methods: {
    refreshFn() {
      let {
        start_date: start,
        end_date: end,
        last_start_date: last_start,
        last_end_date: last_end
      } = this.queryParams;
      start = baseFn.refreshTime(start);
      end = baseFn.refreshTime(end);
      last_start = baseFn.refreshTime(last_start);
      last_end = baseFn.refreshTime(last_end);
      let current = [start, end, 'date'];
      let period = [last_start, last_end, 'date'];
      this.$refs.datePick.getTypeDefault(current);
      this.$refs.datePicks.getTypeDefault(period);
    },
    getLastIntervalTime(val) {
      this.$emit('input', [this.typeData.selfValue, val]);
    },
    // 报表类型触发时调用父组件事件
    changeEvent() {
      this.$emit('parentFn');
    }
  },
  inheritAttrs: false,
  mounted() {
    if (JSON.stringify(this.queryParams) !== '{}') { // refresh
      this.refreshFn();
    }
    if (this.lastDefault) { // 默认昨天
      this.defaultDateData = [new Date(baseFn.lastDayUnix()), new Date(baseFn.lastDayUnix()), 'date'];
      this.$emit('input', [this.typeData.selfValue, this.typeData.lastSelfValue]);
    }
  },
  watch: {
    value(val) { // 重置
      if (val.length === 0) {
        this.clearData = true;
      }
      else {
        this.clearData = false;
      }
    },
    clearData(val) {
      if (val === true) {
        // 默认数据
        this.defaultDateData = [new Date(baseFn.todayUnix()), new Date(baseFn.todayUnix()), 'date'];
        this.$emit('input', [this.typeData.selfValue, this.typeData.lastSelfValue]);
      }
    },
    typeData: {
      handler() {
        this.$emit('input', [this.typeData.selfValue, this.typeData.lastSelfValue]);
        // 处理时间间隔必须相等的操作，上期开始时间根据本期时间以及上期结束时间的改变而改变
        if (this.typeData.selfValue && this.typeData.selfValue.length > 0) {
          let interval = this.typeData.selfValue[3] - this.typeData.selfValue[2];
          this.$refs.datePicks.setInterval(this.typeData.lastSelfValue[3] - interval);
        }
      },
      // 监听属性的子属性变化
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.yh-equalityInterval{
  display: flex;
  .yh-label{
    flex: 0 0 70px;
  }
}
</style>
