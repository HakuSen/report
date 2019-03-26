<template>
  <div class="help-pic">
    <icon name="help" class="icon-help"/>
    <div class="help-hover">
      <p>{{ contentMessage[0] }}</p>
      <p>{{ contentMessage[1] }}</p>
      <div class="cut"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Help',
  props: {
    contentMessage: Array
  }
};
</script>
<style lang="less" scoped>
.help-pic{
  display: inline-block;
  position: relative;
  top: 2px;
  .help-hover{
    display: none;
    padding: 15px 20px;
    background: #fff;
    box-shadow: 0 0 4px 0 rgba(102, 102, 102, 0.3);
    border-radius: 4px;
    font-size: 12px;
    color: #666666;
    position: absolute;
    left: -28px;
    top: 32px;
    z-index: 10;
    p{
      width: 200px;
      line-height: 22px;
    }
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
  .icon-help:hover ~ .help-hover{
    display: block;
  }
}
</style>
