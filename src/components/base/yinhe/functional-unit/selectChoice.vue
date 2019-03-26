<!--------------------------------------------------
  下拉单选
---------------------------------------------------->
<template>
  <div class="yh-select" :ref="'yselect'">
    <el-select v-bind="attrs" size="small" :filterable="filterStatus" v-on="$listeners" v-model="checkedVal" @focus="chengeEvent">
      <el-option
        v-for="(item,key) in listData"
        :key="key"
        :label="item.name"
        :value="item.id+''"
        :disabled="item.disabled">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import Vue from 'vue';
import { Select, Option } from 'element-ui';
import SimpleVue from '../../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Select, Option);
export default {
  name: 'YhSelectChoice',
  props: {
    attrs: Object,
    options: Array,
    label: String,
    listData: Array,
    url: String,
    value: String,
    filterStatus: Boolean
  },
  data() {
    return {
      checkedVal: this.value
    };
  },
  inheritAttrs: false,
  methods: {
    chengeEvent() {
      this.$yselect.forEach((yse, index) => {
        if (yse) {
          if (yse !== this) {
            yse.isShow = false;
          }
        }
        else {
          this.$yselect.splice(index, 0);
        }
      });
    }
  },
  mounted() {
    this.$yselect.push(this);
  },
  watch: {
    value(val) {
      this.checkedVal = val;
      this.$emit('input', val);
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
  .el-select{
    margin-right: 20px;
  }
}
</style>
