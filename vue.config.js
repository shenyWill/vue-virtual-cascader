const { defineConfig } = require('@vue/cli-service');
const path = require('path');

const resolve = dir => path.join(__dirname, dir);
const { name } = require('./package.json')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  publicPath: './',
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('demos')).set('virtual-cascader/packages', resolve('packages'));
    config.plugin('define').tap(args => {
      args[0]['process.env'].LIB_NAME = JSON.stringify(name);
      return args;
    })
  },
  pages: {
    index: {
      entry: 'demos/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    }
  },
  configureWebpack: config => {
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
