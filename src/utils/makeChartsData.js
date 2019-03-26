// 设置基本的请求参数
const makeChartsData = dataName => {
  let res = {};
  switch (dataName) {
    case 'barVolumeData':
      res = {
        data: {
          data: {
            columns: ['area_name', 'sale_count_sum'],
            rows: [{
              area_name: '东北地区',
              short_name: '东北...',
              area_id: '1',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '华北地区',
              short_name: '华北...',
              area_id: '2',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '华中地区',
              short_name: '华中...',
              area_id: '3',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '华东地区',
              short_name: '华东...',
              area_id: '4',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '华南地区',
              short_name: '华南...',
              area_id: '5',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '西南地区',
              short_name: '西南...',
              area_id: '6',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '西北地区',
              short_name: '西北...',
              area_id: '7',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '其他',
              short_name: '其他',
              area_id: '8',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }]
          }
        }
      };
      break;
    case 'barSaleroomData':
      res = {
        data: {
          data: {
            columns: ['area_name', 'sale_price_sum'],
            rows: [{
              area_name: '东北地区',
              short_name: '东北...',
              area_id: '1',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '华北地区',
              short_name: '华北...',
              area_id: '2',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '华中地区',
              short_name: '华中...',
              area_id: '3',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '华东地区',
              short_name: '华东...',
              area_id: '4',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '华南地区',
              short_name: '华南...',
              area_id: '5',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '西南地区',
              short_name: '西南...',
              area_id: '6',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '西北地区',
              short_name: '西北...',
              area_id: '7',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }, {
              area_name: '其他',
              short_name: '其他',
              area_id: '8',
              area_code: null,
              sale_count_sum: 0.0,
              sale_price_sum: 0.0,
              nick: null,
              deep: null,
              org_id: null
            }]
          }
        }
      };
      break;
    case 'mapData':
      res = {
        data: {
          data: {
            columns: ['area_name', 'sale_count_sum'],
            rows: [
              {
                area_name: '浙江',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '吉林',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '黑龙江',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '辽宁',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '河北',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '天津',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '北京',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '河南',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '山东',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '山西',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '陕西',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '宁夏',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '甘肃',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '新疆',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '青海',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '西藏',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '云南',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '重庆',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '四川',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '湖南',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '湖北',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '江西',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '上海',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '江苏',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '福建',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '广西',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '广东',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '海南',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '香港',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '澳门',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '台湾',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '内蒙古',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '贵州',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '安徽',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              },
              {
                area_name: '南海诸岛',
                short_name: null,
                area_id: null,
                area_code: '',
                sale_count_sum: '',
                sale_price_sum: '',
                nick: null,
                deep: null,
                org_id: null
              }
            ]
          }
        }
      };
      break;
    case 'lineData':
      res = {
        data: {
          data: {
            columns: ['goods_name', 'sale_count_sum', 'sale_price_sum', 'average_price'],
            rows: [{ goods_name: '暂无数据1', sale_count_sum: 0.0, sale_price_sum: 0.0, average_price: 0.0, area_name: null, area_id: null },
              { goods_name: '暂无数据2', sale_count_sum: 0.0, sale_price_sum: 0.0, average_price: 0.0, area_name: null, area_id: null },
              { goods_name: '暂无数据3', sale_count_sum: 0.0, sale_price_sum: 0.0, average_price: 0.0, area_name: null, area_id: null },
              { goods_name: '暂无数据4', sale_count_sum: 0.0, sale_price_sum: 0.0, average_price: 0.0, area_name: null, area_id: null }]
          }
        }
      };
      break;
    case 'pieData':
      res = {
        data: {
          data: {
            columns: ['goods_name', 'sale_count_sum'],
            rows: [{ goods_name: '暂无数据', sale_count_sum: 1.0, sale_price_sum: 1.0, average_price: null, area_name: null, area_id: null }]
          }
        }
      };
      break;
    case 'topTenData':
      res = {
        data: {
          data: {
            columns: ['goods_name', 'sale_count_sum'],
            rows: [{ goods_name: '暂无数据', sale_count_sum: 0.0, sale_price_sum: null, average_price: null, area_name: null, area_id: null }]
          }
        }
      };
      break;
  }
  return res;
};

export default makeChartsData;
