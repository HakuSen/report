<template>
  <div style="width: 100%;height: 50px;">
    <div class="loginHeader">
    <span class="imgCan">
      <img src="../../../../static/img/logo.png" alt="">
    </span>
      <span class="loginInfo">
      <span>下载商家APP</span>
      <span>|</span>
      <span>400-666-3907</span>
    </span>
    </div>
  </div>

</template>

<script>
export default {
  name: 'loginTop'
};
</script>

<style lang="less" scoped>
.loginHeader{
  width: calc(100% - 480px);
  height: 50px;
  line-height: 50px;
  margin: 0 auto;
  .imgCan{
    display: inline-block;
    float: left;
    width: 120px;
    height: 32px;
    padding: 12px;
  }
  .loginInfo{
    float: right;
    display: inline-block;
    height: 60px;
    line-height: 60px;
  }
}
</style>
