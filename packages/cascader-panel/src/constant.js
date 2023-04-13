import { noop } from 'element-ui/src/utils/util'

const DefaultProps = {
  value: 'value',
  label: 'label',
  leaf: 'leaf',
  children: 'children',
  disabled: 'disabled',
  lazy: false,
  lazyLoad: noop,
  emitPath: true,
  multiple: false,
  checkStrictly: false,
  expandTrigger: 'click', // 展开的动作 click | hover
  hoverThreshold: 500,
}

export {
  DefaultProps
}
