<!--
 提示框
-->
<template>
  <div class="prompt-content">
    <p v-for="(item, i) in titleList" :key="i">{{item}}</p>
    <div class="cut"></div>
  </div>
</template>

<script>
export default {
  name: 'PromptTip',
  props: {
    titleList: Array
  }
};
</script>
<style lang="less" scoped>
.prompt-content{
  padding: 10px 20px;
  background: #fff;
  box-shadow: 0 0 4px 0 rgba(102, 102, 102, 0.3);
  border-radius: 4px;
  font-size: 12px;
  color: #666666;
  display: inline-block;
  .cut{
    position: absolute;
    top: -5px;
    left: 30px;
    z-index: 9999;
    background-color: #fff;
    width: 10px;
    height: 10px;
    border: #eaeaea solid 1px;
    border-left: 0;
    border-bottom: 0;
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
}
</style>
