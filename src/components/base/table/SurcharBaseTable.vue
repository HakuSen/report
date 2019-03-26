<!--------------------------------------------------
  功能简单的的table
---------------------------------------------------->
<template>
  <div class="table-center">
     <el-button class="btnOut" type="primary" @click="submitHandler" style="float: right; padding: 3px 0; margin-bottom: 10px" :loading="collectLoading" v-if="String(surchargeList.data.table_data) !== 'null' ">
       <span style="margin-right:6px"><i class="el-icon-download" v-if="!collectLoading"></i></span>导出表格
      </el-button>
     <el-table :data="surchargeList.data.table_data" :border='true' :span-method="objectSpanMethod" fit max-height="464" v-if="String(surchargeList.data.table_data) !== 'null'" :row-class-name="activeStyle">
        <el-table-column :key="index" v-for='(item, index) in surchargeList.data.table_config' :label="item.label" :prop='item.prop' :align="item.align" :resizable="item.resizable" :width="item.width ? item.width : ''">
          <el-table-column :key="i" v-if='item.children && item.children.length>0' v-for="(item1, i) in item.children" :label="item1.label" :prop='item1.prop' :align="item.align" :resizable="item.resizable">
            <el-table-column :key="n" v-if='item1.children && item1.children.length>0' v-for="(item2, n) in item1.children" :label="item2.label" :prop='item2.prop' :align="item.align" :resizable="item.resizable">
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    <no-result v-else/>
    <!-- <page-device v-if="tableFlag" :totalRow="totalRow" :everyPageSize="everyPageSize" :currentPage="currentPage" :handleCurrentChange="handleCurrentChange" :handleSizeChange="handleSizeChange"/> -->
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { BlobFile, MIME } from 'vue-simple';
import { Table, TableColumn, Input, Popover, Tag, Tabs, TabPane, Loading } from 'element-ui';
import PathConf from '../../../conf/api.conf';
import NoResult from '../queryResult/NoResult';
import TableLoading from '../Loading';
import PageDevice from './PageDevice';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(TableColumn, Input, Table, Tag, Popover, Tabs, TabPane, Loading);
export default {
  name: 'BaseTable',
  components: {
    NoResult,
    TableLoading,
    PageDevice
  },
  props: {
    surchargeNameList: Array,
    surchargeName: String,
    dialogMassage: String,
    surcharParams: Object,
    loadingName: String,
    loadingFlag: Boolean,
    surchargeList: Object,
    downloadData: Array,
    newPageing: Object
  },
  data() {
    return {
      collectLoading: false,
      surchargeConfig: [],
      surchargeContactArray: [],
      surchargeTotalRowArr: [],
      surchargeLoading: false,
      tableConfigList: [],
      totalCols: 0, // 每行
      // 的列的长度，用来控制横向合并单元格
      totalRow: 0, // 列的总数
      total: 0, // 默认数据总数
      everyPageSize: 20,
      currentPage: 1, // 默认开始页面数
      loading: false,
      chooseShow: false,
      rows: 0,
      totalRowArr: [],
      contactArray: [],
      contactDot: 0,
      maxArrayLength: 0
    };
  },
  computed: {
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    })
  },
  methods: {
    // 导出
    submitHandler() {
      this.collectLoading = true;
      this.surcharParams['download'] = 1;
      Vue.$api.post({ getway: PathConf.report.$getway, api: PathConf.report[this.surchargeName] }, this.surcharParams, {
        responseType: 'blob',
        headers: {
          token: this.userinfo.token,
          invoke_source: '2200'
        }
      }).then(res => {
        const file = new BlobFile({
          data: res.data,
          filename: this.dialogMassage,
          mime: MIME.xls,
          endings: 'native'
        });
        file.download();
        file.destory();
        this.collectLoading = false;
      });
    },
    // 返回合并区域需要的参数
    rowMerge(array, contactArray, contactDot) {
      for (let i = 0; i <= this.totalCols; i++) {
        contactArray.push(1);
      }
      array && array.length > 0 && array.forEach((value, key, item) => {
        if (item[key]['mergeField'] === 'row_id') {
          this.totalRowArr.push(item[key - 1]['row_id'] + 1);
          this.maxArrayLength = item[key]['mergeCols'];
          contactArray[0] = this.maxArrayLength;
          if (this.maxArrayLength >= 2) {
            for (let i = 1; i < this.maxArrayLength; i++) {
              contactArray[i] = 0;
            }
          }
        }
        if (key === 0) {
          contactArray.push(1);
          this.contactDot = 0;
        }
        else {
          contactArray.push(1);
          this.contactDot = key;
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
        if (rowIndex === (this.totalRowArr[i] - 1) && this.contactArray) {
          const col3 = this.contactArray[columnIndex];
          const row3 = col3 >= 1 ? 1 : 0;
          return {
            colspan: col3,
            rowspan: row3
          };
        }
      }
      return false;
    },
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
    // 分页
    // handleSizeChange(val) {
    //   let urlParams = { interfaceAddress: this.queryParams.url, dataName: this.queryParams.tableData };
    //   if (this.tableQueryParams) {
    //     this.tableQueryParams['page_size'] = val;
    //     this.tableQueryParams['download'] = 0;
    //     this.$store.dispatch('info/getRequestDataList', { params: this.tableQueryParams, urlParams });
    //   }
    //   this.everyPageSize = val;
    // },
    // handleCurrentChange(val) {
    //   this.$emit('tableShow', false);
    //   this.$store.commit('info/setQueryLoading', { loadingFlag: this.loadingName, loading: true });
    //   let urlParams = { interfaceAddress: this.queryParams.url, dataName: this.queryParams.tableData };
    //   if (this.tableQueryParams) {
    //     this.tableQueryParams['page_num'] = val;
    //     this.tableQueryParams['download'] = 0;
    //     this.$store.dispatch('info/getRequestDataList', { params: this.tableQueryParams, urlParams });
    //   }
    //   this.currentPage = val;
    // }
  },
  created() {
    this.totalRowArr = [];
    this.contactArray = [];
    this.contactDot = 0;
    this.totalCols = this.surchargeList['data'].total_cols;
    this.rowMerge(this.surchargeList['data'].table_data, this.contactArray, this.contactDot);
  },
  mounted() {
  },
  updated() {
  },
  watch: {
    newPageing(n, o) {
      if (n.pageingFlag !== o.pageingFlag) {
        this.currentPage = 1;
        this.everyPageSize = 20;
      }
    },
    surchargeList(n) {
      if (n) {
        this.totalRowArr = [];
        this.contactArray = [];
        this.contactDot = 0;
        this.totalCols = this.surchargeList['data'].total_cols;
        this.rowMerge(this.surchargeList['data'].table_data, this.contactArray, this.contactDot);
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
}
</style>
