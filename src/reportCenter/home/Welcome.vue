<!--------------------------------------------------
  进入时的欢迎页
---------------------------------------------------->
<template>
  <div class="welcome" :style="{'height': heightDocument}">
    <header>
      <section></section>
    </header>
    <section class="welCon">
      <p>{{message}}</p>
    </section>
    <footer>
      <p>备案号:浙ICP备|14035810号</p>
      <p>©2018.blibao.com Inc.All Rights Reserved.银盒宝成</p>
    </footer>
  </div>
</template>

<script>
import { PersistedClear } from 'vue-simple';

import store from '../../store';
import { fetchMenuList, fetchUserInfo } from './mixins/userinfo';

export default {
  name: 'Welcome',
  data() {
    return {
      message: '',
      completed: false,
      heightDocument: 0
    };
  },
  methods: {
    delayEntry(path, time) {
      setTimeout(() => {
        this.$router.push(path);
      }, time);
    },

    /**
     * 指定加载任务
     * @param title
     * @param loader
     */
    async load({ title, loader }) {
      this.completed = false;
      this.message = title;

      if (typeof loader === 'function') await loader();

      this.completed = true;
    }
  },
  // async/await 不能缺少，否则 this.load() 的后续业务少于其加载时间会越过超前执行
  // 加上这个 async/await 的目的是等待异步完成
  async mounted() {
    await this.load({
      title: '正在启动应用……'
      // 若有加载需求，通过 Promise 进行异步包装
      // loader() {
      //   return new Promise(resolve => {
      //     setTimeout(() => {
      //       resolve();
      //     }, 5000);
      //   });
      // }
    });
    const existToken = store.getters['tokenInfo/token'] || this.$route.query['token'];

    if (existToken) {
      // 还原 token 到 store 和 localStorage
      if (this.$route.query['token']) {
        const { token } = this.$route.query;
        store.commit('tokenInfo/setLogInfo', { token });
      }
      // 请求用户信息
      fetchUserInfo().then(() => {
        fetchMenuList().then(() => {

          // 登录数据有效，且菜单请求成功
          // 代表当前属于登录有效期内刷新等操作，直接进入忽视登录路由

          // 若是由后台某页面刷新后重定向过来的，需要还原到目标
          // 正常直接进入后台首页
          const vuexInfo = JSON.parse(sessionStorage.getItem('vuex')).info;
          const ref_source = '/frame' + vuexInfo.titleArray[vuexInfo.activeTabs].menu.fullpath || '/frame/home';
          const to_query = this.$route.query['to_query'] || null;

          this.delayEntry({ path: ref_source, query: { ...to_query } }, 500);

        }).catch(() => {

          // 菜单数据请求失败，未分配，网络失败，token过期等
          this.$store.dispatch('info/getTitleArray', { titleArray: -1 });
          PersistedClear.remove('tokenInfo/setLogInfo');// 菜单请求不到，该帐号没有分配菜单，清除登录存的缓存用户信息
          this.delayEntry({ path: '/login' }, 500);

        });
      }).catch(() => {

        // 用户信息请求失败
        this.$store.dispatch('info/getTitleArray', { titleArray: -1 });
        PersistedClear.remove('tokenInfo/setLogInfo');// 菜单请求不到，该帐号没有分配菜单，清除登录存的缓存用户信息
        this.delayEntry({ path: '/login' }, 500);

      });
    }
    else {
      // 正常未登录状态进入登录界面
      this.$store.dispatch('info/getTitleArray', { titleArray: -1 });
      this.delayEntry({ path: '/login' }, 500);
    }
    this.heightDocument = document.body.offsetHeight + 'px';
  }
};
</script>

<style lang="less" scoped>
.welcome{
  height: 100%;
  width: 100%;
  background: url("../../assets/bigBackground.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  header{
    width: 100%;
    height: 144px;
    section{
      width: 100%;
      height: 100%;
      background: url("../../assets/LOGO-welcome.png") no-repeat 50px center;
    }
  }
  .welCon{
    flex: 1;
    background: url("../../assets/centerBig.png") no-repeat center center;
    background-size: contain;
    display: flex;
    align-items: center;
    justify-content: center;
    p{
      color: #ffffff;
      font-size: 24px;
    }
  }
  footer{
    height: 144px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p{
      font-size: 16px;
      color: #4162d5;
    }
    p:first-child{
      margin-bottom: 14px;
    }
  }
}
</style>
