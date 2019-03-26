<template>
  <div class="remment">
    <el-card class="server">
      <p>推荐服务</p>
      <el-tabs @tab-click="handleClick">
        <el-tab-pane v-for='(item,index) in recommend' :key='index' :label="item.head" :name="item.num">
          {{item.content}}
          <p class="tongji">已有<span class="tjNum">{{item['people']}}</span>人次订阅</p>
        </el-tab-pane>
      </el-tabs>
      <div class="remButton">
        <el-button type="primary" size="small">立即订购</el-button>
        <el-button type="default" size="small" class="blueWord">了解详情</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      recommend: []
    };
  },
  created() {
    this.recommend = this.$store.state.info.recommend;
  },
  methods: {
    handleClick() {

    }
  }
};
</script>
<style lang="less" scoped>
.remment{
  text-align: left;
  line-height: 20px;
}

.server{
  width: 100%;
  font-size: 12px;
  font-weight: bolder;
  /*float       : left;*/
  .tongji{
    margin-top: 5px;
    font-size: 14px;
    font-weight: normal;
    .tjNum{
      color: #409EFF;
    }
  }
  .remButton{
    margin-top: 20px;
    .blueWord{
      color: #409EFF;
      border-color: #409EFF;
    }
  }
}

</style>

