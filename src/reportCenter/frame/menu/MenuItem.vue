<!--------------------------------------------------
  菜单栏使用的最底层组件
---------------------------------------------------->
<template>
  <div class="menu-item" :style="{fontSize:fontSize+'px'}" @click="itemClickHandler">
    <icon :name="itemData.icon" class="icon-position" autosize :style="{marginLeft:marginLeft+'px'}"></icon>
    <transition name="label" mode="out-in" appear>
      <div class="label" :style="{marginLeft:spacing+'px'}" v-if="!iconOnly" :class="$route.fullPath.indexOf(itemData.url) !== -1 ? 'currently-displayed' : ''">
        <span class="inner" :class="{is_new:itemData.is_new===1}">{{itemData.name}}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'MenuItem',
  props: {
    itemData: {
      id: Number,
      name: String,
      description: String,
      url: String,
      icon: String,
      is_new: Number,
      is_star: Number,
      is_enter: Number
    },
    iconOnly: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: Number,
      default: 14
    },
    marginLeft: {
      type: Number,
      default: 18
    },
    spacing: {
      type: Number,
      default: 15
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      titleArray: State => State.info.titleArray,
      startIndexName: State => State.info.startIndexName
    }),
    ...mapGetters({
      menuList: 'menu/menuList'
    })
  },
  methods: {
    itemClickHandler() {
      const menu = this.itemData;

      // 为外部提供前置操作入口
      this.$emit('actived', menu);

      // 处理跳转逻辑
      if (menu.is_enter === 1) {
        // 点击后去除红点
        menu.is_new = 0;

        if (/^http:\/\//i.test(menu.url)) {
          // 站外地址跳转
          window.open(menu.url, '_blank');
        }
        else {
          // 应用内路由跳转
          if (this.titleArray && this.titleArray.length > 0) {
            let len = this.titleArray.length;
            for (let i = 0; i < len; i++) {
              this.$store.commit('info/setActiveTabs', i);
              if (this.titleArray[i].menu.fullpath === menu.fullpath) {
                break;
              }
              if (i === len - 1) {
                this.$store.commit('info/setActiveTabs', len);
                this.$store.dispatch('info/getTitleArray', {
                  titleArray: { menu }
                });
              }
            }
          }
          else {
            this.$store.commit('info/setActiveTabs', 0);
            this.$store.dispatch('info/getTitleArray', {
              titleArray: { menu }
            });
          }
          this.$store.commit('info/setIfNewTitleArray', false);
          this.$router.push({ name: 'Menu' + menu.gu_code });
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../vars.less";

.label-enter-active{
  transition: opacity .5s;
}

.label-enter{
  opacity: 0;
}

.menu-item{
  width: 100%;
  font-size: @menu-item-fontsize;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover{
    background-color: @menu-item-hover;

    .icon-position, .label{
      color: @menu-item-hover-text;
    }
  }
  .icon-position{
    font-size: @menu-item-fontsize*1.2;
    flex: 0 0 16px;
  }

  .label{
    flex: 1;
    margin-left: 15px;

    > .inner{
      position: relative;

      // &.is_new:after{
      //   /*content          : '';*/
      //   /*display          : block;*/
      //   /*position         : absolute;*/
      //   /*width            : 6px;*/
      //   /*height           : 6px;*/
      //   /*border-radius    : 50%;*/
      //   /*background-color : #ff0000;*/
      //   /*top              : 0;*/
      //   /*right            : -8px;*/
      // }
    }
  }
}

.menu-list{
  .currently-displayed.label{
    span{
      color: rgb(10, 150, 255);
    }
  }
}
</style>

