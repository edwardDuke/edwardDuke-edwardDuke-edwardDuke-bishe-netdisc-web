import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/Index.vue'
import Login from '../components/Login.vue'
import Registered from '../components/Registered.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Roles from '../components/authority/Roles.vue'
import File from '../components/filemanage/File.vue'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  // 重定向
  { path: '/', redirect: '/index' },
  {
    path: '/index',
    component: Index,
    redirect: '/login',
    children: [
      { path: '/login', component: Login, meta: { title: '登录' } },
      { path: '/registered', component: Registered, meta: { title: '登录' } }
    ]
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    meta: { requireAuth: true, title: '后台' },
    children: [
      {
        path: '/welcome',
        component: Welcome,
        meta: { title: '欢迎页面' }
      },
      {
        path: '/user',
        component: User
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/files',
        component: File
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
  // if (to.path === '/index') return next()
  // // 如果直接访问login，通过
  // if (to.path === '/login') return next()
  // // 如果直接访问login，通过
  // if (to.path === '/registered') return next()
  // 其他则需要先判断，先获取token

  // const tokenStr = window.sessionStorage.getItem('token')
  // if (!tokenStr) return next('/login')
  // next()
  const tokenStr = window.localStorage.getItem('token')
  // console.log(window.localStorage.getItem('token'))
  if (window.localStorage.getItem('token')) {
    store.commit('saveToken', tokenStr)
  }
  console.log(!store.state.isLogin)
  store.dispatch('getUserInfo').then(() => {
    console.log('1111')
    console.log(to.matched)
    if (to.matched.some(m => m.meta.requireAuth)) {
      console.log('2222')
      if (!store.state.isLogin) { // 没有登录
        console.log('3333')
        next({
          path: '/',
          query: { redirect: to.fullPath }
        }) // 将to参数中的url传递给login页面进行操作
      }
    }
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next()
  })
})
export default router
