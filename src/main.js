import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入element Ui
import './plugins/element.js'
// 导入全局样式
import './assets/style/css/global.css'
// 导入字体图标
import './assets/style/iconfont/iconfont.css'
// 导入登录界面显示动态
import './plugins/particles.js'
// 导入自定义的axios
import { get, post } from './request/http.js'
// import http from './request/http.js'
import qs from 'qs'
// 导入iview
import './plugins/iview.js'

// Vue.prototype.$http = http
// Vue.prototype.$qs = qs
// 将自定义的axios设置为全局使用
Vue.prototype.$post = post
Vue.prototype.$get = get

Vue.config.productionTip = false

Vue.config.devtools = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
