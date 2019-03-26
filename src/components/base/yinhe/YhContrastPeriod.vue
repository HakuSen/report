<!--
  -----本期/上期时间(报表类型)
-->
<template>
  <div class="yh-typeDate">
    <yh-label :value="label[0]" :style="labelStyles" :alignment="labelAlign"/>
    <el-radio-group v-bind="attrs" v-model="typeData.radio" @change="changeData" @focus="changeEvent">
      <el-radio-button v-for="(item,key) in options" :label="item.value" :key="key">{{item.label}}</el-radio-button>
    </el-radio-group>
    <yh-label :value="label[1]" :style="labelStyles" :alignment="labelAlign" style="margin-left: 20px;"/>
    <yh-date-interval :ref="'datePick'" v-bind="attrs" :type="dateType" :defaultDateData="defaultDateData" :refreshDates="refreshDates" v-model="typeData.selfValue"/>
    <yh-label :value="label[2]" :style="labelStyles" :alignment="labelAlign" style="margin-left: 20px;"/>
    <yh-date-interval :ref="'datePicks'" v-bind="attrs" :type="dateType" :refreshDates="refreshDates" :defaultDateData="defaultDateData" v-model="typeData.selfValue2" @lastIntervalTime="getLastIntervalTime"/>
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
  name: 'YhTypeDate',
  components: {
    YhLabel,
    YhDateInterval
  },
  props: {
    attrs: {},
    label: Array,
    options: Array,
    value: Array,
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
        radio: this.attrs.type,
        selfValue: [],
        selfValue2: []
      },
      clearData: false,
      dateType: 'date',
      refreshDates: [], // 存刷新值
      defaultDateData: [] // 存切换默认值
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
    refreshFn() { // 刷新
      this.typeData.radio = baseFn.getDateType(this.queryParams['type']);
      let type = this.typeData.radio;
      this.dateType = type;
      let {
        start_date: start,
        end_date: end,
        last_start_date: last_start,
        last_end_date: last_end
      } = this.queryParams;
      if (type === 'date') {
        start = baseFn.refreshTime(start);
        end = baseFn.refreshTime(end);
        last_start = baseFn.refreshTime(last_start);
        last_end = baseFn.refreshTime(last_end);
        let current = [start, end];
        let period = [last_start, last_end];
        this.$refs.datePick.getTypeDefault(current);
        this.$refs.datePicks.getTypeDefault(period);
      }
      if (type === 'week') {
        start = baseFn.refreshDate(start, 1);
        end = baseFn.refreshDate(end, -5);
        last_start = baseFn.refreshDate(last_start, 1);
        last_end = baseFn.refreshDate(last_end, -5);
        let current = [start, end];
        let period = [last_start, last_end];
        this.$refs.datePick.getTypeDefault(current);
        this.$refs.datePicks.getTypeDefault(period);
      }
      if (type === 'month') {
        start = baseFn.refreshTime(start);
        end = new Date(end.split(' ')[0].substring(0, 7) + '-01 00:00:00');
        last_start = baseFn.refreshTime(last_start);
        last_end = new Date(last_end.split(' ')[0].substring(0, 7) + '-01 00:00:00');
        let current = [start, end];
        let period = [last_start, last_end];
        this.$refs.datePick.getTypeDefault(current);
        this.$refs.datePicks.getTypeDefault(period);
      }
    },
    // 之前是通过监听完成的数据双向，改为此方法
    getLastIntervalTime(val) {
      this.$emit('input', [this.typeData.radio, this.typeData.selfValue, val]);
    },
    changeData(val) { // 报表类型更改时改变默认值
      let value = baseFn.cutStr(val);
      this.dateType = value;
      if (value === 'date') {
        this.defaultDateData = [new Date(baseFn.todayUnix()), new Date(baseFn.todayUnix())];
      }
      if (value === 'week') {
        this.defaultDateData = [baseFn.showWeekFirstDay(), baseFn.showWeekLastDay()];
      }
      if (value === 'month') {
        this.defaultDateData = [baseFn.getCurrentMonthFirst(), baseFn.getCurrentMonthFirst()];
      }
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
  },
  watch: {
    value(val) { // 带日期类型的对比时间置空
      if (val.length === 0) {
        this.typeData.radio = 'date';
        this.dateType = 'date';
        this.defaultDateData = [new Date(baseFn.todayUnix()), new Date(baseFn.todayUnix()), 'date'];
        this.$emit('input', [this.typeData.radio, this.typeData.selfValue, this.typeData.selfValue2]);
      }
    },
    typeData: {
      handler() {
        this.$emit('input', [this.typeData.radio, this.typeData.selfValue, this.typeData.selfValue2]);
        // 处理时间间隔必须相等的操作，上期开始时间根据本期时间以及上期结束时间的改变而改变
        if (this.typeData.selfValue && this.typeData.selfValue.length > 0) {
          let interval = this.typeData.selfValue[3] - this.typeData.selfValue[2];
          this.$refs.datePicks.setInterval(this.typeData.selfValue2[3] - interval);
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
.yh-typeDate{
  display: flex;
  .el-select{
    margin-right: 8px;
  }
  .el-radio-group{
    display: flex;
    align-items: center;
  }
  .yh-label{
    flex: 0 0 70px;
  }
}
</style>
