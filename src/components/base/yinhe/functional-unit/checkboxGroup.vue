<!--------------------------------------------------
  checkboxGroup.vue
  多选框
---------------------------------------------------->
<template>
  <div class="checkbox-group">
    <el-checkbox-group v-bind="attrs" v-on="$listeners" v-model="checkedVal">
      <el-checkbox v-for="(item,key) in options" :label="item.value" :key="key">{{item.label}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import Vue from 'vue';
import { CheckboxGroup, Checkbox } from 'element-ui';
import SimpleVue from '../../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(CheckboxGroup, Checkbox);
export default {
  name: 'CheckboxGroup',
  props: {
    attrs: Object,
    options: Array,
    label: String,
    url: String,
    value: Array
  },
  data() {
    return {
      checkedVal: this.value
    };
  },
  inheritAttrs: false,
  watch: {
    value(val) {
      this.checkedVal = val;
    }
  }
};
</script>

<style lang="less" scoped>
.checkbox-group{
  display: flex;

  > *{
    flex: 1;
  }
  .el-select{
    margin-right: 20px;
  }
}
</style>
