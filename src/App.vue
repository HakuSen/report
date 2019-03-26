<template>
  <div id="app">
    <div>
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      isToken: false
    };
  },
  mounted() {
    // this.actionLogin();
  },
  methods: {
    ...mapActions({
      getUserInfo: 'tokenInfo/getUserInfo',
      login: 'tokenInfo/login'
    })
    // 登陆
    // actionLogin() {
    //   if (process.env.NODE_ENV !== 'development') {
    //     this.getUserInfo().then(() => {
    //       this.isToken = true;
    //     });
    //   }
    //   else {
    //     this.login({ username: '15068729764-1', password: '123456' }).then(() => {
    //       this.getUserInfo().then(() => {
    //         this.isToken = true;
    //       });
    //     });
    //   }
    // }
  }
};
</script>

<style lang="less">
@import "reset";

html, body{
  padding: 0;
  margin: 0;
  height: 100%;
  background: #fff;
}

body{
  font-family: "Microsoft YaHei", Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  overflow: hidden;
}

#app{
  /*width    : 100%;*/
  height: 100%;
  /*position: fixed;*/
  margin-right: -20px;
  overflow-y: scroll;
}
</style>
