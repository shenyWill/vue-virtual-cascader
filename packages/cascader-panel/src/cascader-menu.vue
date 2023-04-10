<template>
  <div class="virtual-cascader-menu">
    <div class="virtual-cascader-menu__wrap">
      <div v-if="checkAllVisible" class="virtual-search-check__all">
        <el-checkbox
          v-if="checkAllVisible"
          :value="menuCheckState.checked"
          :indeterminate="menuCheckState.indeterminate"
          @change="onMenuCheck"
        >全选</el-checkbox>
        </div>
      <div v-if="isEmpty" class="virtual-cascader-menu__empty-text">
        {{ emptyText }}
      </div>
      <recycle-scroller
          v-else
          v-slot="{ item, index }"
          :buffer="100"
          :items="filterNodes"
          :item-size="34"
          key-field="value"
          :style="{ height: scrollHeight }">
        <cascader-node
          :key="item.uid"
          :node="item"
          :node-id="`${menuId}-${index}`"
          :aria-haspopup="item.hasChildren"
          :aria-owns="item.hasChildren ? menuId : null"
          @expand="isHover && handleExpand"
        />
      </recycle-scroller>
      <!-- <svg v-if="isHover" ref="hoverZone" class="elp-cascader-menu__hover-zone" /> -->
    </div>
  </div>
</template>

<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { RecycleScroller } from 'vue-virtual-scroller'

import CascaderNode from './cascader-node.vue'
import ElCheckbox from 'element-ui/packages/checkbox'

export default {
  name: 'ElpCascaderMenu',

  inject: ['panel'],

  components: {
    RecycleScroller,
    CascaderNode,
    ElCheckbox
  },

  props: {
    nodes: {
      type: Array,
      required: true
    },
    index: Number,
    emptyText: {
      type: String,
      default: '暂无数据'
    }
  },

  data () {
    return {
      activeNode: null,
      hoverTimer: null,
      searchKey: '',
      menuCheckState: {
        checked: false,
        indeterminate: false
      }
    }
  },

  computed: {
    config () {
      return this.panel.config
    },
    isEmpty () {
      return !this.filterNodes.length
    },
    menuId () {
      return `cascader-menu-${this.index}`
    },
    isHover () {
      return this.panel.isHoverMenu
    },
    filterNodes () { // 经搜索词过滤后的node节点
      if (!this.searchKey) return this.nodes
      return this.nodes.filter(node => node.label.includes(this.searchKey))
    },
    checkAllVisible () {
      return this.config.multiple && !this.config.lazyMultiCheck && this.config.checkAll && !this.isEmpty
    },
    scrollHeight () {
      const labelAndCheckAllHeight = this.checkAllVisible ? 30 : 0
      return `calc(100% - ${ labelAndCheckAllHeight }px)`
    }
  },
  watch: {
    'panel.checkedValue': {
      handler () {
        this.setMenuCheckedVal()
      },
      deep: true
    },
    'panel.activePath': {
      handler () {
        this.setMenuCheckedVal()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleExpand (e) {
      this.activeNode = e.target
    },
    clearHoverZone () {
      const { hoverZone } = this.$refs
      if (!hoverZone) return
      hoverZone.innerHTML = ''
    },
    setMenuCheckedVal () {
      if (!this.checkAllVisible) return
      const totalNum = this.filterNodes.filter(it => !it.isDisabled).length
      const checkedNum = this.filterNodes.reduce((c, p) => {
        const num = p.checked ? 1 : (p.indeterminate ? 0.5 : 0)
        return c + num
      }, 0)
      this.menuCheckState = {
        checked: checkedNum > 0 && checkedNum === totalNum,
        indeterminate: checkedNum > 0 && checkedNum !== totalNum
      }
    },
    onMenuCheck (checked) {
      // 标识已选中的标签
      this.filterNodes.forEach(node => { !node.isDisabled && node.doCheck(checked) })
      this.panel.calculateMultiCheckedValue()
    },
  }
}
</script>
