<template>
  <div>
    <el-card class="numShow">
      <div class="leftPersent">
        <div><span class="redNum">{{currentNum}}</span>元</div>
        <div class="bottomMargin">当前营业额</div>
        <div>
          <span class="rightMargin">同比营业额<b>{{turnover}}%</b></span>
          <span class="dingdanCol">同比订单数<b>{{dingdan}}%</b></span>
        </div>
        <div class="modeCenter">
          <div class="mode-bottom" v-for="(item) in nummode" :key="item.id">
            <div class="modeMargin">{{item['money']}}元</div>
            <div>
              <icon :name="item.name" class="middleIcon" autosize></icon>
              <span>{{item.mode}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="rightPersent">
        <ul>
          <li class="pureNum" v-for="(item) in rightlist" :key="item.id">
            <div class="iconfloat">
              <icon :name="item.name" class="bigIcon" autosize></icon>
            </div>
            <div class="iconfloat">
              <p>{{item['money']}}元</p>
              <p>{{item.note}}</p>
            </div>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'NumShow',
  data() {
    return {
      currentNum: '',
      turnover: '',
      dingdan: '',
      nummode: [],
      rightlist: []
    };
  },
  created() {
    this.currentNum = this.$store.state.info['numshow'].currentNum;
    this.turnover = this.$store.state.info['numshow'].turnover;
    this.dingdan = this.$store.state.info['numshow'].dingdan;
    this.nummode = this.$store.state.info['numshow'].nummode;
    this.rightlist = this.$store.state.info['numshow'].rightlist;
  }
};
</script>

<style lang="less" scoped>
.numShow{
  font-size: 12px;
  color: #666;
  width: 100%;
  overflow: hidden;
  line-height: 20px;
  /*float       : left;*/
  .leftPersent{
    width: 50%;
    float: left;
  }
  .rightPersent{
    width: 50%;
    float: left;
    .pureNum{
      width: 34%;
      min-width: 120px;
      background: #eee;
      float: left;
      margin: 0 8px 8px 8px;
      padding: 2% 3%;
      .iconfloat{
        width: 50%;
        height: 40px;
        float: left;
        .bigIcon{
          margin-top: 7px;
          width: 25px;
          height: 25px;
        }
      }
    }
  }
  .modeCenter{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
    .mode-bottom{
      width: 25%;
      min-width: 80px;
      float: left;
      margin: 0 8px 27px 0;
      .modeMargin{
        margin-bottom: 5px;
      }
    }
    .middleIcon{
      vertical-align: middle;
      text-align: center;
      width: 30px;
      height: 30px;
    }
  }
  .redNum{
    font-size: 25px;
    font-weight: bold;
    color: red;
  }
  .bottomMargin{
    margin-bottom: 30px;
  }
  .rightMargin{
    margin-right: 10px;
    b{
      color: red;
    }
  }
  .dingdanCol > b{
    color: green;
  }
}
</style>
