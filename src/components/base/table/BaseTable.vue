<!--------------------------------------------------
  功能简单的的table
---------------------------------------------------->
<template>
  <div class="table-center">
    <keep-alive>
      <tableLoading v-if="loadingFlag"/>
      <no-result v-if="picShow"/>
      <query-fail v-if="queryIfOK"/>
    </keep-alive>
    <div class="tableBox" v-if="tableFlag">
      <keep-alive>
        <report-header :paramsData="queryParams" :totleData="topTableData" :everyTableParams="tableQueryParams" :formData="formData"/>
      </keep-alive>
      <el-table :data="tableDataList" :border='true' :span-method="objectSpanMethod" :row-class-name="activeStyle" fit max-height="464" @cell-click="surcharge" :cell-class-name="cellSttyle" @sort-change="getSortChange">
        <el-table-column :key="index" v-for='(item, index) in tableConfigList' :label="item.label" :prop='item.prop' :fixed="getFixedVal(item.fixed)" :align="item.align" :resizable="item.resizable" :min-width="item.width ? item.width : '150px'" :sortable="item.prop === '-buyCount' || item.prop === '-buyPrice' || item.prop === '-buyTotalPrice'">
          <template slot-scope="scope">
            <!--<p @click="aaa(scope)">aa</p>-->
            <el-popover trigger="hover" :open-delay="800" placement="top" v-if="scope.row[scope.column['property']] && scope.row[scope.column['property']].toString().indexOf('周') !== -1 && needParams.slotFlag">
              <p v-if="scope.column['property'] === 'timeslot'">周期: {{ scope.row['timeslotDisplay']}}</p>
              <p v-if="scope.column['property'] === 'lastTimeslot'">周期: {{ scope.row['lastTimeslotDisplay']}}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row[scope.column['property']] }}</el-tag>
              </div>
            </el-popover>
            <div slot="references" class="name-wrapper no-subtotal" v-else>
              <el-tag>{{ scope.row[scope.column['property']] }} <el-tooltip class="item" v-if="tableShowParams.tipContents" effect="light" :content="tableShowParams.tipContents[0]" placement="top">
                <i class="el-icon-question" v-if="scope.row[scope.column['property']] && scope.row[scope.column['property']].toString() === tableShowParams.tipContents[1] && !scope.row.hasOwnProperty('isDiscount')"></i>
              </el-tooltip></el-tag>
            </div>
          </template>
          <el-table-column :key="i" v-if='item.children && item.children.length>0' v-for="(item1, i) in item.children" :label="item1.label" :prop='item1.prop' :fixed="getFixedVal(item.fixed)" :align="item.align" :resizable="item.resizable">
            <el-table-column :key="n" v-if='item1.children && item1.children.length>0' v-for="(item2, n) in item1.children" :label="item2.label" :prop='item2.prop' :fixed="getFixedVal(item.fixed)" :align="item.align" :resizable="item.resizable">
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <page-device v-if="tableFlag" :totalRow="totalRow" :everyPageSize="everyPageSize" :currentPage="currentPage" :handleCurrentChange="handleCurrentChange" :handleSizeChange="handleSizeChange" :pageSizes="pageSizes"/>
  </div>
</template>

<script>
import Vue from 'vue';
import { Loading } from 'element-ui';
import tableMixins from '../mixins/mixinsTable';
import TableLoading from '../Loading';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Loading);
export default {
  name: 'BaseTable',
  mixins: [tableMixins],
  components: {
    TableLoading
  },
  props: {
    surchargeNameList: Array,
    queryParams: {
      tableName: String
    },
    tableShowParams: {},
    pageSizes: Number
  },
  data() {
    return {
      tableShow: false,
      queryIfOK: false, // 接口请求失败
      currentPage: 1, // 默认开始页面数
      needParams: {},
      loading: false,
      chooseShow: false,
      totalRowArr: [],
      maxArrayLength: 0,
      rankNum: '20'
    };
  },
  methods: {
    activeStyle(row) {
      if (row.row['rowName'] === '<合计>') {
        return 'rowStyle';
      }
      if (row.row['rowName'] === '<小计>') {
        return 'countStyle';
      }
      if (row.row['rowName'] === '<其他小计>') {
        return 'countStyle';
      }
      if (row.row['promotion'] === '合计') {
        return 'rowStyle';
      }
      if (row.row['promotion'] === '整单优惠小计') {
        return 'countStyle';
      }
      if (row.row['promotion'] === '单品优惠小计') {
        return 'countStyle';
      }
    },
    getFixedVal(fixedVal) { // 判断列固定
      if (fixedVal === 'true') {
        return true;
      }
      else if (fixedVal === 'right') {
        return fixedVal;
      }
      else if (fixedVal === 'false') {
        return false;
      }
    },
    getSortChange(column) { // 销售额/量改变时重新请求接口
      this.$emit('getSortChange', column);
    },
    getRankNum(val) {
      this.rankNum = val;
      this.$parent.submitHandler('buy_count_sort', 'desc', val);
    },
    // 某一个单元格样式操作
    cellSttyle(row) {
      if (this.surchargeNameList && this.surchargeNameList.length > 0) {
        for (let i = 0; i < this.surchargeNameList.length; i++) {
          if (row.column['label'].indexOf(this.surchargeNameList[i]) !== -1) {
            return 'cellStyle';
          }
        }
      }
    },
    // 点击附加费 弹窗
    surcharge(row, column) {
      this.$emit('dialogEvent', { row, column });
    },
    // 返回合并区域需要的参数
    rowMerge(array, contactArray, contactDot, arrayKey) {
      array.forEach((value, key, item) => {
        if (item[key]['mergeField'] === 'row_id') {
          if (this.currentPage !== 1) {
            this.totalRowArr.push(item[key - 1]['row_id'] - ((this.currentPage) - 1) * this.everyPageSize + 1);
          }
          else {
            this.totalRowArr.push(item[key - 1]['row_id'] + 1);
          }
          this.maxArrayLength = item[key]['mergeCols'];
          this.needParams.contactArray2[0] = this.maxArrayLength;
          if (this.maxArrayLength >= 2) {
            for (let i = 1; i < this.maxArrayLength; i++) {
              this.needParams.contactArray2[i] = 0;
            }
          }
        }
        if (key === 0) {
          contactArray.push(1);
          this.needParams.contactDot = 0;
        }
        else if (item[key][arrayKey] && item[key][arrayKey] === array[key - 1][arrayKey]) {
          contactArray[this.needParams.contactDot] += 1;
          contactArray.push(0);
        }
        else {
          contactArray.push(1);
          this.needParams.contactDot = key;
        }
      });
      return {
        contactArray,
        contactDot
      };
    },
    // 合并单元格
    objectSpanMethod({ rowIndex, columnIndex }) {
      for (let i = 0; i < this.totalRowArr.length; i++) {
        if (rowIndex === (this.totalRowArr[i] - 1) && this.needParams.contactArray2) {
          const col3 = this.needParams.contactArray2[columnIndex];
          const row3 = col3 >= 1 ? 1 : 0;
          return {
            colspan: col3,
            rowspan: row3
          };
        }
      }
      return false;
    },
    // 分页
    handleSizeChange(val) {
      let urlParams = { interfaceAddress: this.queryParams.url, dataName: this.queryParams.tableData };
      if (this.tableQueryParams) {
        this.tableQueryParams['page_size'] = val;
        this.tableQueryParams['download'] = 0;
        this.$store.dispatch('info/getRequestDataList', { params: this.tableQueryParams, urlParams });
      }
      this.everyPageSize = val;
    },
    handleCurrentChange(val) {
      this.$emit('tableShow', false);
      this.$store.commit('info/setQueryLoading', { loadingFlag: this.loadingName, loading: true });
      let urlParams = { interfaceAddress: this.queryParams.url, dataName: this.queryParams.tableData };
      if (this.tableQueryParams) {
        this.tableQueryParams['page_num'] = val;
        this.tableQueryParams['download'] = 0;
        this.$store.dispatch('info/getRequestDataList', { params: this.tableQueryParams, urlParams });
      }
      this.currentPage = val;
    }
  },
  updated() {
    this.queryParams.contentText = this.tableShowParams.contentText;
    this.queryParams.contentShow = this.tableShowParams.contentShow;
    this.queryParams.contentShopShow = this.tableShowParams.contentShopShow;
    this.queryParams.shopShowFlag = this.tableShowParams.shopShowFlag;
    this.queryParams.shopNodeFlag = this.tableShowParams.shopNodeFlag;
    this.queryParams.totleShowFlag = this.tableShowParams.totleShowFlag;
    this.queryParams.showRankNum = this.tableShowParams.showRankNum;
    this.queryParams.machineShow = this.tableShowParams.machineShow;
    this.queryParams.employeesShow = this.tableShowParams.employeesShow;
    this.queryParams.orgMachineShow = this.tableShowParams.orgMachineShow;
    this.queryParams.tipContents = this.tableShowParams.tipContents
    const disableDiv = document.getElementsByClassName('disabled')[0];
    const disableDiv1 = document.getElementsByClassName('disabled')[1];
    if (disableDiv) {
      disableDiv.setAttribute('disabled', 'disabled');
    }
    if (disableDiv1) {
      disableDiv1.setAttribute('disabled', 'disabled');
    }
  },
  watch: {
    tableAllData(n) {
      if (n) {
        const queryTableData = n.data.data.table_data;
        if (queryTableData && queryTableData.length > 0) {
          this.tableConfigList = n.data.data.table_config;
          this.topTableData = n.data.data['top_table_data'];
          this.tableDataList = queryTableData;
          this.totalRow = n.data.data.total_row;
          this.totalCols = n.data.data.total_cols;
          this.picShow = false;
          this.$emit('tableShow', false);
          this.$store.commit('info/setQueryLoading', { loadingFlag: this.loadingName, loading: true });
          this.totalRowArr = [];
          this.needParams.contactArray2 = [];
          // 返回横向合并需要的数组
          for (let i = 0; i <= this.totalCols; i++) {
            this.needParams.contactArray2.push(1);
          }
          this.$emit('tableShow', true);
          this.$store.commit('info/setQueryLoading', { loadingFlag: this.loadingName, loading: false });
          this.queryIfOK = false;
        }
        else if (queryTableData === null) {
          this.$emit('tableShow', false);
          this.$store.commit('info/setQueryLoading', { loadingFlag: this.loadingName, loading: false });
          this.picShow = true;
          this.queryIfOK = false;
        }
        else {
          this.$emit('tableShow', false);
          this.picShow = false;
          this.queryIfOK = true;
          this.$store.commit('info/setQueryLoading', { loadingFlag: this.loadingName, loading: false });
        }
        this.needParams.arrayKey = this.tableShowParams.mergeTextArray[0];
        this.needParams.arrayKey1 = this.tableShowParams.mergeTextArray[1];
        this.needParams.contactArray = [];
        this.needParams.contactDot = 0;
        this.needParams.contactArray1 = [];
        this.needParams.contactDot1 = 0;
        this.needParams.contactDot2 = 0;
        // 合并第一列
        this.rowMerge(this.tableDataList, this.needParams.contactArray, this.needParams.contactDot, this.needParams.arrayKey);
      }
      else if (n === null) {
        this.$emit('tableShow', false);
        this.$store.commit('info/setQueryLoading', { loadingFlag: this.loadingFlag, loading: false });
        this.picShow = false;
        this.queryIfOK = false;
      }
    }
  }
};
</script>

<style lang="less">
.el-tag{
  white-space: pre-wrap !important;
  padding: 0 !important;
  line-height: inherit !important;
}

thead tr{
  color: #333;
  .cell{
    font-weight: 900;
  }
}

@-moz-document url-prefix(){
  .table-center{
    height: 100%;
  }
}

.table-center{
  background: #ffffff;
  /*@-moz-document url-prefix(){*/
  .el-table table{
    border-collapse: separate !important;
    border-spacing: 1px;
    background-color: #cecccc;
  }
  .el-table table td, .el-table table th{
    border: 0 !important;
  }
  /*}*/
  .el-table__header, .el-table__body{
    border-collapse: collapse;
  }
  .el-table tr,
  .el-table td,
  .el-table th{
    padding: 0;
    border: 1px solid #cecccc;
    height: 23px;
    line-height: 23px;
  }
  .el-table .warning-row{
    background: #ffffff;
  }
  .el-table .success-row{
    background: #f4f4f4;
  }
  .el-table thead.is-group th{
    background-color: #f4f4f4;
  }
  .cell span{
    display: block;
    width: 100%;
    height: 100%;
  }
  .cell .caret-wrapper{
    display: inline-block;;
    width: 14px;
    height: 34px;
  }
  .btnOut{
    height: 27px;
    width: 90px;
    background: #ffffff;
    border-radius: 2px;
    color: #626262;
    border: 1px solid #d5d5d5;
  }
  .name-wrapper.el-popover__reference, .el-tag{
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    background-color: transparent;
    color: #606266;
  }
  .name-wrapper.include-subtotal{
    display: flex;
    .el-tag{
      width: 70%;
      padding-right: 0;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: right;
    }
    .subtotal-text{
      flex: 1;
      line-height: 30px;
      text-align: left;
    }
  }
  .name-wrapper.no-subtotal{
    display: flex;
    .el-tag{
      font-size: 14px;
    }
  }
  .cell .el-checkbox__input{
    height: 12px;
    width: 12px;
  }
  .cell .el-checkbox__inner{
    height: 12px;
    width: 12px;
  }
  .el-checkbox{
    margin-left: 14px;
  }
  .cell{
    padding: 0 !important;
    position: relative;
    .percentage{
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(111, 111, 0, 0.5);
    }
  }

  .cell .el-table__column-filter-trigger{
    height: 12px;
    line-height: 12px;
  }
  .pic-table{
    background: #ffffff;
    min-height: 400px;
    text-align: center;
    .img{
      padding-top: 50px;
    }
    .text{
      margin-top: 20px;
      font-size: 20px;
    }
  }
  .subtotal{
    display: block;
  }
  .tableBox .el-table__body tr.hover-row > td{
    background: #eef8ff;
  }
  .el-table .cellStyle{
    span{
      color: #0096ff !important;
    }
    cursor: pointer;
  }
  .el-table .rowStyle{
    .cell{
      background: #fff0ea !important;
    }
  }
  .el-table .countStyle{
    .cell{
      background: #fdd5c4 !important;
    }
  }
}
</style>
