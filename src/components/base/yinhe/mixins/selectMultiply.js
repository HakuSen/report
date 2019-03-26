import Validator from '../validator/Validator';

export default {
  props: {
    label: String,
    options: Array,
    url: String,
    value: Array,
    multiplyData: Array, // 多选列表数据
    refreshData: Array, // 刷新数据
    propertyInput: String,
    isCheckAll: Boolean,
    labelWidth: {
      type: Number,
      default: 70
    },
    labelAlign: {
      type: String,
      default: 'right',
      validator: Validator.optional(['left', 'center', 'right'])
    },
    attrs: {}
  },
  data() {
    return {
      inputValue: '全部',
      isShow: false,
      isIndeterminate: false,
      checkAll: false,
      checkedCities: [],
      rotate: 'rotate(0deg)',
      searchData: false,
      valueData: '',
      allData: this.multiplyData
    };
  },
  inheritAttrs: false,
  methods: {
    refreshChecked(data) {
      this.checkAll = false;
      this.isIndeterminate = true;
      let l = data.length;
      this.inputValue = '已选' + l + '种';
      this.checkedCities = data;
    },
    // 点击空白处下拉框消失type为商品名称的时候显示值为'请选择'
    haveSelect() {
      this.isShow = false;
      this.rotate = 'rotate(0deg)';
      this.getCheckStatus();
    },
    // 下拉框状态切换
    showToggle(event) {
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
      event.cancelBubble = true;
      this.isShow = !this.isShow;
      if (!this.isShow) {
        this.rotate = 'rotate(0deg)';
      }
      else {
        this.rotate = 'rotate(-180deg)';
      }
      this.getCheckStatus();
    },
    // 所有的id赋值给checkedCities
    allSelectData(id) {
      let that = this;
      that.multiplyData.forEach(value => {
        this.checkedCities.push(value[id]);
      });
    },
    // change触发
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.multiplyData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.multiplyData.length;
    },
    prevent(event) {
      event.cancelBubble = true;
    },
    clearChecked() {
      if (this.propertyInput) {
        this.inputValue = this.propertyInput;
      }
      else {
        this.inputValue = '全部';
      }
      this.checkedCities = [];
      // 全不选样式
      this.checkAll = false;
      this.isIndeterminate = false;
    }
  },
  mounted() {
    if (this.multiplyData === [] || this.propertyInput) {
      this.inputValue = this.propertyInput;
    }
    if (this.refreshData && this.refreshData.length > 0) {
      this.refreshChecked(this.refreshData);
    }
    this.$yselect.push(this);
  }
};
