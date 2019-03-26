<!--------------------------------------------------
  功能较多的table
---------------------------------------------------->
<template>
  <div class="table-center">
    <keep-alive>
      <loading v-if="loadingFlag"/>
      <no-result v-if="picShow"/>
      <query-fail v-if="queryIfOK"/>
    </keep-alive>
    <div class="tableBox" v-if="tableFlag">
      <keep-alive>
        <report-header :paramsData="queryParams" :totleData="topTableData" :everyTableParams="tableQueryParams" :formData="formData"/>
      </keep-alive>
      <el-table :data="tableDataList" border :span-method="objectSpanMethod" :row-class-name="activeStyle" @cell-dblclick="handClick" @row-click="changeBackground" @cell-click="percentageShow" :cell-class-name="cellSttyle" :default-sort="{prop: 'date', order: 'descending'}" max-height="464" fit @sort-change="getSortChange">
        <el-table-column
          type="selection"
          width="40" v-if="chooseShow">
        </el-table-column>
        <el-table-column :key="index" v-for='(item, index) in tableConfigList' :label="item.label" :prop='item.prop' :fixed="getFixedVal(item.fixed)" :align="item.align" :resizable="item.resizable" :width="item.width ? item.width : ''" :class-name="index === tableConfigList.length - 1 ? 'last-cell' : ''" :sortable="item.prop === '-buyCount' || item.prop === '-buyPrice' || item.prop === '-buyTotalPrice' || item.prop === 'refundCount' || item.prop === 'refundPrice'">
          <!--前端实现文本溢出中间...-->
          <!--<template slot-scope="scope">
            <div slot="reference111" class="name-wrapper include-subtotal" v-if="scope.row[scope.column['property']] && scope.row[scope.column['property']].toString().indexOf('小计') !== -1">
              <el-tag>{{ scope.row[scope.column['property']].toString().replace(/'小计'/g, '') }}</el-tag>
              <span class="subtotal-text">小计：</span>
            </div>
            <div slot="reference111" class="name-wrapper no-subtotal" v-else>
              <el-tag>{{ scope.row[scope.column['property']] }}</el-tag>
            </div>
          </template>-->
          <el-table-column :key="i" v-if='item.children && item.children.length>0' v-for="(item1, i) in item.children" :label="item1.label" :prop='item1.prop' :fixed="getFixedVal(item.fixed)" :align="item.align" :resizable="item.resizable" :class-name="index === tableConfigList.length - 1 ? 'last-cell' : ''">
            <el-table-column :key="n" v-if='item1.children && item1.children.length>0' v-for="(item2, n) in item1.children" :label="item2.label" :prop='item2.prop' :fixed="getFixedVal(item.fixed)" :align="item.align" :resizable="item.resizable" :class-name="index === tableConfigList.length - 1 ? 'last-cell' : ''">
              <!--编辑单元格-->
              <!--<template slot-scope="scope">
                <el-input class="e-in" style="display: none;" @blur="change" v-model="scope.row[scope.column['property']]" placeholder="请输入内容"></el-input>
                <div class="percentage" style="display: none;"></div>
                <el-popover class="e-text" trigger="hover" placement="top" :open-delay="1500">
                <p>金额: {{ scope.row[scope.column['property']] }}</p>
                <p>住址: 浙江杭州</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag>{{ scope.row[scope.column['property']] }}</el-tag>
                </div>
                </el-popover>
              </template>-->
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <!--右侧固定列-->
        <!--<el-table-column
        type="selection"
        width="40" fixed="right">
        </el-table-column>-->
      </el-table>
    </div>
    <page-device v-if="tableFlag" :totalRow="totalRow" :everyPageSize="everyPageSize" :currentPage="currentPage" :handleCurrentChange="handleCurrentChange" :handleSizeChange="handleSizeChange"/>
  </div>
</template>

<script>
import Vue from 'vue';
import tableMixins from '../mixins/mixinsTable';
import Loading from '../Loading';
import SimpleVue from '../../../plugins/SimpleVue';
import YhDialog from '../yinhe/dialog/YhDialog';
import WarnText from '../WarnText';
import SurcharBaseTable from './SurcharBaseTable';

Vue.use(SimpleVue);
export default {
  name: 'Table',
  mixins: [tableMixins],
  components: {
    Loading,
    SurcharBaseTable,
    YhDialog,
    WarnText
  },
  props: {
    surchargeName: String,
    queryParams: {
      tableName: String
    },
    tableShowParams: {}
  },
  data() {
    return {
      arrayKeyAndContact: { // 商品属性分析页，前四列竖向合并需要用到的参数
        arrayKeyOne: 'propName',
        arrayKeyTwo: 'className',
        arrayKeyThree: 'typeName',
        arrayKeyFour: 'propValue',
        contactArrayOne: [],
        contactArrayTwo: [],
        contactArrayThree: [],
        contactArrayFour: [],
        contactDotOne: 0,
        contactDotTwo: 0,
        contactDotThree: 0,
        contactDotFour: 0
      },
      currentPage: 1, // 默认开始页面数
      needParams: {},
      chooseShow: false,
      queryIfOK: false, // 接口请求失败
      shopArr: [],
      areaArr: [],
      totalRowArr: [],
      maxArrayLength: 0, // 最后一条合计行返回的合并数
      maxArrayLength2: 0, // 店铺小计合并返回的合并数
      maxArrayLength1: 0, // 城市小计合并返回的合并数
      cityNameArr: [],
      tableFixedBodyTrSecondTd: [],
      tableFixedBodyTrThreeTd: [],
      tableFixedBodyTrSecondTd1: [],
      tableFixedBodyTrThreeTd1: []
    };
  },
  methods: {
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
      if (row.column['label'].indexOf('操作') !== -1) {
        return 'cellStyle';
      }
    },
    // 点击详情操作 弹窗
    surcharge(row, column) {
      this.$emit('dialogEvent', { row, column });
    },
    // 数组生成判定条件，用来做竖向合并
    arrayJudge(arr) {
      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] > 1) {
            return true;
          }
        }
        return false;
      }
      return false;
    },
    // 返回合并区域需要的参数
    rowMerge(array, contactArray, contactDot, arrayKey) {
      array.forEach((value, key, item) => {
        if (item[key]['mergeField'] === this.tableShowParams.mergeTextArray[1]) {
          // 店铺小计合并
          if (this.currentPage !== 1) {
            this.shopArr.push(item[key]['row_id'] - ((this.currentPage) - 1) * this.everyPageSize);
          }
          else {
            this.shopArr.push(item[key]['row_id']);
          }
          this.maxArrayLength2 = item[key]['mergeCols'];
          if (this.needParams.contactArray4 !== undefined) {
            this.needParams.contactArray4[0] = 1;
            this.needParams.contactArray4[2] = this.maxArrayLength2;
            this.needParams.contactArray4[3] = 0;
            if (this.maxArrayLength2 > 2) {
              for (let i = 2; i < this.maxArrayLength2; i++) {
                this.needParams.contactArray4[i + 2] = 0;
              }
            }
          }
        }
        if (item[key]['mergeField'] === this.tableShowParams.mergeTextArray[0]) {
          // 城市小计合并
          if (this.currentPage !== 1) {
            this.areaArr.push(item[key]['row_id'] - ((this.currentPage) - 1) * this.everyPageSize);
          }
          else {
            this.areaArr.push(item[key]['row_id']);
          }
          this.maxArrayLength1 = item[key]['mergeCols'];
          if (this.needParams.contactArray3 !== undefined) {
            this.needParams.contactArray3[1] = this.maxArrayLength1;
            this.needParams.contactArray3[2] = 0;
            if (this.maxArrayLength1 > 2) {
              for (let i = 2; i < this.maxArrayLength1; i++) {
                this.needParams.contactArray3[i + 1] = 0;
              }
            }
          }
        }
        if (item[key]['mergeField'] === 'row_id') {
          // 最后一行合计合并
          if (this.currentPage !== 1 && item[key - 1]) {
            this.totalRowArr.push(item[key - 1]['row_id'] - ((this.currentPage) - 1) * this.everyPageSize + 1);
          }
          else if (this.currentPage !== 1 && !item[key - 1]) {
            this.totalRowArr.push(this.totalRow - ((this.currentPage) - 1) * this.everyPageSize);
          }
          else {
            this.totalRowArr.push(item[key - 1]['row_id'] + 1);
          }
          this.maxArrayLength = item[key]['mergeCols'];
          this.needParams.contactArray2[0] = this.maxArrayLength;
          this.needParams.contactArray2[1] = 0;
          this.needParams.contactArray2[2] = 0;
          if (this.maxArrayLength > 3) {
            for (let i = 3; i < this.maxArrayLength; i++) {
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
    // 返回合并门店需要的参数
    rowMerge1(array, contactArray1, contactDot1, arrayKey1) {
      array.forEach((value, key, item) => {
        if (key === 0) {
          contactArray1.push(1);
          contactDot1 = 0;
        }
        else if (item[key][arrayKey1] && item[key][arrayKey1] === array[key - 1][arrayKey1]) {
          contactArray1[contactDot1] += 1;
          contactArray1.push(0);
        }
        else {
          contactArray1.push(1);
          contactDot1 = key;
        }
      });
      return {
        contactArray1,
        contactDot1
      };
    },
    // 合并单元格
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (this.chooseShow) {
        this.rows = 1;
      }
      else {
        this.rows = 0;
      }
      // 合计合并
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
      // 区域和城市合并 横向
      for (let i = 0; i < this.areaArr.length; i++) {
        if (rowIndex === (this.areaArr[i] - 1) && this.needParams.contactArray3) {
          const col3 = this.needParams.contactArray3[columnIndex];
          const row3 = col3 >= 1 ? 1 : 0;
          return {
            colspan: col3,
            rowspan: row3
          };
        }
      }
      // 门店合并 横向
      if (this.needParams.contactArray4 !== undefined) {
        for (let i = 0; i < this.shopArr.length; i++) {
          // 横向合并在第一行时出问题
          if (this.shopArr[0] === 1 && (this.needParams.contactArray[0] === this.everyPageSize || this.needParams.contactArray[0] === (this.totalRow - (((this.currentPage) - 1) * this.everyPageSize) - 2)) && rowIndex === 0) {
            this.needParams.contactArray4[1] = 1;
          }
          else {
            this.needParams.contactArray4[1] = 0;
          }
          if (rowIndex === (this.shopArr[i] - 1) && this.needParams.contactArray4) {
            if (!this.tableDataList[this.shopArr[i] - 1][this.tableShowParams.mergeTextArray[0]]) {
              this.needParams.contactArray4[1] = 1;
              const col3 = this.needParams.contactArray4[columnIndex];
              const row3 = col3 >= 1 ? 1 : 0;
              return {
                colspan: col3,
                rowspan: row3
              };
            }
            if (this.tableDataList[this.shopArr[i] - 1][this.tableShowParams.mergeTextArray[0]]) {
              if (this.shopArr[i] === 1) {
                this.needParams.contactArray4[1] = 1;
              }
              else {
                this.needParams.contactArray4[1] = 0;
              }
              const col3 = this.needParams.contactArray4[columnIndex];
              const row3 = col3 >= 1 ? 1 : 0;
              return {
                colspan: col3,
                rowspan: row3
              };
            }
          }
        }
      }
      // 合并区域列 竖向
      if (columnIndex === 1) {
        if (this.needParams.contactArray && this.arrayJudge(this.needParams.contactArray)) {
          const row1 = this.needParams.contactArray[rowIndex];
          const col1 = row1 > 0 ? 1 : 0;
          return {
            rowspan: row1,
            colspan: col1
          };
        }
        if (this.arrayKeyAndContact.contactArrayOne && this.arrayJudge(this.arrayKeyAndContact.contactArrayOne)) {
          const row2 = this.arrayKeyAndContact.contactArrayOne[rowIndex];
          const col2 = row2 > 0 ? 1 : 0;
          return {
            rowspan: row2,
            colspan: col2
          };
        }
      }
      else if (columnIndex === 2 && this.needParams.contactArray1) {
        if (this.needParams.contactArray1 && this.arrayJudge(this.needParams.contactArray1)) {
          const row1 = this.needParams.contactArray1[rowIndex];
          const col1 = row1 > 0 ? 1 : 0;
          return {
            rowspan: row1,
            colspan: col1
          };
        }
        if (this.arrayKeyAndContact.contactArrayTwo && this.arrayJudge(this.arrayKeyAndContact.contactArrayTwo)) {
          const row2 = this.arrayKeyAndContact.contactArrayTwo[rowIndex];
          const col2 = row2 > 0 ? 1 : 0;
          return {
            rowspan: row2,
            colspan: col2
          };
        }
      }

      else if (columnIndex === 2 && this.arrayKeyAndContact.contactArrayTwo) {
        const row2 = this.arrayKeyAndContact.contactArrayTwo[rowIndex];
        const col2 = row2 > 0 ? 1 : 0;
        return {
          rowspan: row2,
          colspan: col2
        };
      }
      else if (columnIndex === 3 && this.arrayKeyAndContact.contactArrayThree) {
        const row2 = this.arrayKeyAndContact.contactArrayThree[rowIndex];
        const col2 = row2 > 0 ? 1 : 0;
        return {
          rowspan: row2,
          colspan: col2
        };
      }
      else if (columnIndex === 4 && this.arrayKeyAndContact.contactArrayFour) {
        const row2 = this.arrayKeyAndContact.contactArrayFour[rowIndex];
        const col2 = row2 > 0 ? 1 : 0;
        return {
          rowspan: row2,
          colspan: col2
        };
      }
      return false;
    },
    // 单元格单击当前行操作
    percentageShow(row, column, cell, event) {
      this.surcharge(row, column);
      if (row[column['property']] !== undefined && row[column['property']].toString().indexOf('%') !== -1) {
        if (event.target.className.indexOf('is-cente') !== -1) {
          if (event.target.firstChild.children[1].style.display === 'none') {
            event.target.firstChild.children[1].style.display = 'block';
            event.target.firstChild.children[1].style.width = row[column['property']];
          }
          else {
            event.target.firstChild.children[1].style.display = 'none';
          }
        }
        else if (event.target.className === 'percentage') {
          event.target.style.display = 'none';
        }
        else if (event.target.className === 'el-tag') {
          if (event.target.parentNode.parentNode.parentNode.childNodes[2].style.display === 'none') {
            event.target.parentNode.parentNode.parentNode.childNodes[2].style.display = 'block';
            event.target.parentNode.parentNode.parentNode.childNodes[2].style.width = row[column['property']];
          }
          else {
            event.target.parentNode.parentNode.parentNode.childNodes[2].style.display = 'none';
          }
        }
      }
    },
    // 行单击当前行操作
    changeBackground() {
      // let rowNub = row.row_id - ((this.currentPage) - 1) * this.everyPageSize - 1;
      // let changeDom = event.target.parentNode.parentNode;
      // let parentDom = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
      // let parentDomRight = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
      // if (parentDom.classList.contains('is-scrolling-none')) {
      //   if (isNaN(rowNub)) {
      //     rowNub = parentDom.parentNode.children[3].children[1].children[0].children[1].children.length - 1;
      //   }
      //   if (changeDom.style.backgroundColor !== '#78c3fd') {
      //     changeDom.style.backgroundColor = '#78c3fd';
      //   }
      //   else {
      //     changeDom.style.backgroundColor = '';
      //   }
      //   let brotherDom = parentDom.parentNode.children[3].children[1].children[0].children[1].children[rowNub];
      //   if (brotherDom.children[1].getAttribute('rowspan') > 1) {
      //     brotherDom.children[1].style.backgroundColor = '#fafafa';
      //   }
      //   if (brotherDom.children[2].getAttribute('rowspan') > 1) {
      //     brotherDom.children[2].style.backgroundColor = '#fafafa';
      //   }
      //   if (brotherDom.style.backgroundColor !== '#78c3fd') {
      //     brotherDom.style.backgroundColor = '#78c3fd';
      //   }
      //   else {
      //     brotherDom.style.backgroundColor = '';
      //   }
      // }
      // if (parentDomRight.classList.contains('el-table__fixed')) {
      //   if (changeDom.style.backgroundColor !== '#78c3fd') {
      //     changeDom.style.backgroundColor = '#78c3fd';
      //   }
      //   else {
      //     changeDom.style.backgroundColor = '';
      //   }
      //   if (isNaN(rowNub)) {
      //     rowNub = parentDomRight.parentNode.children[2].children[0].children[1].children.length - 1;
      //   }
      //   let brotherRightDom = parentDomRight.parentNode.children[2].children[0].children[1].children[rowNub];
      //   if (brotherRightDom.style.backgroundColor !== '#78c3fd') {
      //     brotherRightDom.style.backgroundColor = '#78c3fd';
      //   }
      //   else {
      //     brotherRightDom.style.backgroundColor = '';
      //   }
      // }
    },
    // 单元格双击操作
    handClick(row, column, cell, event) {
      if (event.target.className === 'el-input__inner' || event.target.className === 'e-in el-input') {
        return false;
      }
      else if (event.target.className.indexOf('is-center') !== -1) {
        event.target.firstChild.firstChild.style.display = 'block';
        event.target.firstChild.children[1].style.display = 'none';
        event.target.firstChild.children[2].style.display = 'none';
      }
      else if (event.target.className === 'el-tag') {
        event.target.parentNode.parentNode.parentNode.firstChild.style.display = 'block';
        event.target.parentNode.parentNode.parentNode.children[1].style.display = 'none';
        event.target.parentNode.parentNode.style.display = 'none';
      }
      return '';
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
    // 合并的列在hover时颜色不变
    const tableFixedBody = document.getElementsByClassName('el-table__fixed-body-wrapper')[0];
    if (tableFixedBody) {
      this.tableFixedBodyTrSecondTd = [];
      this.tableFixedBodyTrThreeTd = [];
      const tableFixedBodyTr = tableFixedBody.getElementsByClassName('el-table__row');
      for (let i = 0; i < tableFixedBodyTr.length; i++) {
        this.tableFixedBodyTrSecondTd.push(tableFixedBodyTr[i].getElementsByClassName('is-center')[1]);
        this.tableFixedBodyTrThreeTd.push(tableFixedBodyTr[i].getElementsByClassName('is-center')[2]);
      }
      for (let j = 0; j < this.tableFixedBodyTrSecondTd.length; j++) {
        if (this.tableFixedBodyTrSecondTd[j].getAttribute('rowspan') > 1) {
          this.tableFixedBodyTrSecondTd[j].style.background = '#ffffff';
        }
      }
      for (let k = 0; k < this.tableFixedBodyTrThreeTd.length; k++) {
        if (this.tableFixedBodyTrThreeTd[k].getAttribute('rowspan') > 1) {
          this.tableFixedBodyTrThreeTd[k].style.background = '#ffffff';
        }
      }
    }

    const tableBodyWrapper = document.getElementsByClassName('el-table__body-wrapper')[0];
    if (tableBodyWrapper) {
      this.tableFixedBodyTrSecondTd1 = [];
      this.tableFixedBodyTrThreeTd1 = [];
      const tableBodyTr = tableBodyWrapper.getElementsByClassName('el-table__row');
      for (let i = 0; i < tableBodyTr.length; i++) {
        this.tableFixedBodyTrSecondTd1.push(tableBodyTr[i].getElementsByClassName('is-center')[1]);
        this.tableFixedBodyTrThreeTd1.push(tableBodyTr[i].getElementsByClassName('is-center')[2]);
      }
      for (let j = 0; j < this.tableFixedBodyTrSecondTd1.length; j++) {
        if (this.tableFixedBodyTrSecondTd1[j].getAttribute('rowspan') > 1) {
          this.tableFixedBodyTrSecondTd1[j].style.background = '#ffffff';
        }
      }
      for (let k = 0; k < this.tableFixedBodyTrThreeTd1.length; k++) {
        if (this.tableFixedBodyTrThreeTd1[k].getAttribute('rowspan') > 1) {
          this.tableFixedBodyTrThreeTd1[k].style.background = '#ffffff';
        }
      }
    }
    // 修复小计在第一行的合并问题
    const wrapDivFix = document.getElementsByClassName('el-table__fixed')[0];
    const wrapDiv = document.getElementsByClassName('el-table__body-wrapper')[0];
    // 修复在最后一页合并有误的情况
    if (wrapDiv && wrapDivFix && this.shopArr[0] === 1 && this.needParams.contactArray[0] > 1) {
      const tdsFix = wrapDivFix.getElementsByTagName('td')[1];
      const tds = wrapDiv.getElementsByTagName('td')[1];
      tdsFix.setAttribute('rowspan', this.needParams.contactArray[0]);
      tdsFix.setAttribute('colspan', 1);
      tdsFix.style.background = '#ffffff';
      tds.setAttribute('rowspan', this.needParams.contactArray[0]);
      tds.setAttribute('colspan', 1);
      tds.style.background = '#ffffff';
    }
    this.queryParams.contentText = this.tableShowParams.contentText;
    this.queryParams.contentShow = this.tableShowParams.contentShow;
    this.queryParams.contentShopShow = this.tableShowParams.contentShopShow;
    this.queryParams.shopShowFlag = this.tableShowParams.shopShowFlag;
    this.queryParams.totleShowFlag = this.tableShowParams.totleShowFlag;
    this.queryParams.showRankNum = this.tableShowParams.showRankNum;
    this.queryParams.machineShow = this.tableShowParams.machineShow;
    this.queryParams.detailWarnTxt = this.tableShowParams.detailWarnTxt;
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
        if (this.needParams.contactArray2 !== undefined) {
          this.needParams.contactArray2 = [];
          this.totalRowArr = [];
        }
        if (this.needParams.contactArray3 !== undefined) {
          this.needParams.contactArray3 = [];
          this.areaArr = [];
        }
        if (this.needParams.contactArray4 !== undefined) {
          this.shopArr = [];
          this.needParams.contactArray4 = [];
        }
        const queryTableData = n.data.data.table_data;
        if (queryTableData && queryTableData.length > 0) {
          this.tableConfigList = n.data.data.table_config;
          this.tableDataList = queryTableData;
          this.topTableData = n.data.data['top_table_data'];
          this.needParams.arrayKey = this.tableShowParams.mergeTextArray[0];
          this.needParams.arrayKey1 = this.tableShowParams.mergeTextArray[1];
          this.totalRow = n.data.data.total_row;
          this.totalCols = n.data.data.total_cols;
          this.picShow = false;
          this.$emit('tableShow', false);
          this.$store.commit('info/setQueryLoading', { loadingFlag: this.loadingName, loading: true });
          // 返回横向合并需要的数组
          for (let i = 0; i <= this.totalCols; i++) {
            if (this.needParams.contactArray2 !== undefined) {
              this.needParams.contactArray2.push(1);
            }
            if (this.needParams.contactArray3 !== undefined) {
              this.needParams.contactArray3.push(1);
            }
            if (this.needParams.contactArray4 !== undefined) {
              this.needParams.contactArray4.push(1);
            }
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
          this.$store.commit('info/setQueryLoading', { loadingFlag: this.loadingName, loading: false });
          this.picShow = false;
          this.queryIfOK = true;
        }
        this.needParams.contactArray = [];
        this.needParams.contactDot = 0;
        this.needParams.contactArray1 = [];
        this.needParams.contactDot1 = 0;
        this.needParams.contactDot2 = 0;
        this.arrayKeyAndContact.contactArrayOne = [];
        this.arrayKeyAndContact.contactDotOne = 0;
        this.arrayKeyAndContact.contactArrayTwo = [];
        this.arrayKeyAndContact.contactDotTwo = 0;
        this.arrayKeyAndContact.contactArrayThree = [];
        this.arrayKeyAndContact.contactDotThree = 0;
        this.arrayKeyAndContact.contactArrayFour = [];
        this.arrayKeyAndContact.contactDotFour = 0;
        // 合并第一列
        this.rowMerge(this.tableDataList, this.needParams.contactArray, this.needParams.contactDot, this.needParams.arrayKey);
        // 合并第二列
        this.rowMerge1(this.tableDataList, this.needParams.contactArray1, this.needParams.contactDot1, this.needParams.arrayKey1);
        this.rowMerge1(this.tableDataList, this.arrayKeyAndContact.contactArrayOne, this.arrayKeyAndContact.contactDotOne, this.arrayKeyAndContact.arrayKeyOne);
        this.rowMerge1(this.tableDataList, this.arrayKeyAndContact.contactArrayTwo, this.arrayKeyAndContact.contactDotTwo, this.arrayKeyAndContact.arrayKeyTwo);
        this.rowMerge1(this.tableDataList, this.arrayKeyAndContact.contactArrayThree, this.arrayKeyAndContact.contactDotThree, this.arrayKeyAndContact.arrayKeyThree);
        this.rowMerge1(this.tableDataList, this.arrayKeyAndContact.contactArrayFour, this.arrayKeyAndContact.contactDotFour, this.arrayKeyAndContact.arrayKeyFour);
      }
      else if (n === null) {
        this.$emit('tableShow', false);
        this.$store.commit('info/setQueryLoading', { loadingFlag: this.loadingName, loading: false });
        this.picShow = false;
        this.queryIfOK = false;
      }
      else {
        this.$emit('tableShow', false);
        this.$store.commit('info/setQueryLoading', { loadingFlag: this.loadingName, loading: false });
        this.picShow = false;
        this.queryIfOK = true;
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

@-moz-document url-prefix(){
  .table-center{
    height: 100%;
  }
}

.table-center{
  background: #ffffff;
  .el-dialog--center .el-dialog__body .warn-txt{
    background-color: #ffeedd;
    height: 16px;
    font-size: 12px;
    line-height: 16px;
    color: #f55041;
    display: flex;
  }
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
  /*.el-table.el-table--fit.el-table--fluid-height.el-table--enable-row-hover{
    display : none;
  }*/
  thead tr{
    color: #333;
    .cell{
      font-weight: 900;
    }
  }
  .subtotal{
    display: block;
  }
  .tableBox .el-table__body tr.hover-row > td{
    background: #eef8ff;
  }
  .mask-body{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .el-table--border{
    border-right: 1px solid #cecccc;
    border-bottom: 1px solid #cecccc;
  }
  .el-table .cellStyle{
    color: #0096ff;
    cursor: pointer;
  }
  .last-cell{
    padding: 0 15px 0 0 !important;
  }
}
</style>
