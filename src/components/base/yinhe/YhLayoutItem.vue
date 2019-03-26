<!--------------------------------------------------
  LayoutItem.vue
  查询条件组件库 - 布局项
---------------------------------------------------->
<template>
  <div class="yh-layout-item" :style="{width:realWidth}">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'yh-layout-item',
  props: {
    stand: {
      type: Number,
      default: 300,
      validator(value) {
        return value >= 0 && value === parseInt(value, 10);
      }
    },
    size: {
      type: Number,
      default: 1,
      validator(value) {
        return value >= 0;
      }
    }
  },
  computed: {
    realWidth() {
      return this.size * this.stand + 'px';
    }
  }
};
</script>

<style lang="less" scoped>
.yh-layout-item{
  min-width: 100px;
  text-align: left;
  box-sizing: border-box;
  float: left;
  margin: 0 20px 20px 0;
  display: flex;
  align-items: center;

  > *{
    width: 100%;
  }
}
</style>
