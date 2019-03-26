<!----
  店铺单选+
---->
<template>
  <div class="yh-single-shop-equip">
    <yh-label :value="label[0]" :style="labelStyles" :alignment="labelAlign"/>
    <el-cascader
      placeholder="搜索店铺"
      :options="shopList"
      :props="optionsProp"
      v-model="shopVal"
      v-bind="attrs"
      @change="changeVal"
      filterable
    ></el-cascader>
    <yh-label :value="label[1]" :style="labelStyles" style="margin-left: 20px;" :alignment="labelAlign"/>
    <select-multiply :ref="'Multiply'" :multiplyData="MultiplyData" :refreshData="classifyRefreshData" v-model="CheckedVal"></select-multiply>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import Vue from 'vue';
import { Cascader } from 'element-ui';
import YhLabel from './indirectness-unit/YhLabel';
import SelectMultiply from './functional-unit/selectMultiply';
import Validator from './validator/Validator';
import PathConf from '../../../conf/api.conf';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Cascader);
export default {
  name: 'YhSingleShopEquip',
  components: {
    YhLabel,
    SelectMultiply
  },
  props: {
    attrs: {},
    label: Array,
    options: Array,
    url: Array,
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
      classifyRefreshData: [], // 分类刷新数据
      optionsProp: {
        children: 'data',
        label: 'name',
        value: 'id'
      },
      MultiplyData: [],
      shopVal: [],
      CheckedVal: [],
      equipId: []

    };
  },
  methods: {
    refreshData() {
      if (this.queryParams['single_shop']) {
        this.shopVal = this.queryParams['single_shop'];
      }
    },
    urlData() {
      if (this.url.length > 0) {
        let codeStore = [];
        let province = '';
        let city = '';
        let unCodeStore = [];
        let params = {
          id: this.userinfo['type'] === 'SERVICE' ? this.userinfo['parent_id'] : this.userinfo.shopper_id,
          nick: '',
          org_id: this.userinfo.org_id ? this.userinfo.org_id : null,
          service_id: this.userinfo.service_id ? this.userinfo.service_id : ''
        };
        Vue.$api.post({ getway: PathConf.user.$getway, api: this.url[0] }, params).then(response => {
          let datas = response.data.data;
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
              province = codeStores[0].id;
              for (let j = 0; j < codeStores[i].data.length; j++) {
                city = codeStores[0].data[0].id;
                for (let k = 0; k < codeStores[i].data[j].data.length; k++) {
                  codeStore.push(codeStores[i].data[j].data[k].id);
                }
              }
            }
            this.shopVal = [province, city, codeStore[0]];
            this.getPropertyType(codeStore[0]); // 默认请求机器设备
            this.shopList = datas['code_stores'].concat(unCodeStore);
          }
        });
      }
    },
    changeVal(val) {
      this.$refs['Multiply'].clearChecked();
      if (val.length === 1) {
        this.getPropertyType(val[0]);
      }
      else {
        this.getPropertyType(val[2]);
      }
    },
    // 设备类型API
    getPropertyType(id) {
      let params = {
        store_id: id
      };
      Vue.$api.post({ getway: PathConf.shop.$getway, api: this.url[1] }, params).then(response => {
        this.MultiplyData = [];
        this.equipId = [];
        if (response.data.data.length > 0) {
          response.data.data.forEach(item => {
            this.equipId.push(item['hardware_sn']);
            let selectObj = {
              id: item['hardware_sn'],
              name: item['hardware_name']
            };
            this.MultiplyData.push(selectObj);
          });
        }
        this.$emit('input', [id, this.equipId]);
      });
    },
    // 属性名称组件点击空白处下拉框消失
    haveSelect() {
      this.$refs['Multiply'].haveSelect();
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
    value(val) { // 置空
      if (val.length === 0) {
        this.urlData();
      }
    },
    CheckedVal(val) {
      if (val.length > 0) {
        this.$emit('input', [this.shopVal[2], val]);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.yh-single-shop-equip{
  display: flex;

  > *{
    flex: 1;
  }
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

