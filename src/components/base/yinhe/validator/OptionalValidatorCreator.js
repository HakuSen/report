/*
 --------------------------------------------------
 对齐方式验证器
 取值：left、center、right
 ----------------------------------------------------
 */

/**
 * 生成指定取值范围的验证器函数
 * @param {[String|Number]} options 可选的值数组
 * @returns {Function} 验证器函数
 */
export default function(options) {
  let r = '^(' + options.join('|') + ')$';
  let o = 'i';
  const reg = new RegExp(r, o);

  return value => reg.test(value);
}
