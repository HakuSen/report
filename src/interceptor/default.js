import Vue from 'vue';
import { Message, MessageBox } from 'element-ui';
import { Http } from 'vue-simple';
import router from '../router';
import store from '../store';
import StatusCode from '../conf/response.code.conf';

export default [

  // 注册 response 拦截器范例
  {
    type: 'response',
    interceptor(response) {
      // console.warn('response.interceptor:', response);

      let transmit = true; // 是否需要向下继续传递 response
      const { data } = response;
      const code = parseInt(data.code, 10);

      // 有配置项目，且非 SUCCESS 则进行提示
      if (StatusCode.has(code) && code !== StatusCode.SUCCESS) {

        const msg = StatusCode.message[code] || '未知错误';

        // 提示信息
        if (code === StatusCode.NOSESSION) {
          // 取消token过期，未登录提示弹窗多次出现
          Vue.$api.cancel();
          MessageBox.alert(
            `${msg}`, '提示',
            { type: 'warning', dangerouslyUseHTMLString: true }
          ).then(() => {
          }).finally(() => {
            store.dispatch('tokenInfo/logout').then(() => {
              // let redirectUrl = location.href;
              // if (process.env.NODE_ENV === 'development') {
              //   router.replace({ path: '/login' });
              // }
              // else {
              //   location.href = `${process.env.NODE_TYPE}` + encodeURIComponent(redirectUrl);
              // }
              router.replace({ path: '/login' });
            });
            // 终止处理
            transmit = false;
          });
        }
        else {
          Message.error({ message: msg });
        }

        // 是否为需要全局阻断的业务请求
        // 常见于无法、或者无必要再进行后续操作
        if (StatusCode.blocked[code]) {
          transmit = false;
        }

      }
      else {
        // 若该 CODE 没有配置，则忽略直接向下传递
        // 必须返回原数据，否则正常请求之处无法取得该返回数据
        transmit = true;
      }

      // 向下传递
      if (transmit) {
        return response;
      }
    },
    error(error) {
      if (!/^cancel/i.test(error.toString())) {
        const errInfo = Http.errorInfo(error);
        MessageBox.alert(errInfo, '提示', { type: 'warning', showClose: false });

        // 若需要将此错误继续抛出给 $api.post().catch() 进行捕获，则将 error 进行 return
        // 此处可以返回任何数据给 catch() 进行捕获，若不显示 return，则错误处理和请求都在此处终止
        // $api.post() 将不需要再另行处理发生错误时的逻辑，此逻辑已经被封装到 vue-simple 的 API 模块中
        return error;
      }
    }
  }
];
