<!----
  报表类型(只有日月)+日期选择
---->
<template>
  <div class="yh-typeDate">
    <yh-label :value="label[0]" :style="labelStyles" :alignment="labelAlign"/>
    <el-radio-group v-bind="attrs" v-model="typeData.radio" @change="changeData" @focus="changeEvent">
      <el-radio-button v-for="(item,key) in options" :label="item.value" :key="key">{{item.label}}</el-radio-button>
    </el-radio-group>
    <yh-label :value="label[1]" :style="labelStyles" :alignment="labelAlign"/>
    <yh-date-interval v-if="isDate" :ref="'datePick'" v-bind="attrs" :type="dateType" :refreshDate="refreshDates" :defaultDateData="defaultDateData" v-model="typeData.selfValue"/>
    <el-date-picker
      v-else
      :clearable="false"
      size="small"
      v-model="typeData.dateWidget"
      :type="dateType"
      :placeholder="dateTypeTxt"
      :picker-options="pickerOptions"
      @change="getDateType"
      style="width:150px;">
    </el-date-picker>
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
      isDate: true,
      typeData: {
        radio: 'date',
        selfValue: [],
        dateWidget: new Date()
      },
      initial: false,
      dateType: 'date',
      refreshDates: [], // 存刷新值
      defaultDateData: [], // 存切换默认值
      dateTypeTxt: '选择月',
      pickerOptions: { // 时间范围限制
        disabledDate(time) {
          return time.getTime() > new Date();
        }
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
  methods: {
    refreshFn() {
      let {
        start_date: start,
        end_date: end
      } = this.queryParams;
      this.typeData.radio = baseFn.getDateType(this.queryParams['type']);
      let value = baseFn.cutStr(this.typeData.radio);
      this.dateType = value;
      if (value === 'date') {
        start = baseFn.refreshTime(start);
        end = baseFn.refreshTime(end);
        this.refreshDates = [start, end];
      }
      if (value === 'week') {
        start = baseFn.refreshDate(start, 1);
        end = baseFn.refreshDate(end, -5);
        this.refreshDates = [start, end];
      }
    },
    // 报表类型更改时更改时间空间默认值
    changeData(val) {
      val = baseFn.cutStr(val);
      this.dateType = val; // 根据切换的类型更改type类型
      if (val === 'date') {
        this.isDate = true;
        this.defaultDateData = [new Date(baseFn.todayUnix()), new Date(baseFn.todayUnix())];
      }
      if (val === 'week') {
        this.defaultDateData = [baseFn.showWeekFirstDay(), baseFn.showWeekLastDay()];
      }
      if (val === 'month') { // 类型为月的时候
        this.typeData.dateWidget = new Date();
        this.isDate = false;
        let time = new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1);
        this.$emit('input', [this.typeData.radio, time]);
      }
    },
    getDateType(val) {
      let time = val.getFullYear() + '-' + (val.getMonth() + 1 < 10 ? '0' + (val.getMonth() + 1) : val.getMonth() + 1)
      this.$emit('input', [this.typeData.radio, time]);
    },
    computeDate(sIndexDate = 0, eIndexDate = 0) {
      return [new Date(baseFn.todayUnix() + 86400000 * sIndexDate), new Date(baseFn.todayUnix() + 86400000 * eIndexDate)];
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
    else {
      this.typeData.radio = this.attrs.type;
    }
  },
  watch: {
    value(val) { // 重置
      if (val.length === 0) {
        this.typeData.radio = 'date';
        this.changeData('date');
      }
    },
    typeData: {
      handler() {
        if (this.isDate) {
          this.$emit('input', [this.typeData.radio, this.typeData.selfValue]);
        }
      },
      // 监听属性  的子属性变化
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
    margin-right: 20px;
  }
  .yh-label{
    flex: 0 0 70px;
  }
  .el-select{
    margin-left: 20px;
  }
}
</style>
