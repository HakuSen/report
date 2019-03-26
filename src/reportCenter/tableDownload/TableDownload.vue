<!-------------------------
  下载清单页面
 ----------------------- -->
<template>
  <div class="table-download-box">
    <div class="table-download">
      <header>
        <div class="down-title">
          <span class="down-list">下载清单</span>
          <span class="down-text">(查询范围大于一周的明细数据需要5-30分钟，请耐心等待，下载内容最多保存30天)</span>
        </div>
        <el-button class="refresh-btn" @click="refresh">
          <i class="el-icon-refresh" style="margin-right:6px"></i>刷新
        </el-button>
      </header>
      <main class="download-con">
        <div style="width: 100%;">
          <el-table
            v-setHeight
            :row-class-name="activeStyle"
            :data="tableListData.list"
            fit
            style="width: 100%"
            border>
            <el-table-column
              :align="'center'"
              prop="add_time"
              label="请求时间">
            </el-table-column>
            <el-table-column
              :align="'center'"
              prop="update_time"
              label="完成时间">
            </el-table-column>
            <el-table-column
              :align="'center'"
              :min-width="'130'"
              prop="report_name"
              label="导出内容">
            </el-table-column>
            <el-table-column
              :align="'center'"
              label="导出进度">
              <template slot-scope="scope">
                <div class="download-status">
                  <icon :name="scope.row.type === '0' ? 'failure' : (scope.row.type === '1' ? 'done' : 'downwarning')" class="icon-position" style="width: 16px;height: 16px;margin-top: 4px"></icon>
                  <span>
                    {{ scope.row.type === '0' ? '导出失败' : (scope.row.type === '1' ? '导出成功' : '导出中')}}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :align="'center'"
              label="操作">
              <template slot-scope="scope">
                <el-button @click="getExcelReport(scope.row)" type="text" size="small" :disabled="scope.row.type !== '1'">下载</el-button>
                <el-button type="text" @click="deleteList(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <page-device :totalRow="tableListData.total" :everyPageSize="everyPageSize" :currentPage="currentPage" :handleCurrentChange="handleCurrentChange" :handleSizeChange="handleSizeChange" v-if="tableListData.list && tableListData.list.length > 0"/>
      </main>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import { Button, Table, TableColumn, MessageBox } from 'element-ui';
import PathConf from '../../conf/api.conf';
import PageDevice from '../../components/base/table/PageDevice';
import SimpleVue from '../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Button, Table, TableColumn);
export default {
  name: 'TableDownload',
  components: {
    PageDevice
  },
  data() {
    return {
      tableShow: false,
      totalRow: 0,
      total: 0,
      everyPageSize: 20,
      currentPage: 1
    };
  },
  computed: {
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    }),
    ...mapState({
      tableListData: State => State.info.params.tableDownload.downloadList
    })
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDownloadList({
        shopper_id: this.$store.getters['tokenInfo/userinfo']['parent_id']
          ? this.$store.getters['tokenInfo/userinfo']['parent_id']
          : this.$store.getters['tokenInfo/userinfo'].shopper_id,
        page_num: this.currentPage,
        page_size: this.everyPageSize
      });
    },
    handleSizeChange(val) {
      this.everyPageSize = val;
      this.getDownloadList({
        shopper_id: this.$store.getters['tokenInfo/userinfo']['parent_id']
          ? this.$store.getters['tokenInfo/userinfo']['parent_id']
          : this.$store.getters['tokenInfo/userinfo'].shopper_id,
        page_num: this.currentPage,
        page_size: this.everyPageSize
      });
    },
    // 斑马条纹
    activeStyle({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      }
      else if (rowIndex % 2 === 1) {
        return 'success-row';
      }
      return '';
    },
    getDownloadList(params) {
      this.$store.dispatch('info/getDownloadList', params);
    },
    refresh() {
      this.getDownloadList({
        shopper_id: this.$store.getters['tokenInfo/userinfo']['parent_id']
          ? this.$store.getters['tokenInfo/userinfo']['parent_id']
          : this.$store.getters['tokenInfo/userinfo'].shopper_id,
        page_num: this.currentPage,
        page_size: this.everyPageSize
      });
    },
    // 导出Excel下载
    getExcelReport(row) {
      window.open(row.url);
    },
    deleteList(row) {
      Vue.$api.post({ getway: PathConf.config.$getway, api: PathConf.config['deleteList'] }, {
        shopper_id: this.$store.getters['tokenInfo/userinfo']['parent_id']
          ? this.$store.getters['tokenInfo/userinfo']['parent_id']
          : this.$store.getters['tokenInfo/userinfo'].shopper_id,
        id: row['id'] || '1213'
      }).then(res => {
        if (res.data.data.indexOf('成功') !== -1) {
          this.refresh();
        }
        else {
          MessageBox.alert('网络异常或服务器连接失败', '提示', { type: 'warning', dangerouslyUseHTMLString: true });
        }
      });
    }
  },
  directives: {
    setHeight: {
      bind(el) {
        el.style.maxHeight = (document.body.offsetHeight || document.documentElement.offsetHeight) - 276 + 'px';
        el.style.overflow = 'auto';
      }
    }
  },
  updated() {
    window.onresize = () => {
      const elTable = document.getElementsByClassName('el-table')[0];
      elTable.style.maxHeight = (document.body.offsetHeight || document.documentElement.offsetHeight) - 282 + 'px';
      elTable.style.overflow = 'auto';
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.refresh();
    });
  }
};
</script>

<style lang="less" scoped>
.table-download-box{
  background: #f7f7f7;
  padding: 20px;
  .table-download{
    width: 100%;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #e6ebf0;
    header{
      height: 50px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eaeaea;
      .down-list{
        font-size: 18px;
        line-height: 18px;
        color: #666666;
      }
      .down-text{
        font-size: 12px;
        line-height: 18px;
        color: #f5912d;
        margin-left: 6px;
      }
      .refresh-btn{
        padding: 0;
        width: 70px;
        height: 28px;
        border-radius: 2px;
        border: solid 1px #d5d5d5;
        background-color: #ffffff;
        font-size: 14px;
        line-height: 28px;
        color: #626262;
      }
    }
    .download-con{
      padding: 20px;
      .download-status{
        display: flex;
        justify-content: center;
        span{
          font-size: 12px;
          margin-left: 5px;
        }
      }
      .el-button.el-button--text{
        padding: 4px 0;
      }
    }
  }
}
</style>
<style lang="less">
.download-con{
  .warning-row{
    background: #ffffff;
  }
  .success-row{
    background: #f4f4f4;
  }
}

.table-download-box{
  .download-con{
    .el-table .el-table__header-wrapper thead{
      tr, th{
        padding: 0;
        height: 34px;
        background-color: #f8f8f8;
      }
    }
    td{
      padding: 10px;
    }
    .el-input__inner{
      height: 28px !important;
    }
    .el-table::before{
      height: 0;
    }
    .el-table__empty-block{
      border-bottom: 1px solid #ebeef5;
    }
  }
}
</style>
