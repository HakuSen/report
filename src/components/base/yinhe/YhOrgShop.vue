<!--------------------------------------------------
  YhOrgShop.vue
  组织+店铺选择/组织节点
---------------------------------------------------->
<template>
  <div class="yh-org-shop">
    <div class="org_frame" style="display:flex;flex:1;">
      <yh-label :value="label[0]" :style="labelStyles" :alignment="labelAlign"/>
      <yh-org-frame :url="url[1]" :refreshDatas="refreshDatas" v-model="orgVal" :isMultiple="isMultiple" :defalutVal="defalutVal"></yh-org-frame>
    </div>
    <div class="org_node" v-if="isOrgNode">
      <span>{{ nodeLabel }}：</span>
      <select-multiply :ref="'multiply'" :multiplyData="multiplyData" :refreshData="refreshData" v-model="checkedVal"></select-multiply>
    </div>
    <div class="org_shop" v-else>
      <yh-label :value="label[1]" :style="labelStyles" :alignment="labelAlign"/>
      <template>
        <el-select v-model="shops" v-bind="attrs" v-on="$listeners" placeholder="请选择店铺" @visible-change="shopChange" @clear="clearShop">
          <el-option
            v-for="item in shopList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            class="select-box"
            style="background:white;margin-bottom:10px"
            size="large"
          >
              <span style="display:block;margin:0;padding:0">
                <el-input v-model="filterText" @click.native="searchShopClick" size="small" placeholder="搜索店铺" prefix-icon="el-icon-search" v-on:input="searchShop" :ref="'searchShopInput'" style="margin:2px 0 6px 0;"></el-input>
                  <el-tree
                    class="filter-tree"
                    :data="data2"
                    show-checkbox
                    default-expand-all
                    :default-checked-keys="checkedShopId"
                    node-key="id"
                    :ref="'tree1'"
                    highlight-current
                    :filter-node-method="filterShop"
                    :props="defaultProps">
                  </el-tree>
                </span>
          </el-option>
        </el-select>
      </template>
      <!--高级查询-->
      <div class="advanceQuery">
        <el-button @click="featuredStore" type="text">高级查询</el-button>
        <multi-area-shop :centerDialogVisible="shopSearchIsShow" :nameList="nameList" :oNameList="oNameList" @searchName="searchName" @setShops="setCheckedShops"/>
      </div>
    </div>
    <yh-select style="margin-left:20px" v-if="isMachine" v-model="machineVal" :label="label[2]" :url="url[3]" :isMachine="isMachine" :ref="'machine'" :queryParams="queryParams"></yh-select>
  </div>
</template>

<script>
import Vue from 'vue';
import { Select, Option, Tree, Input } from 'element-ui';
import YhOrgFrame from './indirectness-unit/YhOrgFrame';
import SelectMultiply from './functional-unit/selectMultiply';
import YhSelect from './YhSelect';
import SimpleVue from '../../../plugins/SimpleVue';
import Validator from './validator/Validator';
import PathConf from '../../../conf/api.conf';
import shopChoiceMixins from './mixins/shopChoice';

Vue.use(SimpleVue);
Vue.batch.use(Select, Option, Tree, Input);
export default {
  name: 'YhOrgShop',
  mixins: [shopChoiceMixins],
  components: {
    YhOrgFrame,
    SelectMultiply,
    YhSelect
  },
  props: {
    attrs: {},
    label: Array,
    options: Array,
    url: Array,
    queryParams: Object,
    value: Array,
    needShopName: Boolean,
    isMultiple: Boolean,
    isMachine: Boolean,
    node: Boolean,
    orgMultiply: Boolean,
    labelWidth: {
      type: Number,
      default: 70
    },
    labelAlign: {
      type: String,
      default: 'right',
      validator: Validator.optional(['left', 'center', 'right'])
    }
  },
  data() {
    return {
      orgVal: [],
      refreshDatas: '',
      isInitial: true,
      machineVal: '',
      allShopId: 0, // 店铺id合集数量
      oNameList: [], // 组织名称列表
      nameList: [], // 全部店铺
      backValue: {
        name: '',
        shopName: '',
        selectedOptions: ['', '']
      },
      isOrgNode: this.node, // 节点选项是否存在
      nodeLabel: '',
      multiplyData: [], // 多选数据
      checkedVal: [], // v-model
      refreshData: [], // 刷新数据
      nodeAry: [],
      storeNum: [],
      defalutVal: false // 判断组织控件是否是默认值
    };
  },
  methods: {
    refreshFn() {
      if (JSON.stringify(this.queryParams) !== '{}' && this.queryParams !== undefined) { // 刷新时保留已选数据
        this.isInitial = false;
        if (this.queryParams['deep_id'] !== '') {
          this.urlData(this.queryParams['deep_id']);
        }
        if (!this.queryParams['shopper_id_list']) {
          this.checkedShopId = [];
        }
        else {
          this.checkedShopId = this.queryParams['shopper_id_list'];
        }
        if (this.isOrgNode) { // 刷新时维度节点
          this.nodeLabel = this.orgVal[0];
          if (this.queryParams['org_ids'] && this.queryParams['org_ids'].length > 0) {
            this.refreshData = this.queryParams['org_ids'];
          }
          else if (this.queryParams['shopper_ids'] && this.queryParams['shopper_ids'].length > 0) {
            this.refreshData = this.queryParams['shopper_ids'];
          }
          else {
            this.refreshData = [];
          }
        }
        this.refreshDatas = this.queryParams['deep_name'];
      }
    },
    // 拿到节点对应的多选数据
    getNodeData(deepId) { // 初始数据
      this.multiplyData = [];
      this.storeNum = [];
      if (this.url !== '') {
        let params = {
          shopper_id: this.userinfo['shopper_id'],
          // shopper_id: 74908,
          service_id: this.userinfo['service_id'] ? this.userinfo['service_id'] : '',
          deep: deepId
        };
        Vue.$api.post({ getway: PathConf.user.$getway, api: this.url[2] }, params).then(response => {
          this.$refs.multiply.clearChecked(); // 切换时清空多选框数据
          this.nodeAry = response.data['data'];
          this.nodeAry.forEach(item => { // 将接口请求到的字段转换成组件接收的字段名（prop_value -> id）
            let payObj = {
              id: item['id'],
              name: item['nick']
            };
            this.storeNum.push(item['store_num']);
            this.multiplyData.push(payObj);
          });
          this.$emit('input', [this.orgVal, ['全部'], this.storeNum.length]);
        });
      }
    },
    // 属性名称组件点击空白处下拉框消失
    haveSelect() {
      if (this.isOrgNode) {
        this.$refs.multiply.haveSelect();
      }
    },
    // 从父组件得到地址拿到店铺数据
    urlData(deepId) {
      if (this.options && this.options.length > 0) {
        this.data2 = [
          {
            name: '全部',
            data: []
          }
        ];
        this.data2[0].data = this.options;
      }
      else if (this.url.length > 0) {
        let that = this;
        let codeStore = [];
        let unCodeStore = [];
        let params = {
          shopper_id: this.userinfo.shopper_id,
          service_id: this.userinfo.service_id ? this.userinfo.service_id : '',
          type: this.userinfo.type,
          user_id: this.userinfo.user_id,
          org_id: this.userinfo.org_id ? this.userinfo.org_id : null,
          deep: deepId
        };
        that.data2 = [];
        Vue.$api.post({ getway: PathConf.user.$getway, api: this.url[0] }, params).then(response => {
          let datas = response.data.data;
          if (datas['un_code_stores'] && datas['code_stores']) {
            that.data2 = [
              {
                name: '全部',
                data: []
              }
            ];
            datas['un_code_stores'].forEach(item => { // 将接口请求到的字段转换成组件接收的字段名（store_id -> id）
              let selectObj = {
                id: item['store_id'],
                name: item['store_name']
              };
              unCodeStore.push(selectObj);
            });
            let codeStores = datas['code_stores'];
            for (let i = 0; i < codeStores.length; i++) {
              for (let j = 0; j < codeStores[i].data.length; j++) {
                for (let k = 0; k < codeStores[i].data[j].data.length; k++) {
                  let selectObjs = {
                    id: codeStores[i].data[j].data[k].id,
                    name: codeStores[i].data[j].data[k].name
                  }
                  codeStore.push(selectObjs);
                }
              }
            }
            this.allShopId = unCodeStore.length + codeStore.length;
            that.data2[0].data = datas['code_stores'].concat(unCodeStore);
            that.allData = codeStore.concat(unCodeStore);
          }
        });
      }
    },
    // 点击高级查询
    featuredStore() {
      this.shopSearchIsShow = true;
      this.getOrgNameApi();
      this.getAllShopApi();
    },
    // 组织名称和默认查询所有店铺接口
    getOrgNameApi() {
      let params = {
        deep: this.orgVal[2] === null ? 0 : this.orgVal[2],
        // deep: this.orgVal[2],
        shopper_id: this.userinfo.shopper_id,
        service_id: this.userinfo.service_id ? this.userinfo.service_id : ''
      };
      Vue.$api.post({ getway: PathConf.user.$getway, api: 'org/findOrgsByDeep' }, params).then(response => {
        this.oNameList = response.data.data;
      });
    },
    getAllShopApi() {
      const { name, shopName, selectedOptions } = this.backValue;
      const params = {
        deep: this.orgVal[2],
        city_code: selectedOptions[1] || null,
        org_id: name || null,
        province_code: selectedOptions[0] || null,
        shopper_id: this.userinfo.shopper_id || null,
        store_name: shopName || null
      };
      Vue.$api.post({ getway: PathConf.user.$getway, api: 'org/findStroesByOrg' }, params).then(response => {
        this.nameList = this.getStoreName(response.data.data);
      });
    },
    getStoreName(arr) {
      let list = [];
      arr.forEach(a => {
        list.push({
          id: a['store_id'],
          name: a['store_name']
        });
      });
      return list;
    },
    // 查询店铺
    searchName(a) {
      this.backValue = a;
      this.getAllShopApi();
    },
    // 店铺高级查询保存已选店铺
    setCheckedShops(val) {
      if (val) {
        this.checkedShopId = [];
        this.checkedShopId = val;
        this.shopSearchIsShow = false;
        this.$refs.tree1[0].setCheckedKeys(this.checkedShopId);
        this.shops = '已选' + val.length + '家';
      }
      else {
        this.shopSearchIsShow = false;
      }
    },
    searchShop(name) {
      if (!this.isOrgNode) {
        this.$refs.tree1[0].filter(name);
      }
    },
    // //服务商查询店铺
    searchShopEvent() {
      let searchList = {};
      this.searchShopList.push(searchList);
    },
    getNodeShop(arr) {
      this.storeNum = [];
      arr.forEach(b => {
        this.nodeAry.find(item => {
          if (item.id === b) {
            this.storeNum.push(item['store_num']);
          }
          return false;
        });
      });
    }
  },
  inheritAttrs: false,
  mounted() {
    this.refreshFn();
  },
  watch: {
    value(val) {
      if (val.length === 0) {
        this.defalutVal = true;
        this.checkedShopId = [];
        this.machineVal = '';
      }
    },
    orgVal(val) {
      if (this.node && val[0] !== '店铺') {
        this.isOrgNode = true;
        this.nodeLabel = val[0];
        this.getNodeData(val[2]);
      }
      else {
        this.isOrgNode = false; // 页面进来时初始值是店铺
      }
      if (!this.isOrgNode && val[0].length > 0) {
        // 组织架构为店铺时deep值变换为该组织下最高一层的的的deep
        val[0] === '店铺' ? this.urlData(val[2]) : this.urlData(val[1].deep);
        if (this.isInitial) {
          this.checkedShopId = []; // 切换清空所有选中id
          setTimeout(() => {
            this.clearShop();
          }, 500);
        }
        this.isInitial = true; // 切换改变值时为true，刷新为false
      }
    },
    checkedVal(curVal) {
      if (curVal.length === 0 || curVal.length === this.multiplyData.length) {
        this.$emit('input', [this.orgVal, ['全部'], this.storeNum.length]);
      }
      else {
        this.getNodeShop(curVal);
        this.$emit('input', [this.orgVal, curVal, this.storeNum.length]);
      }
    },
    checkedShopId(n, o) {
      if (this.isMachine && JSON.stringify(o) !== JSON.stringify(n)) {
        this.machineVal = '';
        this.$refs.machine.clear();
        this.$refs.machine.urlData(n, this.orgVal[1].id);
      }
      this.filterText = ''; // 清空搜索关键字
      if (n && this.allShopId && n.length === 0 || this.allShopId === n.length) {
        setTimeout(() => {
          this.$emit('input', [this.orgVal, ['全部'], this.allShopId, this.machineVal]);
        }, 500);
        this.shops = '全部';
      }
      else if (this.needShopName && n.length === 1) {
        this.shops = '已选1家';
        this.getCheckedName(n[0]);
        this.$emit('input', [this.orgVal, n, n.length, this.machineVal, this.checkedName]);
      }
      else {
        this.shops = '已选' + n.length + '家';
        this.$emit('input', [this.orgVal, n, n.length, this.machineVal]);
      }
    },
    machineVal(val) {
      if (this.checkedShopId.length > 0) {
        this.$emit('input', [this.orgVal, this.checkedShopId, this.checkedShopId.length, val]);
      }
      else {
        this.$emit('input', [this.orgVal, ['全部'], this.allShopId, val]);
      }
    }
  }
};
</script>

<style lang="less" scoped>
::-webkit-scrollbar{ width: 0 !important }

.yh-org-shop{
  display: flex;
  align-items: center;
  org_frame, .org_shop, .org_node{
    display: flex;
    flex: 1;
  }
  .advanceQuery{
    flex: 0;
    margin-left: 10px;
  }
}

.org_node{
  .yh-select-multiply{
    flex: 1;
  }
  span{
    min-width: 45px;
  }
}

.org_shop, .org_node{
  display: flex;
  flex-direction: row;
  align-items: center;
  .yh-label{
    flex: 0 0 70px;
  }
}

.el-select-dropdown__item{
  height: auto !important;
}
</style>
