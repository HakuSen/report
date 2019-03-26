<!--------------------------------------------------
  普通链接
---------------------------------------------------->
<template>
  <div class="yh-link" :class="classNames" v-if="label">
    <a :target="target" :href="url">
      {{ label }}
    </a>
  </div>
</template>

<script>
import Validator from '../validator/Validator';

export default {
  name: 'YhLink',
  props: {
    label: String,
    target: {
      type: String,
      default: '_blank',
      validator: Validator.optional(['_blank', '_self', '_top'])
    },
    url: String,
    attrs: {},
    alignment: {
      type: String,
      default: 'right',
      validator: Validator.optional(['left', 'center', 'right'])
    }
  },
  computed: {
    selectSize() {
      return (this.attrs && this.attrs.size) || (this.$ELEMENT || {}).size;
    },
    classNames() {
      const ns = {};

      if (this.selectSize) {
        ns[`is-${this.selectSize}`] = true;
      }

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

.yh-link{
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-width: 50px;

  // 水平对齐方式支持
  .flex-horizontal-aligns;

  // 尺寸类定义
  .size-define;

  > a{
    max-width: 100%;
    overflow: hidden;
    /*white-space   : nowrap;*/
    text-overflow: ellipsis;
    color: @link-color;
    text-decoration: none;
    transition: 0.2s;

    &:hover{
      color: @link-color-hover;
    }
  }
}

</style>
