<!--------------------------------------------------
  YhLabel.vue
  普通label标签
---------------------------------------------------->
<template>
  <span class="yh-label" :class="classNames" v-if="value">
    <span>{{ value }}</span>
  </span>
</template>

<script>
import Validator from '../validator/Validator';

export default {
  name: 'YhLabel',
  props: {
    value: String,
    alignment: {
      type: String,
      default: 'right',
      validator: Validator.optional(['left', 'center', 'right'])
    }
  },
  computed: {
    classNames() {
      const ns = {};

      if (this.alignment) {
        ns[`flex-${this.alignment}`] = true;
      }

      return ns;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../css/mixins";

.yh-label{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  min-width: 50px;

  // 水平对齐方式支持
  .flex-horizontal-aligns;

  > span{
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

</style>
