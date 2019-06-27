import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// 数据
const state = {
  isAuthorization: false, // 是否授权
  user: {}, // 用户信息
}
// 获取数据
const getters = {
  isAuthorization: state => state.isAuthorization,
  user: state => state.user
}
// 更改数据
const mutations = {
  setAuthorization: (state, newAuthorization) => {
    state.isAuthorization = newAuthorization;
  },
  setUser: (state, newUser) => {
    state.user = newUser;
  }
}
// 异步更改数据
const actions = {
  setAuthorization: ({commit}, newAuthorization) => {
    commit('setAuthorization', newAuthorization);
  },
  setUser: ({commit}, newUser) => {
    commit('setUser', newUser);
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
