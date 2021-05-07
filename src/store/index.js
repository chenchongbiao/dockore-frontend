import Vue from 'vue'
import Vuex from 'vuex'
import storage from '@/utils/storage'
import constant from '@/utils/constant'

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
      let user_info = state.user_info;
      if (!user_info)
        user_info = storage.local.get('user_info');

      return user_info;
    },
    isAdmin(state, getters) {
      let user_info = getters.userInfo;
      if (user_info && user_info.role_type !== undefined)
        return user_info.role_type === constant.role.TYPE_ADMIN;
      return false;
    },
  }
})
