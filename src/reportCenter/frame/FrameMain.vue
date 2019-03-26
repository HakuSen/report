<!-----------------------
frame的页面的导航栏
------------------------>
<template>
  <el-col class="frame-main">
    <el-tabs type="card" editable :closable="true" @tab-remove="close" @tab-click="goToPath" v-model="newActiveNum" class="frameTabs">
      <el-tab-pane
        class="nav-link"
        :class="$route.fullPath.indexOf(item.menu.fullpath) !== -1 ? 'active' : ''"
        v-for="(item, index) in titleArray"
        :key="index"
        :label="item.menu.name"
        :name="index + ''"
        :labelContent="getFullPath(item.menu.fullpath)"
      >
      </el-tab-pane>
    </el-tabs>

    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view :key="$route.fullPath" class="container" :ref="'requestOnce'"/>
      </keep-alive>
    </transition>
  </el-col>
</template>

<script>
import { mapState } from 'vuex';
import Vue from 'vue';
import { Tabs, TabPane } from 'element-ui';
import SimpleVue from '../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Tabs, TabPane);
export default {
  name: 'FrameMain',
  props: {
    frameAsideWidth: Number
  },
  data() {
    return {
      nextPathFlag: false,
      nextPath: '',
      swiperSlidesLength: 0,
      clientHeight: document.body.clientHeight || document.documentElement.clientHeight,
      clientWidth: document.body.clientWidth || document.documentElement.clientWidth,
      ifScroll: false,
      asideWidthArr: [160, 50],
      arrowsShow: false,
      elCardHeight: 0,
      asideWidth: 0,
      newActiveNum: '0',
      activeUrlArray: [
        'operatingReport',
        'snalySiscommoditySales',
        'FinanceReport',
        'businessCustom',
        'afiliateMarketing',
        '/frame/tableDownload',
        '/frame/repairData'
      ]
    };
  },
  computed: {
    ...mapState({
      titleArray: State => State.info.titleArray,
      activeTabs: State => State.info.activeTabs
    })
  },
  methods: {
    getFullPath(path) {
      return () => path;
    },
    goToPath(tab) {
      // this.$refs['requestOnce'].submitHandler();
      this.$store.commit('info/setActiveTabs', Number(tab.name));
      this.$store.dispatch('info/getIfNewTitleArray', true);
      this.$router.replace('/frame' + tab.labelContent());
    },
    close(index) {
      this.$store.dispatch('info/getTitleArray', { titleArray: index });
      this.$store.commit('info/setActiveTabs', this.titleArray.length - 1);
      if (this.titleArray && this.titleArray.length > 1) {
        this.nextPath = this.titleArray[this.titleArray.length - 1].menu.fullpath;
        this.$router.push('/frame' + this.nextPath);
      }
      else {
        this.$router.push('/frame/home');
      }
    }
  },
  mounted() {
    this.newActiveNum = this.activeTabs;
  },
  updated() {
    // 菜单栏和导航上当前页对应
    let frameMenu;
    if (document) {
      frameMenu = document.getElementsByClassName('frame-menu')[0];
    }
    if (frameMenu) {
      const elRows = frameMenu.getElementsByClassName('el-row');
      const elRowsArr = Array.prototype.slice.call(elRows);
      if (elRowsArr) {
        if (elRowsArr[1]) {
          if (this.$route.fullPath.indexOf('FinanceReport') !== -1) { // afiliateMarketing
            elRowsArr[1].getElementsByClassName('menu-item')[0].style.background = '#1E2432';
            elRowsArr[1].getElementsByClassName('menu-right-arrow')[0].style.display = 'block';
          }
          else {
            elRowsArr[1].getElementsByClassName('menu-item')[0].style.background = '';
            elRowsArr[1].getElementsByClassName('menu-right-arrow')[0].style.display = 'none';
          }
        }
        if (elRowsArr[2]) {
          if (this.$route.fullPath.indexOf('operatingReport') !== -1) { // operatingReport
            elRowsArr[2].getElementsByClassName('menu-item')[0].style.background = '#1E2432';
            elRowsArr[2].getElementsByClassName('menu-right-arrow')[0].style.display = 'block';
          }
          else {
            elRowsArr[2].getElementsByClassName('menu-item')[0].style.background = '';
            elRowsArr[2].getElementsByClassName('menu-right-arrow')[0].style.display = 'none';
          }
        }
        if (elRowsArr[3]) {
          if (this.$route.fullPath.indexOf('snalySiscommoditySales') !== -1) { // snalySiscommoditySales
            elRowsArr[3].getElementsByClassName('menu-item')[0].style.background = '#1E2432';
            elRowsArr[3].getElementsByClassName('menu-right-arrow')[0].style.display = 'block';
          }
          else {
            elRowsArr[3].getElementsByClassName('menu-item')[0].style.background = '';
            elRowsArr[3].getElementsByClassName('menu-right-arrow')[0].style.display = 'none';
          }
        }
        if (elRowsArr[4]) {
          if (this.$route.fullPath.indexOf('afiliateMarketing') !== -1) { // FinanceReport
            elRowsArr[4].getElementsByClassName('menu-item')[0].style.background = '#1E2432';
            elRowsArr[4].getElementsByClassName('menu-right-arrow')[0].style.display = 'block';
          }
          else {
            elRowsArr[4].getElementsByClassName('menu-item')[0].style.background = '';
            elRowsArr[4].getElementsByClassName('menu-right-arrow')[0].style.display = 'none';
          }
        }
        if (elRowsArr[5]) {
          if (this.$route.fullPath.indexOf('businessCustom') !== -1) { // businessCustom
            elRowsArr[5].getElementsByClassName('menu-item')[0].style.background = '#1E2432';
            elRowsArr[5].getElementsByClassName('menu-right-arrow')[0].style.display = 'block';
          }
          else {
            elRowsArr[5].getElementsByClassName('menu-item')[0].style.background = '';
            elRowsArr[5].getElementsByClassName('menu-right-arrow')[0].style.display = 'none';
          }
        }
        if (elRowsArr[6]) {
          if (this.$route.fullPath.indexOf('/frame/tableDownload') !== -1) {
            elRowsArr[6].getElementsByClassName('menu-item')[0].style.background = '#1E2432';
            elRowsArr[6].getElementsByClassName('menu-right-arrow')[0].style.display = 'block';
          }
          else {
            elRowsArr[6].getElementsByClassName('menu-item')[0].style.background = '';
            elRowsArr[6].getElementsByClassName('menu-right-arrow')[0].style.display = 'none';
          }
        }
        if (elRowsArr[7]) {
          if (this.$route.fullPath.indexOf('/frame/repairData') !== -1) {
            elRowsArr[7].getElementsByClassName('menu-item')[0].style.background = '#1E2432';
            elRowsArr[7].getElementsByClassName('menu-right-arrow')[0].style.display = 'block';
          }
          else {
            elRowsArr[7].getElementsByClassName('menu-item')[0].style.background = '';
            elRowsArr[7].getElementsByClassName('menu-right-arrow')[0].style.display = 'none';
          }
        }
      }
    }
    this.newActiveNum = this.activeTabs;
  }
};
</script>
<style lang="less">
.el-tabs__nav-next, .el-tabs__nav-prev{
  font-size: 30px;
}

#tab-0{
  .el-icon-close{
    display: none;
  }
}

.el-tabs__new-tab{
  display: none;
}

.frameTabs{
  height: 50px;
  .el-tabs__header{
    margin: 0;
  }
}

.el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
  border-bottom-color: #e4e7ed;
}
</style>
<style lang="less" scoped>
@breadColor: #0a96ff;

.frame-main{
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
  font-size: 14px;
  min-width: 1200px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .frame-swiper{
    width: 100%;
    height: 36px;
    color: @breadColor;
    line-height: 35px;
    position: absolute;
    z-index: 4;
    top: 0;
    background-color: #f7f7f7;
    border-bottom: solid 1px #d5d5d5;
    box-sizing: border-box;
    .bread-crumb{
      box-sizing: border-box;
      margin: 0;
      .icon-position{
        cursor: pointer;
      }
      a{
        color: @breadColor;
      }
      span{
        cursor: pointer;
        &.last-one{
          color: #333;
          cursor: auto;
        }
      }
      .swiper-slide{
        display: inline-block;
        min-width: 50px;
        width: auto;
        .nav-link{
          display: inline-block;
          height: 35px;
          background-color: #e5e5e5;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 35px;
          color: #333333;
          padding: 0 30px;
          border-right: 1px solid #d5d5d5;
          position: relative;
          .close-nav{
            position: absolute;
            right: 2px;
            top: 0;
            display: inline-block;
            width: 20px;
            height: 20px;
            svg{
              width: 10px;
            }
          }
        }
        .nav-link.active{
          background-color: #ffffff;
        }
      }
      .swiper-button-prev, .swiper-button-next{
        height: 22px;
        position: fixed;
        top: 79px;
      }
    }
  }
  .easy-scrollbar{
    margin-top: 24px;
  }
  .container{
    padding-top: 11px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    margin-right: -20px;
    overflow-y: scroll;
  }
}
</style>
