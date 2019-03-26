<template>
  <div class="loginContainer">
    <logintop/>
    <div class="loginContent">
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </div>
    <loginbottom/>
  </div>
</template>

<script>

import Logintop from './common/logintop';
import Loginbottom from './common/loginbottom';

export default {
  name: 'Acount',
  components: {
    Logintop,
    Loginbottom
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.loginContainer{
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  line-height: 20px;
  height: 900px;
  .el-main{
    width: 100%;
    padding: 0 !important;
  }
  .loginContent{
    width: 100%;
    background: url('../../assets/loginBackground.png') no-repeat 50%;
    background-size: cover;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 1;
    /deep/ .el-card__body{
      padding: 30px;
    }
  }
}

</style>
