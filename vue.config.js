const { defineConfig } = require('@vue/cli-service');
const path = require('path');

const resolve = dir => path.join(__dirname, dir);
const { name } = require('./package.json')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('examples')).set('virtual-cascader/packages', resolve('packages'));
    config.plugin('define').tap(args => {
      args[0]['process.env'].LIB_NAME = JSON.stringify(name);
      return args;
    })
  },
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    }
  },
  configureWebpack: config => {
    // entry: './packages/index.js',
    // output: {
    //   filename: 'vue-virtual-cascader.[name].js',
    //   library: 'VueVirtualCascader',
    //   libraryTarget: 'umd',
    // },
    // optimization: {
    //   splitChunks: {
    //     cacheGroups: {
    //       vendor: {
    //         test: /[\\/]node_modules[\\/]element-ui/,
    //         name: 'element',
    //         chunks: 'all',
    //       },
    //     },
    //   },
    // },
      if (config.mode === 'production') {
        config.externals = {
          'element-ui': {
            commonjs: 'element-ui',
            commonjs2: 'element-ui',
            amd: 'element-ui',
            root: '_',
          },
          'vue-virtual-scroller': {
            commonjs: 'vue-virtual-scroller',
            commonjs2: 'vue-virtual-scroller',
            amd: 'vue-virtual-scroller',
            root: '_',
          }
        }
      }
  },
})
