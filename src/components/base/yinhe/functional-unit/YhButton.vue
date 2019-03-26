<!--------------------------------------------------
  YhButton.vue
  查询按钮
---------------------------------------------------->
<template>
  <el-button :native-type="action" v-bind="attrs" v-on="$listeners" :class="'require-button'" v-waves>
    {{label}}
  </el-button>
</template>

<script>
import Vue from 'vue';
import { Button } from 'element-ui';
import waves from '../../../../directive/waves';
import SimpleVue from '../../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Button);
export default {
  name: 'YhButton',
  directives: {
    waves
  },
  props: {
    label: String,
    action: {
      type: String,
      default: 'submit',
      validator(val) {
        return /^(submit|reset)$/i.test(val);
      }
    },
    attrs: Object
  }
};
</script>
<style lang="less">
button.require-button{
  width: 80px;
  height: 34px;
  background: #0096ff;
}

button.require-button:hover{
  background: #daebf8 !important;
  border-color: #0096ff;
  span{
    color: #0096ff;
  }
}
</style>
