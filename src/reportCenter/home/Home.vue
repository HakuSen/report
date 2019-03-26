<template>
  <div class="canvas-charts" @click="initChartVal">
    <!--统计条件-->
    <div class="time-conditions">
      <span>统计时间：</span>
      <el-radio-group size="mini" v-model="dateSwitch" @change="getSwitchType">
        <el-radio-button label="月"></el-radio-button>
        <el-radio-button label="年" id="year"></el-radio-button>
      </el-radio-group>
      <el-date-picker
        :clearable="false"
        size="mini"
        v-model="dateWidget"
        :type="dateType"
        :placeholder="dateTypeTxt"
        :picker-options="pickerOptions"
        @change="getDateType"
        style="width:150px;">
      </el-date-picker>
    </div>
    <div class="canvas-wrap">
      <div class="item-every">
        <div class="volume-histogram"><!--1 销售量-->
          <ve-histogram :data="chartSwitch && chartSwitch === 'filter2' && JSON.stringify(barCountData) !== '{}' ? barCountData : barVolumeData" :loading="requerySwitch || !requerySwitch1" :events="barVolumeEvent" :legend-visible="false" :title="barVolumeHeader" :settings="barVolumeSettings" :extend="slantX" :height="'300px'" :dataZoom="dataZooms" :toolbox="toolbox1"></ve-histogram>
          <div class="filtrate" v-if="barVolumeData.rows">
            <span v-if="!histogram1" @click.stop="clickFiltrate('histogram1', 'filter1')" class="funnel"><icon name="filtrate" class="icon-position"></icon></span>
            <prompt-tip :titleList="['筛选器']"/>
            <Yh-filtrate v-if="histogram1" :isFiltrate="isFiltrate" :reserveData="reserveHistogram1" :orgData="orgData" @sonData="getSonData" class="funnel-control"></Yh-filtrate>
          </div>
        </div>
        <div class="saleroom-histogram"><!--2 销售额-->
          <ve-histogram :data="chartSwitch && chartSwitch === 'filter1' && JSON.stringify(barPriceData) !== '{}'? barPriceData : barSaleroomData" :loading="requerySwitch || !requerySwitch2" :events="barSaleroomEvent" :legend-visible="false" :title="barSaleroomHeader" :settings="barSaleroomSettings" :extend="slantX1" :height="'300px'" :dataZoom="dataZooms" :toolbox="toolbox1"></ve-histogram>
          <div class="filtrate" v-if="barSaleroomData.rows">
            <span v-if="!histogram2" @click.stop="clickFiltrate('histogram2', 'filter2')" class="funnel"><icon name="filtrate" class="icon-position"></icon></span>
            <prompt-tip :titleList="['筛选器']"/>
            <Yh-filtrate v-if="histogram2" :isFiltrate="isFiltrate" :reserveData="reserveHistogram2" :orgData="orgData" @sonData="getSonData" class="funnel-control"></Yh-filtrate>
          </div>
        </div>
        <div class="line"><!--4折线图-->
          <ve-line :data="lineData" :events="lineEvent" :settings="lineSetting" :extend="slantX" :loading="requerySwitch || !requerySwitch4" :height="'450px'"></ve-line>
          <div class="filtrate" v-if="lineData.rows">
            <span v-if="!line" @click.stop="clickFiltrate('line', 'filter4')" class="funnel"><icon name="filtrate" class="icon-position"></icon></span>
            <prompt-tip :titleList="['筛选器']"/>
            <Yh-filtrate v-if="line" :isFiltrate="isFiltrate" :reserveData="reserveLine" @sonData="getSonData" class="funnel-control"></Yh-filtrate>
          </div>
        </div>
      </div>
      <div class="item-every">
        <div class="map"><!--3 地图-->
          <ve-map :data="mapData" :visualMap="visualMaps" :settings="mapSetting" :events="mapEvent" :toolbox="toolbox1" :legend-visible="false" :title="mapHeader" :loading="requerySwitch || !requerySwitch3">
          </ve-map>
          <div class="filtrate" v-if="mapData.rows">
            <span v-if="!map" @click.stop="clickFiltrate('map', 'filter3')" class="funnel"><icon name="filtrate" class="icon-position"></icon></span>
            <prompt-tip :titleList="['筛选器']"/>
            <Yh-filtrate v-if="map" :isFiltrate="isFiltrate" :reserveData="reserveMap" @sonData="getSonData" class="funnel-control"></Yh-filtrate>
          </div>
        </div>
        <div class="pie"><!--5 饼图-->
          <ve-pie :data="pieData" :settings="pieSettings" :events="pieEvent" :legend-visible="false" :loading="requerySwitch || !requerySwitch5" :title="pieTitle">
          </ve-pie>
          <div class="filtrate" v-if="pieData.rows">
            <span v-if="!pie" @click.stop="clickFiltrate('pie', 'filter5')" class="funnel"><icon name="filtrate" class="icon-position"></icon></span>
            <prompt-tip :titleList="['筛选器']"/>
            <Yh-filtrate v-if="pie" :isFiltrate="isFiltrate" :reserveData="reservePie" @sonData="getSonData" class="funnel-control"></Yh-filtrate>
          </div>
        </div>
      </div>
      <div class="item-every">
        <div class="topTen">
          <sell-table :topTenData="topTenData" v-if="topTenData.rows" :topTenEvent="topTenEvent" :loading="requerySwitch || !requerySwitch6"></sell-table>
          <!--6 销售量或者销售额top10-->
          <div class="filtrate">
            <span v-if="!topTen" @click.stop="clickFiltrate('topTen', 'filter6')" class="funnel"><icon name="filtrate" class="icon-position"></icon></span>
            <prompt-tip :titleList="['筛选器']"/>
            <Yh-filtrate v-if="topTen" :isFiltrate="isFiltrate" :reserveData="reserveTopTen" @sonData="getSonData" class="funnel-control"></Yh-filtrate>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { RadioButton, RadioGroup, DatePicker, MessageBox } from 'element-ui';
import { mapState, mapGetters } from 'vuex';
import VCharts from 'v-charts';
import 'v-charts/lib/style.css';
import 'echarts/lib/component/toolbox';
import SellTable from '../../components/base/table/SellTable';
import setChartsParams from '../../utils/setChartsParams';
import YhFiltrate from '../../components/base/yinhe/YhFiltrate';
import SimpleVue from '../../plugins/SimpleVue';
import baseFn from '../../utils/baseFunction';
import NoResult from '../../components/base/queryResult/NoResult';
import PromptTip from '../../components/base/PromptTip';

Vue.use(SimpleVue);
Vue.use(VCharts);
Vue.batch.use(RadioButton, RadioGroup, DatePicker);
export default {
  name: 'Home',
  components: {
    SellTable,
    YhFiltrate,
    NoResult,
    PromptTip
  },
  data() {
    let that = this;
    this.slantX = {
      // 横轴文字倾斜，否则展示不了所有数据
      'xAxis.0.axisLabel.rotate': -40
    };
    this.slantX1 = {
      // 横轴文字倾斜，否则展示不了所有数据
      'xAxis.0.axisLabel.rotate': -40,
      // 更改柱状图样式
      itemStyle: {
        color: ['#0a96ff']
      }
    };
    this.barVolumeSettings = {
      // 修改别名
      labelMap: {
        area_name: '地区',
        sale_count_sum: '销售量'
      },
      legendName: {
        地区: '地区',
        销售量: '销售量'
      }
    };
    this.barVolumeHeader = {
      text: '销售量',
      x: 'center',
      textStyle: {
        fontSize: 18,
        fontFamily: 'Microsoft YaHei'
      }
    };
    this.pieTitle = {
      text: '销售量',
      x: 'center',
      textStyle: {
        fontSize: 18,
        fontFamily: 'Microsoft YaHei'
      }
    };
    this.barVolumeEvent = {
      click(e) {
        if (that.chartSwitch === 'filter1' && that.requerySwitch1) {
          // that.requerySwitch1 = false;
          that.requerySwitch = true;
          let params = setChartsParams(that.$store, that.zones, that.timeAry);
          params['org_id'] = that.barVolumeData['rows'][e.dataIndex]['org_id'] || null;
          params['chart_type'] = 1;
          params['filter_tag'] = 'filter1';
          params['filter_tag_click'] = true;
          params['geography_id'] = that.barVolumeData.rows[e.dataIndex]['area_id'];
          that.barPriceData = {};
          that.barPriceData['columns'] = that.barSaleroomData['columns'];
          that.barPriceData['rows'] = [];
          that.barPriceData['rows'].push(that.barSaleroomData['rows'][e.dataIndex]);
          that.getChartData(params);
          params['chart_type'] = 3;
          that.getChartData(params);
          params['chart_type'] = 4;
          that.getChartData(params);
          params['chart_type'] = 5;
          that.getChartData(params);
          setTimeout(() => {
            // that.requerySwitch1 = true;
            that.requerySwitch = false;
          }, 1000);
        }
        else {
          return false;
        }
      }
    };
    this.dataZooms = [
      {
        show: false,
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        show: false,
        height: '80%',
        left: '93%'
      }
    ];

    this.barSaleroomSettings = {
      labelMap: {
        area_name: '地区',
        sale_price_sum: '销售额'
      },
      legendName: {
        地区: '地区',
        销售额: '销售额'
      }
    };
    this.barSaleroomHeader = {
      text: '销售额',
      x: 'center',
      textStyle: {
        fontSize: 18,
        fontFamily: 'Microsoft YaHei'
      }
    };
    this.barSaleroomEvent = {
      click(e) {
        if (that.chartSwitch === 'filter2' && that.requerySwitch2) {
          // that.requerySwitch2 = false;
          that.requerySwitch = true;
          let params = setChartsParams(that.$store, that.zones, that.timeAry);
          params['chart_type'] = 2;
          params['filter_tag'] = 'filter2';
          params['filter_tag_click'] = true;
          params['geography_id'] = that.barSaleroomData.rows[e.dataIndex]['area_id'];
          params['org_id'] = that.barSaleroomData['rows'][e.dataIndex]['org_id'] || null;
          that.barCountData = {};
          that.barCountData['columns'] = that.barVolumeData['columns'];
          that.barCountData['rows'] = [];
          that.barCountData['rows'].push(that.barVolumeData['rows'][e.dataIndex]);
          that.getChartData(params);
          params['chart_type'] = 3;
          that.getChartData(params);
          params['chart_type'] = 4;
          that.getChartData(params);
          params['chart_type'] = 5;
          that.getChartData(params);
          setTimeout(() => {
            // that.requerySwitch2 = true;
            that.requerySwitch = false;
          }, 1000);
        }
        else {
          return false;
        }
      }
    };

    this.mapSetting = {
      labelMap: {
        area_name: '地区',
        sale_price_sum: '销售额',
        sale_count_sum: '销售量'
      },
      legendName: {
        销售量: '销售量',
        销售额: '销售额'
      },
      position: 'china',
      label: false,
      roam: true,
      itemStyle: {
        normal: {
          borderColor: '#00f'
        }
      },
      zoom: 1.2
    };
    this.mapHeader = {
      text: '交易热度',
      x: 'center',
      textStyle: {
        fontSize: 18,
        fontFamily: 'Microsoft YaHei'
      }
    };
    this.mapEvent = {
      click(e) {
        if (that.chartSwitch === 'filter3' && that.requerySwitch3) {
          // that.requerySwitch3 = false;
          that.requerySwitch = true;
          let params = setChartsParams(that.$store, that.zones, that.timeAry);
          params['chart_type'] = 3;
          params['filter_tag'] = 'filter3';
          params['filter_tag_click'] = true;
          params['province_code'] = that.mapData.rows[e.dataIndex]['area_code'];
          params['chart_type'] = 4;
          that.getChartData(params);
          params['chart_type'] = 5;
          that.getChartData(params);
          setTimeout(() => {
            // that.requerySwitch3 = true;
            that.requerySwitch = false;
          }, 1000);
        }
        else {
          return false;
        }
      }
    };
    this.toolbox1 = { // 地图上的重置
      show: true,
      feature: {
        show: true,
        restore: {}
      }
    };
    this.visualMaps = { // 地图左下的滑块
      type: 'continuous',
      min: 0,
      max: 200,
      itemHeight: 100,
      itemWidth: 15,
      text: [],
      realtime: false,
      calculable: false,
      color: ['#6664ec', '#e0e0fb']
    };

    this.lineSetting = {
      labelMap: {
        sale_count_sum: '销售量',
        sale_price_sum: '销售额',
        average_price: '均价'
      },
      legendName: {
        销售量: '销售量',
        销售额: '销售额',
        均价: '均价'
      }
    };
    this.lineEvent = {
      click(e) {
        if (that.chartSwitch === 'filter4' && that.requerySwitch4) {
          // that.requerySwitch4 = false;
          that.requerySwitch = true;
          let params = setChartsParams(that.$store, that.zones, that.timeAry);
          params['chart_type'] = 4;
          params['filter_tag'] = 'filter4';
          params['filter_tag_click'] = true;
          params['goods_name'] = e['name'];
          params['chart_type'] = 1;
          that.getChartData(params);
          params['chart_type'] = 2;
          that.getChartData(params);
          params['chart_type'] = 3;
          that.getChartData(params);
          params['chart_type'] = 5;
          that.getChartData(params);
          setTimeout(() => {
            // that.requerySwitch4 = true;
            that.requerySwitch = false;
          }, 1000);
        }
        else {
          return false;
        }
      }
    };

    this.pieSettings = {
      dimension: 'goods_name',
      selectedMode: 'single',
      hoverAnimation: false
    };
    this.pieEvent = {
      click(e) {
        if (that.chartSwitch === 'filter5' && that.requerySwitch5) {
          // that.requerySwitch5 = false;
          that.requerySwitch = true;
          let params = setChartsParams(that.$store, that.zones, that.timeAry);
          params['chart_type'] = 5;
          params['filter_tag'] = 'filter5';
          params['filter_tag_click'] = true;
          params['goods_name'] = e['name'];
          params['chart_type'] = 1;
          that.getChartData(params);
          params['chart_type'] = 2;
          that.getChartData(params);
          params['chart_type'] = 3;
          that.getChartData(params);
          params['chart_type'] = 4;
          that.getChartData(params);
          setTimeout(() => {
            // that.requerySwitch5 = true;
            that.requerySwitch = false;
          }, 1000);
        }
        else {
          return false;
        }
      }
    };

    return {
      loadingName: false,
      barCountData: {}, // 这两个数据是为了解决点击柱状图，另一个柱状图不发请求的问题
      barPriceData: {},
      chartsListName: [
        'barVolumeData',
        'barSaleroomData',
        'mapData',
        'lineData',
        'pieData',
        'topTenData'
      ],
      dropdownType: 1,
      dateSwitch: '月',
      dateWidget: new Date(),
      dateType: 'month',
      dateTypeTxt: '选择月',
      pickerOptions: { // 时间范围限制
        disabledDate(time) {
          return time.getTime() < new Date('2017-01-01');
        }
      },
      timeAry: [], // 月/年的第一天和最后一天数组
      histogram1: false,
      histogram2: false,
      pie: false,
      map: false,
      line: false,
      topTen: false,
      requerySwitch: false,
      requerySwitch1: true,
      requerySwitch2: true,
      requerySwitch3: true,
      requerySwitch4: true,
      requerySwitch5: true,
      requerySwitch6: true,
      isFiltrate: { // 判断下拉框/销售量是否显示
        isSelect: false,
        market: false,
        filterTag: ''
      },
      orgData: [
        {
          id: 1,
          name: '按地理分区'
        }
      ],
      chartSwitch: '', // 筛选器开关
      zones: [],
      reserveHistogram1: {},
      reserveHistogram2: {},
      reservePie: {},
      reserveMap: {},
      reserveLine: {},
      reserveTopTen: {},
      histogram1Loading: true
    };
  },
  computed: {
    ...mapGetters({
      userinfo: 'tokenInfo/userinfo'
    }),
    ...mapState({
      barVolumeData: State => State.chartsInfo.chartsObject.barVolumeData,
      barSaleroomData: State => State.chartsInfo.chartsObject.barSaleroomData,
      mapData: State => State.chartsInfo.chartsObject.mapData,
      lineData: State => State.chartsInfo.chartsObject.lineData,
      pieData: State => State.chartsInfo.chartsObject.pieData,
      topTenData: State => State.chartsInfo.chartsObject.topTenData
    })
  },
  methods: {
    // 年按钮加统计
    statisticsNum() {
      let _czc = [];
      _czc.push(['_trackEvent', '统计数量', '点击', '', '', 'year']);
    },
    // 条件切换
    getSwitchType(val) {
      this.dateWidget = new Date();
      switch (val) {
        case '年':
          MessageBox.alert('年统计数据正在整理中，敬请期待...', '提示', {
            type: 'info',
            callback: () => {
              this.dateSwitch = '月';
            }
          });
          this.statisticsNum();
          break;
        case '月':
          this.timeAry = baseFn.getLastDay(new Date().getFullYear(), new Date().getMonth() + 1);
          break;
      }
    },
    initChartVal() {
      [this.histogram1, this.histogram2, this.map, this.pie, this.line, this.topTen] = [false, false, false, false, false, false];
    },
    // 点击过滤器
    clickFiltrate(val, filterName) {
      this.isFiltrate.isSelect = false;
      this.isFiltrate.market = false;
      this.isFiltrate.filterTag = filterName;
      this.initChartVal();
      switch (val) {
        case 'histogram1':
          this.histogram1 = !this.histogram1;
          this.isFiltrate.isSelect = true;
          break;
        case 'histogram2':
          this.histogram2 = !this.histogram2;
          this.isFiltrate.isSelect = true;
          break;
        case 'map':
          this.map = !this.map;
          this.isFiltrate.market = true;
          break;
        case 'line':
          this.line = !this.line;
          break;
        case 'pie':
          this.pie = !this.pie;
          this.isFiltrate.market = true;
          break;
        case 'topTen':
          this.topTen = !this.topTen;
          this.isFiltrate.market = true;
          break;
      }
    },
    // 拿到组织架构
    getOrgStruct() {
      if (this.userinfo['type'] !== 'SERVICE') {
        Vue.$api.post({ getway: 'report', api: '/OrgStruct/findOrgStruct' }, {
          shopper_id: this.userinfo['shopper_id'],
          org_id: this.userinfo['org_id']
        }).then(response => {
          let data = response.data.data;
          if (data && data.length > 0) {
            data.forEach(item => { // 将接口请求到的字段转换成组件接收的字段名（level_name -> name）
              let selectObj = {
                id: item['level_id'],
                name: item['level_name'],
                count: item['level_count'],
                deep: item['deep']
              };
              this.orgData.push(selectObj);
            });
          }
        });
      }
    },
    // 单个图表loading
    singleLoading() {
      [this.requerySwitch1, this.requerySwitch2, this.requerySwitch3, this.requerySwitch4, this.requerySwitch5, this.requerySwitch6] = [false, false,
        false, false, false, false];
    },
    getSonData(val, data) {
      this.barPriceData = {}; // 请求柱状图截取数据，不然会一直保留，影响页面
      this.barCountData = {};
      this.chartSwitch = val[0];
      this.zones = val;
      let obj = {
        checkedVal: '1',
        filterStatus: false,
        marketSwitch: '销售量'
      };
      if (JSON.stringify(data) !== '{}' && data['filterStatus'] === true) {
        this.reserveHistogram1 = obj;
        this.reserveHistogram2 = obj;
        this.reservePie = obj;
        this.reserveMap = obj;
        this.reserveLine = obj;
        this.reserveTopTen = obj;
      }
      switch (val[3]) {
        case 'filter1' :
          this.reserveHistogram1 = data;
          this.reserveHistogram2['checkedVal'] = data['checkedVal'];
          break;
        case 'filter2' :
          this.reserveHistogram2 = data;
          this.reserveHistogram1['checkedVal'] = data['checkedVal'];
          break;
        case 'filter3' :
          this.reserveMap = data;
          break;
        case 'filter4' :
          this.reserveLine = data;
          break;
        case 'filter5' :
          this.reservePie = data;
          break;
        case 'filter6' :
          this.reserveTopTen = data;
          break;
      }
    },
    getDateType(val) {
      this.dateType === 'month'
        ? this.timeAry = baseFn.getLastDay(val.getFullYear(), val.getMonth() + 1)
        : this.timeAry = [val.getFullYear() + '-01-01 00:00:00', val.getFullYear() + '-12-31 23:59:59'];
    },
    getChartData(params) {
      this.$store.dispatch('chartsInfo/getChartsData', { params, dataName: this.chartsListName[params['chart_type'] - 1] });
    },
    topTenEvent(e) {
      if (this.chartSwitch === 'filter6' && this.requerySwitch6) {
        // this.requerySwitch6 = false;
        this.requerySwitch = true;
        let that = this;
        setTimeout(() => {
          // that.requerySwitch6 = true;
          that.requerySwitch = false;
        }, 1000);
        let params = setChartsParams(this.$store, this.zones, this.timeAry);
        params['chart_type'] = 6;
        params['filter_tag'] = 'filter6';
        params['filter_tag_click'] = true;
        params['goods_name'] = e['goods_name'];
        if (this.dropdownType === '2') {
          params['deep'] = '1';
        }
        this.getChartData(params);
        params['chart_type'] = 2;
        this.getChartData(params);
        params['chart_type'] = 3;
        this.getChartData(params);
        params['chart_type'] = 4;
        this.getChartData(params);
        params['chart_type'] = 1;
        this.getChartData(params);
        params['chart_type'] = 5;
        this.getChartData(params);
      }
      else {
        return false;
      }
    },
    initChartData(filter = null) {
      this.requerySwitch = true;
      setTimeout(() => {
        this.requerySwitch = false;
      }, 1000);
      let params = setChartsParams(this.$store, this.zones, this.timeAry);
      if (filter) {
        switch (filter) {
          case 'filter1':
            params['chart_type'] = 1;
            this.getChartData(params);
            params['chart_type'] = 2;
            this.getChartData(params);
            break;
          case 'filter2':
            params['chart_type'] = 2;
            this.getChartData(params);
            params['chart_type'] = 1;
            this.getChartData(params);
            break;
          case 'filter3':
            params['chart_type'] = 3;
            this.getChartData(params);
            break;
          case 'filter4':
            params['chart_type'] = 4;
            this.getChartData(params);
            break;
          case 'filter5':
            params['chart_type'] = 5;
            this.getChartData(params);
            break;
          case 'filter6':
            params['chart_type'] = 6;
            this.getChartData(params);
            break;
        }
        return;
      }
      params['chart_type'] = 1;
      this.getChartData(params);
      params['chart_type'] = 2;
      this.getChartData(params);
      params['chart_type'] = 3;
      this.getChartData(params);
      params['chart_type'] = 4;
      this.getChartData(params);
      params['chart_type'] = 5;
      this.getChartData(params);
      params['chart_type'] = 6;
      this.getChartData(params);
    }
  },
  mounted() {
    if (this.userinfo['org_id'] !== null) { // 组织登录的时候组织架构才会显示
      this.getOrgStruct(); // 组织架构数据
    }
    this.timeAry = baseFn.getLastDay(new Date().getFullYear(), new Date().getMonth() + 1);
    this.initChartData();
  },
  updated() {
    if (JSON.stringify(this.mapData) !== '{}') {
      this.visualMaps.max = this.mapData['max_map_value'] || 200;
    }
    if (JSON.stringify(this.pieData) !== '{}') {
      this.pieTitle.text = this.pieData['pie_order_by_desc'];
    }
  },
  watch: {
    timeAry(n, o) {
      if (n !== o && o.length > 0) {
        this.initChartData();
      }
    },
    chartSwitch() {
      this.initChartData();
    },
    zones(n, o) {
      if (n !== o && (n[0] === o[0] || o[0] === undefined)) {
        this.initChartData(n[3]);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.canvas-charts{
  padding-left: 20px;
  padding-right: 20px;
  display: inline-block !important;
  .time-conditions{
    display: flex;
    padding: 20px;
    background: #fff;
    margin-bottom: 20px;
    > span{
      line-height: 28px;
    }
    .el-radio-group{
      margin-right: 6px;
    }
  }
  .canvas-wrap{
    padding: 0 20px;
    background: #fff;
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
    flex-direction: initial !important;
    .filtrate{
      cursor: pointer;
      .funnel{
        position: absolute;
        display: none;
        top: 20px;
        right: 26px;
        &:hover + .prompt-content{
          display: block;
        }
      }
      .funnel-control{
        position: absolute;
        top: 20px;
        right: 15px;
      }
      .prompt-content{
        position: absolute;
        top: 50px;
        right: -13px;
        display: none;
      }
    }
    .item-every{
      width: 30%;
      > div{
        position: relative;
        padding-top: 14px;
        margin-bottom: 20px;
        &:hover .filtrate{
          .funnel{
            display: block;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.canvas-charts{
  .el-picker-panel.el-date-picker{
    position: absolute;
    z-index: 2004;
  }
  .el-radio-button--mini .el-radio-button__inner{
    padding: 7px 8px;
  }
}
</style>
