<!----
  排行数量（top10\20\50）
---->
<template>
  <div class="yh-radioButton">
    <yh-label :value="label" :style="labelStyles" :alignment="labelAlign"/>
    <el-radio-group v-bind="attrs" v-on="$listeners" v-model="typeData.radio" @change="$emit('changeData', typeData.radio)">
      <el-radio-button v-for="(item,key) in options" :label="item.value" :key="key">{{item.label}}</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>

import Vue from 'vue';
import { Select, Option, RadioButton, RadioGroup } from 'element-ui';
import YhLabel from './indirectness-unit/YhLabel';
import Validator from './validator/Validator';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Select, Option, RadioButton, RadioGroup);
export default {
  name: 'YhRankNum',
  components: {
    YhLabel
  },
  props: {
    attrs: {},
    label: String,
    options: Array,
    value: String,
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
      typeData: {
        radio: ''
      }
    };
  },
  computed: {
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
    if (this.queryParams && JSON.stringify(this.queryParams) !== '{}') {
      if (this.queryParams['top_num'] !== null) {
        this.typeData.radio = this.queryParams['top_num'] + '';
      }
      else {
        this.typeData.radio = '';
      }
    }
    else {
      this.typeData.radio = this.value;
    }
    let detailInfo = JSON.parse(sessionStorage.getItem('vuex')).info.params.goodsRankings.goodsRankingsParams;
    let typeInfo = JSON.parse(sessionStorage.getItem('vuex')).info.params.classificationRankings.classifySaleRankingParams;
    if (this.attrs['type'] && this.attrs['type'] === '商品销售排行（总排行）' && JSON.stringify(detailInfo) !== '{}') {
      this.typeData.radio = detailInfo['top_num'] + '';
    }
    else if (this.attrs['type'] && this.attrs['type'] === '分类销售排行（总排行）' && JSON.stringify(typeInfo) !== '{}') {
      this.typeData.radio = typeInfo['top_num'] + '';
    }
  }
};
</script>

<style lang="less" scoped>
.yh-radioButton{
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
