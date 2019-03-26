<!--------------------------------------------------
  店铺选择中的高级店铺查询
---------------------------------------------------->
<template>
  <el-dialog title="店铺选择"
             :visible="centerDialogVisible"
             @close="closeDialog">
    <div class="name-wrap">
      <div class="name-wrap-left">
        <div class="left-box-top">
          <span style="margin-right:20px;">
            组织名称：
            <el-select class="search-input custom-input" size="small" clearable v-model="form.name" placeholder="请选择组织名称">
              <el-option v-for="(item,index) in oNameList" :key="index" :label="item['nick']" :value="item.id">
              </el-option>
            </el-select>
          </span>
          <span>
            店铺名称：
            <el-input
              class="search-input custom-input"
              clearable
              size="small"
              placeholder="请输入店铺名称"
              v-model="form.shopName">
            </el-input>
            <el-button class="search-name-btn custom-btn" size="small" @click="searchFn" plain>
              查询
            </el-button>
          </span>
        </div>
        <div class="map-box">
          <div style="margin-right:4px;">定位城市：</div>
          <el-cascader change-on-select clearable style="width:180px;" class="custom-input" size="small" :options="options" v-model="form.selectedOptions">
          </el-cascader>
        </div>
        <div class="left-box">
          <el-checkbox-group @change="handleCheckboxChange" v-model="checkList">
            <div class="left-box-con" v-for="(item,index) in nameList" :key="index">
              <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </div>
      <div class="name-wrap-right">
        <div class="selected-name">
          <span>已选店铺（<span style="color:#0a96ff;">{{checkList.length}}</span>）</span>
          <span @click="handleClickClear" style="color:#0a96ff;cursor:pointer;">清除</span>
        </div>
        <div class="right-box">
          <div class="empty-box" v-if="checkList.length===0">
            <icon class="empty-bg" name="empty">
            </icon>
            <span>还没有选择任何店铺哦～～</span>
          </div>
          <div v-else class="left-box-con" v-for="(item,index) in checkListLeft" :key="index">
            <span>{{item.name}}</span>
            <i @click="handleDeleteSelected(index)" class="el-icon-delete selected-delete"></i>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="centerDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="closeDialog(checkList)">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue';
import { Dialog, Cascader, Select, Option } from 'element-ui';
import { mapGetters } from 'vuex';
import { provinceAndCityData } from 'element-china-area-data';
import SimpleVue from '../../../../plugins/SimpleVue';

Vue.use(SimpleVue);
Vue.batch.use(Dialog, Cascader, Select, Option);
export default {
  props: ['nameList', 'oNameList', 'centerDialogVisible'],
  data() {
    return {
      form: {
        name: '',
        shopName: '',
        selectedOptions: ['', '']
      },
      options: provinceAndCityData,
      checkList: [],
      checkListLeft: []
    };
  },
  computed: {
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    })
  },
  methods: {
    closeDialog(shop) {
      this.$emit('setShops', shop);
    },
    searchFn() {
      this.$emit('searchName', this.form);
    },
    getNameList(arr) {
      let arr1 = [];
      let that = this;
      arr.forEach(a => {
        that.nameList.forEach(b => {
          if (a === b.id) {
            arr1.push(b);
          }
        });
      });
      return arr1;
    },
    handleCheckboxChange(val) {
      this.checkListLeft = this.getNameList(val);
    },
    handleClickClear() {
      this.checkListLeft = [];
      this.checkList = [];
    },
    handleDeleteSelected(i) {
      this.checkList.splice(i, 1);
      this.checkListLeft.splice(i, 1);
    }
  },
  created() {
  },
  watch: {}
};
</script>

<style scoped>
.left-box-top{
  text-align: center;
  background: #ffffff;
}

.custom-input .el-input__inner{
  width: 180px !important;
}

.empty-bg{
  width: 100%;
  height: 45%;
}

.map-box{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 10px;
  line-height: initial;
  white-space: nowrap;
}

.empty-box{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.selected-delete{
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}

.left-box-con{
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30px;
  font-size: 14px;
}

.left-box-top{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 200%;
  height: 60px;
  white-space: nowrap;
}

.selected-name{
  display: flex;
  justify-content: space-between;
  height: 60px;
  line-height: 76px;
}

.name-wrap{
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
}

.name-wrap-left,
.name-wrap-right{
  width: 48%;
  height: 100%;
}

.left-box,
.right-box{
  overflow-x: hidden;
  overflow-y: auto;
  width: 94%;
  height: 302px;
  padding: 15px 10px;
  background: #f7f7f7;
}

.search-name-btn{
  width: 80px;
  margin-left: 20px;
}

.search-input{
  width: 180px;
}
</style>
