<!--搜索控件
  参数：
  type: primay/simple/default, ui规范支持三种按钮演示，分别对应默认、悬停、禁用
  disabled
  @click
}-->
<template>
  <button
    class="yh-button"
    type="button"
    @click="handleClick"
    :disabled="buttonDisabled"
    :class="[
      type ? 'yh-button--' + type : '',
      {
        'is-disabled': buttonDisabled,
        'is-special': special
      }
    ]"
  >
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>

<script>
import Vue from 'vue';
import { Button } from 'element-ui';
import SimpleVue from '../../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Button);
export default {
  name: 'yh-button',
  props: {
    disabled: Boolean,
    type: {
      type: String,
      default: 'default'
    },
    special: Boolean
  },
  computed: {
    buttonDisabled() {
      return this.disabled;
    }
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt);
    }
  }
};
</script>

<style lang="less">
@blueColor: rgb(0, 150, 255);
@lightBlue: rgb(218, 235, 248);
@defualtBorder: rgb(213, 213, 213);
.hover-style{
  background-color: @lightBlue;
  border-color: @blueColor;
  color: @blueColor;
}

.disabled-style{
  background-color: rgb(188, 188, 188);
  border-color: rgb(188, 188, 188);
  color: #fff;
  &:hover{
    background-color: rgb(188, 188, 188);
    color: #fff;
  }
}

.yh-button{
  display: inline-block;
  height: 34px;
  width: 80px;
  line-height: 34px;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid @defualtBorder;
  color: #333;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: .1s;
  transition: .1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  font-size: 14px;
  border-radius: 3px;
  padding: 0;
  + .yh-button{
    margin-left: 20px;
  }
  &.yh-button--primary{
    background-color: @blueColor;
    border-color: @blueColor;
    color: #fff;
    &:hover{
      background-color: rgb(10, 130, 240);
      border-color: rgb(10, 130, 240);
    }
  }
  &.yh-button--default{
    background: #fff;
    border: 1px solid @defualtBorder;
    color: #333;
  }
  &.yh-button--simple{
    border-color: @blueColor;
    background-color: #fff;
    color: @blueColor;
  }
  &.yh-button--simple, &.yh-button--default{
    &:hover{
      .hover-style;
    }
  }
  &.yh-button--simple, &.yh-button--default, &.yh-button--primary{
    &.is-disabled{
      cursor: not-allowed;
      .disabled-style;
    }
  }
  &.is-special{
    padding: 0 17px;
    width: auto;
  }
}
</style>
