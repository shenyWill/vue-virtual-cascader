import { coerceTruthyValueToArray, valueEquals } from 'element-ui/src/utils/util'
import Node from './node'

// 打平nodes
const flatNodes = (data, leafOnly) => data.reduce((res, node) => {
  if (node.isLeaf) {
    res.push(node)
  } else {
    !leafOnly && res.push(node)
    res = res.concat(flatNodes(node.children, leafOnly))
  }
  return res
}, [])

export default class Store {

  constructor (data, config) {
    this.config = config
    this.initNodes(data)
  }

  initNodes (data) {
    data = coerceTruthyValueToArray(data)
    this.nodes = data.map(nodeData => new Node(nodeData, this.config))
    // 打平的nodes集合
    this.flattedNodes = this.getFlattedNodes(false, false)
    // 叶子nodes集合，最后一层的叶子
    this.leafNodes = this.getFlattedNodes(true, false)
  }

  appendNodes (nodeDataList, parentNode) {
    nodeDataList = coerceTruthyValueToArray(nodeDataList)
    const children = parentNode ? parentNode.children : this.nodes
    const nodes = []

    for (let i = 0, length = nodeDataList.length; i < length; i++) {
      const node = new Node(nodeDataList[i], this.config, parentNode)

      const _idx = children.findIndex(item => item.value === node.value)
      if (_idx > -1) {
        break
      }

      nodes.push(node)
    }
    if (parentNode) {
      parentNode.children = Object.freeze(nodes)
    } else {
      this.nodes = Object.freeze(nodes)
    }
  }

  getNodes () {
    return this.nodes
  }
  // 打平node对象
  getFlattedNodes (leafOnly, cached = true) {
    const cachedNodes = leafOnly ? this.leafNodes : this.flattedNodes
    return cached
      ? cachedNodes
      : flatNodes(this.nodes, leafOnly)
  }
  // 通过值获取对应的node对象
  getNodeByValue (value) {
    if (value) {
      const nodes = this.getFlattedNodes(false, !this.config.lazy).
        filter(node => (valueEquals(node.path, value) || node.value === value))
      return nodes && nodes.length ? nodes[0] : null
    }
    return null
  }

}
