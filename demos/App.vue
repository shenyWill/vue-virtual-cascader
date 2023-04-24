<template>
  <div id="app">
    <VirtualCascader v-model="value" :props="props" separator=" | " :options="options" size="small" collapse-tags filterable clearable style="width: 300px">
    <template #prefix>
      <span style="color: red">sss</span>
    </template>
    <template #suffix>
      <span style="color: green" @click.stop="test">ddddddd</span>
    </template>
    <!-- <template #input>
      <div>{{ 111 }}</div>
    </template> -->
    <template #empty>
      <div>{{ 111 }}</div>
    </template>
    <template #default="{ node }">
      <div>{{ node.data }}</div>
    </template>
    </VirtualCascader>
  </div>
</template>

<script>
import Mock from 'mockjs'
import Cascader from './../dist/vue-virtual-cascader.umd.min.js';
import './../dist/vue-virtual-cascader.css';
// import Cascader from 'virtual-cascader/packages';
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
        label: '张三张三张三张三张三张三张三张三张三张三张三张三张三',
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
        checkStrictly: false,
      },
    }
  },
  methods: {
    test() {
      console.log(123)
    }
  }
}
</script>

<style lang="less">
#app {
  display: grid;
  place-items: flex-start;
  margin: 60px;
}
</style>

