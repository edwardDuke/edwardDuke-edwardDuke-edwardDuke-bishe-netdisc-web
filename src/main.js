import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式
import './assets/style/css/global.css'
// 导入字体图标
import './assets/style/iconfont/iconfont.css'
// 导入axios
import axios from 'axios'
axios.defaults.baseURL = 'localhost:8080'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
