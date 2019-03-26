<!-----
店铺点菜员
----->
<template>
  <div class="yh-order-clerk">
    <yh-shop-choice style="flex:1" v-model="shopVal" v-bind="attrs" :label="label[0]" :url="url[0]" @focus="changeEvent"></yh-shop-choice>
    <yh-label :value="label[1]" :style="labelStyles" :alignment="labelAlign"/>
    <select-multiply :ref="'multiply'" style="flex:.6" :multiplyData="multiplyData" :refreshData="refreshData" v-model="checkedVal" propertyInput="全部"></select-multiply>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Select, Option } from 'element-ui';
import YhLabel from './indirectness-unit/YhLabel';
import Validator from './validator/Validator';
import YhShopChoice from './YhShopChoice';
import SelectMultiply from './functional-unit/selectMultiply';
import PathConf from '../../../conf/api.conf';

Vue.batch.use(Select, Option);
export default {
  name: 'YhOrderClerk',
  components: {
    YhLabel,
    YhShopChoice,
    SelectMultiply
  },
  props: {
    attrs: {},
    label: Array,
    value: Array,
    url: Array,
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
      shopVal: [],
      checkedVal: [],
      multiplyData: [],
      refreshData: []
    };
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
  methods: {
    getOrderClerk(storeIds = this.userinfo.store_ids) {
      let params = {
        "shopper_id": this.userinfo.shopper_id,
        "shopper_ids": storeIds
      }
      Vue.$api.post({ getway: PathConf.user.$getway, api: this.url[1] }, params).then(response => {
        if(response.data.data.length > 0) {
          let orderClerkArray = response.data.data;
          orderClerkArray.forEach(item => {
            let payObj = {
              id: item['id'],
              name: item['name']
            };
            this.multiplyData.push(payObj);
          });
        }
      });
    },
    changeEvent() {
      this.$emit('parentFn');
    },
    // 点击空白处下拉框消失
    haveSelect() {
      this.$refs.multiply.haveSelect();
    }
  },
  inheritAttrs: false,
  watch: {
    value(val) {
      if(val.length === 0) {
        this.shopVal = []
      }
      // this.shopVal = [];
    },
    shopVal(n, o) {
      if (o && o.length > 0 && JSON.stringify(o) !== JSON.stringify(n)) {
        console.log(n,o)
        this.$refs['multiply'].clearChecked();
        n[0] !== '全部' ? this.getOrderClerk(n) : this.getOrderClerk();
        this.$emit('input', [n, ['全部']]);
      }
    },
    checkedVal(val) {
      this.$emit('input', [this.shopVal, val]);
    }
  },
  mounted() {
    this.getOrderClerk()
  }
};
</script>

<style lang="less" scoped>
.yh-order-clerk{
  display: flex;
  .yh-label{
    flex: 0 0 70px;
  }
  .el-select{
    margin-left: 20px;
  }
}
</style>
