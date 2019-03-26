import Vue from 'vue';
import { TableColumn, Input, Popover, Tag, Tabs, TabPane, Table, Tooltip } from 'element-ui';
import NoResult from '../queryResult/NoResult';
import ReportHeader from '../ReportHeader';
import QueryFail from '../queryResult/QueryFail';
import PageDevice from '../table/PageDevice';

Vue.batch.use(TableColumn, Input, Table, Tag, Popover, Tabs, TabPane, Tooltip);
export default {
  components: {
    NoResult,
    ReportHeader,
    QueryFail,
    PageDevice
  },
  props: {
    loadingName: String,
    loadingFlag: Boolean,
    tableFlag: Boolean,
    tableAllData: Object,
    queryParams: {
      contentText: String,
      contentShow: Boolean,
      shopShowFlag: Boolean,
      contentShopShow: Boolean,
      totleShowFlag: Boolean
    },
    tableShowParams: {
      contentText: String,
      contentShow: Boolean,
      contentShopShow: Boolean
    },
    tableQueryParams: Object,
    newPageing: Object,
    formData: Object
  },
  data() {
    return {
      tableConfigList: [],
      tableDataList: [],
      topTableData: [],
      picShow: false,
      rows: 0,
      totalRow: 0, // 列的总数
      total: 0, // 默认数据总数
      totalCols: 0, // 每行的列的长度，用来控制横向合并单元格
      everyPageSize: 20
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
  created() {
    this.needParams = this.tableShowParams;
  },
  mounted() {
    if (JSON.stringify(this.tableQueryParams) !== '{}') {
      this.currentPage = this.tableQueryParams['page_num'];
      this.everyPageSize = this.tableQueryParams['page_size'];
    }
  },
  watch: {
    newPageing(n, o) {
      if (n.pageingFlag !== o.pageingFlag) {
        this.currentPage = 1;
        this.everyPageSize = 20;
      }
    }
  }
};
