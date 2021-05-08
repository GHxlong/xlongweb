const WorkboxPlugin = require("workbox-webpack-plugin");

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  outputDir: 'music',
  configureWebpack: {
    devtool: isProd ? false: 'source-map',
    devServer: {
      open: true,
      proxy: {
        '/netease-api': {
          target: '39.103.187.204:3000',
          pathRewrite: { '^/netease-api': '' },
          changeOrigin: true,
          secure: false,
        },
        '/api' : {
            target: 'http://39.103.187.204:3000',
            pathRewrite: { '^/api': '/api' },
            changeOrigin: true
        }
      },
      port: 8888,
    },
    externals: isProd ? {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
    }: {},
    plugins: [
      new WorkboxPlugin.GenerateSW()
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "~@/style/variables.scss";
          @import "~@/style/mixin.scss";
        `,
      },
    },
  },
}
