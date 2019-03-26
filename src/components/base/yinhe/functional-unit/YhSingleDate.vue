<!--------------------------------------------------
  日期选择器(根据页面要求显示类型可能为 日/周/月)
---------------------------------------------------->
<template>
  <div class="yh-single-date">
    <yh-label :value="label" :style="labelStyles" :alignment="labelAlign"></yh-label>
    <el-date-picker
      :clearable="false"
      size="mini"
      v-model="dateWidget"
      :type="attrs.type"
      :placeholder="dateTypeTxt"
      :picker-options="pickerOptions"
      @change="getDateType"
      style="width:150px;">
    </el-date-picker>
  </div>
</template>

<script>
import YhLabel from '../indirectness-unit/YhLabel';
import Validator from '../validator/Validator';
import baseFn from '../../../../utils/baseFunction';

export default {
  name: 'YhSingleDate',
  components: {
    YhLabel
  },
  props: {
    attrs: {},
    label: String,
    value: Array,
    lastDefault: Boolean,
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
      dateWidget: new Date(),
      dateTypeTxt: '选择月',
      pickerOptions: { // 时间范围限制
        disabledDate(time) {
          return time.getTime() > new Date();
        }
      },
      timeAry: [], // 月/年的第一天和最后一天数组
      outputTime: []
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
        start_date: start
      } = this.queryParams;
      if (type === 'month') {
        this.dateWidget = baseFn.refreshTime(start);
      }
    },
    getDateType(val) {
      if (this.attrs.type === 'month') {
        // this.timeAry = baseFn.getLastDay(val.getFullYear(), val.getMonth() + 1);
        // this.$emit('input', this.timeAry);
        this.outputTime = [val.getFullYear() + '-' + (val.getMonth() + 1 < 10 ? '0' + (val.getMonth() + 1) : val.getMonth() + 1)];
        this.$emit('input', this.outputTime);
      }
    }
  },
  inheritAttrs: false,
  mounted() {
    // this.timeAry = baseFn.getLastDay(new Date().getFullYear(), new Date().getMonth() + 1);
    // this.$emit('input', this.timeAry);
    this.outputTime = [new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1)];
    this.$emit('input', this.outputTime);
    if (JSON.stringify(this.queryParams) !== '{}' && JSON.stringify(this.queryParams) !== undefined) { // refresh
      // this.refreshFn();
    }
  }
};
</script>

<style lang="less" scoped>
.yh-single-date{
  display: flex;

  > *{
    flex: 1;
  }

  .yh-label{
    flex: 0 0 70px;
  }
}
</style>
