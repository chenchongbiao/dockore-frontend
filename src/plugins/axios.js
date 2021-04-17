"use strict";

import Vue from 'vue';
import axios from "axios";
import storage from '@/utils/storage'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      let token = storage.local.get('user_token')
      if (token)
        config.headers.Token = token;
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
);

// Add a response interceptor
_axios.interceptors.response.use(
    function (response) {
      // Do something with response data
      console.log('Resp:', response.data);

      if (response.config.method !== 'get' || response.data.code !== 0) {
        let vue = new Vue();
        let success = response.data.code === 0;
        let title = vue.$api.$name[vue.$api.$key[response.config.url]];
        if (!title)
          title = success ? '操作成功' : '操作失败';
        vue.$notify({
          title: title,
          message: response.data.msg,
          type: success ? 'success' : 'error',
          offset: 64,
        })
      }

      return response.data;
    },
    function (error) {
      // Do something with response error
      console.log('Error:', error);

      let vue = new Vue();
      let title = vue.$api.$name[vue.$api.$key[error.config.url]];
      if (!title)
        title = '网络错误'
      vue.$notify({title: title, message: error, type: "error", offset: 64});

      return {code: -1, msg: error};
    }
);

Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
