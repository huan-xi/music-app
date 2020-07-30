let target = process.env.target ? process.env.target : 'http://music.vaiwan.com/';

console.log("当前代理地址:" + target);

// 修改以后必须要重启
let proxy = mockApis([
  {
    target: "http://test.tb.xqcrm.com:3000/mock/19",  // mock 地址，19表示项目
    apis: [ // 需要使用mock数据的api
      // "/comment/bad_manege/info",
      // "/index/sms/count"
    ]
  },
]);

proxy["/api"] = {
  target: target, //开发环境

  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/api': '/'
  }
};

module.exports = {
  outputDir: '../dist',
  configureWebpack: {
    resolve: {
      alias: {}
    }
  },
  devServer: {
    disableHostCheck: true,
    proxy,
  }
};

function mockApis(array) {
  let proxy = {};
  array.forEach(obj => {
    if (obj.apis.length > 0) {
      obj.apis.forEach(api => {
        proxy["/api" + api] = {
          target: obj.target,
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      })
    }
  });
  return proxy;
}
