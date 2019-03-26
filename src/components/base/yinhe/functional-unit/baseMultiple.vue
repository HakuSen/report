<!--------------------------------------------------
  el-select-multiple.vue
  element基础多选
  暂时不用
---------------------------------------------------->
<template>
  <div class="yh-base-multiple">
    <el-select v-bind="attrs" multiple collapse-tags reserve-keyword clearable size="small" :filterable="filterStatus" v-on="$listeners" v-model="checkedVal">
      <el-option
        v-for="(item,key) in listData"
        :key="key"
        :label="item.name"
        :value="item.id+''"
        :disabled="item.disabled">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import Vue from 'vue';
import { Select, Option } from 'element-ui';
import SimpleVue from '../../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Select, Option);
export default {
  name: 'YhBaseMultiple',
  props: {
    attrs: Object,
    options: Array,
    label: String,
    listData: Array,
    url: String,
    value: Array,
    filterStatus: Boolean
  },
  data() {
    return {
      checkedVal: []
    };
  },
  inheritAttrs: false,
  watch: {
    value(val) {
      this.checkedVal = val;
      this.$emit('input', val);
    }
  }
};
</script>

<style lang="less" scoped>
.yh-base-multiple{
  display: flex;

  > *{
    flex: 1;
  }
  .el-select{
    margin-right: 20px;
  }
}
</style>
