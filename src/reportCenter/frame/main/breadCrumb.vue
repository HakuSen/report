<!--报表中心项目后台-主框架-->
<template>
  <!--面包屑导航-->
  <el-row class="bread-crumb">
    <el-col>
      <router-link to="home">
        <icon name="home" class="icon-position" autosize></icon>
      </router-link>
      <!--<el-col v-for="(item, index) in breadList" :key="index" class="bread-list">-->
      <!--<router-link :to="{name: 'Menu'+ item.id}">-->
      <!--<span :class="{'last-one': index === breadList.length - 1}">{{item.name}}</span>-->
      <!--</router-link>-->
      <!--<span v-show="index !== breadList.length - 1"> > </span>-->
      <!--</el-col>-->
      <el-col class="bread-list">
        <router-link to="home">
          <span>子店铺管理</span>
        </router-link>
        <span> > </span>
      </el-col>
      <el-col class="bread-list">
        <router-link to="home">
          <span class="last-one">我的子店铺</span>
        </router-link>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'bread-crumb',
  computed: {
    ...mapGetters({
      menuList: 'menu/getterMemuList',
      breadList: 'menu/getbreadList'
    })
  }
};
</script>

<style lang="less" scoped>
@breadColor: #0a96ff;

.bread-crumb{
  height: 25px;
  color: @breadColor;
  line-height: 25px;
  margin-bottom: 10px;

  a{
    color: @breadColor;
    text-decoration: none;
    float: left;

    .icon-position{
      cursor: pointer;
      margin: 5px 3px 0 0;
    }
  }
  .bread-list{
    width: auto;
    a{
      margin: 0 3px;
    }
  }
  span{
    cursor: pointer;
    &.last-one{
      color: #333;
      cursor: auto;
    }
  }
}
</style>
