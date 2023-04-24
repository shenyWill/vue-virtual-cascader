<template>
  <div
      ref="reference"
      :class="[
          'virtual-cascader',
          { 'is-disabled': isDisabled },
          size && `virtual-cascader--${size}`
      ]"
      v-clickoutside="() => toggleDropDownVisible(false)"
      @mouseover="() => inputHover = true"
      @mouseleave="() => inputHover = false"
      @click="() => toggleDropDownVisible(true)">
    <el-input
        ref="input"
        v-model="presentText"
        :size="size"
        :readonly="true"
        :disabled="isDisabled"
        :validate-event="false"
        :placeholder="placeholder"
        :class="{ 'is-focus': dropDownVisible, 'is-plus-suffix': $slots.suffix }"
        @focus="handleFocus"
        @blur="handleBlur">
      <template v-if="$slots.prefix" slot="prefix">
        <slot name="prefix"></slot>
      </template>
      <template slot="suffix">
        <div v-if="$slots.suffix" class="virtual-cascader__input-suffix">
          <slot name="suffix"></slot>
        </div>
        <i
            v-if="clearBtnVisible"
            key="clear"
            class="el-input__icon el-icon-error"
            @click.stop="handleClear"
        />
        <i
            v-if="!clearBtnVisible"
            key="arrow-down"
            :class="[
                'el-input__icon',
                'el-icon-arrow-down',
                dropDownVisible && 'is-reverse'
            ]"
            @click.stop="toggleDropDownVisible()"
        />
      </template>
    </el-input>

    <div v-if="multiple" :class="{ 'virtual-cascader__tags': true , 'is-prefix': $slots.prefix, 'is-suffix': $slots.suffix }">
      <slot v-if="hasInputSlot" name="input"></slot>
      <el-tag
        v-else
        v-for="(tag, index) in presentTags"
        :key="tag.key"
        type="info"
        :size="size || 'small'"
        :hit="tag.hitState"
        :closable="tag.closable"
        disable-transitions
        @close="deleteTag(index)">
        <span>{{ tag.text }}</span>
      </el-tag>
    </div>

    <transition name="el-zoom-in-top" @after-leave="handleDropdownLeave">
      <div
          v-show="dropDownVisible"
          ref="popper"
          :class="[
              'virtual-cascader__dropdown',
              'el-popper',
               popperClass
          ]">
          <div class="virtual-cascader__search">
            <input
              v-if="filterable && !isDisabled"
              v-model.trim="searchValue"
              type="text"
              class="virtual-cascader__search-input"
              placeholder="请输入"
              @input="e => handleInput(searchValue, e)"
            />
            <i class="virtual-cascader__search-icon el-input__icon el-icon-search"></i>
          </div>
        <virtual-cascader-panel
            ref="panel"
            v-show="!filtering"
            v-model="checkedValue"
            :visible="dropDownVisible"
            :options="options"
            :props="config"
            :border="false"
            :empty-text="emptyText"
            :render-label="$scopedSlots.default"
            @expand-change="handleExpandChange"
            @lazy-loaded="handleLazyLoaded"
            @close="toggleDropDownVisible(false)"
        />
        <scrollbar
          ref="filterPanel"
          v-if="filterable"
          v-show="filtering"
          tag="ul"
          class="virtual-cascader__filter-panel"
          view-class="virtual-cascader__filter-list">
          <template v-if="filterList.length">
            <el-checkbox 
              v-for="(item, index) in filterList"
              class="virtual-cascader__filter-item"
              :key="item.uid" :value="item.checked"
              @change="handleFilterClick(index)"
            > {{ item.text }}</el-checkbox>
          </template>
          <slot v-else name="empty">
            <li class="virtual-cascader__empty-text">{{ emptyText }}</li>
          </slot>
        </scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>
import { Scrollbar } from 'element-ui'
import ElTag from 'element-ui/packages/tag'
import ElInput from 'element-ui/packages/input'
import ElCheckbox from 'element-ui/packages/checkbox'
import Emitter from 'element-ui/src/mixins/emitter'
import Migrating from 'element-ui/src/mixins/migrating'
import { isDef } from 'element-ui/src/utils/shared'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import { isUndefined, isFunction } from 'element-ui/src/utils/types'
import { isEqual, isEmpty, kebabCase } from 'element-ui/src/utils/util'
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

import 'virtual-cascader/packages/styles/cascader.less'
import VirtualCascaderPanel from 'virtual-cascader/packages/cascader-panel'
import { MigratingProps, PopperMixin, InputSizeMap, VirtualProps } from './constant'
import { debounce } from 'throttle-debounce';

export default {
  name: 'VirtualCascader',

  directives: { Clickoutside },

  mixins: [PopperMixin, Emitter, Migrating, VirtualProps],

  components: {
    ElTag,
    ElInput,
    Scrollbar,
    VirtualCascaderPanel,
    ElCheckbox
  },

  data () {
    return {
      filterList: [], // 过滤后的数据列表
      presentTags: [], // 多选时选中的tag
      checkedNodes: [],
      filtering: false, // 是否正在过滤
      searchValue: null,
      presentText: null,
      inputHover: false,
      pressDeleteCount: 0,
      inputInitialHeight: 0, // root最外层virtual-cascader实际高度
      dropDownVisible: false, // 是否处于弹窗层显示状态
      checkedValue: this.value || null // 选中的数据
    }
  },

  computed: {
    isDisabled () {
      return this.disabled
    },
    config () {
      const config = this.props || {}
      const { $attrs } = this

      Object.keys(MigratingProps).forEach(oldProp => {
        const { newProp, type } = MigratingProps[oldProp]
        let oldValue = $attrs[oldProp] || $attrs[kebabCase(oldProp)]
        if (isDef(oldProp) && !isDef(config[newProp])) {
          if (type === Boolean && oldValue === '') {
            oldValue = true
          }
          config[newProp] = oldValue
        }
      })
      return config
    },
    multiple () {
      return this.config.multiple
    },
    // 是否父子节点取消选中关联，从而达到选择任意一项的目的（true: 关联， false: 不关联）
    leafOnly () {
      return !this.config.checkStrictly
    },
    clearBtnVisible () {
      if (!this.clearable || this.isDisabled || this.filtering || !this.inputHover) {
        return false
      }

      return this.multiple
          ? !!this.checkedNodes.filter(node => !node.isDisabled).length
          : !!this.presentText
    },
    panel () {
      return this.$refs.panel
    },
    hasInputSlot() {
      console.log(this.$slots);
      return !!this.$slots.input
    },
  },

  watch: {
    disabled () {
      this.computePresentContent()
    },
    value (val) {
      if (!isEqual(val, this.checkedValue)) {
        this.checkedValue = val
        this.computePresentContent()
      }
    },
    checkedValue (val) {
      const { value, dropDownVisible } = this
      const { checkStrictly, multiple } = this.config

      if (!isEqual(val, value) || isUndefined(value)) {
        // 如果选中的数据发生改变，重新计算展示内容
        this.computePresentContent()
        if (!multiple && !checkStrictly && dropDownVisible) {
          this.toggleDropDownVisible(false)
        }

        this.$emit('input', val)
        this.$emit('change', val)
      }
    },
    options: {
      handler: function () {
        this.$nextTick(this.computePresentContent)
      },
      deep: true
    },
    presentTags (val, oldVal) {
      if (this.multiple && (val.length || oldVal.length)) {
        this.$nextTick(this.updateStyle)
      }
    },
    filtering () {
      this.$nextTick(this.updatePopper)
    }
  },

  mounted () {
    const { input } = this.$refs
    if (input && input.$el) {
      this.inputInitialHeight = input.$el.offsetHeight || InputSizeMap.get(this.size) || 40
    }
    if (!isEmpty(this.value)) {
      // 如果数据不为空，回填
      this.computePresentContent()
    }

    this.filterHandler = debounce(this.debounce, () => {
      const { searchValue } = this
      if (!searchValue) {
        this.filtering = false
        return
      }

      const before = this.beforeFilter(searchValue)
      if (before && before.then) {
        before.then(this.getFilterList)
      } else if (before !== false) {
        this.getFilterList()
      } else {
        this.filtering = false
      }
    })
    // 根据ResizeObserver观察root的变动，使popover跟随变动
    addResizeListener(this.$el, this.updateStyle)
  },

  beforeDestroy () {
    removeResizeListener(this.$el, this.updateStyle)
  },

  methods: {
    toggleDropDownVisible (visible) {
      if (this.isDisabled) return
      const { dropDownVisible } = this
      const { input } = this.$refs
      visible = isDef(visible) ? visible : !dropDownVisible
      if (!visible) {
        this.searchValue = '';
      }
      if (visible !== dropDownVisible) {
        this.dropDownVisible = visible;
        if (visible) {
          this.$nextTick(() => {
            this.updatePopper()
            this.panel.scrollIntoView()
          })
        }
        input.$refs.input.setAttribute('aria-expanded', visible)
        this.$emit('visible-change', visible)
      }
    },
    handleDropdownLeave () {
      this.filtering = false
    },
    handleFocus (e) {
      this.$emit('focus', e)
    },
    handleBlur (e) {
      this.$emit('blur', e)
    },
    handleInput (val, event) {
      !this.dropDownVisible && this.toggleDropDownVisible(true)
      // 如果输入的是中文或者日文，输入完成后再做筛选
      if (event && event.isComposing) return
      if (val) {
        this.filterHandler()
      } else {
        this.filtering = false
      }
    },
    handleClear () {
      this.presentText = ''
      this.panel.clearCheckedNodes()
    },
    handleExpandChange (value) {
      this.$nextTick(this.updatePopper.bind(this))
      this.$emit('expand-change', value)
      this.$emit('active-item-change', value) // Deprecated
    },
    handleLazyLoaded (value) {
      this.$emit('lazy-loaded', value)
    },
    // 计算展示内容（多选：计算展示的tags， 单选： 计算展示文本）
    computePresentContent () {
      this.$nextTick(() => {
        if (this.config.multiple) {
          this.computePresentTags()
          // 多选的时候，展示的文本可以置空
          this.presentText = this.presentTags.length ? ' ' : null
        } else {
          this.computePresentText()
        }
      })
    },
    // 计算展示文本
    computePresentText () {
      const { checkedValue, config } = this
      if (!isEmpty(checkedValue)) {
        const node = this.panel.getNodeByValue(checkedValue)
        if (node && (config.checkStrictly || node.isLeaf)) {
          this.presentText = node.getText(this.showAllLevels, this.separator)
          return
        }
      }
      this.presentText = null
    },
    // 计算展示的tag--多选
    computePresentTags () {
      const { isDisabled, leafOnly, showAllLevels, separator, collapseTags } = this
      const checkedNodes = this.getCheckedNodes(leafOnly)
      const tags = []

      const genTag = node => ({
        node,
        key: node.uid,
        text: node.getText(showAllLevels, separator),
        hitState: false,
        closable: !isDisabled && !node.isDisabled
      })

      if (checkedNodes.length) {
        const [first, ...rest] = checkedNodes
        const restCount = rest.length
        tags.push(genTag(first))

        if (restCount) {
          if (collapseTags) {
            tags.push({
              key: -1,
              text: `+ ${restCount}`,
              closable: false
            })
          } else {
            rest.forEach(node => tags.push(genTag(node)))
          }
        }
      }

      this.checkedNodes = checkedNodes
      this.presentTags = tags
    },
    // 获取过滤的数据列表
    getFilterList () {
      let { filterMethod } = this

      if (!isFunction(filterMethod)) {
        filterMethod = (node, keyword) => node.text.includes(keyword)
      }
      const filterList = this.panel.getFlattedNodes(this.leafOnly).filter(node => {
        if (node.isDisabled) return false
        node.text = node.getText(this.showAllLevels, this.separator) || ''
        return filterMethod(node, this.searchValue)
      })

      if (this.multiple) {
        this.presentTags.forEach(tag => {
          tag.hitState = false
        })
      } else {
        filterList.forEach(node => {
          node.checked = isEqual(this.checkedValue, node.getValueByOption())
        })
      }

      this.filtering = true
      this.filterList = filterList
      this.$nextTick(this.updatePopper)
    },
    handleFilterClick (index) {
      const { multiple } = this
      const targetNode = this.filterList[index]
      if (multiple) {
        const { checked } = targetNode
        // 反转当前选择的node
        targetNode.doCheck(!checked)
        // 重新计算选中的数据
        this.panel.calculateMultiCheckedValue()
      } else {
        this.checkedValue = targetNode.getValueByOption()
        this.toggleDropDownVisible(false)
      }
    },
    // 删除tag
    deleteTag (index) {
      const { checkedValue } = this
      const val = checkedValue[index]
      this.checkedValue = checkedValue.filter((n, i) => i !== index)
      this.$emit('remove-tag', val)
    },
    updateStyle () {
      const { $el, inputInitialHeight } = this
      if (this.$isServer || !$el) return

      const { filterPanel } = this.$refs
      const inputInner = $el.querySelector('.el-input__inner')

      if (!inputInner) return

      const tags = $el.querySelector('.virtual-cascader__tags')
      let filterPanelEl = null

      if (filterPanel && (filterPanelEl = filterPanel.$el)) {
        // 搜索时候的panel最小宽度等同root的宽度
        const filterList = filterPanelEl.querySelector('.virtual-cascader__filter-list')
        filterList.style.minWidth = inputInner.offsetWidth + 'px'
      }

      if (tags) {
        const { offsetHeight } = tags
        const height = Math.max(offsetHeight + 4, inputInitialHeight) + 'px'
        inputInner.style.height = height
        this.updatePopper()
      }
    },
    getCheckedNodes (leafOnly) {
      return this.panel.getCheckedNodes(leafOnly)
    }
  }
}
</script>
