<!--------------------------------------------------
  总占比、属性分类
---------------------------------------------------->
<template>
  <div class="yh-propertyAnalyze">
    <yh-label :value="label" :style="labelStyles" :alignment="labelAlign"/>
    <el-checkbox-group v-bind="attrs" v-model="typeData.radio" @change="getRadio">
      <el-checkbox v-for="(item,key) in options" :label="item.value" :key="key">{{item.label}}</el-checkbox>
    </el-checkbox-group>
    <el-select class="yhSelect" v-if="proShow" v-bind="attrs" v-model="typeData.propertyVal">
      <el-option
        v-for="(item,key) in propertyData"
        :key="key"
        :label="item.name"
        :value="item.id"
        :disabled="item.disabled">
      </el-option>
    </el-select>
  </div>
</template>

<script>

import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Select, Option, CheckboxButton, CheckboxGroup, Checkbox } from 'element-ui';
import YhLabel from './indirectness-unit/YhLabel';
import Validator from './validator/Validator';
import SimpleVue from '../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Select, Option, CheckboxButton, CheckboxGroup, Checkbox);
export default {
  name: 'YhPropertyAnalyze',
  components: {
    YhLabel
  },
  props: {
    attrs: {},
    url: String,
    label: String,
    options: Array,
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
      typeData: {
        radio: [],
        propertyVal: ''
      },
      propertyUrl: this.url,
      proShow: false,
      propertyData: []
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
    getTransData() {
      let total = this.queryParams['total_proportion'];
      let contain = this.queryParams['is_contain_prop'];
      if (total === 1 && contain === 1) {
        this.proShow = true;
        return ['proportion', 'type'];
      }
      if (total === 0 && contain === 1) {
        this.proShow = true;
        return ['type'];
      }
      if (total === 1 && contain === 0) {
        this.proShow = false;
        return ['proportion'];
      }
      if (total === 0 && contain === 0) {
        this.proShow = false;
        return [];
      }
    },
    getRadio(val) {
      if (val && val.length > 0 && val.toString().indexOf('type') !== -1) {
        this.proShow = true;
      }
      else {
        this.typeData.propertyVal = '';
        this.proShow = false;
      }
    },
    getPropertyData() {
      let params = {
        service_id: this.userinfo.service_id ? this.userinfo.service_id : ''
      };
      if (this.userinfo['user_type'] && this.userinfo['user_type'] === 'child_shop') {
        params.shopper_id = this.userinfo['parent_id'];
      }
      else {
        params.shopper_id = this.userinfo.shopper_id;
      }
      // 分类
      Vue.$api.post({ getway: 'goods', api: this.url }, params).then(response => {
        if (response.data.code === '10000') {
          this.propertyData = response.data.data;
          let all = {
            id: '',
            name: '全部'
          };
          this.propertyData.unshift(all);
        }
      });
    }
  },
  inheritAttrs: false,
  mounted() {
    this.getPropertyData();
    if (JSON.stringify(this.queryParams) !== '{}' && this.queryParams !== undefined) { // 刷新时保留已选数据
      this.typeData.radio = this.getTransData();
      this.typeData.propertyVal = Number(this.queryParams['prop_class_id']) || '';
    }
  },
  watch: {
    value(val) { // 重置
      if (val.length === 0) {
        this.typeData.radio = [];
        this.typeData.propertyVal = '';
      }
      else {
        this.proShow = JSON.stringify(val[0]).indexOf('type') !== -1;
      }
    },
    typeData: {
      handler() {
        this.$emit('input', [this.typeData.radio, this.typeData.propertyVal]);
      },
      // 监听属性  的子属性变化
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.yh-propertyAnalyze{
  display: flex;
  align-items: center;
  .el-date-editor{
    flex: 1 !important;
    width: auto !important;
  }
  .yh-label{
    flex: 0 0 70px;
  }
  .yhSelect{
    margin-left: 20px;
    width: auto;
  }
}
</style>
