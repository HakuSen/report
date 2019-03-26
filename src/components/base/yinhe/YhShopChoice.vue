<!--------------------------------------------------
  Yhshopchoice.vue
  店铺选择
---------------------------------------------------->
<template>
  <div class="yh-shopChoice">
    <yh-label :value="label" :style="labelStyles" :alignment="labelAlign"/>
    <template>
      <el-select v-model="shops" v-bind="attrs" size="small" v-on="$listeners" placeholder="请选择店铺" @visible-change="shopChange" @clear="clearShop">
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
    <!--高级查询，后期再添加-->
    <!--<div class="advanceQuery">
      <el-button @click.native="shopSearchIsShow = true" type="text">高级查询</el-button>
      <multi-area-shop :centerDialogVisible="shopSearchIsShow" :shopList="url" @setShops="setCheckedShops"/>
    </div>-->
  </div>
</template>

<script>
import Vue from 'vue';
import { Select, Option, Tree, Input } from 'element-ui';
import SimpleVue from '../../../plugins/SimpleVue';
import PathConf from '../../../conf/api.conf';
import Validator from './validator/Validator';
import shopChoiceMixins from './mixins/shopChoice';

Vue.use(SimpleVue);
Vue.batch.use(Select, Option, Tree, Input);
export default {
  name: 'YhShopChoice',
  mixins: [shopChoiceMixins],
  props: {
    attrs: {},
    label: String,
    options: Array,
    url: String,
    queryParams: Object,
    value: Array,
    needShopName: Boolean,
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
      allShopId: [], // 店铺所有id合集
      clearData: false
    };
  },
  methods: {
    // 从父组件得到地址拿到店铺数据
    urlData() {
      if (this.options && this.options.length > 0) {
        this.data2 = [
          {
            name: '全部',
            data: []
          }
        ];
        this.data2[0].data = this.options;
      }
      else if (this.url !== '') {
        let that = this;
        let codeStore = [];
        let unCodeStore = [];
        let params = {
          id: this.userinfo['type'] === 'SERVICE' ? this.userinfo['parent_id'] : this.userinfo.shopper_id,
          nick: '',
          org_id: this.userinfo.org_id ? this.userinfo.org_id : null,
          service_id: this.userinfo.service_id ? this.userinfo.service_id : ''
        };
        Vue.$api.post({ getway: PathConf.user.$getway, api: this.url }, params).then(response => {
          let datas = response.data.data;
          // if (datas && datas.length > 0) {
          //   that.data2 = [
          //     {
          //       name: '全部',
          //       data: []
          //     }
          //   ];
          //   that.data2[0].data = datas;
          //   // that.checkedShopId = [];
          //   for (let i = 0; i < datas.length; i++) {
          //     for (let j = 0; j < datas[i].data.length; j++) {
          //       for (let k = 0; k < datas[i].data[j].data.length; k++) {
          //         that.allShopId.push(datas[i].data[j].data[k].id);
          //       }
          //     }
          //   }
          // }
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
    // 店铺高级查询保存已选店铺
    setCheckedShops(val) {
      if (val) {
        this.checkedShopId = [];
        for (let i = 0; i < val.length; i++) {
          this.checkedShopId.push(val[i].id);
          // names.push(val[i].name)
        }
        this.shopSearchIsShow = false;
        this.$refs.tree1[0].setCheckedKeys(this.checkedShopId);
        if (this.checkedShopId && this.checkedShopId.length > 0) {
          this.shops = '已选' + this.checkedShopId.length + '家';
        }
        else {
          this.shops = '';
        }
      }
      else {
        this.shopSearchIsShow = false;
      }
    },
    searchShop(name) {
      this.$refs.tree1[0].filter(name);
    }
  },
  inheritAttrs: false,
  mounted() {
    this.shops = '全部';
    this.$emit('input', ['全部']);
    this.urlData();
    if (JSON.stringify(this.queryParams) !== '{}' && this.queryParams !== undefined && this.queryParams['shopper_id_list']) { // 刷新时保留已选数据
      this.checkedShopId = this.queryParams['shopper_id_list'];
    }
  },
  watch: {
    value(val) { // 重置
      if (val.length === 0) {
        this.checkedShopId = [];
        this.urlData();
      }
    },
    checkedShopId(n) {
      this.filterText = ''; // 清空搜索关键字
      if (n && this.allShopId && n.length === 0 || this.allShopId.length === n.length) {
        this.shops = '全部';
        this.$emit('input', ['全部']);
      }
      else if (this.needShopName && n.length === 1) {
        this.shops = '已选1家';
        this.getCheckedName(n[0]);
        this.$emit('input', [n, this.checkedName]);
      }
      else {
        this.shops = '已选' + n.length + '家';
        this.$emit('input', n);
      }
    }
  }
};
</script>

<style lang="less" scoped>
::-webkit-scrollbar{ width: 0 !important }

.yh-shopChoice{
  display: flex;
  align-items: center;
  > *{
    flex: 1;
  }
  .advanceQuery{
    flex: 0;
    margin-left: 10px;
  }
  .yh-label{
    flex: 0 0 70px;
  }
}

.el-select-dropdown__item{
  height: auto !important;
}
</style>
