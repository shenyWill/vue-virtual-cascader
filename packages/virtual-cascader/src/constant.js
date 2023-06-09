import Popper from 'element-ui/src/utils/vue-popper'

const MigratingProps = {
  expandTrigger: {
    type: String,
    newProp: 'expandTrigger'
  },
  changeOnSelect: {
    type: Boolean,
    newProp: 'checkStrictly'
  },
  hoverThreshold: {
    type: Number,
    newProp: 'hoverThreshold'
  }
}

const VirtualProps = {
  props: {
    value: {},
    options: Array,
    props: Object,
    size: String,
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    filterMethod: Function,
    separator: {
      type: String,
      default: ' / '
    },
    showAllLevels: {
      type: Boolean,
      default: true
    }, // 是否展示所有层级的label
    collapseTags: Boolean, // 是否则折叠选中的tag
    debounce: {
      type: Number,
      default: 300
    },
    beforeFilter: {
      type: Function,
      default: () => (() => { })
    },
    popperClass: String,
    emptyText: {
      type: String,
      default: '暂无选项'
    }
  }
}

const PopperMixin = {
  data: Popper.data,
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    visibleArrow: {
      type: Boolean,
      default: true
    },
    offset: Popper.props.offset,
    arrowOffset: Popper.props.arrowOffset,
    appendToBody: Popper.props.appendToBody,
    popperOptions: Popper.props.popperOptions,
    boundariesPadding: Popper.props.boundariesPadding
  },
  methods: Popper.methods,
  beforeDestroy: Popper.beforeDestroy
}

const InputSizeMap = new Map([
  ['medium', 36],
  ['small', 32],
  ['mini', 28]
])


export {
  MigratingProps,
  VirtualProps,
  PopperMixin,
  InputSizeMap
}
