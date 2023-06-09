<template>
  <div
      :class="[
          'virtual-cascader-panel',
          border && 'is-bordered'
       ]"
      v-show="visible">
    <cascader-menu
        ref="menu"
        v-for="(menu, index) in menus"
        :key="index"
        :nodes="menu"
        :index="index"
    />
  </div>
</template>

<script>
import CascaderMenu from './cascader-menu'
import Store from './store'
import merge from 'element-ui/src/utils/merge'
import scrollIntoView from 'element-ui/src/utils/scroll-into-view'
import {
  noop,
  coerceTruthyValueToArray,
  isEqual,
  isEmpty,
  valueEquals,
} from 'element-ui/src/utils/util'

import 'virtual-cascader/packages/styles/cascader-panel.less'

const DefaultProps = {
  expandTrigger: 'click', // 展开的动作 click | hover
  multiple: false,
  checkStrictly: false,
  emitPath: true,
  lazy: false,
  lazyLoad: noop,
  value: 'value',
  label: 'label',
  children: 'children',
  leaf: 'leaf',
  disabled: 'disabled',
  hoverThreshold: 500,
}

export default {
  name: 'VirtualCascaderPanel',

  components: { CascaderMenu },

  props: {
    value: {},
    options: Array,
    props: Object,
    border: {
      type: Boolean,
      default: true
    },
    renderLabel: Function,
    visible: Boolean
  },

  provide () {
    return {
      panel: this
    }
  },

  data () {
    return {
      store: [],
      menus: [],
      loadCount: 0,
      activePath: [],
      checkedValue: null,
      checkedNodePaths: []
    }
  },

  computed: {
    config () {
      return merge({ ...DefaultProps }, this.props || {})
    },
    multiple () {
      return this.config.multiple
    },
    checkStrictly () {
      return this.config.checkStrictly
    },
    leafOnly () {
      return !this.checkStrictly
    },
    isHoverMenu () {
      return this.config.expandTrigger === 'hover'
    },
    renderLabelFn () {
      return this.renderLabel || this.$scopedSlots.default
    }
  },

  watch: {
    options: {
      handler: function () {
        this.initStore()
      },
      immediate: true,
      deep: true
    },
    value () {
      this.syncCheckedValue()
      this.checkStrictly && this.calculateCheckedNodePaths()
    },
    checkedValue (val) {
      if (!isEqual(val, this.value)) {
        this.checkStrictly && this.calculateCheckedNodePaths()
        this.$emit('input', val)
        this.$emit('change', val)
      }
    }
  },

  mounted () {
    if (!isEmpty(this.value)) {
      // TODO: 因为watch的时候，checkedValue还是空，所以重置一次选中数据
      this.syncCheckedValue()
    }
  },

  methods: {
    initStore () {
      const { config, options } = this
      // 如果是懒加载
      if (config.lazy && isEmpty(options)) {
        this.lazyLoad()
      } else {
        // 直接加载
        this.store = new Store(options, config)
        this.menus = [this.store.getNodes()]
        this.syncMenuState()
      }
    },
    syncCheckedValue () {
      const { value, checkedValue } = this
      if (!isEqual(value, checkedValue)) {
        this.checkedValue = value
        this.syncMenuState()
      }
    },
    // 设置menu的状态（也就是所有node的状态）
    syncMenuState () {
      const { multiple, checkStrictly } = this
      this.syncActivePath()
      // 多选的情况下，设置选中的所有的node的check
      multiple && this.syncMultiCheckState()
      checkStrictly && this.calculateCheckedNodePaths()
      this.$nextTick(this.scrollIntoView)
    },
    syncMultiCheckState () {
      const nodes = this.getFlattedNodes(this.leafOnly)

      nodes.forEach(node => {
        node.syncCheckState(this.checkedValue)
      })
    },
    syncActivePath () {
      const { store, multiple, activePath, checkedValue } = this
      if (!isEmpty(activePath)) {
        const nodes = activePath.map(node => this.getNodeByValue(node.getValue()))
        this.expandNodes(nodes)
      } else if (!isEmpty(checkedValue)) {
        const value = multiple ? checkedValue[0] : checkedValue
        const checkedNode = this.getNodeByValue(value) || {}
        // 过滤掉最后一项（叶子）,最后一项不需要展开
        const nodes = (checkedNode.pathNodes || []).slice(0, -1)
        this.expandNodes(nodes)
      } else {
        this.activePath = []
        this.menus = [store.getNodes()]
      }
    },
    // 展开nodes
    expandNodes (nodes) {
      nodes.forEach(node => this.handleExpand(node, true /* silent */))
    },
    calculateCheckedNodePaths () {
      const { checkedValue, multiple } = this
      const checkedValues = multiple
          ? coerceTruthyValueToArray(checkedValue)
          : [checkedValue]
      this.checkedNodePaths = checkedValues.map(v => {
        const checkedNode = this.getNodeByValue(v)
        return checkedNode ? checkedNode.pathNodes : []
      })
    },
    // 展开
    handleExpand (node, silent) {
      const { activePath } = this
      const { level } = node
      const path = activePath.slice(0, level - 1)
      const menus = this.menus.slice(0, level)
      // 如果不是叶子（最后一层），则加入展开路径，menus也加入下一层
      if (!node.isLeaf) {
        path.push(node)
        menus.push(node.children)
      }

      this.activePath = path
      this.menus = [...menus]
      if (!silent) {
        const pathValues = path.map(node => node.getValue())
        const activePathValues = activePath.map(node => node.getValue())
        if (!valueEquals(pathValues, activePathValues)) {
          this.$emit('active-item-change', pathValues) // Deprecated
          this.$emit('expand-change', pathValues)
        }
      }
    },
    handleCheckChange (value) {
      this.checkedValue = value
    },
    lazyLoad (node, onFullfiled) {
      const { config } = this
      if (!node) {
        node = node || { root: true, level: 0 }
        this.store = new Store([], config)
        this.menus = [this.store.getNodes()]
      }
      node.loading = true
      const resolve = dataList => {
        const parent = node.root ? null : node
        dataList && dataList.length && this.store.appendNodes(dataList, parent)
        node.loading = false
        node.loaded = true

        if (this.loadCount === 0 && this.menus[0] && !this.menus[0].length) {
          this.menus = [this.store.getNodes()]
        }

        if (Array.isArray(this.checkedValue)) {
          const nodeValue = this.checkedValue[this.loadCount++]
          const valueKey = this.config.value
          const leafKey = this.config.leaf

          if (Array.isArray(dataList) && dataList.filter(item => item[valueKey] === nodeValue).length > 0) {
            const checkedNode = this.store.getNodeByValue(nodeValue)

            if (!checkedNode.data[leafKey]) {
              this.lazyLoad(checkedNode, () => {
                this.handleExpand(checkedNode)
              })
            }

            if (checkedNode.data[leafKey] && this.config.lazy) {
              this.$emit('lazy-loaded', this.checkedValue)
            }

            if (this.loadCount === this.checkedValue.length) {
              this.$parent.computePresentText()
            }
          }
        }

        onFullfiled && onFullfiled(dataList)
      }
      config.lazyLoad(node, resolve)
    },

    // 计算多选情况下选中的数据
    calculateMultiCheckedValue () {
      this.checkedValue = this.getCheckedNodes(this.leafOnly).map(node => node.getValueByOption())
    },
    // 虚拟滚动时，还没有渲染出来activeNode，所以无效
    scrollIntoView () {
      if (this.$isServer) return

      const menus = this.$refs.menu || []
      menus.forEach(menu => {
        const menuElement = menu.$el
        if (menuElement) {
          const container = menuElement.querySelector('.virtual-cascader-menu__wrap')
          const activeNode = menuElement.querySelector('.virtual-cascader-node.is-active') ||
              menuElement.querySelector('.virtual-cascader-node.in-active-path')
          scrollIntoView(container, activeNode)
        }
      })
    },
    getNodeByValue (val) {
      return this.store.getNodeByValue(val)
    },
    getFlattedNodes (leafOnly) {
      const cached = !this.config.lazy
      return this.store.getFlattedNodes(leafOnly, cached)
    },
    // 获取选中的nodes
    getCheckedNodes (leafOnly) {
      const { checkedValue, multiple } = this
      if (multiple) {
        const nodes = this.getFlattedNodes(leafOnly)
        return nodes.filter(node => node.checked)
      } else {
        return isEmpty(checkedValue)
            ? []
            : [this.getNodeByValue(checkedValue)]
      }
    },
    // 删除选中的nodes
    clearCheckedNodes () {
      const { config, leafOnly } = this
      const { multiple, emitPath } = config
      if (multiple) {
        // 循环所有nodes，将所有node置为不选中
        this.getCheckedNodes(leafOnly).filter(node => !node.isDisabled).forEach(node => node.doCheck(false))
        this.calculateMultiCheckedValue()
      } else {
        this.checkedValue = emitPath ? [] : null
      }
    },
  }
}
</script>
