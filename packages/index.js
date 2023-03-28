import VirtualCascader from './virtual-cascader';

const components = [VirtualCascader];


const install = Vue => {
  if (install.installed) return

  components.forEach(Component => {
    Vue.component(Component.name, Component)
  })
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  VirtualCascader,
}