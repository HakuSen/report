<!--------------------------------------------------
  菜单栏的整体包裹
---------------------------------------------------->
<template>
  <div class="menu-panel">
    <menu-group v-for="(menu,index) in menuData" :item-data="menu" :key="index"></menu-group>
  </div>
</template>

<script>
import MenuGroup from './MenuGroup';

export default {
  name: 'MenuPanel',
  components: {
    MenuGroup
  },
  props: {
    menuData: Array
  }
};
</script>

<style lang="less" scoped>
@import "../vars.less";

@padding: 20px;

.menu-panel{
  width: 580px;
  overflow: hidden;
  padding: @padding;
  box-sizing: border-box;
  background-color: @menu-bgcolor-actived;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 3000;

  > .menu-group:not(:first-child):before{
    content: '';
    display: block;
    width: calc(100% - @padding * 2);
    height: 1px;
    opacity: .5;
    margin: 5px auto;
    background: linear-gradient(left, transparent, @line-color 20%, @line-color 80%, transparent);
  }
}
</style>
