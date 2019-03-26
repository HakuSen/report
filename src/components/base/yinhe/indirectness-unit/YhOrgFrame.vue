<!--------------------------------------------------
  YhOrgFrame.vue
  组织架构
---------------------------------------------------->
<template>
  <div class="yh-org-frame">
    <mul-select-choice v-if="isMultiple" :listData="typeDatas" v-model="multipleValue" @change="multipleDeepName"></mul-select-choice>
    <select-choice v-else :listData="typeDatas" v-model="selfValue" @change="deepName"></select-choice>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Select, Option } from 'element-ui';
import YhLabel from './YhLabel';
import Validator from '../validator/Validator';
import SelectChoice from '../functional-unit/selectChoice';
import MulSelectChoice from '../functional-unit/mulSelectChoice';
import SimpleVue from '../../../../plugins/SimpleVue';
import PathConf from '../../../../conf/api.conf';

Vue.use(SimpleVue);
Vue.batch.use(Select, Option);
export default {
  name: 'YhOrgFrame',
  components: {
    YhLabel,
    SelectChoice,
    MulSelectChoice
  },
  props: {
    queryParams: Object,
    attrs: {},
    label: String,
    options: Array,
    url: String,
    isMultiple: Boolean,
    value: Array,
    defalutVal: Boolean,
    refreshDatas: String,
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
      topDeep: 0,
      organize: '', // 需要传给页面的一系列数据
      originalData: [], // 接口拿到的数据
      multipleValue: []
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
    urlData() {
      if (this.options && this.options.length > 0) {
        this.typeDatas = this.options;
      }
      if (this.url !== '') {
        let params = {
          shopper_id: this.userinfo.shopper_id,
          service_id: this.userinfo.service_id ? this.userinfo.service_id : '',
          type: this.userinfo.type,
          user_id: this.userinfo.user_id
        };
        Vue.$api.post({ getway: PathConf.user.$getway, api: this.url }, params).then(response => {
          let data = response.data.data;
          this.originalData = data;
          if (data && data.length > 0) {
            data.forEach(item => { // 将接口请求到的字段转换成组件接收的字段名（prop_value -> id）
              let selectObj = {
                id: item['name'] || item['id'],
                name: item['name'] || item['name']
              };
              this.typeDatas.push(selectObj);
            });
            this.topDeep = null;
            this.organize = data[data.length - 1];
            if (this.isMultiple) {
              this.multipleValue = [data[data.length - 1].name];
              this.$emit('input', [this.multipleValue, this.organize, this.topDeep]);
            }
            else {
              this.selfValue = data[data.length - 1].name;
              this.$emit('input', [this.selfValue, this.organize, this.topDeep]);
            }
            this.refreshData(); // refresh
          }
        });
      }
    },
    // 改变值时获取其deep
    deepName(val) { // 单选类别
      let originalData = this.originalData;
      originalData.forEach(item => {
        if (item.name === val) {
          this.organize = item;
          // item.deep === null ? this.topDeep = null : this.topDeep = item.deep;
          this.topDeep = item.deep;
          this.$emit('input', [val, this.organize, this.topDeep]);
        }
        return false;
      });
    },
    multipleDeepName(val) { // 多选组织类别时的情况
      let originalData = this.originalData;
      let arrs = [];
      if (val.length === 0) {
        this.$emit('input', [val]);
      }
      originalData.forEach(item => {
        val.forEach(index => {
          if (item.name === index) {
            arrs.push(item.deep);
            this.organize = item;
          }
          if (val.indexOf('店铺') > -1) {
            this.topDeep = null;
            this.$emit('input', [val, this.organize, this.topDeep]);
          }
          else {
            let min = arrs[0];
            if (arrs.length > 1) {
              arrs.forEach(a => {
                if (a < min) {
                  this.topDeep = min;
                  this.$emit('input', [val, this.organize, this.topDeep]);
                }
              });
            }
            else if (arrs.length === 1) {
              this.topDeep = min;
              this.$emit('input', [val, this.organize, this.topDeep]);
            }
          }
        });
      });
    },
    refreshData() {
      if (this.queryParams && this.queryParams['deep_name']) {
        if (typeof this.queryParams['deep_name'] === 'string') {
          this.selfValue = this.queryParams['deep_name'];
        }
        else {
          this.multipleValue = this.queryParams['deep_name'];
        }
      }
      if (this.refreshDatas !== '' && this.refreshDatas !== undefined) {
        this.selfValue = this.refreshDatas;
        this.deepName(this.selfValue);
      }
    }
  },
  inheritAttrs: false,
  mounted() {
    this.urlData();
  },
  watch: {
    defalutVal(val) {
      if (val) {
        // console.warn('defalutVal', val);
        this.urlData();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.yh-org-frame{
  display: flex;

  > *{
    flex: 1;
  }

  .yh-label{
    flex: 0 0 70px;
  }
}
</style>
