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
    <VirtualCascader v-model="value" :props="props" :options="options" size="mini" collapse-tags filterable clearable />
  </div>
</template>
<script>
import Cascader from 'vue-virtual-cascader/dist/vue-virtual-cascader.umd.min.js';
import 'vue-virtual-cascader/dist/vue-virtual-cascader.css';
const { VirtualCascader } = Cascader;

export default {
  components: {
    VirtualCascader
  },
}
</script>
```

### 新增功能

> 除了Element带的功能和属性外，为了更好的扩展，新增支持一些插槽：

| 名称 | 说明 |
| --- | --- |
| prefix | 输入框头部内容 |
| suffix | 输入框尾部内容 |
| default | 自定义备选项的节点内容，参数为 { node, data }，分别为当前节点的 Node 对象和数据 |


### 说明

> 由于是基于element，所以很多参数也是以element为主，okee为辅（样式以okee为主），所以参数请参考element文档，常用样式说明如下：

| Okee中名称 | ele中名称 | 说明 |
| --- | --- | --- |
| multiple | props -> multiple | ele中多选时props中的参数，不是直接绑定在组件上 |
| independent | props -> checkStrictly | ele中独立模式也是在props中，并且属性名有变化 |
