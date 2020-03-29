import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'

Vue.use(VueRouter)

const routes = [
  // 重定向
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/user',
        component: User
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航拦截

router.beforeEach((to, from, next) => {
// to将要访问的路径，from代表从哪个路径跳转而来，next是一个函数，表示放行
// 如果直接访问login，通过
  if (to.path === '/login') return next()
  // 其他则需要先判断，先获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
