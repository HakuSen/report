<template>
  <div class="adaptive-block">
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="8">
        <div class="grid-content bg-purple adaptive_block_model">
          <p>账户总余额（元）</p>
          <p>{{ memberCardTotalStatistics.list['total_blance'] }}</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple adaptive_block_model">
          <p>
            充值总额（元）
            <Help :contentMessage="contentMessage"/>
          </p>
          <p>{{ memberCardTotalStatistics.list['total_pry_real_money'] }}</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple adaptive_block_model">
          <p>消费总额（元）</p>
          <p>{{ memberCardTotalStatistics.list['total_member_pay']}}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Help from './Help';

export default {
  name: 'AdaptiveBlock',
  components: {
    Help
  },
  props: {
    memberCardTotalStatistics: Object
  },
  data() {
    return {
      contentMessage: ['所有会员的实际充值金额，不包含赠送金额', '']
    };
  }
};
</script>

<style lang="less" scoped>
.adaptive-block{
  .adaptive_block_model{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff !important;
    height: 112px;
    border: 1px solid #e6ebf0;
    margin-bottom: 12px;
    border-radius: 4px;
    p{
      width: 100%;
      text-align: center
    }
    p:nth-child(1){
      font-size: 14px;
      color: #333
    }
    p:nth-child(2){
      font-size: 30px;
      color: #eb7741
    }
  }
  div:nth-child(2){
    margin: 0 14px!important;
  }
}
</style>
