<!-----------------------
frame的上部header页面
------------------------>
<template>
  <el-row class="animated bounce frame-header">
    <el-col :span="4" class="logo-box right-line"></el-col>
    <el-col :span="12" class="logo-text">银盒子 · 报表中心</el-col>
    <el-col :span="4" class="help right-line" @click.native="loginOutHandler">退出</el-col>
    <el-col :span="4" v-if="userInfo['user_type'] === 'parent_shop' && userInfo['type'] === 'SHOP'" class="el-icon-download help right-line " @click.native="scavenginEexport">聚合微信日账单</el-col>
    <!--<el-col :span="4" class="tips right-line">-->
    <!--(试用期剩39天)-->
    <!--</el-col>-->
    <!--用户信息-->
    <el-col :span="4" class="userinfo right-line">
      <!--<el-dropdown trigger="hover">-->
      <div class="el-dropdown-link userinfo-inner userinfo-inner1">
        <img :src="'static/img/default-logo.png'"/><!--图片现在没有 userInfo.min_logo || -->
        <div>
          <span v-if="userInfo && userInfo.nick">{{userInfo.nick}}</span>
          <span class="store" v-if="userInfo && userInfo.name">{{userInfo.username}}</span>
          <!--<icon name="incometotal" class="icon-position" autosize></icon>-->
        </div>
      </div>
      <!--<el-dropdown-menu slot="dropdown">-->
      <!--<el-dropdown-item>帐号信息</el-dropdown-item>-->
      <!--<el-dropdown-item>切换门店</el-dropdown-item>-->
      <!--<el-dropdown-item>退出店铺</el-dropdown-item>-->
      <!--<el-dropdown-item @click.native="loginOutHandler">退出</el-dropdown-item>-->
      <!--</el-dropdown-menu>-->
      <!--</el-dropdown>-->
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue';
import { Message, MessageBox } from 'element-ui';
import { mapGetters } from 'vuex';
import { BlobFile, MIME } from 'vue-simple';
import SimpleVue from '../../plugins/SimpleVue';
import PathConf from '../../conf/api.conf';

Vue.use(SimpleVue);
Vue.prototype.$message = Message;
export default {
  computed: {
    ...mapGetters({
      userInfo: 'tokenInfo/userinfo'
    })
  },
  data() {
    return {
      scavenginEexportUrl: 'scavenginEexportList'
    };
  },
  methods: {
    loginOutHandler() {
      this.$store.commit('info/initstore');
      this.$store.dispatch('info/getTitleArray', { titleArray: -1 });
      this.$store.dispatch('tokenInfo/logout').then(() => {
        // if (process.env.NODE_ENV !== 'development') {
        //   let redirectUrl = location.href;
        //   redirectUrl = redirectUrl.substring(0, redirectUrl.lastIndexOf('#'));
        //   location.href = `${process.env.NODE_TYPE}${redirectUrl}`;
        // }
        // else {
        //   this.$router.push({ path: '/login' });
        // }
        this.$router.push({ path: '/login' });
      });
    },
    scavenginEexport() {
      if (this.userInfo['user_type'] === 'parent_shop' && this.userInfo['type'] === 'SHOP') {
        let params = {
          shopper_pid: this.userInfo['shopper_id'],
          download: '1'
        };
        const params2 = {
          responseType: 'blob',
          headers: {
            download: '1'
          }
        };
        Vue.$api.post({ getway: PathConf.report.$getway, api: PathConf.report[this.scavenginEexportUrl] }, params, params2).then(res => {
          const file = new BlobFile({
            data: res.data,
            mime: MIME.xls,
            filename: '聚合微信日账单',
            endings: 'native'
          });
          file.download();
          file.destory();
          this.collectLoading = false;
        }).catch(() => {
          MessageBox.alert('帐单未生成', '提示', { type: 'warning' });
        });
      }
    }
  }
};
</script>
<style lang="less">
@import "vars";

.el-dropdown-menu__item--divided{
  border-top: none;
  &:after{
    height: 0;
  }
}

.el-dropdown-menu{
  line-height: 40px;
  background-color: @menu-bgcolor;
  border-radius: 0;
  padding-top: 0;
  .popper__arrow{
    display: none;
  }
  .el-dropdown-menu__item{
    text-align: center;
    padding: 0 30px;
    color: rgba(255, 255, 255, 0.6);
    &:hover{
      background-color: @menu-bgcolor-actived;
      color: #fff;
    }
  }
}

.popper__arrow{
  border-width: 0;
  &:before{
    border-width: 0;
  }
}

.el-dropdown{
  padding: 0 40px 0 64px;
}
</style>
<style lang="less" scoped>
@import "vars";

.frame-header{
  width: 100%;
  background-color: @header-bgcolor;
  color: #fff;
  text-align: center;
  line-height: 50px;
  overflow: hidden;
  font-size: 16px;
  padding: 0;
}

// 顶部样式
.right-line{
  border-right: 1px solid @line-color;
}

.logo-box{
  width: 50px;
  height: 50px;
  background: url('../../assets/logo.png') no-repeat center center;
  background-size: 34px 33px;
}

.logo-text{
  color: #fff;
  padding: 0 22px;
  text-align: left
}

.userinfo{
  text-align: right;
  height: 50px;
  float: right;
  box-sizing: border-box;
  font-size: 14px;
  .userinfo-inner{
    color: #fff;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    div{
      padding: 0 15px;
      span:first-child{
        margin-left: 2px;
      }
    }
    .icon-position{
      color: #fff;
      position: absolute;
    }
    span{
      display: block;
      height: 16px;
      line-height: 16px;
      text-align: left;
      &.store{
        font-size: 12px;
        color: #9b9ca0;
      }
    }
    img{
      height: 33px;
      width: 33px;
      border-radius: 50%;
    }
  }
}

.help{
  width: auto;
  padding: 0 20px 0 20px;
  color: #fff;
  line-height: 50px;
  float: right;
  cursor: pointer;
  font-size: 14px;
  position: relative;

  .icon-position{
    color: #fff;
    position: absolute;
    top: 18px;
    right: 20px;
  }
}

.tips{
  padding: 0 19px;
  float: right;
  font-size: 14px;
  width: auto;
}
</style>

