<!-----------------------
frame的左侧菜单页面
------------------------>
<template>
  <div class="frame-menu">
    <slot></slot>
    <el-row v-for="(item, index) in menuList" :key="index">
      <div class="menu-right-arrow"></div>
      <menu-root-item :item-data="item" :icon-only="collapsed"></menu-root-item>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Container } from 'element-ui';
import MenuRootItem from './menu/MenuRootItem';
import SimpleVue from '../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Container);
export default {
  components: {
    MenuRootItem
  },
  props: ['collapsed'],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      menuList: 'menu/menuList'
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
// 公共样式
@import "vars";

.frame-menu{
  width: 160px;
  height: 100%;
  background: @menu-bgcolor;
  color: #fff;
  text-align: left;
  overflow: visible;
  font-size: 14px;
  .el-row{
    position: relative;
    .menu-right-arrow{
      display: none;
      position: absolute;
      right: 0;
      top: 20px;
      z-index: 1;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-right: 8px solid #fff;
    }
  }
}

a{
  text-decoration: none;
}

.el-submenu .el-menu-item{min-width: auto;}

.full-height{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  min-width: 1200px;
}

.el-menu-vertical-demo{
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.el-dropdown{
  font-size: 16px;
}

.no-data{
  text-align: center;
  font-size: 12px;
  padding: 30px 0;
}

.none-arrow i{display: none !important;}

.left-arrow{
  position: absolute;
  right: 0;
  top: 20px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid #fff;
}

.menu-collapsed{
  flex: 0 0 @header-height;
  .aside-item{
    padding-left: 11px;
  }
  .bottom-line{
    width: 50px;
  }
}
</style>
