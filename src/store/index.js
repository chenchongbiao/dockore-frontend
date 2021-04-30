import Vue from 'vue'
import Vuex from 'vuex'
import storage from '@/utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user_token: '',
    user_info: {},
  },
  mutations: {
    setUserToken(state, token) {
      state.user_token = token;
      storage.local.set('user_token', token);
    },
    setUserInfo(state, user_info) {
      state.user_info = user_info;
      storage.local.set('user_info', user_info);
    },
    logout(state) {
      state.user_token = '';
      state.user_info = {};
      storage.local.remove('user_token');
      storage.local.remove('user_info');
    },
  },
  actions: {},
  modules: {},
  getters: {
    userToken(state) {
      let token = state.user_token;
      if (!token)
        token = storage.local.get('user_token');

      return token;
    },
    userInfo(state) {
      let user_token = state.user_token;
      if (!user_token)
        user_token = storage.local.get('user_token');

      return state.user_info;
    },
  }
})
