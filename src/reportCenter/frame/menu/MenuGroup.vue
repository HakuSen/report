<!--------------------------------------------------
  报表中心二级和三级菜单组件
---------------------------------------------------->
<template>
  <div class="menu-group">
    <!--二级菜单-->
    <menu-item :font-size="14" :margin-left="0" :spacing="8" :item-data="itemData"></menu-item>

    <!--三级菜单-->
    <div class="menu-list" v-if="hasChildren">
      <menu-item v-for="(menu,index) in itemData.children"
                 :font-size="12" :margin-left="0" :spacing="24"
                 :item-data="menu" :key="index">
      </menu-item>
    </div>
  </div>
</template>

<script>
import MenuItem from './MenuItem';

export default {
  name: 'MenuGroup',
  components: {
    MenuItem
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

.menu-group{
  > .menu-item{
    line-height: 36px;
  }

  > .menu-list{
    display: flex;
    flex-wrap: wrap;

    .menu-item{
      width: 160px;
      box-sizing: border-box;
      line-height: 36px;
    }
  }
}
</style>
