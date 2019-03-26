<template>
  <div class="noticeCard">
    <el-card>
      <div slot="header">
        <span>公告栏</span>
        <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
      </div>
      <div>
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="item in 3" :key="item" class="noticeImg">
            <img src="" alt="">
          </el-carousel-item>
        </el-carousel>
        <ul class="dot">
          <li v-for="i in 2 " :key="i">
            <p>几点交乐附近看到了附近的路口</p>
            <p>2018-7-6</p>
          </li>
        </ul>
      </div>

    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Notice'
};
</script>

<style lang="less" scoped>
.noticeCard{
  width: 100%;
  font-size: 12px;
  line-height: 20px;
  text-align: left;
  margin-top: 20px;
  .noticeImg{
    width: 100%;
    background: pink;
    height: 130px;
  }
  /deep/ .el-carousel__container{
    height: 140px;
  }
  /deep/ .el-carousel__indicators--outside{
    text-align: right;
    button{
      background-color: #409EFF;
    }
  }
}

.dot{
  list-style-type: disc;
  color: #666;
  margin-left: 15px;
}

</style>
