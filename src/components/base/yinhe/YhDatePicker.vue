<!--------------------------------------------------
  日期选择器(根据页面要求显示类型可能为 日/周/月)
---------------------------------------------------->
<template>
  <div class="yh-datePicker">
    <yh-label :value="label" :style="labelStyles" :alignment="labelAlign"></yh-label>
    <yh-date-interval :storeTurnover="storeTurnover" :businessDaily="businessDaily" v-bind="attrs" v-on="$listeners" :refreshDate="refreshDates" :defaultDateData="defaultDateData" :type="this.attrs.type" v-model="selfValue" @clear="clearQuickLook"></yh-date-interval>
    <el-select v-model="quickVal" size="small" @change="changeDate" placeholder="快速选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import Vue from 'vue';
import { Select, Option } from 'element-ui';
import YhLabel from './indirectness-unit/YhLabel';
import YhDateInterval from './functional-unit/date-picker/YhDateInterval';
import Validator from './validator/Validator';
import baseFn from '../../../utils/baseFunction';

Vue.batch.use(Select, Option);
export default {
  name: 'YhDatePicker',
  components: {
    YhLabel,
    YhDateInterval
  },
  props: {
    attrs: {},
    label: String,
    value: Array,
    lastDefault: Boolean,
    queryParams: Object,
    storeTurnover: Boolean, // 时间限制为1个月
    businessDaily: Boolean, // 时间限制为只能查12月份之后
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
      selfValue: this.value,
      refreshDates: [], // 存刷新值
      defaultDateData: [], // 存切换默认值
      options: [
        {
          label: '昨天',
          value: 'yes'
        },
        {
          label: '近三天',
          value: 'nearthreeday'
        }
      ],
      quickVal: ''
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
      let type = this.attrs.type;
      let {
        start_date: start,
        end_date: end
      } = this.queryParams;
      if (type === 'date') {
        start = baseFn.refreshTime(start);
        end = baseFn.refreshTime(end);
        this.refreshDates = [start, end];
      }
      if (type === 'week') {
        start = baseFn.refreshDate(start, 1);
        end = baseFn.refreshDate(end, -5);
        this.refreshDates = [start, end];
      }
      if (type === 'month') {
        start = baseFn.refreshTime(start);
        end = new Date(end.split(' ')[0].substring(0, 7) + '-01 00:00:00');
        this.refreshDates = [start, end];
      }
    },
    defaultFn() {
      if (this.attrs.type === 'date') {
        this.defaultDateData = [new Date(baseFn.todayUnix()), new Date(baseFn.todayUnix()), 'date'];
      }
      if (this.attrs.type === 'week') {
        this.defaultDateData = [baseFn.showWeekFirstDay(), baseFn.showWeekLastDay()];
        this.options = [
          {
            label: '上周',
            value: 'nearoneweek'
          },
          {
            label: '近三周',
            value: 'nearthreeweek'
          }
        ];
      }
      if (this.attrs.type === 'month') {
        this.defaultDateData = [baseFn.getCurrentMonthFirst(), baseFn.getCurrentMonthFirst()];
        this.options = [
          {
            label: '上月',
            value: 'nearonemonth'
          },
          {
            label: '近三月',
            value: 'nearthreemonth'
          }
        ];
      }
    },
    changeDate() {
      let type = this.attrs.type;
      if (type === 'date') {
        if (this.quickVal === 'yes') { // 昨天
          this.defaultDateData = [new Date(baseFn.lastDayUnix()), new Date(baseFn.lastDayUnix())];
        }
        else if (this.quickVal === 'nearthreeday') { // 近三天
          this.defaultDateData = this.computeDate(-2);
        }
      }
      else if (type === 'week') {
        if (this.quickVal === 'nearoneweek') { // 上周
          this.defaultDateData = [baseFn.getLastDate(5), baseFn.getLastDate(5)];
        }
        else if (this.quickVal === 'nearthreeweek') { // 近三周
          this.defaultDateData = [baseFn.getLastDate(12), baseFn.showWeekLastDay()];
        }
      }
      else if (type === 'month') {
        if (this.quickVal === 'nearonemonth') { // 上月
          this.defaultDateData = [baseFn.getLastMonthDate('mStart'), baseFn.getLastMonthDate('mStart')];
        }
        else if (this.quickVal === 'nearthreemonth') { // 近3月算本月
          this.defaultDateData = [baseFn.getLastMonthDate('mStart', 2), baseFn.getCurrentMonthFirst()];
        }
      }
    },
    computeDate(sIndexDate = 0, eIndexDate = 0) {
      return [new Date(baseFn.todayUnix() + 86400000 * sIndexDate), new Date(baseFn.todayUnix() + 86400000 * eIndexDate)];
    },
    // 接收用户确认选定的值时触发清空快速查询的选项
    clearQuickLook() {
      this.quickVal = '';
    },
    getDefaultData() {
      if (this.lastDefault && this.attrs.type === 'date') {
        this.defaultDateData = [new Date(baseFn.lastDayUnix()), new Date(baseFn.lastDayUnix()), 'date'];
      }
      else {
        this.defaultFn(); // 判断是周和月的时候传给子组件的数据（默认值）
      }
    }
  },
  inheritAttrs: false,
  created() {
    this.getDefaultData();
  },
  mounted() {
    if (JSON.stringify(this.queryParams) !== '{}' && JSON.stringify(this.queryParams) !== undefined) { // refresh
      this.refreshFn();
    }
  },
  watch: {
    value(val) { // 重置功能
      if (val.length === 0) {
        this.clearQuickLook();
        this.getDefaultData();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.yh-datePicker{
  display: flex;
  .yh-label{
    flex: 0 0 70px;
  }
  .el-select{
    margin-left: 20px;
  }
}
</style>
