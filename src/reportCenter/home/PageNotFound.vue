<!--------------------------------------------------
  页面没有上线时的默认页面
---------------------------------------------------->
<template>
  <div class="hello">
    {{msg}}
  </div>
</template>

<script>
export default {
  name: 'PageNotFound',
  data() {
    return {
      msg: 'Sorry, 页面正在努力开发中！'
    };
  }
};
</script>

<style scoped>
/* styles define: */
</style>
