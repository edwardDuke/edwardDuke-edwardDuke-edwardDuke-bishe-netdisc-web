import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  // 存放状态信息
  state: {
    // 初始时候给一个 isLogin = false 表示用户未登录
    isLogin: false,
    username: '',
    userId: 0,
    userInfoObj: {},
    token: ''
  },
  mutations: {
    changeLogin (state, data) {
      state.isLogin = data
    },
    saveToken (state, data) {
      state.token = data
    }
  },
  getters: {
  },
  actions: {
    // 检查用户登录状态
    getUserInfo (context) {
      return axios.get('').then(res => {
        if (context.state.token === 'admin' || context.state.token === 'user') {
          context.commit('changeLogin', true)
        } else {
          setTimeout(() => {
            context.commit('changeLogin', false)
          }, 1000)
        }
      })
    },
    // 判断用户是否为管理员用户
    judgeUsers (context) {
      return axios.get('').then(res => {
        if (context.state.token === 'admin') {
          return true
        } else {
          return false
        }
      })
    }
  },
  modules: {
  }
})
