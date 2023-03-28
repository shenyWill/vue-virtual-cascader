<template>
  <div id="app">
    <VirtualCascader v-model="value" :props="props" :options="options" size="small" collapse-tags filterable clearable style="width: 400px" />
    <!-- <VirtualCascader v-model="value" :props="props" :options="options" size="small" collapse-tags filterable clearable style="width: 400px" />
    <VirtualCascader v-model="value" :props="props" :options="options" size="small" collapse-tags filterable clearable style="width: 400px" />
    <VirtualCascader v-model="value" :props="props" :options="options" size="small" collapse-tags filterable clearable style="width: 400px" />
    <VirtualCascader v-model="value" :props="props" :options="options" size="small" collapse-tags filterable clearable style="width: 400px" />
    <VirtualCascader v-model="value" :props="props" :options="options" size="small" collapse-tags filterable clearable style="width: 400px" />
    <VirtualCascader v-model="value" :props="props" :options="options" size="small" collapse-tags filterable clearable style="width: 400px" />
    <VirtualCascader v-model="value" :props="props" :options="options" size="small" collapse-tags filterable clearable style="width: 400px" />
    <VirtualCascader v-model="value" :props="props" :options="options" size="small" collapse-tags filterable clearable style="width: 400px" />
    <VirtualCascader v-model="value" :props="props" :options="options" size="small" collapse-tags filterable clearable style="width: 400px" /> -->
  </div>
</template>

<script>
import Mock from 'mockjs'
// import Cascader from './../dist/vue-virtual-cascader.umd.js';
// import './../dist/vue-virtual-cascader.css';
import Cascader from 'virtual-cascader/packages';
// console.log(Cascader);
const { VirtualCascader } = Cascader;


export default {
  name: 'APP',
  components: {
    VirtualCascader
  },
  data () {
    const _mock = Mock.mock({
      'array|2000': [
        {
          label: '@csentence(6)',
          value: '@string()',
          'children|2': [
            {
              label: '@csentence(6)',
              value: '@string()',
              'children|2': [
                {
                  label: '@csentence(6)',
                  value: '@string()'
                }
              ]
            }
          ]
        }
      ]
    })
    return {
      value: [],
      options: _mock.array,
      props: {
        checkAll: true,
        multiple: true,
        selectWithExpand: false,
        panelSearch: true,
        panelLabels: []
      },
    }
  },
}
</script>

<style lang="less">
@import url('./../dist/vue-virtual-cascader.css');
#app {
  display: grid;
  place-items: flex-start;
  margin: 60px;
}
</style>

