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
import http from 'axios'
import qs from 'qs'
import './plugins/vant.js'
import 'vant/lib/index.css'
// 导入iview
import './plugins/iview.js'
// 导入第三方上传组件
import './plugins/vue-simple-upload.js'
// 导入hash
import uploadFile from './request/uploadFile.js'
Vue.prototype.uploadFile = uploadFile
Vue.prototype.$http = http
// Vue.prototype.$qs = qs
// 将自定义的axios设置为全局使用
Vue.prototype.$post = post
Vue.prototype.$get = get
// 注册一个全局事件发送
Vue.prototype.$BUS = new Vue()

Vue.config.productionTip = false

Vue.config.devtools = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
