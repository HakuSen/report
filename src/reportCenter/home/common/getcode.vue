<template>
  <div>
    <el-input placeholder="请输入6位数验证码" class="phone-password"></el-input>
    <el-button type="primary" :disabled="selectDisabled" v-show="sendAuthCode" @click="getAuthCode">发送验证码</el-button>
    <el-button type="primary" v-show="!sendAuthCode"><span>{{auth_time}} </span> 秒</el-button>
  </div>
</template>

<script>
export default {
  name: 'getcode',
  props: ['selectDisabled'],
  data() {
    return {
      sendAuthCode: true, /* 控制显示‘获取按钮’还是‘倒计时’ */
      auth_time: 0 /* 倒计时 计数器 */
    };
  },
  methods: {
    getAuthCode() {
      this.sendAuthCode = false;
      this.auth_time = 30;
      // 请求接口获得验证码
      let timer = setInterval(() => {
        this.auth_time--;
        if (this.auth_time <= 0) {
          this.sendAuthCode = true;
          clearInterval(timer);
        }
      }, 1000);
    }
  }
};
</script>

<style lang="less" scoped>
.phone-password{
  float: left;
  width: 62%;
  margin-right: 5px;
}
</style>
