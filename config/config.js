const prodEnv = require('./prod.env');
var fs = require('fs');

const variable = process.argv[2];

console.log(variable, typeof variable, 'variable')
switch(variable) {
  case '15':
    prodEnv.NODE_TYPE = '"//login.blibao.com/#/?source=report&redirectUrl="';
    break;
  case 'test':
    prodEnv.NODE_TYPE = '"//test.blibao.com:10080/login/#/?source=report&redirectUrl="';
    break;
  case 'pre':
    prodEnv.NODE_TYPE = '"//pre.test.web.blibao.com:10080/login/#/?source=report&redirectUrl="';
    break;
  case 'web':
    prodEnv.NODE_TYPE = '"//web.blibao.com/login/#/?source=report&redirectUrl="';
    break;
}

let t = `'use strict'

module.exports = {
  NODE_ENV: '"production"',
  LOGIN_PATH: '"//login.blibao.com/#/"',
  NODE_TYPE: '${prodEnv.NODE_TYPE}'
}`

fs.writeFileSync('./config/prod.env.js', t, function(err) {
  if (err) {
    consol.log(err)
  } else {
    console.log('写文件操作成功');
  }
})
