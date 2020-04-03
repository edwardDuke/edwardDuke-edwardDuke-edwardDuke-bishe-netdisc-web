module.exports = {
  lintOnSave: false
  // devServer: {
  //   disableHostCheck: true,
  //   host: '0.0.0.0',
  //   proxy: { //配置代理，解决跨域请求后台数据的问题
  //     '/api': {
  //       target: 'http://localhost:8080', //后台接口
  //       ws: true, //是否跨域
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': '/'
  //       }
  //     }
  //   }
  // }
}
