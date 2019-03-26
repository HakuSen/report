/**
 * 合成后的所有 API 集合
 */
const ApiConf = {
  user: {
    // getway 网关子系统名称
    $getway: 'v2/user-system',

    // --------------------------------------------------
    // 菜单相关
    // --------------------------------------------------
    menuAll: '/menu/all', // get
    menuLoadMenusByUser: '/menu/loadMenusByUser', // post
    // --------------------------------------------------
    // 登录接口
    // --------------------------------------------------
    login: '/login/login', // post
    oldLogin: '/login/loginForOldBus', // 老版登录
    getShop: '/shopinfo/findOne', // post
    changeAcount: '/login/updateRepeatUsername', // POST  修改帐号
    getImgCode: '/comm/getImageCode', // get 获得图片验证码
    createImg: '/comm/getImageCode', // get 获得图片验证码
    checkImgCode: '/comm/checkImageCode', // post 验证图片验证码
    checkPhoneNum: '/login/findPhoneForLogin', // post 验证手机号是否存在
    getPhoneCode: '/comm/sendMsgCode', // post 获取手机验证码
    checkCode: '/comm/checkMsgCode', // post 验证短信验证码
    phoneLoginInfo: '/login/loginByPhone', // post
    // 生成二维码
    createQr: '/login/createQrCode', // get
    // 轮询发送请求
    findConnect: '/login/findConnection', // post
    // app扫码保存信息
    appSao: '/login/appSaoma', // post
    //  扫码成功确认
    confirm: '/login/LoginByApprove', // post
    // 保存员工信息
    saveInfo: '/employee/updateShopperEmployeeBySysUserId', // post
    // --------------------------------------------------
    // 用户信息
    // --------------------------------------------------
    getUserByToken: '/sysuser/findUserByToken', // get
    // --------------------------------------------------
    // 注册相关
    // --------------------------------------------------
    acountRegister: '/sysuser/findUsername', // post
    phoneRegister: '/sysuser/findPhone', // post
    fastRegister: '/login/saveFastregister', // post
    // 找回密码
    findPass: '/sysuser/getBackPassword', // POST
    // 手机号和帐号
    checkUserAndPhone: '/login/checkUsernameAndPhone',
    // 设置密码
    editPass: '/sysuser/updateUserPasswordByUsername', // post
    // 认证手机号
    approvePhone: '/sysuser/updateApproveByPhone', // post
    // 修改密码
    changePass: '/sysuser/updateUserPasswordByPhone', // post
    // 修改手机号
    changeNum: '/sysuser/updateUserPhone' // post
  },
  shop: {
    // getway 网关子系统名称
    $getway: 'v2/shopper-system'
  },
  goods: {
    // getway 网关子系统名称
    $getway: 'goods'
  },
  task: {
    // getway 网关子系统名称
    $getway: 'task',
    // 数据修复
    doCustomJobs: '/customJob/doCustomJobs', // 修复
    findCustomJob: '/customJob/findCustomJob' // 刷新
  },
  config: {
    $getway: 'v2/config-system',

    // 下载清单
    downloadList: '/reportExportList', // 获取所以下载列表
    deleteList: '/deleteReportExport' // 删除下载列表
  },
  report: {
    // getway 网关子系统名称
    $getway: 'report',

    // --------------------------------------------------
    // 报表相关接口
    // --------------------------------------------------
    getUserInfo: '/user/getMenu.htm',
    getIncomeLedgerList: '/incomeStatistics/findIncomeStatistics',
    getAccountList: '/dueMoneyStatistics/findDueMoneyStatistics', // 挂账统计
    getStoreIncomeList: '/incomeStatistics/findShopIncomeStatistics', // 款项统计(按门店)
    getSettlementList: '/shopSettlementStatisticsController/findShopSettlementStatistics', // 结算日报
    getShopTimeIncomeList: '/incomeStatistics/findShopTimeslotIncomeStatistics', // 查询门店收入统计按时间段汇总
    getIncludeLedgerList: '/incomeLedgerStatistics/findLedgerIncomeStatistics', // 收入总账
    getTakeoutStatisticsList: '/takeOutFoodStatistics/findTakeOutFoodStatistics', // 外卖统计
    getRevenueList: '/revenueStatistics/findRevenueStatistics', // 消费统计(按时间)
    getRevenueShopList: '/revenueStatistics/findShopRevenueStatistics', // 消费统计(按门店)
    getRevenueTimeList: '/revenueStatistics/findShopTimeslotRevenueStatistics', // 门店时间段营收统计
    getBusinessPoolList: '/businessStatistics/findBusinessStatistics', // 营业汇总(按时间)
    getStoreBusinessList: '/businessStatistics/findShopBusinessStatistics', // 营业汇总(按门店)
    getStoreBusinessTimeList: '/businessStatistics/findShopTimeslotBusinessStatistics', // 门店时间营业汇总
    getPreferentCountList: '/discountStatistics/findDiscountStatistics', // 优惠统计报表
    getStorePreferentList: '/discountStatistics/findShopDiscountStatistics', // 门店优惠统计报表
    getStoreTimePreferentList: '/discountStatistics/findShopTimeslotDiscountStatistics', // 门店时间段优惠统计报表
    getRefundCountList: '/refundStatistics/findRefundStatistics', // 退款
    getStoreRefundCountList: '/refundStatistics/findShopRefundStatistics', // 门店退款统计报表
    getStoreTimeRefundList: '/refundStatistics/findShopTimeslotRefundStatistics', // 退款时间段退款统计报表
    getGoodsSalesAnalysisList: '/itemSaleStatistics/findItemSaleStatistics', // 商品销售对比分析
    getGoodsShopAnalysisList: '/itemSaleStatistics/findShopItemSaleStatistics', // 门店商品销售对比分析
    getGoodsAnalyzeList: '/itemPropStatistics/findItemPropStatistics', // 商品属性分析
    getColligateAnalysisList: '/itemGoodsSaleAnalysisSummary/findItemGoodsSaleAnalysisSummary', // 商品综合分析
    getColligateAnalysisTotleList: '/itemGoodsSaleAnalysisSummary/findItemGoodsSaleAnalysisSummaryExtraChargeDetail', // 商品综合分析附加费
    getGoodsStoreAnalyzeList: '/itemPropStatistics/findShopItemPropStatistics', // 商品属性门店分析
    getGoodsSaleSizeAnalyzeList: '/goodsSpecStatisticsController/findGoodsSpecStatistics', // 商品规格分析
    getGoodsSaleRankingList: '/itemSaleRankStatistics/findItemSaleRankStatistics', // 商品销售排行
    getGoodsSaleRankingTotleList: '/itemSaleRankStatistics/findItemSaleRankExtraChargeDetailStatistics', // 商品销售排行 附加费
    classifySaleRankingList: '/itemSaleCategoryRankStatistics/findItemSaleCategoryRankStatistics', // 分类销售排行
    timeIndexAnalysisList: '/timeslotIndexAnalysis/findTimeslotIndexAnalysis', // 时段指标分析
    timeComparatAnalysisList: '/timeslotCompareAnalysis/findTimeslotCompareAnalysis', // 时段对比分析
    findStoreItemGoodsStatisticsList: '/storeItemGoodsStatistics/findStoreItemGoodsStatistics', // 门店商品统计
    findStoreBusinessDailyReportList: '/storeBusinessDailyReport/findStoreBusinessDailyReport', // 门店营业日报
    chartStatisticsList: '/chartStatisticsController/findChartStatistics', // 获取图表数据接口
    findMemberCardPryList: '/memberStatistics/findMemberCardPryPayAndConsumeStatistics', // 会员卡统计服务
    findMemberCardShopPayList: '/memberStatistics/findMemberCardPryPayAndConsumeOnDateStatistics', // 会员卡统计服务 门店
    findMemberCardTotalStatistics: '/memberStatistics/findMemberCardTotalStatistics', // 主账户商户总余额，消费总额，充值总额
    findShopVoucher: '/shopVoucherStatisticsController/findShopVoucherStatistics', // 实体券报表
    scavenginEexportList: '/exportBillByScavengingPayModel/findExportBillByScavengingPayModel', // 扫呗对账导出
    getStoreTurnoverList: '/businessCustomPay/findStoreBusinessCustomPay', // 营业额日报
    getShopReceiptsList: '/ShopTotalPricesStatisticsController/findShopTotalPricesStatistics', // 实收日报
    getretailCabinetList: '/accountStatistics/findAccountStatistics', // 智能零售柜统计报表
    getmanagementLedgerList: '/operationState/findOperationState', // 经营状况
    getBusinessDailyList: '/dailyBusiness/findStoresDailyBusinessReportV2', // '/dailyBusiness/findStoresDailyBusinessReport' // 综合日报
    getelectronicList: '/ShopAlipayTradeRecordStatisticsController/findAlipayTradeRecordStatistics', // 电子交易对账
    getrefundVegetablesList: '/refundMenuStatistics/findRefundMenuStatistics', // 电子交易对账
    electronicDetailList: '/ShopAlipayTradeRecordStatisticsController/findOrderStatistics', // 电子交易查询详情接口
    getShopStoreList: '/customReports/findStoreScoreCheckStatistics', // 门店分数对账表
    getKdsStatisticsList: '/kdsStatistics/findKdsStatistics', // KDS统计
    getMembershipSynthesisList: '/memberStatistics/findMemberPryPayAndConsumeStatistics', // 会员综合统计
    getRecordListStatistics: '/memberStatistics/findLogoutRecordListStatistics', // 注销记录
    getConsumeListStatistics: '/memberStatistics/findMemberConsumeListStatistics', // 消费统计
    getPryPayRecordListStatistics: '/memberStatistics/findMemberPryPayRecordListStatistics', // 充值记录
    getPreferentialDetailsList: '/OrderItemPromotionsStatisticsController/queryOrderItemPromotionsStatistics', // 优惠明细日报
    getStoreTargetList: '/storeIndexStatistics/findStoreIndexStatistics', // 门店指标统计
    getShopTargetAnalysisList: '/indexAnalysis/findIndexAnalysis', // 门店指标分析
    getOrderClerkCountList: '' // 点菜员销售统计
  }
};

// 调用范例
// post({ getway: ApiConf.user.$getway, api: ApiConf.user.login }, {username:'', password:''});

export default ApiConf;

