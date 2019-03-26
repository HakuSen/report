<!--------------------------------------------------
  快速查看日期
---------------------------------------------------->
<template>
  <div class="yh-quickLook">
    <yh-label :value="label[0]" :style="labelStyles" :alignment="labelAlign"/>
    <yh-date-interval class="date_interval" :ref="'datePick'" v-bind="attrs" type="date" :defaultDateData="defaultDateData" :refreshDate="refreshDates" :quick="quickLook" @clear="clearQuickLook" v-model="typeData.selfValue"/>
    <yh-label :value="label[1]" :style="labelStyles" :alignment="labelAlign"/>
    <el-radio-group v-bind="attrs" v-model="typeData.radio" @change="changeDate" @focus="changeEvent">
      <el-radio-button v-for="(item,key) in options" :label="item.value" :key="key">{{item.label}}</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>

import Vue from 'vue';
import { Select, Option, RadioButton, RadioGroup, MessageBox } from 'element-ui';
import YhLabel from './indirectness-unit/YhLabel';
import YhDateInterval from './functional-unit/date-picker/YhDateInterval';
import Validator from './validator/Validator';
import baseFn from '../../../utils/baseFunction';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Select, Option, RadioButton, RadioGroup);
export default {
  name: 'YhQuickLook',
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
        selfValue: []
      },
      quickLook: true,
      resetDate: false,
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
    refreshFn() {
      this.typeData.radio = '';
      let {
        start_date: start,
        end_date: end
      } = this.queryParams;
      start = baseFn.refreshTime(start);
      end = baseFn.refreshTime(end);
      this.refreshDates = [start, end];
    },
    // 报表类型更改
    changeDate(val) {
      if (val === '1') { // 昨天
        this.defaultDateData = this.computeDate();
      }
      else if (val === '2') { // 近三天
        this.defaultDateData = this.computeDate(-2);
      }
      else if (val === '3') { // 本周
        if (new Date().getDay() === 1) {
          MessageBox.alert('本周报表尚未生成，可选择查看上周报表', '提示', { type: 'warning' });
        }
        else {
          this.defaultDateData = [baseFn.showWeekFirstDay(true), new Date(baseFn.todayUnix())];
        }
      }
      else if (val === '4') { // 上周
        this.defaultDateData = [baseFn.getLastDate(6), baseFn.getLastDate(0)];
      }
      else if (val === '5') { // 本月
        if (new Date().getDate() === 1) {
          MessageBox.alert('本月报表尚未生成，可选择查看上月报表', '提示', { type: 'warning' });
        }
        else {
          this.defaultDateData = [new Date(new Date().setDate(1)), new Date(baseFn.todayUnix())];
        }
      }
      else if (val === '6') { // 上月
        this.defaultDateData = [baseFn.getLastMonthDate('mStart'), baseFn.getLastMonthDate()];
      }
    },
    computeDate(sIndexDate = 0, eIndexDate = 0) {
      return [new Date(baseFn.todayUnix() + 86400000 * sIndexDate), new Date(baseFn.todayUnix() + 86400000 * eIndexDate)];
    },
    // 报表类型触发时调用父组件事件
    changeEvent() {
      this.$emit('parentFn');
    },
    // 接收用户确认选定的值时触发清空快速查询的选项
    clearQuickLook() {
      this.typeData.radio = 'date';
    }
  },
  inheritAttrs: false,
  mounted() {
    if (JSON.stringify(this.queryParams) !== '{}') {
      this.refreshFn();
    }
  },
  watch: {
    typeData: {
      handler() {
        this.$emit('input', [this.typeData.radio, this.typeData.selfValue]);
      },
      // 监听属性  的子属性变化
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.yh-quickLook{
  display: flex;
  .el-select{
    margin-right: 8px;
  }
  .date_interval{
    margin-right: 20px;
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
