const WorkboxPlugin = require("workbox-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  outputDir: 'dist',
  configureWebpack: {
    devtool: isProd ? false: 'source-map',
    devServer: {
      open: true,
      proxy: {
        '/api' : {
            target: 'https://localhost:4000',
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
      new WorkboxPlugin.GenerateSW(),
      new CopyWebpackPlugin([
        { from: path.join(__dirname, "static"), to: "static" }
      ]),
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
