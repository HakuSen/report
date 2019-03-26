<!--------------------------------------------------
  图表可视化中筛选器
---------------------------------------------------->
<template>
  <div class="yh-filtrate" @click.stop="()=>{return false}">
    <div class="filterStatus">
      <span>筛选器:</span>
      <el-switch
        @change="filterSwitch"
        v-model="form.filterStatus"
        active-color="#13ce66"
        inactive-color="#999">
      </el-switch>
    </div>
    <el-select v-if="showOrg" v-bind="attrs" size="mini" v-on="$listeners" v-model="form.checkedVal" @change="filterSwitch" placeholder="选择组织架构设计">
      <el-option
        v-for="(item,key) in listData"
        :key="key"
        :label="item.count ? item.name + ' ('+ item.count + ')' : item.name"
        :value="item.id+''"
        :disabled="item.count && item.count > 10">
      </el-option>
    </el-select>
    <el-radio-group size="mini" v-if="isFiltrate.market" v-model="form.marketSwitch" @change="filterSwitch">
      <el-radio-button label="销售量"></el-radio-button>
      <el-radio-button label="销售额"></el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>

import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Select, Option, Switch, RadioButton, RadioGroup } from 'element-ui';

Vue.batch.use(Switch, Select, Option, RadioButton, RadioGroup);
export default {
  name: 'YhFiltrate',
  props: {
    attrs: {},
    label: String,
    options: Array,
    value: String,
    queryParams: Object,
    isFiltrate: Object,
    orgData: Array,
    reserveData: Object
  },
  computed: {
    showOrg() {
      return this.isFiltrate['isSelect'] && this.userinfo['type'].indexOf('ORG') !== -1;
    },
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    })
  },
  data() {
    return {
      listData: this.orgData,
      form: {
        checkedVal: '1',
        filterStatus: false,
        marketSwitch: '销售量'
      },
      deep: ''
    };
  },
  inheritAttrs: false,
  mounted() {
    if (JSON.stringify(this.reserveData) !== '{}') {
      this.form = this.reserveData;
    }
  },
  methods: {
    filterSwitch() {
      this.$emit('sonData', this.getSonDataForm(), this.form);
    },
    getSonDataForm() {
      let filter;
      let sale;
      let deep;
      let that = this;
      filter = this.form.filterStatus ? this.isFiltrate['filterTag'] : '';
      sale = this.form.marketSwitch === '销售量' ? 'saleCountSum' : 'salePriceSum';
      if (this.form.checkedVal === '') {
        deep = '';
      }
      else {
        this.listData && this.listData.length > 0 && that.listData.forEach(item => {
          if (Number(this.form.checkedVal) === item.id) {
            deep = item.deep;
          }
        });
      }
      return [filter, sale, deep, this.isFiltrate['filterTag']];
    }
  }
};
</script>

<style lang="less" scoped>
.yh-filtrate{
  padding: 5px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 4px 0 rgba(102, 102, 102, 0.3);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  .filterStatus{
    align-items: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    span{
      margin-right: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
    }
  }
  .el-switch{
    display: flex;
    align-items: center;
  }
  .el-radio-group{
    margin-top: 10px;
  }
  .el-select{
    margin-top: 10px;
    width: 110px;
  }
}
</style>
