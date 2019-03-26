<template>
  <div class="positionText">
    <p class="titleSize">银盒子-商家中心</p>
    <p class="introduceSize">智能新零售 聚焦新餐饮</p>
    <p class="footSize">
      <span>高效收银</span>
      <span>|</span>
      <span>流量导入</span>
      <span>|</span>
      <span>智慧营销</span>
    </p>
    <div class="lookMore">查看详情</div>
  </div>
</template>

<script>
export default {
  name: 'contentText'
};
</script>

<style lang="less" scoped>
.positionText{
  color: #fff;
  float: left;
  // position : absolute;
  // left     : 17%;
  // top      : 34%;
  // margin   : 15% 0 0 15%;
  // position : absolute;
  // top      : 190px;
  // left     : 20%;

  .titleSize{
    font-size: 37px;
    font-weight: bold;
    margin-bottom: 22px;
  }
  .introduceSize{
    font-size: 21px;
    font-weight: bolder;
    margin-bottom: 29px;
  }
  .footSize{
    font-size: 17px;
    font-weight: bolder;
    margin-bottom: 44px;
    span{
      margin-right: 5px;
    }
  }
  .lookMore{
    width: 108px;
    height: 41px;
    border: 1px solid #ffffff;
    border-radius: 5px;
    text-align: center;
    line-height: 38px;
    cursor: pointer;
    &:hover{
      border-color: green;
      color: green
    }
  }
}
</style>
