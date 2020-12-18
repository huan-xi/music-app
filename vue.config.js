module.exports = {
  outputDir: '../dist',
  configureWebpack: {
    resolve: {
      alias: {}
    }
  },
  devServer: {
    disableHostCheck: true,
    proxy:{
      '/':{
        target: 'http://localhost:8008',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};

