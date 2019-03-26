<!--------------------------------------------------
  店铺+机器+员工
---------------------------------------------------->
<template>
  <div class="yh-shop-machine">
    <yh-shop-choice v-if="userinfo.user_type === 'parent_shop'" style="margin-right: 20px" v-model="shopVal" v-bind="attrs" :label="label[0]" :url="url[0]"></yh-shop-choice>
    <yh-select v-model="machineVal" :label="label[1]" :url="url[1]" :isMachine="isMachine" :ref="'machine'" :queryParams="queryParams"></yh-select>
    <yh-select v-if="isEmployees" v-model="employeesVal" :label="label[2]" :url="url[2]" :isEmployees="isEmployees" :ref="'employees'" :queryParams="queryParams"></yh-select>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Select, Option } from 'element-ui';
import YhShopChoice from './YhShopChoice';
import YhSelect from './YhSelect';

Vue.batch.use(Select, Option);
export default {
  name: 'YhShopMachine',
  components: {
    YhShopChoice,
    YhSelect
  },
  props: {
    attrs: {},
    label: Array,
    value: Array,
    url: Array,
    isMachine: Boolean,
    isEmployees: Boolean,
    queryParams: Object
  },
  data() {
    return {
      shopVal: [],
      machineVal: '',
      employeesVal: ''
    };
  },
  computed: {
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    })
  },
  methods: {},
  inheritAttrs: false,
  watch: {
    value(val) {
      if (val.length === 0) {
        this.shopVal = [];
        this.machineVal = '';
        this.employeesVal = '';
        this.$emit('input', [['全部'], '', '']);
      }
    },
    shopVal(n, o) {
      if (o.length > 0 && JSON.stringify(o) !== JSON.stringify(n)) {
        if (this.isMachine) {
          this.machineVal = '';
          this.$refs.machine.clear();
          this.$refs.machine.urlData(n);
        }
        if (this.isEmployees) {
          this.employeesVal = '';
          this.$refs.employees.clear();
          this.$refs.employees.urlData(n);
        }
      }
      this.$emit('input', [this.shopVal, this.machineVal, this.employeesVal]);
    },
    machineVal(val) {
      this.$emit('input', [this.shopVal, val, this.employeesVal]);
    },
    employeesVal(val) {
      this.$emit('input', [this.shopVal, this.machineVal, val]);
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.yh-shop-machine{
  display: flex;
  .yh-label{
    flex: 0 0 70px;
  }
  .el-select{
    margin-left: 20px;
  }
}
</style>
