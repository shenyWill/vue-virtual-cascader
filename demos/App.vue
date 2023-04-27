<template>
  <div id="app">
    <div>{{ value }}</div>
    <VirtualCascader v-model="value" :props="props" separator=" | " :options="options" collapse-tags filterable clearable style="width: 300px">
    <!-- <template #prefix>
      <span style="color: red">sss</span>
    </template>
    <template #suffix>
      <span style="color: green" @click.stop="test">ddddddd</span>
    </template>
    <template #input>
      <div>{{ 111 }}</div>
    </template>
    <template #empty>
      <div>{{ 111 }}</div>
    </template>
    <template #default>
      <div>大萨达撒旦撒打算大萨达稍等奥德赛啊奥迪阿萨德阿萨德</div>
    </template> -->
    </VirtualCascader>
  </div>
</template>

<script>
import Mock from 'mockjs'
// import Cascader from './../dist/vue-virtual-cascader.umd.min.js';
// import './../dist/vue-virtual-cascader.css';
import Cascader from 'virtual-cascader/packages';
const { VirtualCascader } = Cascader;
// import { getRender } from './const.jsx';

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
      // value: [['zhangsan', 'lisi', 'wangwu']],
      value: ['zhangsan', 'lisi', 'wangwu'],
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
        // multiple: true,
        checkStrictly: false,
      },
    }
  },
  methods: {
    test() {
      console.log(123)
    }
  },
  /* eslint-disable */
  render(h) {
    // return getRender(h, this.props, this.options);
    // return (
    //   <VirtualCascader value={this.value} props={this.props} options={this.options} collapse-tags filterable clearable style="width: 300px"></VirtualCascader>
    // );
    const slotContent = h('div', { slot: 'prefix' }, '123edc');
    return <div>
      {h(
      VirtualCascader,
      {
        props: {
          props: this.props,
          options: this.options,
          filterable: true,
          value: this.value,
        },
        style: {
          width: '300px'
        },
        scopedSlots: {
          default: () => h('div', 123),
        },
        on: {
          change: (param) => {
            console.log(param);
          }
        }
      },
      [slotContent]
    )}
    </div>
    return (
      <div>1123</div>
    )
  }
}
</script>

<style lang="less">
#app {
  display: grid;
  place-items: flex-start;
  margin: 60px;
}
// :root {
//   --theme-color: red;
//   --border-color: green;
//   --txt-color: blue;
// }
</style>

