<template>
  <el-card class="positionTab">
    <div class="loginNotice">
      <icon name="warning" style="vertical-align: middle;margin-top: -4px;"></icon>
      <span>帐号没有绑定手机号，请拨打客服热线400-666-3907进行重置</span>
    </div>
    <h2 style="height: 30px;
    text-align: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    margin-top: 10px;
    font-size: 16px;">忘记密码</h2>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="26.4%" class="changeForm">
      <div v-show="showError" class="errorMsg">
        <icon name="error" style="margin-top: -3px; vertical-align:middle;"></icon>
        {{errorInfo}}
      </div>
      <el-form-item label="帐号" prop="checkAcount">
        <el-input type="text" auto-complete="off"
                  v-model="ruleForm.checkAcount"
                  placeholder="请输入帐号"
                  :disabled="disabledAcount"
                  @focus="errorShowHide"></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="checkPhone">
        <el-input type="text" auto-complete="off"
                  v-model="ruleForm.checkPhone"
                  placeholder="请输入手机号"
                  @focus="errorShowHide"
                  maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="imgCode">
        <el-input
          placeholder="请输入验证码"
          class="imgCodeWrap"
          clearable
          v-model="ruleForm.imgCode"
          @focus="errorShowHide"
        >
        </el-input>
        <span class="imgWrap">
          <img :src="randomHref" style="width:100%;height:100%;" @click="sendResId"/>
        </span>
      </el-form-item>
      <el-form-item label="短信验证码" prop="checkPhoneCode">
        <el-input placeholder="请输入6位数验证码"
                  name="phoneCodeAcount"
                  class="phone-password"
                  @focus="errorShowHide"
                  v-model="ruleForm.checkPhoneCode"></el-input>
        <yh-button type="primary" @click="getAuthCode('ruleForm')" :disabled="disabledSend" style="height:40px;width:112px;">
          {{this.disabledSend?disableNum+'s 重新获取':'获取验证码'}}
        </yh-button>
      </el-form-item>
      <el-form-item label="新密码" prop="checkPass" class="eyePosition">
        <icon name="eyeopen" class="eyePass" v-show="eye.eyeShow" @click.native="openClose"></icon>
        <icon name="eyeclose" class="eyePass" v-show="!eye.eyeShow" @click.native="openClose"></icon>
        <el-input
          type="password"
          auto-complete="off"
          v-model="ruleForm.checkPass"
          v-show="!pass.passType"
          @focus="errorShowHide"
          class="passEye"
          placeholder="数字+字母组合，6-12个字符"
        >

        </el-input>
        <el-input
          type="text"
          auto-complete="off"
          v-model="ruleForm.checkPass"
          v-show="pass.passType"
          @focus="errorShowHide"
          class="passEye"
          placeholder="数字+字母组合，6-12个字符"
        >

        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" class="eyePosition" prop="confirmPass">
        <icon name="eyeopen" class="eyePass" v-show="eye.eyeShowC" @click.native="openCloseC"></icon>
        <icon name="eyeclose" class="eyePass" v-show="!eye.eyeShowC" @click.native="openCloseC"></icon>
        <el-input
          type="password"
          auto-complete="off"
          v-model="ruleForm.confirmPass"
          v-show="!pass.passTypeC"
          @focus="errorShowHide"
          class="passEye"
          placeholder="数字+字母组合，6-12个字符"
        >

        </el-input>
        <el-input
          type="text"
          auto-complete="off"
          v-model="ruleForm.confirmPass"
          v-show="pass.passTypeC"
          @focus="errorShowHide"
          class="passEye"
          placeholder="数字+字母组合，6-12个字符"
        >
        </el-input>
      </el-form-item>
      <yh-button
        style="width: 100%;margin-bottom: 16px;"
        type="primary"
        class="submitChange"
        @click="submitChange('ruleForm')"
        :disabled="submitLoad"
        :loading="submitLoad">
        {{this.submitLoad?'正在修改，请稍后..':'确认修改'}}
      </yh-button>
      <span @click="toLogin" class="toLogin">
        已有帐号，去登录
      </span>
    </el-form>
  </el-card>
</template>

<script>

import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Card, Input, Form, FormItem, Tabs, TabPane, Loading } from 'element-ui';
import YhButton from '../../components/base/yinhe/button/YhButton';
import SimpleVue from '../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Tabs, TabPane, Card, Input, Form, FormItem, Loading);
export default {
  name: 'findpass',
  data() {
    let validateAcount = (rule, value, callback) => {
      if (value === '') {
        this.errorAcount = false;
        callback(new Error('请输入帐号'));
      }
      else if (!(/[\u4e00-\u9fa5_a-zA-Z0-9_]{4,10}/.test(value))) {
        this.errorAcount = false;
        callback(new Error('4-24个字符，支持中文、英文、数字或组合'));
      }
      else {
        callback();
      }
    };
    let validatePhone = (rule, value, callback) => {
      if (value === '') {
        this.errorPhone = false;
        callback(new Error('请输入手机号'));
      }
      else if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(value))) {
        this.errorPhone = false;
        callback(new Error('请输入11位正确手机号'));
      }
      else {
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
      else if (value === this.ruleForm['acount']) {
        callback(new Error('密码不能跟帐号相同'));
      }
      else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(value)) {
        callback(new Error('密码必须包含：数字+字母组合，6-20个字符'));
      }
      else {
        callback();
      }
    };
    let validatePhoneCode = (rule, value, callback) => {
      if (value === '') {
        this.codeMsg = false;
        callback(new Error('请输入验证码'));
      }
      else {
        callback();
      }
    };
    let validateImgCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
        this.imgCodeMsg = false;
      }
      else if (this.imgCodeMsg) {
        callback(new Error('验证码错误'));
      }
      else {
        callback();
      }
    };
    let validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
      else if (value === this.ruleForm['acount']) {
        callback(new Error('密码不能跟帐号相同'));
      }
      else if (value !== this.ruleForm.checkPass) {
        callback(new Error('保持两次密码输入相同'));
      }
      else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(value)) {
        callback(new Error('密码必须包含：数字+字母组合，6-20个字符'));
      }
      else {
        callback();
      }
    };
    return {
      disableNum: 60,
      requestId: '',
      disabledSend: false,
      imgCodeMsg: false,
      submitLoad: false,
      randomHref: '',
      showError: false,
      errorInfo: '',
      disabledAcount: false,
      eye: {
        eyeShow: false,
        eyeShowC: false
      },
      pass: {
        passType: false,
        passTypeC: false
      },
      ruleForm: {
        checkPass: '',
        checkAcount: '',
        checkPhone: '',
        imgCode: '',
        checkPhoneCode: '',
        confirmPass: ''
      },
      rules: {
        checkAcount: [
          { validator: validateAcount, required: true, trigger: 'change' }
        ],
        checkPhone: [
          { validator: validatePhone, required: true, trigger: 'change' }
        ],
        checkPass: [
          { validator: validatePass, required: true, trigger: 'change' }
        ],
        checkPhoneCode: [
          { validator: validatePhoneCode, required: true, trigger: 'change' }
        ],
        imgCode: [
          { validator: validateImgCode, required: true, trigger: 'change' }
        ],
        // originPass: [
        //   { validator: validateOriginPass, required: true, trigger: 'change' }
        // ],
        // newPass: [
        //   { validator: validateNewPass, required: true, trigger: 'change' }
        // ],
        confirmPass: [
          { validator: validateConfirmPass, required: true, trigger: 'change' }
        ]
      }
    };
  },
  components: {
    YhButton
  },
  mounted() {
    // this.defaultHandle();
    this.sendResId();
  },
  computed: {
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    })
  },
  methods: {
    defaultHandle() {
      this.passTitle = this.$route.query['title'] ? '设置新密码' : '忘记密码';
      this.ruleForm.checkAcount = this.$route.query['acount'] ? this.$route.query['acount'] : '';
      this.$route.query['acount'] ? this.disabledAcount = true : this.disabledAcount = false;
      this.$route.query['title'] ? this.editPass = false : this.editPass = true;
    },
    errorShowHide() {
      this.showError = false;
      this.errorInfo = '';
    },
    openClose() {
      this.eye.eyeShow = !this.eye.eyeShow;
      this.pass.passType = !this.pass.passType;
    },
    // openCloseA() {
    //   this.eye.eyeShowA = !this.eye.eyeShowA;
    //   this.pass.passTypeA = !this.pass.passTypeA;
    // },
    // openCloseB() {
    //   this.eye.eyeShowB = !this.eye.eyeShowB;
    //   this.pass.passTypeB = !this.pass.passTypeB;
    // },
    openCloseC() {
      this.eye.eyeShowC = !this.eye.eyeShowC;
      this.pass.passTypeC = !this.pass.passTypeC;
    },
    getAuthCode(form) {
      if (this.ruleForm.checkPhone === '' || this.ruleForm.checkAcount === '' || this.ruleForm.imgCode === '') {
        this.$refs[form].validateField('checkPhone');
        this.$refs[form].validateField('checkAcount');
        this.$refs[form].validateField('imgCode');
      }
      else {
        let params = {
          username: this.ruleForm.checkAcount,
          phone: this.ruleForm.checkPhone
        };
        this.$store.dispatch('tokenInfo/checkUserAndPhone', params).then(() => {
          this.$store.dispatch('tokenInfo/checkImgCode', { image_code: this.ruleForm.imgCode, reqest_id: this.requestId }).then(() => {
            clearInterval(this.disableTimer);
            this.disableNum = 60;
            this.$store.dispatch('tokenInfo/getPhoneCode', { phone: this.ruleForm.checkPhone }).then(() => {
              this.disabledSend = true;
              this.disableTimer = setInterval(() => {
                if (this.disableNum === 0) {
                  clearInterval(this.disableTimer);
                  this.disabledSend = false;
                }
                this.disableNum--;
              }, 1000);
            });
          }).catch(error => {
            this.showError = true;
            this.errorInfo = error.data['sub_msg'];
          });
        }).catch(error => {
          this.showError = true;
          this.errorInfo = error.data['sub_msg'];
        });
      }
    },
    // getAuthCode(form) {
    //   if (this.ruleForm.imgCode === '') {
    //     this.$refs[form].validateField('imgCode');
    //   }
    //   else {
    //     this.$store.dispatch('tokenInfo/checkImgCode', { image_code: this.ruleForm.imgCode, reqest_id: this.requestId }).then(() => {
    //       this.imgCodeMsg = false;
    //       this.$refs[form].validateField('imgCode');
    //       if (this.ruleForm.checkPhone === '') {
    //         this.$refs[form].validateField('checkPhone');
    //       }
    //       else {
    //         clearInterval(this.disableTimer);
    //         this.disableNum = 60;
    //         this.$store.dispatch('tokenInfo/getPhoneCode', { phone: this.ruleForm.checkPhone }).then(() => {
    //           this.disabledSend = true;
    //           this.disableTimer = setInterval(() => {
    //             if (this.disableNum === 0) {
    //               clearInterval(this.disableTimer);
    //               this.disabledSend = false;
    //             }
    //             this.disableNum--;
    //           }, 1000);
    //         });
    //       }
    //     }).catch(error => {
    //       if (error.data.code === '40002') {
    //         this.imgCodeMsg = true;
    //         this.$refs[form].validateField('imgCode');
    //       }
    //     });
    //   }
    // },
    sendResId() {
      this.loginAble = true;
      this.requestId = Date.parse(new Date());
      this.$store.dispatch('tokenInfo/getImgCode', { request_id: this.requestId }).then(data => {
        this.randomHref = data.data['img_str'];
      });
    },
    submitChange(form) {
      // 忘记密码
      // if (this.editPass === true) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let phoneinfo = {
            smg_code: this.ruleForm.checkPhoneCode,
            phone: this.ruleForm.checkPhone,
            password: this.ruleForm.checkPass,
            username: this.ruleForm.checkAcount
          };
          this.submitLoad = true;
          this.$store.dispatch('tokenInfo/findPass', phoneinfo).then(() => {
            this.$router.push('/login');
          }).catch(error => {
            this.showError = true;
            this.errorInfo = error.data['sub_msg'];
          }).finally(() => {
            this.submitLoad = false;
          });
        }
        else {
          return false;
        }
      });
      // }
      // 设置密码
      // else if (this.editPass === false || this.$route.query['title']) {
      //   this.$refs[form].validate(valid => {
      //     if (valid) {
      //       let editinfo = {
      //         new_password: this.ruleForm.newPass,
      //         password: this.ruleForm.originPass,
      //         type: this.userinfo.type,
      //         user_id: this.userinfo.user_id,
      //         username: this.ruleForm.checkAcount
      //       };
      //       this.submitLoad = true;
      //       this.$store.dispatch('tokenInfo/editPass', editinfo).then(data => {
      //         let updateLogin = {
      //           type: this.userinfo.type,
      //           user_id: this.userinfo.user_id
      //         };
      //         this.$store.dispatch('tokenInfo/updateLoginState', updateLogin).then(() => {
      //           this.$store.dispatch('tokenInfo/logout').then(() => {
      //             this.$store.dispatch('history/clearHistory');
      //             this.$router.push('/login');
      //           });
      //         }).catch(() => {
      //         });
      //       }).catch(() => {
      //         this.showError = true;
      //         this.errorInfo = error.data['sub_msg'];
      //       }).finally(() => {
      //         this.submitLoad = false;
      //       });
      //     }
      //     else {
      //       return false;
      //     }
      //   });
      // }
    },
    toLogin() {
      if (this.$route.query['title']) {
        this.$store.dispatch('tokenInfo/logout').then(() => {
          this.$store.dispatch('history/clearHistory').then(() => {
            this.$router.push('/login');
          });
        });
      }
      else {
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style lang="less" scoped>
.loginContainer{
  display: flex;
  flex-direction: column;
}

/deep/ .el-form-item.is-success .el-input__inner{
  border-color: #dcdfe6
}

.positionTab{
  margin-right: 17%;
  width: 410px;
  .errorMsg{
    width: calc(100% - 12px);
    padding: 5px;
    border: 1px solid #ff0000;
    background: #fff0eb;
    font-size: 10px;
    color: #333333;
    margin-bottom: 10px;
  }
  .imgCodeWrap{
    width: 52.6%;
    float: left;
    margin-right: 10px;
  }
  h2{
    height: 30px;
    text-align: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
  }
  /deep/ .el-form-item__label{
    text-align: center;
  }
  .imgWrap{
    display: inline-block;
    float: left;
    border: 1px solid #eee;
    width: 110px;
    height: 38px;
    line-height: 38px;
  }
  .eyePosition{
    position: relative;
    .eyePass{
      position: absolute;
      right: 3%;
      top: 13px;
      z-index: 1;
    }
  }
  .phone-password{
    float: left;
    width: 52.6%;
    margin-right: 10px;
  }
  .toLogin{
    font-size: 14px;
    text-decoration: none;
    cursor: pointer;
    color: #0096ff;
    margin-left: 68%;
  }
}
</style>
