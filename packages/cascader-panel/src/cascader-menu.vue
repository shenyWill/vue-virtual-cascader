<template>
  <div class="virtual-cascader-menu">
    <div class="virtual-cascader-menu__wrap">
      <div v-if="checkAllVisible" class="virtual-search-check__all">
        <el-checkbox
          v-if="checkAllVisible"
          :value="checkStatusData.checked"
          :indeterminate="checkStatusData.indeterminate"
          @change="onMenuCheck"
        >全选</el-checkbox>
        </div>
      <div v-if="isEmpty" class="virtual-cascader-menu__empty-text">
        <div class="virtual-cascader-menu_empty-icon">
          <img :src="emptySVG">
        </div>
        {{ emptyText }}
      </div>
      <recycle-scroller
          v-else
          v-slot="{ item, index }"
          :buffer="100"
          :items="nodes"
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
    </div>
  </div>
</template>

<script>
import CascaderNode from './cascader-node.vue'
import ElCheckbox from 'element-ui/packages/checkbox'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import emptySVG from 'virtual-cascader/packages/styles/imgs/empty.png';

export default {
  name: 'VirtualCascaderMenu',

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
      default: '暂无选项'
    }
  },

  data () {
    return {
      activeNode: null,
      hoverTimer: null,
      searchKey: '',
      checkStatusData: {
        checked: false,
        indeterminate: false
      },
      emptySVG,
    }
  },

  computed: {
    config () {
      return this.panel.config
    },
    isEmpty () {
      return !this.nodes.length
    },
    menuId () {
      return `cascader-menu-${this.index}`
    },
    isHover () {
      return this.panel.isHoverMenu
    },
    // 是否有全选
    checkAllVisible () {
      return this.config.multiple && this.config.checkAll && !this.isEmpty
    },
    // 滚动高度
    scrollHeight () {
      const labelAndCheckAllHeight = this.checkAllVisible ? 30 : 0
      return `calc(100% - ${ labelAndCheckAllHeight }px)`
    }
  },
  watch: {
    // 选中的某个值发生变化--多选
    'panel.checkedValue': {
      handler () {
        this.setMenuCheckedVal()
      },
      deep: true
    },
    // 选中的路径发生变化--多选
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
    // 设置全选按钮的值
    setMenuCheckedVal () {
      if (!this.checkAllVisible) return
      const totalNum = this.nodes.filter(it => !it.isDisabled).length
      const checkedNum = this.nodes.reduce((c, p) => {
        const num = p.checked ? 1 : (p.indeterminate ? 0.5 : 0)
        return c + num
      }, 0)
      this.checkStatusData = {
        checked: checkedNum > 0 && checkedNum === totalNum,
        indeterminate: checkedNum > 0 && checkedNum !== totalNum
      }
    },
    onMenuCheck (checked) {
      // 标识已选中的标签
      this.nodes.forEach(node => { !node.isDisabled && node.doCheck(checked) })
      this.panel.calculateMultiCheckedValue()
    },
  }
}
</script>
