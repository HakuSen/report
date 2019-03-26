// --------------------------------------------------
// API 请求响应的对应 CODE 编号列表
// --------------------------------------------------

const StatusCode = {
  // 请求成功
  SUCCESS: 10000,

  // 只有查看权限，无写权限
  ONLY_READ: 20001,

  // 无权限进行此操作，请联系管理员
  UNAUTHORIZED: 20002,

  // 缺少必选参数
  PARAM_REQUIRED: 40001,

  // 传入参数不合法
  PARAM_INVALID: 40002,

  // 未登录，请先登录
  NOSESSION: 40003,

  // 业务处理失败，请检查请求参数（比如服务端顾及到数据关联等，拒绝操作）
  // FORBIDDEN: 40004,

  // 服务器忙，请稍后再次尝试，或者跟管理员联系
  BUSINESS: 40005,

  // 请求的资源不存在
  // NORESOURCE: 40010,

  // 用户名错误
  // USER_WRONG: 41001,

  // 密码错误
  // PASSWORD_WRONG: 41002,

  // 帐号未激活，请联系管理员
  USER_NOT_ACTIVED: 41003

};

// 检测 CODE 是否存在
StatusCode.has = code => Object.values(StatusCode).some(item => item === code);

// 阻断列表
// 当请求发生错误或者问题时是否全局阻断不再将错误下放到业务层
// 请注意，请求一般由业务层发起，而大部分业务层都需要进行错误反馈，因此只需要将重大错误进行全局阻断即可
StatusCode.blocked = {
  [StatusCode.UNAUTHORIZED]: true,
  [StatusCode.NOSESSION]: true,
  [StatusCode.USER_NOT_ACTIVED]: true
};

// 提示信息详情
StatusCode.message = {
  [StatusCode.SUCCESS]: '请求成功',
  [StatusCode.ONLY_READ]: '只有查看权限，无写权限',
  [StatusCode.UNAUTHORIZED]: '无权限进行此操作，请联系管理员',

  [StatusCode.PARAM_REQUIRED]: '缺少必选参数',
  [StatusCode.PARAM_INVALID]: '传入参数不合法',

  [StatusCode.NOSESSION]: '未登录或登录超时，请重新登录',
  // [StatusCode.FORBIDDEN]: '业务处理失败，请检查请求参数',
  [StatusCode.BUSINESS]: '服务器忙，请稍后再次尝试，或者跟管理员联系',
  // [StatusCode.NORESOURCE]: '请求的资源不存在',

  // [StatusCode.USER_WRONG]: '用户名错误',
  // [StatusCode.PASSWORD_WRONG]: '密码错误',
  [StatusCode.USER_NOT_ACTIVED]: '帐号未激活，请联系管理员'
};

// 检测是否需要阻断
// if(StatusCode.blocked[StatusCode.UNAUTHORIZED]){}

// 获取请求码相应提示信息
// StatusCode.message[StatusCode.UNAUTHORIZED]

export default StatusCode;

