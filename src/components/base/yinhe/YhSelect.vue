<!--------------------------------------------------
  YhSelect.vue
  单选下拉选择菜单
---------------------------------------------------->
<template>
  <div class="yh-select">
    <yh-label :value="label" :style="labelStyles" :alignment="labelAlign"/>
    <select-choice :listData="typeDatas" v-model="selfValue"></select-choice>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import YhLabel from './indirectness-unit/YhLabel';
import Validator from './validator/Validator';
import selectChoice from './functional-unit/selectChoice';
import PathConf from '../../../conf/api.conf';

export default {
  name: 'YhSelect',
  components: {
    YhLabel,
    selectChoice
  },
  props: {
    queryParams: Object,
    attrs: {},
    label: String,
    options: Array,
    url: String,
    isMachine: Boolean,
    isfilter: Boolean,
    isEmployees: Boolean,
    indicators: Boolean,
    value: {
      type: String,
      default: ''
    },
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
      selfValue: '',
      typeDatas: [],
      clearData: false
    };
  },
  computed: {
    labelStyles() {
      let stl = {};

      if (this.labelWidth) {
        stl.flex = `0 0 ${this.labelWidth}px`;
      }

      return stl;
    },
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    })
  },
  methods: {
    refreshData() {
      if (this.queryParams['order_type']) {
        this.selfValue = this.queryParams['order_type'];
      }
    },
    clear() {
      this.selfValue = '';
    },
    urlData(val = [], org) {
      if (this.options && this.options.length > 0) {
        let options = this.options;
        options.forEach(item => { // 将接口请求到的字段转换成组件接收的字段名（prop_value -> id）
          let selectObj = {
            id: item['value'] || item['id'],
            name: item['label'] || item['name']
          };
          this.typeDatas.push(selectObj);
        });
      }
      else if (this.urlData !== '') {
        let params = {};
        let pathWay;
        this.typeDatas = [];
        if (this.isMachine) {
          pathWay = PathConf.shop.$getway;
          if (org) {
            params.org_id = org;
          }
          if (this.userinfo['user_type'] === 'child_shop') {
            params.store_ids = [this.userinfo['shopper_id']];
          }
          else if (this.userinfo['user_type'] === 'parent_shop') {
            if (val.length === 0 || val[0] === '全部') {
              params.shopper_id = this.userinfo['shopper_id'];
            }
            else {
              params.store_ids = val;
            }
          }
        }
        if (this.isEmployees) {
          pathWay = PathConf.user.$getway;
          if (val.length === 0 || val[0] === '全部') {
            params.shopper_id = this.userinfo['shopper_id'];
            params.shopper_ids = [0];
          }
          else {
            params.shopper_ids = val;
          }
        }
        Vue.$api.post({ getway: pathWay, api: this.url }, params).then(response => {
          let data = response.data['data'];
          if (data && data.length > 0) {
            this.typeDatas = [{
              id: 'all',
              name: '全部'
            }];
            data.forEach(item => { // 将接口请求到的字段转换成组件接收的字段名（prop_value -> id）
              let payObj = {
                id: item['prop_value'] || item['job_num'] || item['uuid'] || item['id'] || item['pay_code'],
                name: item['descript'] || item['name'] || item['company_name']
              };
              this.typeDatas.push(payObj);
            });
          }
        });
      }
    }
  },
  inheritAttrs: false,
  mounted() {
    this.selfValue = this.value; // 初始化赋值
    this.urlData();
  },
  watch: {
    value(val) {
      if (this.isMachine && val === '') { // 重置机器号默认请选择
        this.selfValue = '';
      }
      if (val === '2') { // 重置订单类型默认全部
        this.selfValue = '2';
        this.$emit('input', '');
      }
      if(val === 'originalPrice'){ // 选择指标
        this.selfValue = 'originalPrice';
        this.$emit('input', 'originalPrice;营业额');
      }
    },
    selfValue(val) {
      if (val === '2') { // 订单类型为全部时需要传空
        val = '';
      }
      if (this.isMachine || this.indicators) {
        this.typeDatas.find(item => {
          if (String(item.id) === val) {
            let obj = val + ';' + item.name;
            this.$emit('input', obj);
          }
          return false;
        });
      }
      else {
        this.$emit('input', val);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.yh-select{
  display: flex;

  > *{
    flex: 1;
  }

  .yh-label{
    flex: 0 0 70px;
  }
}
</style>
