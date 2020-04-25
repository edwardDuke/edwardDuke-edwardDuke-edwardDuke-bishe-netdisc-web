module.exports = {
  // // 选项...
  publicPath: '/',

  // 是否开启eslint校验
  lintOnSave: false,

  devServer: {
    // open: true, // 是否自动弹出浏览器页面
    host: '0.0.0.0',
    port: '8080',
    disableHostCheck: true,
    // proxy: 'http://localhost:8088'
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        ws: true, // 代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: { // 重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/api': 'http://localhost:8088'
        }
      }
    }
  }

  // devServer: {
  //   disableHostCheck: true,
  //   host: '0.0.0.0',
  //   proxy: { // 配置代理，解决跨域请求后台数据的问题
  //     '/api': {
  //       target: 'http://localhost:8088', // 后台接口
  //       ws: true, // 是否跨域
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': '/'
  //       }
  //     }
  //   }
  // }
}
