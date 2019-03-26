<!-------------------------
  修复数据页面
 ----------------------- -->
<template>
  <div class="table-repair-data">
    <div class="table-repair">
      <header>
        <h2>任务修复清单</h2>
        <div class="condition-box">
          <el-card class="box-card">
            <!--头部-->
            <div class="query-container">
              <form @submit.prevent="submitHandler" @reset.prevent="resetHandler" onkeydown="if(event.keyCode === 13){return false;}">
                <!--组件循环遍历组件测试-->
                <yh-layout-item v-for="(item,index) in totalData"
                                :key="index"
                                :stand="syncConfig.width"
                                :size="item.size"
                                :alignment="item.alignment">
                  <component :is="child.name"
                             v-for="(child,childIdx) in item.children"
                             :key="childIdx"
                             v-bind="transmit(child)"
                             v-model="formData[child.fieldName]"
                             :ref="'payList'">
                  </component>
                </yh-layout-item>
              </form>
            </div>
          </el-card>
          <div class="operate-box">
            <el-button class="btnOut" type="primary" style="float: right; padding: 3px 0;height: 27px;width: 70px;" @click="mendClick" :disabled="btnOutShow">
              修复
            </el-button>
            <el-button class="btnOut" plain style="float: right; padding: 3px 0;height: 27px;width: 70px;" @click="refreshClick">
              <span style="margin-right:6px"><i class="el-icon-refresh"></i></span>刷新
            </el-button>
          </div>
        </div>
      </header>
      <main class="repair-con">
        <div style="width: 100%;">
          <el-table
            :data="findCustomJobList"
            fit
            style="width: 100%"
            :row-class-name="activeStyle"
            border>
            <el-table-column
              :align="'center'"
              prop="create_time"
              label="请求时间">
            </el-table-column>
            <el-table-column
              :align="'center'"
              prop="update_time"
              label="完成时间">
            </el-table-column>
            <el-table-column
              :align="'center'"
              prop="repair_timeslot"
              label="修复时段">
            </el-table-column>
            <el-table-column
              :align="'center'"
              label="导出进度">
              <template slot-scope="scope">
                <div>
                  <icon :name="scope.row['job_status'] === -1 ? 'failure' : (scope.row['job_status'] === 1 ? 'done' : 'downwarning')" class="icon-position" style="width: 16px;height: 16px"></icon>
                  {{ scope.row['job_status'] === -1 ? '修复失败' : (scope.row['job_status'] === 1 ? '已完成' : '修复中')}}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Vue from 'vue';
import {
  MessageBox,
  Container,
  Header,
  Row,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Aside,
  Main,
  Card,
  Table,
  TableColumn,
  Button
} from 'element-ui';
import YhLayoutItem from '../../components/base/yinhe/YhLayoutItem';
import YhSelect from '../../components/base/yinhe/YhSelect';
import YhShopChoice from '../../components/base/yinhe/YhShopChoice';
import YhTypeDate from '../../components/base/yinhe/YhTypeDate';
import YhDatePicker from '../../components/base/yinhe/YhDatePicker';
import { ComponentSize, LayoutWidthBase } from '../../components/base/yinhe/setting';
import setQueryTimeAddTail from '../../utils/setQueryTimeAddTail';
import setQueryParams from '../../utils/setQueryParams';
import PathConf from '../../conf/api.conf';
import SimpleVue from '../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Container, Header, Row, Col, Dropdown, DropdownMenu, DropdownItem, Aside, Main, Card, Table, TableColumn, Button);

export default {
  name: 'TableRepairData',
  data() {
    return {
      btnOutShow: false,
      totalData: [],
      formData: {}
    };
  },
  components: {
    YhSelect,
    YhLayoutItem,
    Table,
    YhShopChoice,
    YhDatePicker,
    YhTypeDate
  },
  created() {
    this.refreshClick();
  },
  mounted() {
    this.totalData = this.syncConfig.config;
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
    },
    mendClick() {
      let params = setQueryParams(this.formData, this.$store);
      let { start_date, end_date } = setQueryTimeAddTail(this.formData);
      params['start_date'] = start_date;
      params['end_date'] = end_date;
      let repairParams = {
        condition_store_id_list: params['shop_id_list'] ? params['shop_id_list'] : null,
        condition_start_time: params['start_date'],
        condition_end_time: params['end_date'],
        login_type: this.$store.getters['tokenInfo/userinfo']['type'],
        user_type: this.$store.getters['tokenInfo/userinfo']['user_type'],
        id: this.$store.getters['tokenInfo/userinfo']['id']
      };
      Vue.$api.post({ getway: PathConf.task.$getway, api: PathConf.task['doCustomJobs'] }, repairParams).then(res => {
        MessageBox.alert(`${res.data['sub_msg']}`, '提示', { type: 'warning', dangerouslyUseHTMLString: true });
        this.btnOutShow = true;
      }).catch(() => {
      });
    },
    refreshClick() {
      let refreshParams = {
        login_type: this.$store.getters['tokenInfo/userinfo']['type'],
        user_type: this.$store.getters['tokenInfo/userinfo']['user_type'],
        id: this.$store.getters['tokenInfo/userinfo']['id']
      };
      this.$store.dispatch('info/getFindCustomJob', refreshParams).then(() => {
      }).catch(() => {
      });
    },
    /**
     * 过滤不需要向组件内部传递的Props属性
     * @param conf
     * @returns {*}
     * @constructor
     */
    transmit: conf => {
      const { name, fieldName, value, ...other } = conf;
      return other;
    }
  },
  computed: {
    ...mapState({
      findCustomJobList: State => State.info.params.repairData.findCustomJobList,
      findCustomJobParams: State => State.info.params.repairData.findCustomJobParams
    }),
    formDataStr() {
      return JSON.stringify(this.formData);
    },
    syncConfig() {
      return {
        key: 'two',
        width: LayoutWidthBase,
        config: [
          {
            name: 'yh-layout-item',
            size: 2,
            children: [
              {
                name: 'yh-date-picker',
                label: '报表日期：',
                fieldName: 'datetime',
                value: [],
                attrs: {
                  'start-placeholder': '开始日期',
                  'end-placeholder': '结束日期',
                  type: 'date',
                  size: ComponentSize
                }
              }
            ]
          },
          {
            name: 'yh-layout-item',
            size: 0.85,
            children: [
              {
                name: 'yh-shop-choice',
                label: '店铺选择：',
                fieldName: 'shop',
                value: [],
                url: '/shopinfo/findStructureStores',
                attrs: {
                  size: ComponentSize
                }
              }
            ]
          }
        ]
      };
    }
  }
};
</script>

<style lang="less" scoped>
.table-repair-data{
  background: #f2f2f2;
  padding: 20px;
  .table-repair{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #e6ebf0;
    header{
      display: flex;
      flex-direction: column;
      h2{
        font-size: 18px;
        font-weight: 500;
        color: #666;
        padding: 20px 20px 0 20px;
      }
      .condition-box{
        display: flex;
        align-items: center;
      }
      .operate-box{
        font-size: 12px;
        color: #f5912d;
        display: flex;
      }
      .is-always-shadow{
        border: 0;
        margin: 0;
        box-shadow: none
      }
    }
    .repair-con{
      flex: 1;
      padding: 20px;
    }
  }
}
</style>
<style lang="less">
.el-table .warning-row{
  background: #ffffff;
}

.el-table .success-row{
  background: #f4f4f4;
}

thead tr{
  color: #333;
  .cell{
    font-weight: 900;
  }
}
</style>
