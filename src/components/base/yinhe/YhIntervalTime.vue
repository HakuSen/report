<!--------------------------------------------------
  时间间隔（小时）
---------------------------------------------------->
<template>
  <div class="yh-interval-time">
    <yh-label :value="label" :alignment="labelAlign"/>
    <el-time-select
      v-bind="validAttrs"
      :size="attrs.size"
      placeholder="起始时间"
      v-model="timeVal.startTime"
      :picker-options="{
        start: '00:00',
        step: '01:00',
        end: '23:00',
        maxTime: timeVal.endTime
      }">
    </el-time-select>
    <div class="separator">
      <span>-</span>
    </div>
    <el-time-select :size="attrs.size" v-bind="validAttrs" placeholder="结束时间" v-model="timeVal.endTime"
                    :picker-options="{
        start: '01:00',
        step: '01:00',
        end: '24:00',
        minTime: timeVal.startTime
      }">
    </el-time-select>
  </div>
</template>

<script>

import Vue from 'vue';
import { Select, TimePicker, TimeSelect } from 'element-ui';
import YhLabel from './indirectness-unit/YhLabel';
import Validator from './validator/Validator';
import baseFn from '../../../utils/baseFunction';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Select, TimeSelect, TimePicker);
export default {
  name: 'YhIntervalTime',
  components: {
    YhLabel
  },
  props: {
    attrs: {},
    label: String,
    options: Array,
    value: Array,
    queryParams: Object,
    labelWidth: {
      type: Number,
      default: 90
    },
    labelAlign: {
      type: String,
      default: 'right',
      validator: Validator.optional(['left', 'center', 'right'])
    }
  },
  data() {
    return {
      timeVal: {
        startTime: '00:00',
        endTime: '24:00'
      }
    };
  },
  computed: {
    // 过滤掉不需要向El组件传递的属性
    validAttrs() {
      const { placeholder, ...valid } = this.$attrs;
      return valid;
    }
  },
  inheritAttrs: false,
  mounted() {
    if (JSON.stringify(this.queryParams) !== '{}' && this.queryParams !== undefined) { // 刷新时保留已选数据
      this.timeVal.startTime = baseFn.numTotime(this.queryParams['start_timeslot']);
      this.timeVal.endTime = baseFn.numTotime(this.queryParams['end_timeslot']);
    }
  },
  watch: {
    value(val) { // 重置
      if (val.length === 0) {
        this.timeVal.startTime = '00:00';
        this.timeVal.endTime = '24:00';
        this.$emit('input', ['00:00', '24:00']);
      }
    },
    timeVal: {
      handler() {
        this.$emit('input', [this.timeVal.startTime.substr(0, 2), this.timeVal.endTime.substr(0, 2)]);
      },
      // 监听属性  的子属性变化
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.yh-interval-time{
  display: flex;
  align-items: center;
  .el-date-editor{
    flex: 1 !important;
    width: auto !important;
  }
  .separator{
    display: flex;
    flex: 0 0 15px;

    > span{
      margin: auto;
    }
  }
  .yh-label{
    flex: 0 0 70px;
  }
}
</style>
