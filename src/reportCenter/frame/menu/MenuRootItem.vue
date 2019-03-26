<!--左侧菜单根级菜单项-->
<template>
  <div class="menu-root-item">
    <menu-item :item-data="itemData" :icon-only="iconOnly"></menu-item>

    <!--子级菜单列表-->
    <menu-panel v-if="hasChildren" :menu-data="itemData.children"></menu-panel>
  </div>
</template>

<script>
import MenuItem from './MenuItem';
import MenuPanel from './MenuPanel';

export default {
  name: 'MenuRootItem',
  components: {
    MenuItem, MenuPanel
  },
  props: {
    itemData: {
      id: Number,
      name: String,
      description: String,
      url: String,
      icon: String,
      is_new: Number,
      is_star: Number,
      children: Array
    },
    iconOnly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasChildren() {
      return this.itemData && this.itemData.children && this.itemData.children.length > 0;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../vars.less";

.menu-root-item{
  position: relative;

  > .menu-item{
    height: @menu-item-height;
  }

  > .menu-panel{
    visibility: hidden;
    position: absolute;
    left: 100%;
    top: -5px;
    opacity: 0;
    transition: all 0.4s;
  }

  &:hover{
    background-color: @menu-item-hover;

    > .menu-panel{
      visibility: visible;
      opacity: 1;
      top: 0;
    }
  }
}
</style>
<style lang="less">
.menu-root-item{
  .menu-panel{
    .menu-group{
      > .menu-item{
        &:hover{
          .icon-position, .label{
            color: #ffffff;
          }
          span{
            cursor: default;
          }
        }
      }
    }
  }
}
</style>

