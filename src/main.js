import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'

import moment from "moment"
import fileSize from "filesize"
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueSocketIO from "vue-socket.io";

import api from '@/utils/api'
import storage from '@/utils/storage'
import text from '@/utils/text'
import event from "@/utils/event";
import debounce from "@/utils/debounce";

Vue.use(ElementUI)
Vue.use(new VueSocketIO({
  debug: process.env.NODE_ENV === 'development',
  connection: `${process.env.VUE_APP_BASE_URL}/terminal`,
  options: {
    autoConnect: false,
  }
}))

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()
Vue.prototype.$api = api
Vue.prototype.$storage = storage
Vue.prototype.$text = text
Vue.prototype.$event = event
Vue.prototype.$moment = moment
Vue.prototype.$filesize = fileSize
Vue.prototype.$debounce = debounce

moment.locale('zh-cn')

new Vue({
  router,
  store,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')
