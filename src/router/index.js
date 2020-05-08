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
import Userhome from '../components/Userhome.vue'
import Userindex from '../components/file/Userindex.vue'
import Usershare from '../components/share/Usershare.vue'

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
  // 管理员后台页面
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    meta: { requireAuth: true, title: '后台' },
    children: [
      {
        path: '/welcome',
        component: Welcome,
        meta: { title: '后台：欢迎页面' }
      },
      {
        path: '/user',
        component: User,
        meta: { title: '后台：用户管理' }
      },
      {
        path: '/roles',
        component: Roles,
        meta: { title: '后台：角色管理' }
      },
      {
        path: '/files',
        component: File,
        meta: { title: '后台：文件管理' }
      }
    ],
    // 验证当前用户是否可以访问后台
    beforeEnter: (to, from, next) => {
      store.dispatch('judgeUsers').then(res => {
        if (to.matched.some(m => m.meta.requireAuth)) {
          if (res) {
            next()
          } else {
            next(false)
          }
        }
      })
    }
  },
  // 用户界面
  {
    path: '/userhome',
    component: Userhome,
    meta: { requireAuth: true, title: '用户首页' },
    redirect: '/userindex',
    children: [
      {
        path: '/userindex',
        component: Userindex,
        meta: { title: '首页' }
      },
      {
        path: '/usershare',
        component: Usershare,
        meta: { title: '分享' }
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
  if (to.path === '/usertest') return next()
  if (to.path === '/usershare') return next()
  // // 如果直接访问login，通过
  if (to.path === '/login') return next()
  // 如果直接访问注册，通过
  if (to.path === '/registered') return next()
  // 其他则需要先判断，先获取token

  // const tokenStr = window.sessionStorage.getItem('token')
  // if (!tokenStr) return next('/login')
  // next()
  if (window.localStorage.getItem('token')) {
    const tokenStr = window.localStorage.getItem('token')
    store.commit('saveToken', tokenStr)
  }
  if (window.localStorage.getItem('userInfo')) {
    const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    store.commit('saveUserInfo', userInfo)
  }
  console.log('当前登录状态', store.state.isLogin)
  store.dispatch('getUserInfo').then(() => {
    console.log('检查登录状态成功后')
    if (to.matched.some(m => m.meta.requireAuth)) {
      console.log('获取登录状态', store.state.isLogin)
      if (!store.state.isLogin) { // 没有登录
        console.log('没有登录')
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        }) // 将to参数中的url传递给login页面进行操作
      } else {
        next()
      }
    }
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
      document.title = to.meta.title
    }
    // console.log('4444')
    // next()
  })
})
export default router
