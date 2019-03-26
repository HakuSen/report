<!--------------------------------------------------
  日期选择器
---------------------------------------------------->
<template>
  <div class="yh-date-interval">
    <el-date-picker v-bind="validAttrs"
                    v-model="selfValue.start"
                    :type="type"
                    :placeholder="startPlaceholder"
                    start-placeholder="开始时间"
                    :clearable="false"
                    :format="formatData"
                    @change="changeIncident"
                    :picker-options="pickerOptions1"
                    :editable="false">
    </el-date-picker>

    <div class="separator">
      <span>{{rangeSeparator}}</span>
    </div>

    <el-date-picker v-bind="validAttrs"
                    v-model="selfValue.end"
                    :type="type"
                    :placeholder="endPlaceholder"
                    :format="formatData"
                    :clearable="false"
                    end-placeholder="结束时间"
                    @change="changeIncident"
                    :picker-options="pickerOptions2"
                    :editable="false">
    </el-date-picker>
  </div>
</template>

<script>
import Vue from 'vue';
import { DatePicker } from 'element-ui';
import Validator from '../../validator/Validator';
import setQueryTimes from '../../../../../utils/setQueryTimes';
import DateMixin, { getFirstWeekDate } from './util/index';
import baseFn from '../../../../../utils/baseFunction';
import SimpleVue from '../../../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(DatePicker);
export default {
  name: 'YhDateInterval',
  props: {
    quick: Boolean,
    rangeSeparator: {
      type: String,
      default: '-'
    },
    value: Array,
    storeTurnover: Boolean,
    businessDaily: Boolean,
    refreshDate: Array,
    defaultDateData: Array,
    valueFormat: String,
    startPlaceholder: String,
    endPlaceholder: String,
    type: {
      type: String,
      default: 'date',
      validator: Validator.optional(['year', 'month', 'week', 'date'])
    }
  },
  mixins: [DateMixin],
  data() {
    return {
      formatData: '', // 周选项默认显示形式
      selfValue: { // 默认时间
        start: new Date(),
        end: new Date()
      },
      pickerOptions1: { // 时间范围限制
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time.getTime() > baseFn.todayUnix();
        }
      },
      pickerOptions2: {
        firstDayOfWeek: 1,
        disabledDate(time) { 
          return time.getTime() > baseFn.todayUnix();
        }
      }
    };
  },
  computed: {
    // 过滤掉不需要向El组件传递的属性
    validAttrs() {
      const { placeholder, ...valid } = this.$attrs;
      return valid;
    },
    currentValue() { // 要传给父组件的改变后的值大集合
      const v = [];
      const start = this.formatAsFormatAndType(this.selfValue.start, this.valueFormat, this.type) || '';
      const end = this.formatAsFormatAndType(this.selfValue.end, this.valueFormat, this.type) || '';
      v.push(start, end, new Date(this.selfValue.start).getTime(), new Date(this.selfValue.end).getTime(), this.type);
      // 设置请求需要时间
      // 引用方法实现时间转换
      this.$store.dispatch('info/getTimes', setQueryTimes(v));
      return v;
    }
  },
  methods: {
    // 刷新保留已存的数据(刷新)
    // 属性日/周/月销售分析表(默认值)
    getTypeDefault(val) {
      if (val.length > 0) {
        this.selfValue.start = val[0];
        this.selfValue.end = val[1];
        this.$emit('input', this.currentValue);
      }
    },
    setInterval(val) {
      // 根据本期时间自动更改上期开始时间
      this.selfValue.start = new Date(val);
      this.$emit('lastIntervalTime', this.currentValue);
      this.pickerOptions2 = {
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time.getTime() > baseFn.todayUnix();
        }
      };
      let that = this;
      this.pickerOptions1 = {
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time.getTime() > Date.parse(that.selfValue.end) || time.getTime() < new Date().setHours(0, 0, 0, 0);
        }
      };
    },
    // 用户确认选定的值时触发清空快速查询的选项
    changeIncident(a) {
      if (a === 'isQuickLook') {
        // 快速查看组件页面初始化时不清空组件内的快速选择条件
      }
      else {
        this.$emit('clear');
      }
      // 结束时间不可大于开始时间
      let that = this;
      this.pickerOptions2 = {
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time.getTime() > baseFn.todayUnix() || time.getTime() < that.selfValue.start;
        }
      };
      this.pickerOptions1 = {
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time.getTime() > that.selfValue.end;
        }
      };
      if (this.storeTurnover) { // 营业额日报页面特殊处理（只允许查询一个月的数据
        let limit = new Date(Date.parse(that.selfValue.end) - 2592000000);
        this.pickerOptions1 = {
          firstDayOfWeek: 1,
          disabledDate(time) {
            return time.getTime() > that.selfValue.end || time.getTime() < limit;
          }
        };
      }
      if (this.businessDaily) { // 综合日报特殊处理只允许查询12月之后数据
        let limit = new Date('2018-11-30');
        this.pickerOptions1 = {
          firstDayOfWeek: 1,
          disabledDate(time) {
            return time.getTime() > that.selfValue.end || time.getTime() < limit;
          }
        };
      }
      this.$emit('input', this.currentValue);
    },
    setDefaultValue(val) {
      if (val && this.isDateObject(val)) {
        return val;
      }
      // 以周为单位必须带上年份 yyyywWW 以空格或者小写w分隔
      if (this.type === 'week') {
        const array = (val || '').split(/[ w]/i);
        if (array.length === 2) {
          const year = Number(array[0]);
          const week = Number(array[1]);

          if (!isNaN(year) && !isNaN(week) && week < 54) {
            const dt = getFirstWeekDate(year);
            dt.setTime(dt.getTime() + week * 7 * 86400000);
            return dt;
          }
        }
      }
      else {
        return new Date(val);
      }

      return val;
    }
  },
  inheritAttrs: false,
  mounted() {
    // 可通过value赋初始值，报表中所有的日期控件中只可查到昨天
    this.selfValue.start = this.value && this.value[0] ? this.setDefaultValue(this.value[0]) : new Date(baseFn.todayUnix());
    this.selfValue.end = this.value && this.value[1] ? this.setDefaultValue(this.value[1]) : new Date(baseFn.todayUnix());
    // 初始化时间传给父组件,给参数表示在快速查询组件里默认不执行$emit操作
    this.changeIncident('isQuickLook');
    // 禁止今天可选
    if(Date.parse(this.defaultDateData[0]) === Date.parse(new Date(baseFn.lastDayUnix()))){
      let that = this;
      this.pickerOptions2 = {
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time.getTime() > baseFn.lastDayUnix() || time.getTime() < that.selfValue.start;
        }
      };
    }
    // 默认日/周/月销售分析值（date-picker.vue）
    if (this.defaultDateData && this.defaultDateData.length > 0) {
      this.getTypeDefault(this.defaultDateData);
    }
  },
  watch: {
    refreshDate(val) { // 刷新传过来的已选时间
      this.getTypeDefault(val);
    },
    defaultDateData(val) { // 切换日期type更新默认值
      this.getTypeDefault(val);
    },
    selfValue: {
      handler() {
        // 如果是周则显示yyyy周WW 否则formatData为空
        this.formatData = '';
        if (this.type === 'week') {
          this.formatData = 'yyyy 第 WW 周';
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
.yh-date-interval{
  display: flex;
  align-items: center;
  .el-date-editor{
    flex: 1;
    width: auto !important;
  }
  .separator{
    display: flex;
    flex: 0 0 15px;

    > span{
      margin: auto;
    }
  }
}
</style>
<style lang="less">
.el-date-picker{
  position: absolute;
  z-index: 10;
}

.el-input__inner{
  padding-right: 0;
  padding-left: 26px;
}
</style>
