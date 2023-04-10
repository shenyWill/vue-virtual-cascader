<template>
  <div id="app">
    <VirtualCascader v-model="value" :props="props" :options="options" size="mini" collapse-tags filterable clearable style="width: 400px" />
  </div>
</template>

<script>
import Mock from 'mockjs'
// import Cascader from './../dist/vue-virtual-cascader.umd.min.js';
// import './../dist/vue-virtual-cascader.css';
import Cascader from 'virtual-cascader/packages';
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
      value: [['zhangsan', 'lisi', 'wangwu']],
      // value: ['zhangsan', 'lisi', 'wangwu'],
      options: [..._mock.array, {
        label: '张三',
        value: 'zhangsan',
        children: [
          {
            label: 'lisi',
            value: 'lisi',
            children: [
              {
                label: 'wangwu',
                value: 'wangwu',
              },
              {
                label: '马六',
                value: 'maliu'
              }
            ]
          }
        ]
      }],
      props: {
        checkAll: true,
        multiple: true,
        selectWithExpand: true,
        checkStrictly: false,
      },
    }
  },
}
</script>

<style lang="less">
#app {
  display: grid;
  place-items: flex-start;
  margin: 60px;
}
</style>

