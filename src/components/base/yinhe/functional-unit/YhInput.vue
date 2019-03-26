<!--------------------------------------------------
  YhInput.vue
  普通输入框
---------------------------------------------------->
<template>
  <div class="yh-input">
    <yh-label :value="label" :style="labelStyles" :alignment="labelAlign"/>
    <el-input v-bind="attrs" v-on="$listeners" v-model="selfValue" clearable>
      <!--<slot name="prepend" slot="prepend" v-if="hasPrependSlot">{{prepend}}</slot>-->
      <!--<slot name="append" slot="append" v-if="hasAppendSlot">{{append}}</slot>-->
    </el-input>
  </div>
</template>

<script>
import Vue from 'vue';
import { Input } from 'element-ui';
import YhLabel from '../indirectness-unit/YhLabel';
import Validator from '../validator/Validator';
import SimpleVue from '../../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Input);
export default {
  name: 'YhInput',
  components: {
    YhLabel
  },
  props: {
    attrs: {},
    label: String,
    prepend: String,
    append: String,
    value: String,
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
      selfValue: this.value || this.attrs.value
    };
  },
  computed: {
    hasPrependSlot() {
      return this.prepend && this.prepend.length > 0 || this.$slots.prepend;
    },
    hasAppendSlot() {
      return this.append && this.append.length > 0 || this.$slots.append;
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
.yh-input{
  display: flex;

  > *{
    flex: 1;
  }

  .yh-label{
    flex: 0 0 70px;
  }
}
</style>
