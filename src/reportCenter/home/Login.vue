<template>
  <div class="loginContainer" :style="{'height': heightDocument}">
    <Logintop/>
    <div class="loginContent">
      <el-card class="positionTab" v-show="tabShow">
        <div class="loginNotice">
          <icon name="warning" style="vertical-align: middle;margin-top: -4px;"></icon>
          <span style="font-size: 12px;">帐号是在2018-11-21前注册的，首次登录请点击左下角老后台登录</span>
        </div>
        <!--<div class="ma" @click="loginMa()">-->
        <!--<img src="../../../static/img/ma.png" alt="二维码">-->
        <!--</div>-->
        <el-tabs v-model="activeName" :stretch="true">
          <el-tab-pane label="帐号密码登录" name="first">
            <div v-show="showErrorA" class="errorMsg" style="padding: 0 20px">
              <icon name="error" class="iconSty" autosize></icon>
              {{errorInfoA}}
            </div>
            <el-form ref="form" :model="form" :rules="rules" style="padding: 0 20px">
              <el-form-item prop="username" class="acountError">
                <el-input placeholder="请输入用户名"
                          class="account-userInput"
                          v-model.trim="form.username"
                          @focus="hidedrop"
                          @keyup.enter.native="onSubmit('form')"
                ></el-input>
                <icon :name="dropLog" class="dropDown" @click.native="handledrop" v-show="showHistory"></icon>
                <ul v-show="showdrop" class="acountList">
                  <li v-for="(item,index) in acountList" :key="item.id">
                    <span @click="putdrop(item)" class="historyAcount">{{item}}</span>
                    <span class="el-icon-circle-close removeHistory" @click="removelog(index)"></span>
                  </li>
                </ul>
              </el-form-item>
              <el-form-item prop="password">
                <el-input placeholder="请输入密码" type="password" class="account-password"
                          v-model.trim="form.password" clearable
                          @keyup.enter.native="onSubmit('form')"
                ></el-input>
              </el-form-item>
              <!--登录三次需要有验证码-->
              <el-form-item v-show="idCodeShow" prop="imgCode">
                <el-input placeholder="请输入验证码" class="imgCodeWrap" clearable
                          @input="checkCodeImg('form')"
                          v-model="imgCode"
                          @keyup.enter.native="onSubmit('form')"
                ></el-input>
                <img :src="randomHref" alt="验证码" style="height:38px;border:1px solid #eee;float: left;" @click="sendResId"/>
              </el-form-item>
            </el-form>
            <div class="account-register">
              <div style="display: flex; justify-content: space-between;">
                <el-checkbox v-model="checked">5天内自动登录</el-checkbox>
                <span @click="toFindPass" class="findPassSty">忘记密码?</span>
              </div>
              <yh-button type="primary" class="account-login"
                         :loading="loginSubmiting"
                         @click.enter="onSubmit('form')"
                         :disabled="loginSubmiting"
              >
                {{this.loginSubmiting?'正在登录...':'登录'}}
              </yh-button>
            </div>
            <div class="bottomHandle">
              <span>
               <router-link to="/acount/oldlogin" class="zfbText">老后台登录</router-link>
                <span style="color:#0096ff;">|</span>
                <icon name="zhifubao" class="zhifubao" autosize></icon>
              </span>
              <!--<router-link to="/acount/register" class="registerSty">立即注册</router-link>-->
            </div>
          </el-tab-pane>
          <el-tab-pane label="手机短信验证码" name="second">
            <div v-show="showError" class="errorMsg" style="padding: 0 20px">
              <icon name="error" class="iconSty"></icon>
              {{errorInfo}}
            </div>
            <el-form ref="phoneform" :model="phoneform" :rules="phonerules">
              <el-form-item prop="phonenum" style="padding: 0 20px">
                <el-input placeholder="请输入手机号"
                          class="phone-phonenumber"
                          clearable
                          v-model="phoneform.phonenum"
                          prop="phonenum"
                          maxlength="11"
                          @input="checkPhoneNum"
                          @keyup.enter.native="phoneLogin('phoneform')"
                ></el-input>
              </el-form-item>
              <el-form-item prop="phonecode" style="margin-bottom: 4px;padding: 0 20px;">
                <el-input name="phoneCode"
                          placeholder="请输入6位数验证码"
                          class="phone-password"
                          v-model="phoneform.phonecode"
                          clearable
                          @keyup.enter.native="phoneLogin('phoneform')"
                ></el-input>
                <yh-button type="primary" @click="getAuthCode('phoneform')" style="width:110px;height:40px;" :disabled="disableSend">
                  {{this.disableSend?disableNum+'s 重新获取':'获取验证码'}}
                </yh-button>
              </el-form-item>
            </el-form>
            <div style=" padding: 0 20px 10px;">
              <yh-button type="primary" class="phone-login"
                         :loading="loginSubmiting"
                         @click="phoneLogin('phoneform')"
                         :disabled="loginSubmiting"
              >
                {{this.loginSubmiting?'正在登录...':'登录'}}
              </yh-button>
            </div>
            <div class="bottomHandle">
              <span>
                <router-link to="/acount/oldlogin" class="zfbText">老后台登录</router-link>
                <span style="color:#0096ff;">|</span>
                <icon name="zhifubao" class="zhifubao" autosize></icon>
              </span>
              <!--<router-link to="/acount/register" class="registerSty">立即注册</router-link>-->
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!--<el-card v-if="!tabShow" class="positionMa">-->
      <!--<div class="ma" @click="logoutMa()">-->
      <!--<img src="../../../static/img/closema.png" alt="关闭二维码">-->
      <!--</div>-->
      <!--<div class="maInfo">-->
      <!--<div style="height: 30px; border-bottom: 1px solid #ccc;">手机扫码，安全登录</div>-->
      <!--<div v-if="maLoginOk">-->
      <!--<vue-qr :text="qrContent" class="maWrap" v-show="qrOrqrExpire" logoSrc="../../../static/img/favicon.png" :margin="0"></vue-qr>-->
      <!--<div class="qrExpire" v-show="!qrOrqrExpire">-->
      <!--<img src="../../../static/img/qrExpire.png" alt="">-->
      <!--<div class="qrText">-->
      <!--<p>二维码失效</p>-->
      <!--<p style="font-size: 14px;color: #0096ff;" @click="againGetMa">重新获取</p>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div>-->
      <!--<icon name="saoyisao" style="vertical-align: middle; width:17px;height:15px;"></icon>-->
      <!--<span class="saoApp">-->
      <!--打开<span style="color: #0096ff;">商家APP</span>扫一扫登陆-->
      <!--</span>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div v-if="!maLoginOk">-->
      <!--<div class="saoMaOk">-->
      <!--<img src="../../../static/img/appOk.png" alt="">-->
      <!--<p>扫描成功！</p>-->
      <!--<p>请在手机上确认登录</p>-->
      <!--<p class="toMaLogin" @click="loginMa">返回二维码扫码登录</p>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="ma-otherLogin">-->
      <!--<span style="cursor: pointer" @click="toAcountLoign">密码登录</span>-->
      <!--<span>|</span>-->
      <!--<router-link to="/acount/register" style="color:#494949; text-decoration: none;">免费注册</router-link>-->
      <!--</div>-->
      <!--</el-card>-->
    </div>
    <Loginbottom/>
  </div>
</template>

<script>
import Vue from 'vue';
import VueQr from 'vue-qr';
import { mapGetters } from 'vuex';
import { PersistedClear } from 'vue-simple';
import { Tabs, TabPane, Card, Input, Message, Form, FormItem, Checkbox, Select, Option, MessageBox } from 'element-ui';
import YhButton from '../../components/base/yinhe/button/YhButton';
import StatusCode from '../../conf/response.code.conf';
import SimpleVue from '../../plugins/SimpleVue';
import Logintop from './common/logintop';
import Loginbottom from './common/loginbottom';
import { fetchMenuList, fetchUserInfo } from './mixins/userinfo';

Vue.use(SimpleVue);
Vue.prototype.$message = Message;
Vue.batch.use(Tabs, TabPane, Card, Input, Checkbox, Form, FormItem, Select, Option);
export default {
  name: 'login',
  components: {
    VueQr,
    Logintop,
    Loginbottom,
    YhButton
  },
  data() {
    let validateAcount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('帐号不能为空'));
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === '') { // this.passEmpty
        callback(new Error('密码不能为空'));
      }
    };
    let validateImg = (rule, value, callback) => {
      if (this.imgCode === '') {
        callback(new Error('验证码不能为空'));
      }
      else if (this.imgCodeCheck) {
        callback(new Error('验证码错误'));
        this.imgCodeCheck = false;
      }
      else {
        callback();
      }
    };
    let validatephoneNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'));
      }
      else if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(value))) {
        callback(new Error('请输入11位正确手机号'));
      }
      else {
        callback();
      }
    };
    let validatephoneCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'));
      }
      else {
        callback();
      }
    };
    return {
      disableNum: 60,
      loginSubmiting: false,
      activeName: '',
      checked: false,
      tabShow: true,
      threeLogin: 0,
      idCodeShow: false, // 登录失败需要出现验证码验证
      dropLog: 'dropdown',
      showHistory: false,
      showError: false,
      errorInfo: '',
      showErrorA: false,
      errorInfoA: '',
      disableSend: false,
      showdrop: false,
      acountList: '',
      qrContent: '', // 二维码
      timer: '',
      ucode: '', // 二维码登录id
      maLoginOk: true,
      qrOrqrExpire: true, // 二维码失效显示
      loginAble: false, // 图形验证码控制的登录能不能点
      randomHref: '',
      requestId: '',
      imgCodeCheck: false,
      time: '',
      form: {
        username: '',
        password: '',
        remember: ''
      },
      rules: {
        username: [
          { validator: validateAcount, trigger: 'change' }
        ],
        password: [
          { validator: validatePass, trigger: 'change' }
        ],
        imgCode: [
          { validator: validateImg, trigger: 'change' }
        ]
      },
      imgCode: '',
      phoneform: {
        phonenum: '',
        phonecode: ''
      },
      phonerules: {
        phonecode: [
          { validator: validatephoneCode, trigger: 'change' }
        ],
        phonenum: [
          { validator: validatephoneNum, trigger: 'change' }
        ]
      },
      heightDocument: 0
    };
  },
  computed: {
    ...mapGetters({
      token: 'tokenInfo/token',
      userinfo: 'tokenInfo/userinfo',
      first_login: 'tokenInfo/first_login'
    })
  },
  methods: {
    toAcountLoign() {
      this.tabShow = true;
    },
    toFindPass() {
      this.$router.push({
        path: '/acount/findpass'
      });
    },
    loginMa() {
      this.tabShow = false;
      this.maLoginOk = true;
      this.createQr(); // 生成二维码
    },
    logoutMa() {
      this.tabShow = true;
      clearInterval(this.timer);
    },
    handledrop() {
      if (this.dropLog === 'dropdown') {
        this.dropLog = 'dropup';
        this.showdrop = true;
      }
      else if (this.dropLog === 'dropup') {
        this.dropLog = 'dropdown';
        this.showdrop = false;
      }
    },
    hidedrop() {
      this.showHistory = true;
      this.dropLog = 'dropdown';
      this.showdrop = false;
    },
    dropIcon() {
      this.showHistory = false;
    },
    putdrop(value) {
      this.form.username = value;
      this.dropLog = 'dropdown';
      this.showdrop = false;
    },
    removelog(index) {
      this.acountList.splice(index, 1);
      localStorage.setItem('acount', JSON.stringify(this.acountList));
      if (this.acountList.length === 0) {
        this.showdrop = false;
        this.dropLog = 'dropdown';
      }
    },
    // 先取出local，放进数组，在unshift进去新的重新存
    saveAcount() {
      if (localStorage.getItem('acount') === null) {
        let localArr = [];
        localArr.unshift(this.form.username);// ['10000']
        localStorage.setItem('acount', JSON.stringify(localArr));
        this.acountList = JSON.parse(localStorage.getItem('acount'));
      }
      else {
        let historyArr = JSON.parse(localStorage.getItem('acount'));
        if (historyArr.indexOf(this.form.username) === -1) {
          historyArr.unshift(this.form.username);
          localStorage.setItem('acount', JSON.stringify(historyArr));
          this.acountList = JSON.parse(localStorage.getItem('acount'));
        }
        if (historyArr.length >= 10) {
          historyArr.splice(9, historyArr.length - 10);
          this.acountList = JSON.parse(localStorage.getItem('acount'));
        }
      }
    },
    // 验证手机号
    checkPhoneNum() {
      let phoneNum = {
        phone: this.phoneform.phonenum
      };
      if (this.phoneform.phonenum.length === 11) {
        this.$store.dispatch('tokenInfo/checkPhoneNum', phoneNum).then(() => {
          this.showError = false;
        }).catch(error => {
          let code = error.data.code;
          if (code !== StatusCode.BUSINESS) {
            this.showError = true;
            this.errorInfo = error.data['sub_msg'];
          }
        });
      }
    },
    // 手机号登录获取验证码
    getAuthCode(form) {
      clearInterval(this.disableTimer);
      this.disableNum = 60;
      if (this.phoneform.phonenum === '') {
        this.$refs[form].validateField('phonenum');
      }
      else {
        // 请求接口获得验证码
        this.$store.dispatch('tokenInfo/getPhoneCode', { phone: this.phoneform.phonenum }).then(() => {
          this.disableSend = true;
          this.disableTimer = setInterval(() => {
            if (this.disableNum === 0) {
              clearInterval(this.disableTimer);
              this.disableSend = false;
            }
            this.disableNum--;
          }, 1000);
        }).catch(() => {
        });
      }
    },
    checkCodeImg(form) {
      if (this.imgCode !== '' && this.imgCode.length === 4) {
        let info = {
          reqest_id: this.requestId,
          image_code: this.imgCode
        };
        this.$store.dispatch('tokenInfo/checkImgCode', info).then(() => {
          this.loginAble = false;
        }).catch(() => {
          this.imgCodeCheck = true;
          this.$refs[form].validateField('imgCode');
        });
      }
    },
    // 拉取用户信息，拉取菜单
    getAllInfo() {
      fetchUserInfo().then(() => {
        fetchMenuList().then(() => {
          // 正常直接进入后台首页
          this.$router.push({ path: '/frame/home' });
        }).catch(error => {
          // 菜单数据请求失败，未分配，网络失败，token过期等
          MessageBox.alert(error['sub_msg'], '提示', { type: 'warning' });
          PersistedClear.remove('tokenInfo/setLogInfo');// 菜单请求不到，该帐号没有分配菜单，清除登录存的缓存用户信息
          this.$router.push({ path: '/login' });
        });// 取菜单
      }).catch(() => {
        // 用户信息请求失败
        PersistedClear.remove('tokenInfo/setLogInfo');
        this.$router.push({ path: '/login' });
      }).finally(() => {
        // 请求完成再放开加载状态
        this.loginSubmiting = false;
      });
    },
    phoneLogin(form) {
      // 验证帐号是不是空
      if (this.phoneform.phonenum === '' || this.phoneform.phonecode === '') {
        this.$refs[form].validateField('phonenum');
        this.$refs[form].validateField('phonecode');
      }
      else { // this.showError = false;
        let phoneLoginInfo = { code: this.phoneform.phonecode, phone: this.phoneform.phonenum, switch_code: 1 };
        // 开始发送请求，设置加载状态
        this.loginSubmiting = true;
        this.$store.dispatch('tokenInfo/phoneLoginInfo', phoneLoginInfo).then(() => {
          this.getAllInfo();
        }).catch(error => {
          this.showError = true;
          this.errorInfo = error.data['sub_msg'];
        }).finally(() => {
          this.loginSubmiting = false;
        });
      }
    },
    onSubmit(formName) {
      if (this.loginAble && this.imgCode === '') {
        this.$refs[formName].validateField('imgCode');
      }
      if (!this.loginAble) { // 三次以内可以点击登录
        if (this.form.username === '' || this.form.password === '') {
          this.$refs[formName].validateField('username');
          this.$refs[formName].validateField('password');
        }
        else {
          if (this.checked) {
            this.form.remember = '5d';
          }
          else {
            this.form.remember = '';
          }
          const userinfo = this.form;
          // 开始发送请求，设置加载状态
          this.loginSubmiting = true;
          this.$store.dispatch('tokenInfo/login', userinfo).then(() => {
            // 缓存用户名历史记录
            this.saveAcount();
            // 非首次登录
            if (this.first_login === 0) {
              // 新注册帐号无法登陆的判断
              this.getAllInfo();
            }
            // 首次登陆
            else if (this.first_login === 1) {
              fetchUserInfo().then(userInfo => {
                // 主动注册，跳页面完善信息
                if (userInfo.source === 1) {
                  const pathEdit = {
                    path: '/editinfo'
                  };
                  this.$store.dispatch('history/setHistory', pathEdit).then(() => {
                    this.$router.push(pathEdit);
                  });
                }
                // 不拦截source为null的情况
                else {
                  fetchMenuList().then(() => {
                    this.$router.push({ path: '/frame/home' });
                  }).catch(error => {
                    MessageBox.alert(error['sub_msg'], '提示', { type: 'warning' });
                    PersistedClear.remove('tokenInfo/setLogInfo');
                    this.$router.push({ path: '/login' });
                  });
                }
              }).catch(() => {
                // 用户信息请求失败
                PersistedClear.remove('tokenInfo/setLogInfo');
                this.$router.push({ path: '/login' });
              }).finally(() => {
                this.loginSubmiting = false;
              });
            }
          }).catch(error => {
            const code = Number(error.data.code);
            if (code !== StatusCode.BUSINESS) {
              this.showErrorA = true;
              this.errorInfoA = error.data['sub_msg'];
            }
            this.threeLogin++;
            if (this.threeLogin === 3) {
              this.idCodeShow = true;
              this.loginAble = true; // 图形验证码出现，登录不能进行
              this.sendResId(); // 生成图片验证码
            }
          }).finally(() => {
            this.loginSubmiting = false;
          });
        }
      }
    },
    // 图片验证码发送本地id
    sendResId() {
      this.loginAble = true;
      this.requestId = Date.parse(new Date());
      this.$store.dispatch('tokenInfo/getImgCode', { request_id: this.requestId }).then(data => {
        this.randomHref = data.data['img_str'];
      });
    },
    // 创建二维码
    createQr() {
      this.$store.dispatch('tokenInfo/createQr').then(data => {
        this.qrContent = data.data.content;
        this.ucode = data.data.ucode;
        // this.appSao();
        // this.timer = setInterval(this.moreRequest, 1000);
      });
    },
    // 轮询
    moreRequest() {
      this.$store.dispatch('tokenInfo/findConnect', { ucode: this.ucode }).then(data => {
        // 扫描成功
        if (data.data.state === 1) {
          this.maLoginOk = false;
          this.confirmApp(); // 手机确认
        }
        // 确认登录
        if (data.data.state === 2) {
          this.$store.dispatch('menu/getMenuList').then(() => {
            this.$router.push('/frame/home');
            clearInterval(this.timer);
          });
        }
        // 取消登录
        if (data.data.state === 3) {
          this.maLoginOk = true;
          clearInterval(this.timer);
        }
        // 二维码过期
        if (data.data.state === 4) {
          this.qrOrqrExpire = false;
          clearInterval(this.timer);
        }
      }).catch(() => {
      });
    },
    // 模拟app扫描保存信息
    appSao() {
      let appInfo = {
        ucode: this.ucode,
        min_logo: 'http://img.blibao.com/upload/bdjiudian/201421139367259887546728356.jpg',
        username: '10000'
      };
      this.$store.dispatch('tokenInfo/appSao', appInfo).then(() => {
      });
    },
    // 扫描成功，确认或者取消
    confirmApp() {
      let appConfirmInfo = {
        comfirm: 2,
        ucode: this.ucode
      };
      this.$store.dispatch('tokenInfo/confirm', appConfirmInfo).then(() => {
      });
    },
    // 重新获取二维码
    againGetMa() {
      this.qrOrqrExpire = true;
      this.createQr();
    },
    zhiLogin() {
      // 发支付宝授权请求
    }
  },
  mounted() {
    this.heightDocument = document.body.offsetHeight + 'px';
    this.acountList = JSON.parse(localStorage.getItem('acount'));
    if (this.acountList !== null && this.acountList.length > 10) {
      this.acountList.splice(10, this.acountList.length - 10);
    }
    this.activeName = this.$route.query['flag'] === 1 ? 'second' : 'first';
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
}

.el-main{
  width: 100%;
  padding: 0 !important;
}

.loginHeader{
  display: flex;
  justify-content: space-between;
  height: 60px;
  .imgCan{
    display: inline-block;
    width: 120px;
    height: 32px;
    padding: 14px;
  }
  .loginInfo{
    display: inline-block;
    height: 60px;
    line-height: 60px;
    margin-right: 14px;
  }
}

.loginContent{
  background: url("../../assets/loginBackground.png") no-repeat center center;
  background-size: cover;
  flex: 1;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  > div{
    margin-right: 17%;
  }
  .errorMsg{
    margin: 10px 0;
    border: 1px solid red;
    background: #fff0eb;
  }
  .account-register{
    color: #808080;
    font-size: 14px;
    margin: 10px 0;
    padding: 0 20px;
    button{
      width: 100%;
    }
    .account-login{
      width: 100%;
      height: 40px;
      margin: 20px 0;
    }
    .findPassSty{
      color: #606266;
      cursor: pointer;
      text-decoration: none;
    }
  }
  .positionMa{
    left: 60%;
    width: 410px;
    .ma{
      position: absolute;
      right: 0;
      top: 0;
    }
    .maInfo{
      width: 100%;
      height: 260px;
      text-align: center;
      margin-top: 50px;
      border-bottom: 1px solid #ececec;
      margin-bottom: 20px;
    }
    .ma-otherLogin{
      font-size: 15px;
      color: #b0b0b0;
      margin-top: 10px;
      .freeRegister{
        float: right;
        color: #0a96ff;
        cursor: pointer;
      }
    }
  }
  .register{
    position: absolute;
    left: 60%;
    top: 97px;
    width: 330px;
    color: #333;
    .staff-password{
      margin: 20px 0;
    }
    .phone-register{
      display: flex;
      justify-content: space-between;
      .phone-register{
        margin-right: 20px;
      }
    }
    .register-btn{
      width: 100%;
      margin-top: 20px;
    }
  }
  .positionTab{
    width: 410px;
    min-height: 346px;
    _height: 346px;
    position: relative;
    .loginNotice{
      height: 40px;
      border-bottom: 1px solid #ccc;
      line-height: 40px;
      padding-left: 10px;
      margin-bottom: 17px;
    }
    .bottomHandle{
      padding-left: 20px;
      box-sizing: border-box;
      /*position: absolute;*/
      width: 100%;
      /*bottom: 0;*/
      /*right: 0;*/
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #dfeef8;
      height: 56px;
      .zfbText{
        color: #0096ff;
        text-decoration: none;
      }
      .registerSty{
        margin-right: 20px;
        color: #0096ff;
        cursor: pointer;
        text-decoration: none;
      }
    }
    .ma{
      position: absolute;
      right: 0;
      top: 0;
    }
    .boss-userInput{
      /deep/ .el-input__inner{
        background: url('../../../static/img/username.png') center no-repeat;
        background-position-x: 10px;
        padding-left: 35px;
      }
    }
    .boss-password{
      /deep/ .el-input__inner{
        background: url('../../../static/img/password.png') center no-repeat;
        background-position-x: 10px;
        padding-left: 35px;
      }
    }
    .boss-register{
      display: flex;
      justify-content: space-between;
      color: #808080;
      font-size: 14px;
      span{
        cursor: pointer;
      }
    }
    .boss-login{
      width: 100%;
      margin-top: 20px;
    }
    .boss-otherLogin{
      font-size: 15px;
      color: #b0b0b0;
      margin-top: 10px;
    }
    .boss-zhifubao{
      width: 98%;
      border: 2px solid #409EFF;
      height: 34px;
      text-align: center;
      line-height: 34px;
      color: #409EFF;
      margin-top: 5px;
    }
    .staff-userInput{
      /deep/ .el-input__inner{
        background: url('../../../static/img/username.png') center no-repeat;
        background-position-x: 10px;
        padding-left: 35px;
      }
    }
    .staff-phonenumber{
      /deep/ .el-input__inner{
        background: url('../../../static/img/password.png') center no-repeat;
        background-position-x: 10px;
        padding-left: 35px;
      }
    }
    .staff-password{
      /deep/ .el-input__inner{
        background: url('../../../static/img/password.png') center no-repeat;
        background-position-x: 10px;
        padding-left: 35px;
      }
    }
    .staff-register{
      color: #0a96ff;
      font-size: 14px;
    }
    .staff-login{
      width: 100%;
      margin-top: 20px;
    }
    .staff-otherLogin{
      font-size: 15px;
      color: #b0b0b0;
      margin-top: 10px;
    }
  }
}

.el-tabs__nav{
  width: 100%;
  .el-tabs__item{
    width: 50%;
    text-align: center;
    padding: 0;
  }
  .el-tabs__active-bar{
    width: 50%;
  }
}

.loginFooter{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 60px;
  text-align: center;
  align-items: center;
  p{
    width: 500px;
  }
}
</style>
<style lang="less">
.positionMa{
  .el-card__body{
    position: relative !important;
  }
  .is-top{
    padding: 0 20px;
  }
}

.loginContent{
  .el-card__body{
    padding: 0;
  }
  .el-tabs__header{
    padding: 0 20px;
  }
}

.positionTab .el-form-item__content{
  display: flex;
  .yh-button{
    width: 144px !important;
    margin-left: 10px;
  }
}

#pane-second .yh-button:nth-child(1){
  width: 100%;
  margin-top: 40px;
  margin-bottom: 20px;
  height: 40px;
}
</style>
