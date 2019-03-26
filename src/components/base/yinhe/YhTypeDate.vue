<!----
  报表类型+日期选择
---->
<template>
  <div class="yh-typeDate">
    <yh-label :value="label[0]" :style="labelStyles" :alignment="labelAlign"/>
    <el-radio-group v-bind="attrs" v-model="typeData.radio" @change="changeData" @focus="changeEvent">
      <el-radio-button v-for="(item,key) in options" :label="item.value" :key="key">{{item.label}}</el-radio-button>
    </el-radio-group>
    <yh-label :value="label[1]" :style="labelStyles" :alignment="labelAlign"/>
    <yh-date-interval :ref="'datePick'" v-bind="attrs" :type="dateType" :refreshDate="refreshDates" :defaultDateData="defaultDateData" @clear="clearQuickLook" v-model="typeData.selfValue"/>
    <el-select v-model="quickVal" size="small" @change="quickChange" placeholder="快速选择">
      <el-option
        v-for="item in quickList"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
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
        radio: 'date',
        selfValue: []
      },
      initial: false,
      dateType: 'date',
      refreshDates: [], // 存刷新值
      defaultDateData: [], // 存切换默认值
      quickVal: '',
      quickList: [
        {
          label: '昨天',
          value: 'yes'
        },
        {
          label: '近三天',
          value: 'nearthreeday'
        }
      ]
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
      if (value === 'month') {
        start = baseFn.refreshTime(start);
        end = new Date(end.split(' ')[0].substring(0, 7) + '-01 00:00:00');
        this.refreshDates = [start, end];
      }
    },
    // 报表类型更改时更改时间空间默认值
    changeData(val) {
      val = baseFn.cutStr(val);
      this.dateType = val;
      this.quickVal = '';
      if (val === 'date') {
        this.defaultDateData = [new Date(baseFn.todayUnix()), new Date(baseFn.todayUnix())];
        this.quickList = [
          {
            label: '昨天',
            value: 'yes'
          },
          {
            label: '近三天',
            value: 'nearthreeday'
          }
        ];
      }
      if (val === 'week') {
        this.defaultDateData = [baseFn.showWeekFirstDay(), baseFn.showWeekLastDay()];
        this.quickList = [
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
      if (val === 'month') {
        this.defaultDateData = [baseFn.getCurrentMonthFirst(), baseFn.getCurrentMonthFirst()];
        this.quickList = [
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
    quickChange() {
      let type = this.dateType;
      if (type === 'date') {
        if (this.quickVal === 'yes') { // 昨天lastDayUnix
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
        else if (this.quickVal === 'nearthreeweek') { // 近三周 近四周在此基础上+7=19以此类推
          this.defaultDateData = [baseFn.getLastDate(12), baseFn.showWeekLastDay()];
        }
      }
      else if (type === 'month') {
        if (this.quickVal === 'nearonemonth') { // 上月
          this.defaultDateData = [baseFn.getLastMonthDate('mStart'), baseFn.getLastMonthDate('mStart')];
        }
        else if (this.quickVal === 'nearthreemonth') { // 近3月
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
        this.dateType = 'date';
        this.typeData.radio = this.attrs.type;
        this.quickVal = '';
        this.defaultDateData = [new Date(baseFn.todayUnix()), new Date(baseFn.todayUnix())];
      }
    },
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
