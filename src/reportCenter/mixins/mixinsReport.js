// 该 js 留用 2019 01 09 张猛

export default {
  data() {},
  methods: {
    getDetailDudge(column, detailInfo) {
      if (detailInfo && JSON.stringify(detailInfo) !== '{}') {
        this.rankNum = detailInfo['top_num'] + '';
      }
      if (column.prop === '-buyCount') {
        column.order === 'descending' ? this.submitHandler('buy_count_sort', 'desc', this.rankNum) : this.submitHandler('buy_count_sort', 'asc', this.rankNum);
      }
      if (column.prop === '-buyPrice') {
        column.order === 'descending' ? this.submitHandler('buy_price_sort', 'desc', this.rankNum) : this.submitHandler('buy_price_sort', 'asc', this.rankNum);
      }
      if (column.prop === '-buyTotalPrice') {
        column.order === 'descending' ? this.submitHandler('buy_total_price_sort', 'desc', this.rankNum) : this.submitHandler('buy_total_price_sort', 'asc', this.rankNum);
      }
      if (column.prop === 'refundCount' || column.prop === 'refundPrice') { // 退菜统计数量和金额排序
        column.order === 'descending' ? this.submitHandler(column.prop, 'desc') : this.submitHandler(column.prop, 'asc');
      }
    }
  }
};
