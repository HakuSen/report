<!--------------------------------------------------
  树形结构的下拉多选框
---------------------------------------------------->
<template>
  <div class="multiple__tree">
    <el-select size="small" v-model="shops" v-bind="attrs" v-on="$listeners" placeholder="请选择" @visible-change="shopChange" @clear="clearShop">
      <el-option
        v-for="item in shopList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        class="select-box"
        style="background:white;margin-bottom:10px"
        size="large"
      >
              <span style="display:block;margin:0;padding:0">
                <el-input v-model="filterText" @click.native="searchShopClick" size="small" placeholder="搜索" prefix-icon="el-icon-search" v-on:input="searchShop" :ref="'searchShopInput'" style="margin:2px 0 6px 0;"></el-input>
                  <el-tree
                    class="filter-tree"
                    :data="data2"
                    @check-change="checkChange"
                    show-checkbox
                    default-expand-all
                    :default-checked-keys="checkedShopId"
                    node-key="id"
                    :ref="'tree1'"
                    highlight-current
                    :filter-node-method="filterShop"
                    :props="defaultProps">
                  </el-tree>
                </span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import Vue from 'vue';
import { Select, Option, Tree, Input } from 'element-ui';

Vue.batch.use(Select, Option, Tree, Input);
export default {
  name: 'MultipleTree',
  props: {
    attrs: {},
    options: Array,
    url: String,
    value: Array,
    treeData: Array,
    defaultVal: String
  },
  data() {
    return {
      shops: this.defaultVal,
      data2: this.treeData,
      seLoading: false,
      shopList: [
        {
          value: '',
          label: ''
        }
      ],
      defaultProps: {
        children: 'data',
        label: 'name'
      },
      searchShopId: '',
      checkedLeaf: [],
      checkedShopId: [], // 店铺选中id合集
      allShopId: 0, // 店铺id合集数量
      filterText: '', // 搜索店铺输入的关键字
      shopSearchIsShow: false,
      leafOnly: true
    };
  },
  methods: {
    // 从父组件得到地址拿到店铺数据
    urlData() {
      // this.data2 = [
      //   {
      //     name: '全部',
      //     data: [
      //       {
      //         id: 540000,
      //         name: '西藏自治区',
      //         // data: [
      //         //   {
      //         //     id: 540100,
      //         //     name: '拉萨市',
      //         //     data: [
      //         //       {
      //         //         id: 681052,
      //         //         name: 'syh_4',
      //         //         data: null,
      //         //         type: 'shop'
      //         //       }
      //         //     ],
      //         //     type: 'city'
      //         //   }
      //         // ],
      //         type: 'province'
      //       }
      //     ]
      //   }
      // ];
      let that = this;
      setTimeout(() => {
        if (this.treeData && this.treeData.length > 0) {
          that.data2 = that.treeData;
          let data = this.data2[0].data;
          this.allShopId = data.length;
        }
      }, 1000);
    },
    searchShop(name) {
      this.$refs.tree1[0].filter(name);
    },
    clearShop() {
      this.$refs.tree1[0].setCheckedKeys([]);
    },
    // // 店铺下拉框搜索与筛选
    searchShopClick(e) {
      e.stopPropagation();
    },
    filterShop(value, data, note) {
      if (!value) return true;
      let hasShop = data.name.indexOf(value) > -1;
      let hasCity = note.parent.data.name ? note.parent.data.name.indexOf(value) > -1 : false;
      return hasShop || hasCity;
    },
    checkChange() {
    },
    shopChange(show) {
      if (show) {
        this.searchShop('');
        this.$refs.searchShopInput[0].$refs.input.value = '';
        setTimeout(() => {
          for (let i = 0; i < document.getElementsByClassName('el-scrollbar__wrap').length; i++) {
            document.getElementsByClassName('el-scrollbar__wrap')[i].scrollTop = 0;
          }
        }, 100);
      }
      this.checkedShopId = [];
      this.checkedLeaf = this.$refs.tree1[0].getCheckedNodes(this.leafOnly);
      for (let i = 0; i < this.checkedLeaf.length; i++) {
        this.checkedShopId.push(this.checkedLeaf[i].id);
      }
      if (this.checkedShopId.length > 0) {
        this.shops = '已选' + this.checkedShopId.length + '种';
      }
      else {
        this.shops = '';
      }
    }
  },
  mounted() {
    this.urlData();
  },
  watch: {
    checkedShopId() {
      this.filterText = ''; // 清空搜索关键字
      // if (n && this.allShopId && this.allShopId === n.length || n.length === 0) {
      //   this.shops = '全部';
      //   this.$emit('input', ['全部']);
      // }
      // else {
      //   console.warn('n', n);
      //   this.shops = '已选' + n.length + '种';
      //   this.$emit('input', n);
      // }
    }
  }
};
</script>

<style scoped>
.el-select-dropdown__item{
  height: auto !important;
}
</style>
