<!--------------------------------------------------
  YhDialog.vue
  对话框类
  目标：统一公司内司内部项目基础组件库、风格
---------------------------------------------------->
<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" data-options="options">

    <template slot="title" v-if="$slots.title">
      <slot name="title"></slot>
    </template>

    <slot></slot>

    <template slot="footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>

  </el-dialog>
</template>

<script>
import Vue from 'vue';
import { Dialog } from 'element-ui';

Vue.use(Dialog);

export default {
  name: 'YhDialog',
  inheritAttrs: false,
  data() {
    return {
      options: {
        excludeOlderBrowsers: true,
        multipleDropzonesItemsDraggingEnabled: true,
        showDropzoneAreas: true,
        onDrop() {
          // console.warn(event);
        },
        onDragstart() {
          // console.warn(event);
        },
        onDragend() {
        }
      }
    };
  }
};
</script>

<style lang="less">
.el-dialog{
  overflow: hidden;
  border-radius: 3px;

  .el-dialog__header{
    background-color: #f7f7f7;
    border-bottom: 1px solid #d4d4d4;
    padding: 0 0 0 10px;
    height: 34px;
    display: flex;
    align-items: center;

    .el-dialog__title{
      color: #333;
      flex: 1;
      text-align: center;
      font-size: 18px;
      font-weight: 500;
    }

    .el-dialog__headerbtn{
      position: static;
      top: auto;
      left: auto;
      flex: 0 0 30px;
    }
  }
  .el-dialog__footer{
    text-align: center;
    padding-bottom: 30px;
  }
}
</style>
