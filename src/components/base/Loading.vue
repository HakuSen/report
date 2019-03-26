<template>
  <div class="loading-mask"><!--loading-->
    <div>
      <img src="../../../static/img/loading.gif" alt="">
    </div>
  </div>
</template>

<script>

export default {
  name: 'noResult'
};
</script>
<style lang="less">
.loading-mask{
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
  z-index: 10;
}
</style>
