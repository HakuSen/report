<!--------------------------------------------------
  easytable
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
      <el-table :data="tableDataList" border fit max-height="700" stripe style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column :key="index" v-for='(item, index) in tableConfigList' :label="item.label" align='center' :prop='item.prop'>
        </el-table-column>
      </el-table>
    </div>
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
  name: 'EasyTable',
  mixins: [tableMixins],
  components: {
    TableLoading
  },
  props: {
    queryParams: {
      tableName: String
    },
    tableShowParams: {}
  },
  data() {
    return {
      tableShow: false,
      surchargeTotalCols: 0, // dialog行
      queryIfOK: false, // 接口请求失败
      currentPage: 1, // 默认开始页面数
      needParams: {},
      loading: false,
      chooseShow: false,
      totalRowArr: [],
      maxArrayLength: 0,
      surchargeMaxArrayLength: 0,
      rankNum: '20'
    };
  },
  methods: {
  },
  updated() {
    this.queryParams.contentText = this.tableShowParams.contentText;
    this.queryParams.contentShow = this.tableShowParams.contentShow;
    this.queryParams.contentShopShow = this.tableShowParams.contentShopShow;
    this.queryParams.shopShowFlag = this.tableShowParams.shopShowFlag;
    this.queryParams.shopNodeFlag = this.tableShowParams.shopNodeFlag;
    this.queryParams.totleShowFlag = this.tableShowParams.totleShowFlag;
    this.queryParams.showRankNum = this.tableShowParams.showRankNum;
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
      this.tableDataList = [];
      this.tableConfigList = [];
      if (n) {
        const queryTableData = n.data['shopper_info_line_obj_resp_tos'];
        if (queryTableData && queryTableData.length > 0) {
          queryTableData.unshift(
            {
              shoper_id: 6,
              shopper_name: '报表项目名称'
            });
          let infoTos = n.data['shopper_info_line_obj_resp_tos'];
          infoTos.forEach(item => {
            this.tableConfigList.push({
              label: item.shopper_name,
              prop: item.shopper_name
            });
          });
          let moneyResp = n.data['shopper_money_info_line_obj_resp_to'];
          moneyResp.forEach(item => {
            let obj = {};
            this.tableConfigList.forEach((item2, index) => {
              let objCh = { [item2.prop]: index === 0 ? item['key_name'] : item.line_moneys[index - 1]}
              Object.assign(obj, objCh);
            });
            this.tableDataList.push(obj);
          });
          this.picShow = false;
          this.$emit('tableShow', false);
          this.$store.commit('info/setQueryLoading', { loadingFlag: this.loadingName, loading: true });
          this.needParams.contactArray2 = [];
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
      //   this.rowMerge(this.tableDataList, this.needParams.contactArray, this.needParams.contactDot, this.needParams.arrayKey);
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
}
</style>
