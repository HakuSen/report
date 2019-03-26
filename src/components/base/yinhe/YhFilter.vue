<!--------------------------------------------------
  YhFilter.vue
  过滤下拉选择菜单
---------------------------------------------------->
<template>
  <div class="yh-select">
    <yh-label :value="label" :style="labelStyles" :alignment="labelAlign"/>
    <select-choice :listData="typeDatas" v-on="$listeners" v-model="selfValue"></select-choice>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import YhLabel from './indirectness-unit/YhLabel';
import Validator from './validator/Validator';
import selectChoice from './functional-unit/selectChoice';

export default {
  name: 'YhFilter',
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
      typeDatas: [],
      selfValue: this.value
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
        let options = this.options;
        options.forEach(item => { // 将接口请求到的字段转换成组件接收的字段名（prop_value -> id）
          let selectObj = {
            id: item['value'] || item['id'],
            name: item['label'] || item['name']
          };
          this.typeDatas.push(selectObj);
        });
      }
    }
  },
  mounted() {
    this.urlData();
  },
  watch: {
    value(val) {
      this.selfValue = val;
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
