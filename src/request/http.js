import axios from 'axios'
import store from '../store/index'
import route from '../router/index'
import qs from 'qs'

// axios 配置
// 响应时间
axios.defaults.timeout = 8000
// 接口地址
axios.defaults.baseURL = 'http://localhost:8088'
// 配置请求头
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
// post请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.post.Accept = 'application/json;'
// axios.defaults.headers.abc = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODY4NzI3MjYsInVzZXJuYW1lIjoiYWRtaW4ifQ.RbY79TmFAsecXkNKH-23Q_6Swfm15tXIV_znB9bFPxA'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// http request 拦截器
axios.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  config.headers['Access-Control-Allow-Origin'] = '*'
  if (window.localStorage.getItem('token') && store.state.token !== '') {
    if (window.localStorage.getItem('token') === store.state.token) {
      config.headers.Authorization = store.state.token
      config.headers.abc = 'abcedf'
    }
  }

  return config
}
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.log('-----------------------------')
    console.log(error.response)
    console.log('=============================')
    route.push('/login')
    if (error.response.data.code === 201) {
      return Promise.reject(error.response.data)
    } else {
      return Promise.reject(error.response)
    }
  }
)

/**
* get方法，对应get请求
*/
export function get (url, params) {
  return new Promise((resolve, reject) => {
    console.log('aaaaa', params)
    axios.get(url, { params: params })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
/**
 * post方法，对应post请求
 */
export function post (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(params))
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export default axios
