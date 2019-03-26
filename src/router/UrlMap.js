// 异步加载范例
const Default = () => import('../reportCenter/home/PageNotFound');
const Home = () => import('../reportCenter/home/Home');
// 下载清单页面
const TableDownload = () => import('../reportCenter/tableDownload/TableDownload');
// 登录页面
const IncomeTotal = () => import('../reportCenter/operationReport/statistics/Income'); // 款项统计(按时间)
const ShopBusinessReport = () => import('../reportCenter/businessCustom/xinfengxiaochi/shopBusinessReport'); // 门店营业日报表
const AccountTotal = () => import('../reportCenter/operationReport/statistics/Account'); // 挂账页面
const retailCabinet = () => import('../reportCenter/Finance/FinanceReport/retailCabinetStatistics'); // 智能零售柜订单统计
const BusinessDaily = () => import('../reportCenter/Finance/FinanceReport/BusinessDaily'); // 综合日报
const ElectronicTrading = () => import('../reportCenter/Finance/FinanceReport/ElectronicTrading'); // 电子交易对账
const ManagementCondition = () => import('../reportCenter/Finance/FinanceReport/ManagementCondition'); // 经营状况
const ShopStore = () => import('../reportCenter/businessCustom/heilongtang/ShopStore'); // 门店分数对账表
const ShopSettlement = () => import('../reportCenter/businessCustom/xinfengxiaochi/ShopSettlementReport'); // 门店结算日报页面new
const ShopIncome = () => import('../reportCenter/operationReport/statistics/ShopIncome');
const ShopTimeIncome = () => import('../reportCenter/operationReport/statistics/ShopIncomeReport');
const IncludeLedger = () => import('../reportCenter/operationReport/statistics/IncludeLedger'); // 收入总账
const TakeoutStatistics = () => import('../reportCenter/operationReport/statistics/Takeout'); // 外卖统计
const SolidVoucherReport = () => import('../reportCenter/businessCustom/xinfengxiaochi/SolidVoucherReport'); // 实体券统计报表
const ShopGoodsTotle = () => import('../reportCenter/businessCustom/xinfengxiaochi/ShopGoodsTotle'); // 外卖统计
const RefundVegetablesTrading = () => import('../reportCenter/operationReport/statistics/RefundVegetables'); // 退菜统计
const Revenue = () => import('../reportCenter/operationReport/statistics/Revenue'); // 消费统计(按时间)
const TimeIndexAnalysis = () => import('../reportCenter/operationReport/timeInterval/IndexAnalysis'); // 时段指标分析
const TimeComparatAnalysis = () => import('../reportCenter/operationReport/timeInterval/ComparatAnalysis'); // 时段对比分析
const ShopRevenue = () => import('../reportCenter/operationReport/statistics/ShopRevenue');
const ShopTimeRevenue = () => import('../reportCenter/operationReport/statistics/ShopRevenueReport');
const BusinessPool = () => import('../reportCenter/operationReport/summary/BusinessPool'); // 营业汇总(按时间)
const StoreBusiness = () => import('../reportCenter/operationReport/summary/ShopBusinessPool');
const StoreTimeBusiness = () => import('../reportCenter/operationReport/summary/ShopBusinessReport');
const PreferentCount = () => import('../reportCenter/operationReport/statistics/Preferent'); // 优惠统计(按时间)
const StorePreferent = () => import('../reportCenter/operationReport/statistics/ShopPreferent');
const StoreTimePreferent = () => import('../reportCenter/operationReport/statistics/ShopPreferentReport');
const RefundCount = () => import('../reportCenter/operationReport/statistics/Refund'); // 退款统计(按时间)
const StoreRefundCount = () => import('../reportCenter/operationReport/statistics/ShopRefund');
const StoreTimeRefund = () => import('../reportCenter/operationReport/statistics/ShopRefundReport');
const ShopReceipts = () => import('../reportCenter/operationReport/comprehensiveDaily/ShopReceipts'); // 实收日报
const StoreTurnover = () => import('../reportCenter/operationReport/comprehensiveDaily/StoreTurnover'); // 实收日报
const GoodsSalesAnalysis = () => import('../reportCenter/goodsSaleReport/comparison/ComparisonAnalysis'); // 销售对比分析
const GoodsColligateAnalysis = () => import('../reportCenter/goodsSaleReport/synthesize/ColligateAnalysis'); // 商品销售分析 （汇总）
const GoodsShopAnalysis = () => import('../reportCenter/goodsSaleReport/comparison/ShopComparisonAnalysis');
const GoodsAnalyzeData = () => import('../reportCenter/goodsSaleReport/property/Data'); // 商品属性日分析
const GoodsAnalyzeWeek = () => import('../reportCenter/goodsSaleReport/property/Week'); // 商品属性周分析
const GoodsAnalyzeMonth = () => import('../reportCenter/goodsSaleReport/property/Month'); // 商品属性月分析
const GoodsStoreAnalyze = () => import('../reportCenter/goodsSaleReport/property/Shop');
const GoodsRankings = () => import('../reportCenter/goodsSaleReport/synthesize/Ranking'); // 商品销售排行
const ClassifySaleRanking = () => import('../reportCenter/goodsSaleReport/synthesize/ClassifyRanking'); // 分类销售排行
const GoodsSaleSize = () => import('../reportCenter/goodsSaleReport/synthesize/SizePropAnalysis'); // 商品规格分析
const RepairData = () => import('../reportCenter/repairData/RepairData'); // 报表数据修复
const KdsStatistics = () => import('../reportCenter/operationReport/statistics/kdsStatistics'); // KDS统计
const MembershipReport = () => import('../reportCenter/afiliateMarketing/membershipData/MembershipReport'); // 会员卡统计报表
const MembershipSynthesis = () => import('../reportCenter/afiliateMarketing/membershipData/MembershipSynthesis'); // 会员综合统计
const PreferentialDetails = () => import('../reportCenter/Finance/FinanceReport/PreferentialDetails'); // 优惠明细日报
const StoreTarget = () => import('../reportCenter/targetAnalysis/targetAnalysis/StoreTarget'); // 门店指标统计
const ShopTargetAnalysis = () => import('../reportCenter/targetAnalysis/targetAnalysis/shopTargetAnalysis'); // 门店指标统计
const OrderClerkCount = () => import('../reportCenter/goodsSaleReport/synthesize/orderClerkCount'); // 点菜员销售统计
/**
 * 服务端菜单配置数据中的 url 映射本地 views 页面组件
 * <p>
 *     key: 对应服务端传回的菜单项目对应的 url
 *     value: 本地组件的异步加载模式结果
 * </p>
 */
const UrlMap = {
  '/default': Default,
  '/home': Home,
  '/tableDownload': TableDownload,
  '/repairData': RepairData,
  '/operatingReport/dataStatistics/incomeTotal': IncomeTotal,
  '/businessCustom/xinfengxiaochi/shopBusinessReport': ShopBusinessReport,
  '/operatingReport/dataStatistics/accountTotal': AccountTotal,
  '/Finance/FinanceReport/retailCabinet': retailCabinet,
  '/Finance/FinanceReport/BusinessDaily': BusinessDaily,
  '/Finance/FinanceReport/PreferentialDetails': PreferentialDetails,
  '/businessCustom/heilongtang/shopStore': ShopStore,
  '/Finance/FinanceReport/ElectronicTrading': ElectronicTrading,
  '/Finance/FinanceReport/ManagementCondition': ManagementCondition,
  '/operatingReport/dataStatistics/includeLedger': IncludeLedger,
  '/operatingReport/dataStatistics/takeoutStatistics': TakeoutStatistics,
  '/businessCustom/xinfengxiaochi/solidVoucherReport': SolidVoucherReport,
  '/businessCustom/xinfengxiaochi/shopGoodsTotle': ShopGoodsTotle,
  '/operatingReport/dataStatistics/shopIncome': ShopIncome,
  '/businessCustom/xinfengxiaochi/shopSettlementReport': ShopSettlement,
  '/operatingReport/dataStatistics/shopTimeIncome': ShopTimeIncome,
  '/operatingReport/dataStatistics/revenueIncome': Revenue,
  '/operatingReport/timeInter/timeIndexAnalysis': TimeIndexAnalysis,
  '/operatingReport/timeInter/timeComparatAnalysis': TimeComparatAnalysis,
  '/operatingReport/dataStatistics/revenueShopIncome': ShopRevenue,
  '/operatingReport/dataStatistics/shopTimeRevenue': ShopTimeRevenue,
  '/operatingReport/dataStatistics/refundVegetables': RefundVegetablesTrading,
  '/operatingReport/detailsSummary/businessPool': BusinessPool,
  '/operatingReport/detailsSummary/storeBusiness': StoreBusiness,
  '/operatingReport/detailsSummary/storeTimeBusiness': StoreTimeBusiness,
  '/operatingReport/dataStatistics/preferentCount': PreferentCount,
  '/operatingReport/dataStatistics/storePreferent': StorePreferent,
  '/operatingReport/dataStatistics/storeTimePreferent': StoreTimePreferent,
  '/operatingReport/dataStatistics/refundCount': RefundCount,
  '/operatingReport/dataStatistics/storeRefundCount': StoreRefundCount,
  '/operatingReport/dataStatistics/storeTimeRefund': StoreTimeRefund,
  '/operatingReport/comprehensiveDaily/shopReceipts': ShopReceipts,
  '/operatingReport/comprehensiveDaily/storeTurnover': StoreTurnover,
  '/operatingReport/dataStatistics/KdsStatistics': KdsStatistics,
  '/afiliateMarketing/membershipData/MembershipSynthesis': MembershipSynthesis,
  '/afiliateMarketing/membershipData/membershipReport': MembershipReport,
  '/snalySiscommoditySales/propertySalesAnalysis/goodsAnalyzeData': GoodsAnalyzeData,
  '/snalySiscommoditySales/propertySalesAnalysis/goodsAnalyzeWeek': GoodsAnalyzeWeek,
  '/snalySiscommoditySales/propertySalesAnalysis/goodsAnalyzeMonth': GoodsAnalyzeMonth,
  '/snalySiscommoditySales/ComparisonAnalysiscommodityAales/goodsSalesAnalysis': GoodsSalesAnalysis,
  '/snalySiscommoditySales/ComparisonAnalysiscommodityAales/goodsShopAnalysis': GoodsShopAnalysis,
  '/snalySiscommoditySales/comprehensiveAnalysis/goodsColligateAnalysis': GoodsColligateAnalysis,
  '/snalySiscommoditySales/propertySalesAnalysis/goodsStoreAnalyze': GoodsStoreAnalyze,
  '/snalySiscommoditySales/comprehensiveAnalysis/goodsRankings': GoodsRankings,
  '/snalySiscommoditySales/comprehensiveAnalysis/classificationRankings': ClassifySaleRanking,
  '/snalySiscommoditySales/comprehensiveAnalysis/goodsSaleSize': GoodsSaleSize,
  '/targetAnalysis/targetAnalysis/StoreTarget': StoreTarget,
  '/targetAnalysis/targetAnalysis/shopTargetAnalysis': ShopTargetAnalysis,
  '/snalySiscommoditySales/comprehensiveAnalysis/orderClerkCount': OrderClerkCount
};

export default UrlMap;
