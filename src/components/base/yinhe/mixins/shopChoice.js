import { mapGetters } from 'vuex';
import YhLabel from '../indirectness-unit/YhLabel';
import MultiAreaShop from '../indirectness-unit/YhAdvancedQuery';

export default {
  components: {
    YhLabel,
    MultiAreaShop
  },
  data() {
    return {
      shops: '',
      data2: [],
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
      filterText: '', // 搜索店铺输入的关键字
      shopSearchIsShow: false,
      searchShopList: [],
      leafOnly: true,
      checkedName: '', // 店铺只有一家时存下该电铺name
      allData: [] // 存放所有的子店铺idname
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
        this.shops = '已选' + this.checkedShopId.length + '家';
      }
      else {
        this.shops = '';
      }
    },
    // //服务商查询店铺
    searchShopEvent() {
      let searchList = {};
      this.searchShopList.push(searchList);
    },
    getCheckedName(val) {
      this.allData.find(item => {
        if (item.id === val) {
          this.checkedName = item.name;
        }
        return false;
      });
    }
  }
};
