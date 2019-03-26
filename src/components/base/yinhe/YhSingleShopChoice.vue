<!----
  店铺单选
---->
<template>
  <div class="yh-single-shop-choice">
    <yh-label :value="label" :style="labelStyles" :alignment="labelAlign"/>
    <el-cascader
      placeholder="搜索店铺"
      :options="shopList"
      :props="optionsProp"
      v-on="$listeners"
      v-model="shopVal"
      v-bind="attrs"
      clearable
      filterable
    ></el-cascader>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import Vue from 'vue';
import { Cascader } from 'element-ui';
import YhLabel from './indirectness-unit/YhLabel';
import Validator from './validator/Validator';
import PathConf from '../../../conf/api.conf';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Cascader);
export default {
  name: 'YhSingleShopChoice',
  components: {
    YhLabel
  },
  props: {
    attrs: {},
    label: String,
    options: Array,
    url: String,
    value: Array,
    queryParams: Object,
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
      shopList: [],
      optionsProp: {
        children: 'data',
        label: 'name',
        value: 'id'
      },
      shopVal: []
    };
  },
  methods: {
    refreshData() {
      if (this.queryParams['single_shop']) {
        this.shopVal = this.queryParams['single_shop'];
      }
    },
    urlData() {
      if (this.url !== '') {
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
          // this.shopList = datas;
          if (datas['un_code_stores'] && datas['code_stores']) {
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
                  codeStore.push(codeStores[i].data[j].data[k].id);
                }
              }
            }
            this.shopList = datas['code_stores'].concat(unCodeStore);
          }
        });
      }
    }
  },
  computed: {
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    }),
    labelStyles() {
      let stl = {};
      if (this.labelWidth) {
        stl.flex = `0 0 ${this.labelWidth}px`;
      }
      return stl;
    }
  },
  inheritAttrs: false,
  mounted() {
    this.refreshData();
    this.urlData();
  },
  watch: {
    value() {
      this.shopVal = this.value;
    }
  }
};
</script>

<style lang="less" scoped>
.yh-single-shop-choice{
  display: flex;
  .el-select{
    margin-right: 8px;
  }
  .el-radio-group{
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  .yh-label{
    flex: 0 0 70px;
  }
}
</style>

