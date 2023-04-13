<p>
  <h2 align="center">vue-virtual-cascader</h3>
  <p align="center">
    <a href="https://www.npmjs.com/package/vue-virtual-cascader">
      <img src="https://img.shields.io/npm/dt/vue-virtual-cascader">
    </a>
    <a href="https://www.npmjs.com/package/vue-virtual-cascader">
      <img src="https://img.shields.io/npm/v/vue-virtual-cascader?maxAge=2592000">
    </a>

  </p>
</p>

### 介绍

> 基于`element-ui`和`vue-virtual-scroller`实现的支持虚拟滚动的级联选择器(vue2)，主体样式和功能对齐OKee，支持大数据渲染场景，增加支持全选功能。


### install

```shell
npm i vue-virtual-cascader --save
# or
yarn add vue-virtual-cascader
```


### 全局使用

``` javascript
import vueVirtualCascader from 'vue-virtual-cascader';
import 'vue-virtual-cascader/dist/vue-virtual-cascader.css';

Vue.use(vueVirtualCascader);
```

### 局部使用

```html
<template>
  <div id="app">
    <VirtualCascader v-model="value" :props="props" :options="options" size="mini" collapse-tags filterable clearable style="width: 400px" />
  </div>
</template>
<script>
import Cascader from 'vue-virtual-cascader/dist/vue-virtual-cascader.umd.min.js';
import 'vue-virtual-cascader/dist/vue-virtual-cascader.css';
import Cascader from 'virtual-cascader/packages';
const { VirtualCascader } = Cascader;

export default {
  components: {
    VirtualCascader
  },
}
</script>
```