import Vue from 'vue'
import Vuex from 'vuex'
import storage from '@/utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user_token: null,
    username: null,
  },
  mutations: {
    setUserToken(state, token) {
      state.user_token = token;
      storage.local.set('user_token', token);
    },
    setUserName(state, username) {
      state.username = username;
      storage.local.set('username', username);
    },
  },
  actions: {},
  modules: {},
  getters: {
    userToken(state) {
      let token = state.user_token;
      if (!token) {
        token = storage.local.get('user_token');
      }
      return token;
    },
    userName(state) {
      let username = state.username;
      if (!username) {
        username = storage.local.get('username');
      }
      return username;
    },
  }
})
