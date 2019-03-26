<template>
  <div class="pic-table no-result"><!--请求无数据时页面-->
    <div>
      <img src="../../../../static/img/noResult.png"/>
    </div>
    <p class="text">哎呀,暂无数据</p>
  </div>
</template>

<script>

export default {
  name: 'noResult'
};
</script>
<style lang="less">
.pic-table.no-result{
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  text-align: center;
  width: 100%;
  height: 100%;
  font-size: 18px;
  color: #999999;
  img{
    width: 163px;
    height: 150px;
  }
  .text{
    margin-top: 20px;
    font-size: 20px;
  }
}
</style>
