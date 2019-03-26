<template>
  <div class="notification">
    <div class="close" @click="close">
      <icon name="close" class="icon-position" style="width: 14px;height: 14px"></icon>
    </div>
    <div class="notification-title">
      <icon name="downwarning" class="icon-position" style="width: 16px;height: 16px"></icon>
      <span>{{ messageTitle }}</span>
    </div>
    <div class="notification-text" v-if="this.status === '2'">
      表格内容过多，导出时间较长明细请前往
      <button @click="goToTableDownload" class="to-download">下载清单</button>
      中查看
    </div>
    <div class="notification-text" v-else>
      任务已存在，不可重复任务。
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Notification',
  props: {
  },
  data() {
    return {
      status: '2',
      messageTitle: ''
    };
  },
  computed: {
    ...mapState({
      titleArray: State => State.info.titleArray,
      activeTabs: State => State.info.activeTabs
    })
  },
  methods: {
    close() {
      this.$emit('show', false);
    },
    goToTableDownload() {
      const len = this.titleArray.length;
      for (let i = 0; i < len; i++) {
        if (this.titleArray[i].menu.fullpath === '/tableDownload') {
          this.$store.commit('info/setActiveTabs', i);
          break;
        }
        if (i === len - 1) {
          this.$store.commit('info/setActiveTabs', len);
          this.$store.dispatch('info/getTitleArray', {
            titleArray: {
              menu: {
                name: '下载清单',
                fullpath: '/tableDownload',
                url: '/tableDownload'
              }
            }
          });
        }
      }
      this.$router.push({ path: '/frame/tableDownload' });
    }
  },
  mounted() {
    this.messageTitle = this.status === '2' ? '导出中' : '导出失败';
  }
};
</script>
<style lang="less" scoped>
.notification{
  position: absolute;
  right: 20px;
  top: 11px;
  background-color: #ffffff;
  padding: 20px;
  width: 290px;
  box-shadow: 0 0 16px 0 rgba(102, 102, 102, 0.27);
  border-radius: 2px;
  z-index: 666;
  .notification-title{
    height: 14px;
    display: flex;
    margin-bottom: 9px;
    span{
      margin-left: 8px;
      font-size: 14px;
      line-height: 14px;
      color: #333333;
    }
  }
  .notification-text{
    font-size: 12px;
    line-height: 16px;
    color: #666666;
    .to-download{
      background-color: #ffffff;
      border: 0;
      font-size: 12px;
      line-height: 16px;
      cursor: pointer;
      color: #0096ff;
      outline: none;
    }
  }
  .close{
    position: absolute;
    right: 12px;
    top: 12px;
  }
}

</style>
