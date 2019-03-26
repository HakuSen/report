<!--<template></template>-->
<script>
import store from '../../store';

export default {
  name: 'Logout',
  methods: {
    logout() {
      store.commit('info/initstore');
      let token = localStorage.getItem('token');
      if (!token) {
        token = '';
      }
      localStorage.removeItem('token');
      sessionStorage.removeItem('vuex');
      if (process.env.NODE_ENV !== 'development') {
        let redirectUrl = location.href;
        redirectUrl = redirectUrl.substring(0, redirectUrl.lastIndexOf('#'));
        location.href = `${process.env.NODE_TYPE}${redirectUrl}`;
      }
      else {
        this.$router.push({ path: '/login' });
      }
      // location.href = this.Config.silverBoxPath + '/account/exit.htm?redirectType=new_report&type=shop&token=' + token;
    }
  },
  mounted() {
    this.logout();
  }
};
</script>
