<template>
  <div class="page-device">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="sizesData"
      :page-size="everyPageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow" :disabled="(totalRow / everyPageSize) <= 1 && everyPageSize === 20 ">
    </el-pagination>
  </div>
</template>

<script>
import Vue from 'vue';
import { Pagination } from 'element-ui';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Pagination);
export default {
  name: 'PageDevice',
  props: {
    totalRow: Number,
    everyPageSize: Number,
    currentPage: Number,
    handleCurrentChange: Function,
    handleSizeChange: Function,
    pageSizes: Number
  },
  data() {
    return {
      sizesData: []
    };
  },
  mounted() {
    if (this.pageSizes && this.pageSizes === 100) {
      this.sizesData = [this.pageSizes];
    }
    else {
      this.sizesData = [20, 50, 100]
    }
  }
};
</script>
<style lang="less" scoped>
.page-device{
  height: 30px;
  text-align: center;
  margin-top: 20px;
  .el-input__inner{
    padding-left: 8px;
    padding-right: 25px;
  }
  .el-pagination__jump{
    .el-input__inner{
      padding: 0;
      text-align: center;
    }
  }
  .el-input__suffix{
    .el-input__suffix-inner{
      .el-select__caret.el-input__icon{
        line-height: 28px !important;
      }
    }
  }
}
</style>
<style lang="less">
.page-device{
  .el-input__suffix{
    .el-input__suffix-inner{
      .el-input__icon{
        line-height: 28px !important;
      }
    }
  }
}
</style>
