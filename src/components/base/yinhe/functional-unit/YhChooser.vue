<!--------------------------------------------------
  YhChooser.vue
  多项、单项复合选择器（el-checkbox-group）
---------------------------------------------------->
<template>
  <div class="yh-chooser" :class="[selectSize ? `is-${ selectSize }` : '']">
    <yh-label :value="label" :style="{width:labelWidth+'px'}"></yh-label>
    <el-checkbox-group :style="{width:label?`calc(100% - ${labelWidth}px)`:'100%'}"
                       v-bind="attrs" v-on="$listeners" v-model="selfValue">
      <el-checkbox v-for="(item,key) in options" :label="item.value" :key="key">{{item.label}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import Vue from 'vue';
import { CheckboxGroup, Checkbox } from 'element-ui';
import YhLabel from '../indirectness-unit/YhLabel';
import Validator from '../validator/Validator';
import SimpleVue from '../../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(CheckboxGroup, Checkbox);
export default {
  name: 'YhChooser',
  components: {
    YhLabel
  },
  props: {
    attrs: {
      size: Number
    },
    label: String,
    options: Array,
    value: Array,
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
      selfValue: this.value
    };
  },
  computed: {
    selectSize() {
      return (this.attrs && this.attrs.size) || (this.$ELEMENT || {}).size;
    },
    labelStyles() {
      let stl = {};

      if (this.labelWidth) {
        stl.flex = `0 0 ${this.labelWidth}px`;
      }

      return stl;
    }
  },
  inheritAttrs: false,
  watch: {
    value(val) {
      this.selfValue = val;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../css/mixins";

.yh-chooser{
  display: flex;
  align-items: stretch;

  // 尺寸类定义
  .size-define;

  > *{
    flex: 1;
  }

  .yh-label{
    flex: 0 0 70px;
  }

  .el-checkbox-group{
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }
}
</style>
