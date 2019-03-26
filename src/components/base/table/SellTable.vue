<template>
  <div class="sell-table">
    <div class="sell-table-title">{{sellTableTitle}}</div>
    <el-table :row-class-name="activeStyle"
              @row-click="topTenEvent"
              :data="topTenData.rows"
              border>
      <el-table-column
        fit
        :resizable="false"
        v-for="(item, i) in topTenData.columns"
        :key="i"
        :prop="item"
        :label="item === 'goods_name'? '产品目录' : (item === 'sale_count_sum'? '销售量':(item === 'sale_price_sum'?'销售额': '' ))">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Vue from 'vue';
import { Table, TableColumn } from 'element-ui';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Table, TableColumn);
export default {
  name: 'SellTable',
  props: {
    topTenData: Object,
    topTenEvent: Function
  },
  data() {
    return {
      sellTableTitle: ''
    };
  },
  methods: {
    // 斑马条纹
    activeStyle({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'warning-row';
      }
      else if (rowIndex % 2 === 0) {
        return 'success-row';
      }
      return '';
    }
  },
  mounted() {
    this.sellTableTitle = this.topTenData['columns'][1] === 'sale_count_sum' ? '销售量top10' : '销售额top10';
  },
  updated() {
    this.sellTableTitle = this.topTenData['columns'][1] === 'sale_count_sum' ? '销售量top10' : '销售额top10';
  }
};
</script>
<style lang="less" scoped>
.sell-table{
  .sell-table-title{
    font-size: 18px;
    line-height: 24px;
    margin-bottom: 20px;
    color: #1a1a1a;
    text-align: center;
    font-weight: 600;
    font-family: 'Microsoft YaHei';
  }
}
</style>
<style lang="less">
.sell-table{
  .el-table{
    tr, th{
      background-color: #f7f7f7;
    }
    th, td{
      padding: 4px 10px;
    }
    .cell{
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      width: 100%;
    }
    td{
      cursor: pointer;
    }
  }
  .el-table .warning-row{
    background: #f7f7f7;
  }
  .el-table .success-row{
    background: #ffffff;
  }
}
</style>
