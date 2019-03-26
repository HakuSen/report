<template>
  <el-card class="positionTab" style="margin-right: 17%">
    <h2>免费注册</h2>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="26.4%" style="display: flex; flex-direction: column;">
      <div v-show="showError" class="errorMsg">
        <icon name="error" style="margin-top: -3px;vertical-align:middle;"></icon>
        {{errorInfo}}
      </div>
      <el-form-item label="帐号" prop="checkAcount">
        <el-input type="text"
                  auto-complete="off"
                  v-model="ruleForm.checkAcount"
                  placeholder="请输入帐号"
                  @blur="checkAcountHad('ruleForm')"
        >

        </el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="checkPhone">
        <el-input type="text"
                  auto-complete="off"
                  v-model="ruleForm.checkPhone"
                  placeholder="请输入手机号"
                  @input="checkPhoneHad('ruleForm')"
                  @change="clearPhoneCode"
                  maxlength="11"
        >

        </el-input>
      </el-form-item>
      <span @click="toPhoneLogin" class="toLogin" v-show="toLogin">去登陆</span>

      <el-form-item label="验证码" prop="imgCode">
        <el-input
          placeholder="请输入验证码"
          class="imgCodeWrap"
          clearable
          v-model="ruleForm.imgCode"
          :disabled="optionDisable.noImgCode"
        >

        </el-input>
        <img :src="randomHref" alt="验证码" style="width:102px;height:38px;border:1px solid #eee;float: left;" @click="sendResId"/>
      </el-form-item>
      <el-form-item label="短信验证码" prop="checkphoneCode">
        <el-input
          placeholder="请输入6位数验证码"
          class="phone-password"
          v-model="ruleForm.checkphoneCode"
          :disabled="optionDisable.noPhoneCode"
        >

        </el-input>
        <yh-button type="primary" @click="getAuthCode('ruleForm')" :disabled="disableNum > 0" style="height:40px;width:102px;">
          {{disableNum > 0?disableNum+'s 重新获取':'获取验证码'}}
        </yh-button>
        <!--<el-button type="primary" v-show="!sendAuthCode" :disabled="phoneCodeNot"><span>{{auth_time}} </span> 秒</el-button>-->
      </el-form-item>
      <el-form-item label="设置密码" prop="checkPass" class="eyePosition">
        <icon name="eyeopen" class="eyePass" v-show="eyeShow" @click.native="openClose"></icon>
        <icon name="eyeclose" class="eyePass" v-show="!eyeShow" @click.native="openClose"></icon>
        <el-input
          type="password"
          auto-complete="off"
          v-model="ruleForm.checkPass"
          v-show="!passType"
          class="passEye"
          placeholder="数字+字母组合，6-12个字符"
          :disabled="optionDisable.noPass"
        >

        </el-input>
        <el-input
          type="text"
          auto-complete="off"
          v-model="ruleForm.checkPass"
          v-show="passType"
          class="passEye"
          placeholder="数字+字母组合，6-12个字符"
          :disabled="optionDisable.noPass"
        >

        </el-input>
      </el-form-item>
      <yh-button type="primary" style="width: 100%; margin-bottom: 20px;height:40px;" @click="submitRegister('ruleForm')" :disabled="optionDisable.noRegister">
        注册
      </yh-button>
      <div>
        <el-checkbox v-model="userSysChecked">阅读并接受</el-checkbox>
        <span class="userSys" v-if="showUserSys">请阅读并确认下方的《用户协议》</span>
        <router-link to="" style="font-size:14px;text-decoration: none;color: #0096ff;">《用户协议》</router-link>
        <router-link to="/login" style="font-size:14px;float:right;text-decoration: none;color: #0096ff;">已有帐号，去登录</router-link>
      </div>
      <!--<el-checkbox v-model="userSysChecked">阅读并接受</el-checkbox>-->
      <!--<span class="userSys" v-if="showUserSys">请阅读并确认下方的《用户协议》</span>-->
      <!--<router-link to="" style="font-size:14px;text-decoration: none;color: #0096ff;">《用户协议》</router-link>-->
      <!--<router-link to="/login" style="font-size:14px;float:right;text-decoration: none;color: #0096ff;">已有帐号，去登录</router-link>-->
    </el-form>
  </el-card>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Card, Tabs, Input, TabPane, Form, FormItem, Checkbox, MessageBox } from 'element-ui';
import YhButton from '../../components/base/yinhe/button/YhButton';
import SimpleVue from '../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Card, Input, Form, FormItem, Tabs, TabPane, Checkbox);
export default {
  name: 'register',
  components: {
    YhButton
  },
  data() {
    let validateAcount = (rule, value, callback) => {
      if (value === '') {
        this.checkAcount = false;
        callback(new Error('请输入帐号'));
      }
      else if (!(/[a-zA-Z0-9_]{4,10}/.test(value))) {
        this.checkAcount = false;
        callback(new Error('4-24个字符，支持英文、数字、下划线或组合'));
      }
      else if (this.checkAcount) {
        callback(new Error('该帐号已注册，请换一个！'));
        // this.checkAcount = false;
      }
      else {
        callback();
      }
    }; // 帐号验证
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
      else if (value === this.ruleForm.checkAcount) {
        callback(new Error('密码不能跟帐号相同'));
      }
      else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(value)) {
        callback(new Error('密码必须包含：数字+字母组合，6-20个字符'));
      }
      else {
        callback();
      }
    }; // 密码
    let validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
        this.toLogin = false;
      }
      else if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(value))) {
        callback(new Error('请输入11位手机号'));
        this.toLogin = false;
      }
      else if (this.checkPhone) {
        callback(new Error('该手机号已注册，'));
        this.toLogin = true;
        // this.checkPhone = false;
        this.optionDisable.noImgCode = true;
        this.optionDisable.noPhoneCode = true;
        this.optionDisable.noPass = true;
        this.optionDisable.noRegister = true;
        this.optionDisable.noPhoneCodeButton = true;
      }
      else {
        callback();
        this.toLogin = false;
        this.optionDisable.noImgCode = false;
        this.optionDisable.noPhoneCode = false;
        this.optionDisable.noPass = false;
        this.optionDisable.noRegister = false;
        this.optionDisable.noPhoneCodeButton = false;
      }
    }; // 手机号
    let validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
        this.imgCodeMsg = false;
      }
      else if (this.imgCodeMsg) {
        callback(new Error('验证码错误'));
      }
      else {
        callback();
        if (this.ruleForm.checkPhone !== '') {
          this.optionDisable.noPhoneCode = false;
        }
      }
    };
    let validatephoneCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      }
      else if (this.codeMsg) {
        callback(new Error('验证码错误'));
        this.codeMsg = false;
      }
      else {
        callback();
      }
    }; // 短信验证码
    return {
      disableNum: 0,
      passType: false,
      eyeShow: false,
      clickCode: true,
      toLogin: false,
      checkAcount: false,
      checkPhone: false,
      userSysChecked: false,
      imgCodeMsg: false,
      randomHref: '', //  图片验证码
      requestId: '',
      showUserSys: false,
      errorInfo: '',
      showError: false,
      optionDisable: {
        noImgCode: false,
        noPhoneCode: false,
        noPass: false,
        noRegister: false,
        noPhoneCodeButton: false
      },
      ruleForm: {
        checkPass: '',
        checkAcount: '',
        checkPhone: '',
        imgCode: '', // 图片验证码
        checkphoneCode: ''
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
        imgCode: [
          { validator: validateCode, required: true, trigger: 'change' }
        ],
        checkphoneCode: [
          { validator: validatephoneCode, required: true, trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    openClose() {
      this.eyeShow = !this.eyeShow;
      this.passType = !this.passType;
    },
    // 验证帐号是否注册
    checkAcountHad(form) {
      if (this.ruleForm.checkAcount !== '') {
        this.checkAcount = false;
        this.$refs[form].validateField('checkAcount');
        this.$store.dispatch('tokenInfo/acountRegister', { username: this.ruleForm.checkAcount }).then(data => {
          if (data) {
            this.checkAcount = true;
            this.$refs[form].validateField('checkAcount');
          }
        }).catch(() => {
        });
      }
    },
    // 验证手机号手否注册
    checkPhoneHad(form) {
      if (this.ruleForm.checkPhone !== '' && this.ruleForm.checkPhone.length === 11) {
        this.checkPhone = false;
        this.$store.dispatch('tokenInfo/phoneRegister', { phone: this.ruleForm.checkPhone }).then(data => {
          if (data) {
            this.checkPhone = true;
            this.$refs[form].validateField('checkPhone');
          }
        }).catch(() => {
        });
      }
    },
    // 获取短信验证码
    getAuthCode(form) {
      this.$store.dispatch('tokenInfo/checkImgCode', { image_code: this.ruleForm.imgCode, reqest_id: this.requestId }).then(() => {
        this.imgCodeMsg = false;
        this.$refs[form].validateField('imgCode');
        clearInterval(this.disableTimer);
        this.disableNum = 60;
        if (this.ruleForm.checkPhone === '') {
          this.$refs[form].validateField('checkPhone');
        }
        else {
          this.$store.dispatch('tokenInfo/getPhoneCode', { phone: this.ruleForm.checkPhone }).then(() => {
            this.optionDisable.noPhoneCodeButton = true;
            this.disableTimer = setInterval(() => {
              if (this.disableNum === 0) {
                clearInterval(this.disableTimer);
                this.optionDisable.noPhoneCodeButton = false;
              }
              this.disableNum--;
            }, 1000);
          });
        }
      }).catch(() => {
        this.imgCodeMsg = true;
        this.$refs[form].validateField('imgCode');
      });
    },
    // 图片验证码发送本地id
    sendResId() {
      this.requestId = Date.parse(new Date());
      this.$store.dispatch('tokenInfo/getImgCode', { request_id: this.requestId }).then(data => {
        this.randomHref = data.data['img_str'];
      });
    },
    clearPhoneCode() {
      if (this.ruleForm.checkphoneCode !== '') {
        this.ruleForm.checkphoneCode = '';
      }
    },
    submitRegister(form) {
      this.$refs[form].validate(valid => {
        if (this.userSysChecked) {
          if (valid) {
            let registerInfo = {
              password: this.ruleForm.checkPass,
              phone: this.ruleForm.checkPhone,
              username: this.ruleForm.checkAcount,
              code: this.ruleForm.checkphoneCode,
              source: 1
            };
            this.$store.dispatch('tokenInfo/fastRegister', registerInfo).then(() => {
              this.showError = false;
              MessageBox.alert('注册成功', '提示', { type: 'success', showClose: false });
              this.$router.push({ path: '/login' });
            }).catch(error => {
              this.showError = true;
              this.errorInfo = error.data['sub_msg'];
            });
          }
        }
        else {
          this.showUserSys = true;
          setTimeout(() => {
            this.showUserSys = false;
          }, 3000);
        }
      });
    },
    toPhoneLogin() {
      this.$router.push({
        path: '/login',
        query: { flag: 1 }
      });
    }
  },
  mounted() {
    this.sendResId();
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-form-item.is-success .el-input__inner{
  border-color: #dcdfe6
}

.positionTab{
  position: relative;
  // width       : 30%;
  width: 410px;
  // left     : 55%;
  // top      : 15%;

  .errorMsg{
    width: calc(100% - 71px);
    padding: 5px;
    border: 1px solid #ff0000;
    background: #fff0eb;
    font-size: 10px;
    color: #333333;
    // margin-bottom : 10px;
    position: absolute;
    top: 61px;
    z-index: 1;
  }
  .imgCodeWrap{
    width: 55.2%;
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
  .eyePosition{
    position: relative;
    .eyePass{
      position: absolute;
      right: 3%;
      top: 13px;
      z-index: 1;
    }
  }
  .toLogin{
    position: absolute;
    left: 53%;
    top: 36%;
    font-size: 12px;
    text-decoration: none;
    color: #42a6ff;
    cursor: pointer;
  }
  .phone-password{
    float: left;
    width: 55.2%;
    margin-right: 10px;
  }
  .userSys{
    position: absolute;
    top: 43%;
    left: 23%;
    display: block;
    padding: 12px;
    background: #4c4c4c;
    color: #fff;
    opacity: 0.7;
    border-radius: 3px;
  }
}

</style>
