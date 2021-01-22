import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import api from '@/utils/api'
import storage from '@/utils/storage'

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue();
Vue.prototype.$api = api
Vue.prototype.$storage = storage

new Vue({
  router,
  store,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')
