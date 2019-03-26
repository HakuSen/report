<template>
  <div class="oldLogin">
    <el-card class="oldLoginTab" v-if="showChangeAcount">
      <el-tabs v-model="activeName" :stretch="true">
        <el-tab-pane label="老板" name="first">
          <div v-show="showError" class="errorMsgChange">
            <icon name="error" class="iconSty"></icon>
            {{errorInfo}}
          </div>
          <el-form :model="bossForm" :rules="bossRule" ref="bossForm">
            <el-form-item prop="username">
              <el-input type="text" v-model="bossForm.username" placeholder="用户名" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="bossForm.password" placeholder="密码" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <yh-button type="primary"
                         :loading="loginSubmiting"
                         :disabled="loginSubmiting"
                         @click="submitBoss('bossForm')"
                         class="oldLoginSubmit">{{this.loginSubmiting?'正在登录...':'登录'}}
              </yh-button>
            </el-form-item>
          </el-form>
          <router-link to="/login" class="toNewLogin">新后台登录</router-link>
        </el-tab-pane>
        <el-tab-pane label="员工" name="second">
          <div v-show="showErrorB" class=" errorMsgChange">
            <icon name="error" class="iconSty"></icon>
            {{errorInfoB}}
          </div>
          <el-form :model="employeeForm" :rules="employeeRule" ref="employeeForm">
            <el-form-item prop="shopper_id">
              <el-input type="text" v-model="employeeForm.shopper_id" placeholder="老板id" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="job_num">
              <el-input type="text" v-model="employeeForm.job_num" placeholder="工号/手机号" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="employeeForm.password" placeholder="密码" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <yh-button type="primary"
                         @click="submitEmployee('employeeForm')"
                         class="oldLoginSubmit"
                         :loading="loginSubmiting"
                         :disabled="loginSubmiting">{{this.loginSubmiting?'正在登录...':'登录'}}
              </yh-button>
            </el-form-item>
          </el-form>
          <router-link to="/login" class="toNewLogin">新后台登录</router-link>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card class="positionTab changeInfo" v-if="showChangeAcountBoss">
      <div class="changeAcountTit">修改帐号</div>
      <div v-show="showErrorC" class=" errorMsgChange">
        <icon name="error" class="iconSty"></icon>
        {{errorInfoC}}
      </div>
      <el-form ref="formChg" :model="formChg" :rules="rulesChg">
        <el-form-item label="老账户名" label-width="20%">
          <span>{{bossForm.username}}</span>
        </el-form-item>
        <el-form-item prop="type" label="帐号类型" label-width="20%">SHOP</el-form-item>
        <div style="margin-bottom: 10px;color: #ccc;">因新后台整改，要求帐号必须有唯一的用户名，为了保证正常使用本公司的产品，请重新设置新的用户名。</div>
        <el-form-item label="新账户名" prop="new_username" label-width="20%">
          <el-input placeholder="请输入新帐号" v-model="formChg.new_username" clearable></el-input>
        </el-form-item>
        <yh-button type="primary" @click="changeUserName('formChg')" class="submitChange">确定</yh-button>
      </el-form>
      <span class="toOldLogin" @click="toLoginBoss">返回登录</span>
    </el-card>

    <el-card class="positionTab changeInfo" v-if="showChangeAcountEm">
      <div class="changeAcountTit">修改帐号</div>
      <div v-show="showErrorD" class=" errorMsgChange">
        <icon name="error" class="iconSty"></icon>
        {{errorInfoD}}
      </div>
      <el-form ref="formChgEm" :model="formChgEm" :rules="rulesChgEm">
        <el-form-item label="用户名" label-width="20%">
          <span>{{this.employeeAcount}}</span>
        </el-form-item>
        <el-form-item label="工号" label-width="20%">
          <span>{{employeeForm.job_num}}</span>
        </el-form-item>
        <el-form-item prop="type" label="帐号类型" label-width="20%">EMPLOYEE</el-form-item>
        <div style="margin-bottom: 10px;color: #ccc;">因新后台整改，要求帐号必须有唯一的用户名，为了保证正常使用本公司的产品，请重新设置新的用户名。</div>
        <el-form-item label="新用户名" prop="new_username" label-width="20%">
          <el-input placeholder="请输入新帐号" v-model="formChgEm.new_username" clearable></el-input>
        </el-form-item>
        <yh-button type="primary" @click="changeUserNameEm('formChgEm')" class="submitChange">确定</yh-button>
      </el-form>
      <span class="toOldLogin" @click="toOldLogin">返回登录</span>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue';
import { PersistedClear } from 'vue-simple';
import { mapGetters } from 'vuex';
import { Card, Input, Form, FormItem, Select, Option, Message } from 'element-ui';
import StatusCode from '../../conf/response.code.conf';
import YhButton from '../../components/base/yinhe/button/YhButton';
import SimpleVue from '../../plugins/SimpleVue';

import { fetchMenuList, fetchUserInfo } from './mixins/userinfo';

Vue.use(SimpleVue);
Vue.prototype.$message = Message;
Vue.batch.use(Option, Card, Input, Form, FormItem, Select);
export default {
  name: 'oldlogin',
  components: {
    YhButton
  },
  data() {
    // 老板登录
    let validateAcount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('帐号不能为空'));
      }
      else {
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'));
      }
      else {
        callback();
      }
    };
    // 员工登录
    let validateId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('帐号不能为空'));
      }
      else {
        callback();
      }
    };
    let validateCard = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'));
      }
      else {
        callback();
      }
    };
    let validateUserPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('帐号不能为空'));
      }
      else {
        callback();
      }
    };
    // 修改用户名
    let validateNewAcount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('新帐号不能为空'));
      }
      else {
        callback();
      }
    };
    let validateNewAcountEm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('新帐号不能为空'));
      }
      else {
        callback();
      }
    };

    return {
      activeName: 'first',
      employeeAcount: '',
      showError: false,
      errorInfo: '',
      showErrorB: false,
      errorInfoB: '',
      showErrorC: false,
      errorInfoC: '',
      showErrorD: false,
      errorInfoD: '',
      loginSubmiting: false,
      showChangeAcount: true,
      showChangeAcountBoss: false,
      showChangeAcountEm: false,
      bossForm: {
        username: '',
        password: '',
        type: 'shop'
      },
      bossRule: {
        username: [
          { validator: validateAcount, trigger: 'change' }
        ],
        password: [
          { validator: validatePass, trigger: 'change' }
        ]
      },
      employeeForm: {
        shopper_id: '',
        job_num: '',
        password: '',
        type: 'employee'
      },
      employeeRule: {
        shopper_id: [
          { validator: validateId, trigger: 'change' }
        ],
        job_num: [
          { validator: validateCard, trigger: 'change' }
        ],
        password: [
          { validator: validateUserPass, trigger: 'change' }
        ]
      },
      formChg: {
        new_username: ''
      },
      rulesChg: {
        new_username: [
          { validator: validateNewAcount, trigger: 'change' }
        ]
      },
      formChgEm: {
        new_username: '',
        employee_id: ''
      },
      rulesChgEm: {
        new_username: [
          { validator: validateNewAcountEm, trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      token: 'tokenInfo/token',
      userinfo: 'tokenInfo/userinfo'
    })
  },
  methods: {
    submitBoss(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let bossLoginInfo = this.bossForm;
          this.loginSubmiting = true;
          this.$store.dispatch('tokenInfo/oldLogin', bossLoginInfo).then(() => {
            fetchUserInfo().then(() => {
              fetchMenuList().then(() => {
                this.$router.push({ path: '/frame/home' });
              }).catch(() => {
                PersistedClear.remove('tokenInfo/setLogInfo');
                this.$router.push({ path: '/login' });
              });
            }).catch(() => {
              PersistedClear.remove('tokenInfo/setLogInfo');
              this.$router.push({ path: '/login' });
            }).finally(() => {
              this.loginSubmiting = false;
            });
          }).catch(error => {
            let code = Number(error.data.code);
            // 老板修改用户名
            if (code === 41004) {
              if (error.data.data['opt_code'] === '2') {
                this.showError = true;
                this.errorInfo = error.data['sub_msg'];
                setTimeout(() => {
                  this.showChangeAcount = false;
                  this.showChangeAcountBoss = true; // 修改老版帐号
                }, 2500);
              }
            }
            else if (code !== StatusCode.BUSINESS && code !== 10000) {
              this.showError = true;
              this.errorInfo = error.data['sub_msg'];
            }
          }).finally(() => {
            this.loginSubmiting = false;
          });
        }
      });
    },
    submitEmployee(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let emplyLoginInfo = this.employeeForm;
          this.loginSubmiting = true;
          this.$store.dispatch('tokenInfo/oldLogin', emplyLoginInfo).then(() => {
            this.showErrorB = false;
            fetchUserInfo().then(() => {
              fetchMenuList().then(() => {
                this.$router.push({ path: '/frame/home' });
              }).catch(() => {
                PersistedClear.remove('tokenInfo/setLogInfo');
                this.$router.push({ path: '/login' });
              });
            }).catch(() => {
              PersistedClear.remove('tokenInfo/setLogInfo');
              this.$router.push({ path: '/login' });
            }).finally(() => {
              this.loginSubmiting = false;
            });
          }).catch(error => {
            let code = Number(error.data.code);
            // 员工信息不全
            if (code === 41004) {
              if (error.data.data['opt_code'] === '1') {
                this.showErrorB = true;
                this.errorInfoB = error.data['sub_msg'];
                this.formChgEm.employee_id = error.data.data['employee_id'];
                setTimeout(() => {
                  this.showChangeAcountEm = true; // 修改员工帐号
                  this.showChangeAcount = false;
                }, 2500);
              }
              // 重名
              else if (error.data.data['opt_code'] === '3') {
                this.showErrorB = true;
                this.errorInfoB = error.data['sub_msg'];
                this.employeeAcount = error.data.data['username'];
                this.formChgEm.employee_id = error.data.data['employee_id'];
                setTimeout(() => {
                  this.showChangeAcountEm = true; // 修改员工帐号
                  this.showChangeAcount = false;
                }, 2500);
              }
            }
            else if (code !== StatusCode.BUSINESS) {
              this.showErrorB = true;
              this.errorInfoB = error.data['sub_msg'];
            }
          }).finally(() => {
            this.loginSubmiting = false;
          });
        }
      });
    },
    changeUserName(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let newUsername = {
            old_username: this.bossForm.username,
            type: 'shop',
            new_username: this.formChg.new_username,
            source: 3
          };
          this.$store.dispatch('tokenInfo/changeAcount', newUsername).then(() => {
            this.showErrorC = false;
            this.$message({
              message: '设置成功',
              type: 'success'
            });
            let user = {
              username: this.formChg.new_username,
              password: this.bossForm.password
            };
            this.$store.dispatch('tokenInfo/login', user).then(() => {
              fetchUserInfo().then(() => {
                fetchMenuList().then(() => {
                  this.$router.push({ path: '/frame/home' });
                }).catch(() => {
                  PersistedClear.remove('tokenInfo/setLogInfo');
                  this.$router.push({ path: '/login' });
                });
              }).catch(() => {
                PersistedClear.remove('tokenInfo/setLogInfo');
                this.$router.push({ path: '/login' });
              }).finally(() => {
                this.loginSubmiting = false;
              });
            });
          }).catch(error => {
            let code = Number(error.data.code);
            if (code !== StatusCode.BUSINESS) {
              this.showErrorC = true;
              this.errorInfoC = error.data['sub_msg'];
            }
          }).finally(() => {
            this.loginSubmiting = false;
          });
        }
      });
    },
    changeUserNameEm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let newUsernameEm = {
            employee_id: this.formChgEm.employee_id,
            // old_username: this.employeeForm.username,
            type: 'EMPLOYEE',
            new_username: this.formChgEm.new_username,
            source: 3
          };
          this.$store.dispatch('tokenInfo/changeAcount', newUsernameEm).then(() => {
            this.showErrorD = false;
            this.$message({
              message: '设置成功',
              type: 'success'
            });
            let user = {
              username: this.formChgEm.new_username,
              password: this.employeeForm.password
            };
            this.$store.dispatch('tokenInfo/login', user).then(() => {
              fetchUserInfo().then(() => {
                fetchMenuList().then(() => {
                  this.$router.push({ path: '/frame/home' });
                }).catch(() => {

                  PersistedClear.remove('tokenInfo/setLogInfo');
                  this.$router.push({ path: '/login' });
                });
              }).catch(() => {
                PersistedClear.remove('tokenInfo/setLogInfo');
                this.$router.push({ path: '/login' });
              }).finally(() => {
                this.loginSubmiting = false;
              });
            });
          }).catch(error => {
            let code = Number(error.data.code);
            if (code !== StatusCode.BUSINESS) {
              this.showErrorD = true;
              this.errorInfoD = error.data['sub_msg'];
            }
          }).finally(() => {
            this.loginSubmiting = false;
          });
        }
      });
    },
    toOldLogin() {
      this.showChangeAcountEm = false;
      this.showChangeAcount = true;
    },
    toLoginBoss() {
      this.showChangeAcountBoss = false;
      this.showChangeAcount = true;
    }
  }
};
</script>

<style lang="less" scoped>
.oldLogin{
  position: relative;
  width: 410px;
  margin-right: 17%;
  /deep/ .el-select{
    width: 100%;
  }
  /deep/ .el-form-item.is-success .el-input__inner{
    border-color: #d5d5d5;
  }
  .oldLoginTab{
    /deep/ .el-card__body{
      padding: 30px;
    }
    /deep/ .el-tabs__header{
      margin: 0;
    }
    /deep/ .el-form{
      margin-top: 20px;
    }
  }
  .errorMsgChange{
    width: calc(100% - 32px);
    padding: 2px 15px;
    border: 1px solid #ff0000;
    background: #fff0eb;
    font-size: 12px;
    color: #333333;
    position: absolute;
    top: 2px;
    z-index: 1;
    .iconSty{
      vertical-align: middle;
      margin-top: -3px;
    }
  }
  .oldLoginSubmit{
    width: 100%;
    height: 40px;
  }
  .toNewLogin{
    text-decoration: none;
    color: #0096ff;
  }
  .positionTab.changeInfo{
    /deep/ .el-form{
      padding: 0;
    }
    /deep/ .el-card__body{
      padding: 30px;
    }
    .changeAcountTit{
      text-align: center;
      color: #c0c4cc;
      border-bottom: 1px solid #c0c4cc;
      margin-bottom: 20px;
      padding-bottom: 5px;
    }
    .errorMsgChange{
      width: calc(100% - 32px);
      padding: 5px 15px;
      border: 1px solid #ff0000;
      background: #fff0eb;
      font-size: 12px;
      color: #333333;
      .iconSty{
        vertical-align: middle;
        margin-top: -3px;
      }
    }
    .submitChange{
      width: 100%;
      height: 40px;
    }
    .toOldLogin{
      display: inline-block;
      font-size: 14px;
      color: #0a82f0;
      margin-top: 10px;
      cursor: pointer
    }
  }
  .errorMsg{
    width: calc(100% - 32px);
    padding: 5px 15px;
    border: 1px solid #ff0000;
    background: #fff0eb;
    font-size: 12px;
    color: #333333;
    margin-bottom: 10px;
  }
}
</style>
