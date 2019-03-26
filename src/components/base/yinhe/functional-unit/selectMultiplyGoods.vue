<!--------------------------------------------------
  checkbox下拉多选copy版（为了解决多选搜索功能）
---------------------------------------------------->
<template>
  <div class="yh-select-multiply" :ref="'yselect'">
    <div style="position: relative;">
      <div class="input-box"
           @click="showToggle"><span>{{this.inputValue}}</span><i class="el-icon-arrow-down drop" v-bind:style="{transform: rotate }"></i>
      </div>
      <el-collapse-transition name="el-zoom-in-top">
      <div class="checkboxTransiton" v-show="isShow">
        <div>
          <div class="cut"></div>
          <div class="checkbox" @click="prevent">
            <div class="search">
              <input placeholder="请输入内容" @keyup="searchClass" type="text" class="checkbox_search" v-model='valueData'>
              <i class="el-icon-close" @click="clearSearch"></i>
            </div>
            <el-checkbox v-if="multiplyData.length > 0 && searchData"
                        :indeterminate="isIndeterminate"
                        v-model="checkAll"
                        @change="handleCheckAllChange">全选
            </el-checkbox>
            <div v-if="multiplyData.length === 0" style="margin:0 auto;text-align: center;">暂无数据</div>
            <!--👇多选下拉列表选择项-->
            <el-checkbox-group v-bind="attrs" v-on="$listeners"
                              v-model="checkedCities"
                              @change="handleCheckedCitiesChange"
                              style="display:flex;flex-direction: column;">
              <el-checkbox
                v-for="(item,index) in multiplyData"
                :label="item['id']"
                :key="index"
                style="margin-left:0;line-height:25px"
              >{{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import 'element-ui/lib/theme-chalk/base.css';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import { Checkbox, CheckboxGroup } from 'element-ui';
import multiplyMixins from '../mixins/selectMultiply';
import SimpleVue from '../../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.batch.use(Checkbox, CheckboxGroup);
export default {
  name: 'YhSelectMultiply',
  mixins: [multiplyMixins],
  methods: {
    clearSearch() { // 清除输入内容
      this.valueData = '';
      this.checkedCities = [];
      this.inputValue = '全部';
      this.checkAll = false;
      this.isIndeterminate = false;
      this.searchClass();
    },
    searchClass() { // 向store传入请求接口的输入值
      this.$store.commit('info/searchData', this.valueData);
      this.searchData = true;
      if (!this.valueData) {
        this.searchData = false;
      }
    },
    getCheckStatus() {
      if (this.checkedCities && this.multiplyData && this.checkedCities.length > 0 && this.checkedCities.length < this.multiplyData.length) { // 非全选
        this.inputValue = '已选' + this.checkedCities.length + '种';
      }
      else if (this.checkedCities && this.multiplyData && this.checkedCities.length === this.multiplyData.length && !this.searchData) { // 全选
        this.checkedCities = [];
        this.allSelectData('id');
        this.inputValue = '全部';
      }
      else if (this.searchData) {
        this.inputValue = '已选' + this.checkedCities.length + '种';
      }
      else if (this.checkedCities && this.multiplyData && this.multiplyData.length > 0 && this.checkedCities.length === 0) { // 全不选
        if (this.propertyInput !== '' && this.propertyInput !== undefined) {
          this.inputValue = this.propertyInput;
        }
        else {
          this.inputValue = '全部';
        }
      }
    },
    // 全选的设置
    handleCheckAllChange(val) {
      this.checkedCities = [];
      if (val && this.multiplyData) {
        this.allSelectData('id');
      }
      this.isIndeterminate = false;
    }
  },
  watch: {
    multiplyData() {
      if (this.refreshData.length === 0 && this.isCheckAll === true) {
        this.allSelectData('id');
        this.inputValue = '全部';
        this.checkAll = true;
        this.isIndeterminate = false;
      }
    },
    checkedCities(curVal) {
      this.$emit('input', curVal);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../css/selectMultiply";
::-webkit-scrollbar{ width: 0 !important }

.el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
  background-color: #fff;
}
.search{
  position: relative;
  .el-icon-close{
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
}
</style>
