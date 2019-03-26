<template>
  <div class="pic-table query-fail"><!--请求无数据时页面-->
    <div class="img"><img src="../../../../static/img/queryFail.png"/></div>
    <ul class="text">
      <li>
        <p></p>
        <span>您所查看的页面无法浏览或已不存在</span>
      </li>
      <li>
        <p></p>
        <span>输入地址不正确</span>
      </li>
      <li>
        <p></p>
        <span>页面重新定义或程序出错</span>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'noResult'
};
</script>
<style lang="less">
.pic-table.query-fail{
  background: #ffffff;
  min-height: 400px;
  text-align: center;
  .img{
    padding-top: 50px;
    img{
      width: 100px;
      height: 100px;
    }
  }
  .text{
    margin-top: 20px;
    font-size: 20px;
    text-align: left;
    padding-left: 50%;
    margin-left: -150px;
    li{
      display: flex;
      font-size: 18px;
      color: #999999;
      width: 100%;
      align-items: center;
      p{
        width: 10px;
        height: 10px;
        background: #989898;
        border-radius: 50% 50%;
        margin-right: 10px;
      }
    }
  }
}
</style>
