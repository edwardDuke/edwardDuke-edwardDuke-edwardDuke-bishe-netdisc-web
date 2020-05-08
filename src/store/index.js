import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../request/http.js'
import { get } from '../request/http.js'

Vue.use(Vuex)

export default new Vuex.Store({
  // 存放状态信息
  state: {
    // 初始时候给一个 isLogin = false 表示用户未登录
    isLogin: false,
    username: '',
    userId: 0,
    userInfoObj: {},
    token: '',
    // 存放全局上传数据
    uploadInfo: {}
  },
  mutations: {
    changeLogin (state, data) {
      state.isLogin = data
    },
    saveToken (state, data) {
      state.token = data
    },
    saveUserInfo (state, data) {
      if (data.name === '' || data.name == null) {
        state.username = data.account
      } else {
        state.username = data.name
      }
      state.userId = data.id
      state.userInfoObj = data
    },
    // 存储全局上传数据
    saveUploadInfo (state, data) {
      state.uploadInfo = data
    }
  },
  getters: {
  },
  actions: {
    // 检查用户登录状态
    getUserInfo (context) {
      console.log('进入store中检查用户登录状态')
      // this.$http.get()
      return get('/user/article').then(res => {
        console.log('检查用户登录状态', res)
        if (res.code === 200) {
          console.log('登录状态')
          context.commit('changeLogin', true)
        } else {
          console.log('未登录')
          context.commit('changeLogin', false)
        }
      })
        .catch((err) => {
          console.log('检查用户登录状态异常', err) // 错误信息
        })
    },
    // 判断用户是否为管理员用户
    judgeUsers (context) {
      return get('/user/roletype').then(res => {
        console.log('判断用户是否为管理员用户', res)
        if (res.code === 200) {
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
