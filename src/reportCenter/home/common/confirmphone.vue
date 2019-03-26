<template>
  <div class="approveWrap">
    <h2>{{headText}}</h2>
    <div class="positionTab" v-if="!checkSuccess">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="20%">
        <el-form-item label="手机号码">
          <el-input type="text" auto-complete="off" placeholder="请输入你的手机号" v-model="ruleForm.phone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="短信验证码" prop="code">
          <el-input placeholder="请输入6位数验证码" class="phone-password" v-model="ruleForm.code"></el-input>
          <yh-button type="primary" @click="getAuthCode" :disabled="disableSend" style="width:98px;">{{this.disableSend?disableNum+'s重新获取':'获取验证码'}}
          </yh-button>
        </el-form-item>
        <yh-button type="primary" class="approve" @click="approvePhone('ruleForm')" :loading="approveLoading" :disabled="approveLoading">
          {{this.approveLoading?'正在认证，请稍后...':'认证'}}
        </yh-button>
      </el-form>
    </div>
    <div v-if="checkSuccess" class="checkSuccessWrap">
      <div class="approveTit">
        <icon name="changesuccess" autosize style="width:62px;height:62px;"></icon>
      </div>
      <h3 class="phoneNumber">手机号码：{{ruleForm.phone}}</h3>
      <h4 class="approveSuccess">认证成功！</h4>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Card, Input, Form, FormItem, MessageBox } from 'element-ui';
import YhButton from '../../../components/base/yinhe/button/YhButton';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Card, Input, Form, FormItem);

export default {
  name: 'confirmPhone',
  data() {
    let validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      }
      else if (this.codeError) {
        callback(new Error('验证码错误'));
        this.codeError = false;
      }
    };
    return {
      approveLoading: false,
      checkSuccess: false,
      disableNum: 60,
      disableSend: false,
      // approveText: '认证',
      codeError: false,
      ruleForm: {
        phone: '',
        code: ''
      },
      rules: {
        code: [
          { validator: validateCode, trigger: 'change' }
        ]
      }
    };
  },
  components: {
    YhButton
  },
  props: ['headText'],
  computed: {
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    })
  },
  methods: {
    getAuthCode() {
      clearInterval(this.disableTimer);
      this.disableNum = 60;
      this.$store.dispatch('tokenInfo/getPhoneCode', { phone: this.ruleForm.phone }).then(() => {
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
    },
    approvePhone() {
      if (this.ruleForm.phone !== '' && this.ruleForm.code !== '') {
        this.approveLoading = true;
        let checkInfo = {
          phone: this.ruleForm.phone,
          code: this.ruleForm.code,
          sys_user_id: this.userinfo.user_id
        };
        this.$store.dispatch('tokenInfo/approvePhone', checkInfo).then(() => {
          this.checkSuccess = true;
          setTimeout(() => {
            this.$router.replace({ path: '/' });
          }, 2000);
        }).catch(error => {
          MessageBox.alert(error.data['sub_msg'], '提示', { type: 'warning' }).then(() => {
            this.$router.replace({ path: '/frame/acountinfo' });
          });
          this.checkSuccess = false;

        }).finally(() => {
          this.approveLoading = false;
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
h2{
  width: 96px;
  height: 30px;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 30px;
  letter-spacing: 0;
  color: #666666;
  margin-bottom: 61px;
}

/deep/ .el-input__inner{
  width: 300px;
  height: 34px;
}

/deep/ .el-form-item__content{
  width: 300px;
  height: 34px;
}

.el-button{
  padding: 9px 13px;
  /*width: 100px;*/
  /*height: 34px;*/
}

.approveWrap{
  height: 790px;
  background: #fff;
  padding: 20px;
  .positionTab{
    width: 50%;
    .phone-password{
      float: left;
      width: 190px;
      margin-right: 12px;
      /deep/ .el-input__inner{
        width: 190px;
        height: 34px;
      }
      /deep/ .el-form-item__content{
        width: 190px;
        height: 34px;
      }
    }
    .approve{
      padding: 0 10px;
      width: auto;
      margin-top: 20px;
      margin-left: 20%;
      min-width: 120px;
    }
  }
  .checkSuccessWrap{
    margin-top: 100px;
    .phoneNumber{
      text-align: center;
      margin-bottom: 10px;
    }
    .successLogo{
      text-align: center;
    }
    .approveTit{
      margin-bottom: 16px;
      text-align: center;
    }
    .approveSuccess{
      text-align: center;
      margin-bottom: 10px;
    }
  }

}

</style>
