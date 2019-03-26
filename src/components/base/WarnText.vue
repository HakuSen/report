<template>
  <div class="warnimg-text">
    <icon name="warning" class="warning-icon"></icon>
    <span>{{message}}</span>
    <!--<span>请务必保证外卖平台与堂食的“商品名称”，“规格”，“属性”完全一致，否则外卖商品无法与堂食商品合并统计！</span>-->
  </div>
</template>

<script>

export default {
  name: 'WarnText',
  props: {
    message: String
  }
};
</script>
<style lang="less" scoped>
.warnimg-text{
  background-color: #ffeedd;
  box-shadow: 0 1px 2px 0 rgba(179, 91, 4, 0.18);
  height: 16px;
  margin: -20px -20px 6px -20px;
  border-radius: 4px 4px 0 0;
  font-size: 12px;
  line-height: 16px;
  padding: 4px 0 4px 20px;
  color: #f55041;
  display: flex;
}
</style>
