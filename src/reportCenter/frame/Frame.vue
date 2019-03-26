<!--报表中心项目后台-主框架-->
<template>
  <div class="fullscreen" :style="{'height': heightDocument}">
    <frame-header></frame-header>
    <div class="main-container">
      <frame-menu :class="{'menu-collapsed':collapsed}" :collapsed="collapsed">
        <el-row @click.native="triggerMore()">
          <el-col :span="4" class="move-trigger">
            <icon name="asidemore" class="icon-position"></icon>
          </el-col>
        </el-row>
      </frame-menu>
      <frame-main :frameAsideWidth="asideWidth"></frame-main>
    </div>
  </div>
</template>

<script>
import FrameHeader from './FrameHeader';
import FrameMain from './FrameMain';
import FrameMenu from './FrameMenu';

export default {
  components: {
    FrameMain,
    FrameMenu,
    FrameHeader
  },
  data() {
    return {
      collapsed: false,
      asideWidthArr: [160, 160, 50, 50],
      asideWidth: 0,
      heightDocument: 0
    };
  },
  created() {
    const vuexInfo = JSON.parse(sessionStorage.getItem('vuex')).info;
    this.$store.dispatch('info/getTitleArray', { titleArray: vuexInfo.titleArray });
    this.$store.commit('info/setPageParams', vuexInfo.params);
    this.$store.commit('info/setActiveTabs', vuexInfo.activeTabs);
  },
  methods: {
    triggerMore() {
      this.collapsed = !this.collapsed;
    }
  },
  mounted() {
    this.heightDocument = document.body.offsetHeight + 'px';
  }
};
</script>

<style lang="less" scoped>
@import "vars";

.fullscreen{
  width: 100%;
  height: 100%;
  min-width: 1024px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .frame-header{
    flex: 0 0 @header-height;
  }
  .main-container{
    min-height: 0;
    flex: 1;
    display: flex;
    .move-trigger{
      width: 100%;
      height: 40px;
      line-height: 40px;
      color: #fff;
      padding-top: 5px;
      cursor: pointer;
      text-align: center;
    }
    .frame-menu{
      flex: 0 0 @menu-width;
      transition: flex 0.2s ease-out;
      &.menu-collapsed{
        flex: 0 0 @menu-width-collapsed;
      }
    }
    .frame-main{
      flex: 1;
    }
  }
}
</style>
<style lang="less">
.container{
  position: relative;
}

.el-radio-button.el-radio-button--small.is-active{
  span{
    background: #0096ff;
  }
}

.el-input__suffix-inner{
  .el-input__suffix{
    .el-select__caret.el-input__icon{
      line-height: 28px !important;
    }
  }
}

.el-button.el-button--primary.el-button--small{
  border-radius: 4px;
}

.fullscreen{
  .el-card__body{
    padding: 20px 20px 0 20px !important;
  }
}

.el-table__body-wrapper{
  overflow-y: auto;
}

.el-message-box{
  width: 360px;
  height: 240px;
  .el-message-box__header{
    display: flex;
    justify-content: space-between;
    padding: 0;
    border-bottom: 1px solid #ccc;
    .el-message-box__title{
      font-size: 12px;
      height: 34px;
      line-height: 34px;
      margin-left: 14px;
    }
    .el-message-box__headerbtn{
      margin-top: -4px;
    }
  }
  .el-message-box__content{
    width: 100%;
    height: 142px;
    padding: 0;
    .el-message-box__message{
      padding: 0;
      p{
        text-align: center;
      }
    }
    .el-message-box__status{
      position: static;
      margin-left: 47%;
      margin-top: 42px;
    }
    .el-message-box__status{
      color: red;
    }
  }
  .el-message-box__btns{
    padding: 0;
    text-align: center;
    button{
      width: 80px;
      height: 34px;
      background: #0096ff;
    }
    button:hover{
      background: #daebf8;
      border-color: #0096ff;
      color: #0096ff;
    }
  }
}

.table-warp{
  border-radius: 4px;
  border: 1px solid #e6ebf0;
  flex: 1;
  box-sizing: content-box;
  padding: 20px;
}

.is-always-shadow{
  margin-top: 0;
  margin-bottom: 14px;
}
</style>
