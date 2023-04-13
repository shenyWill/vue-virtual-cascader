module.exports = {
  // 将 docs 类型的提交也计入更新日志中
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'perf', section: 'Performance Improvements' },
    { type: 'docs', section: 'Docs' },
    { type: 'style', section: 'Styles' },
    { type: 'refactor', section: 'Code Refactoring' },
    { type: 'test', section: 'Tests' },
    { type: 'chore', section: 'Chores' },
    { type: 'revert', section: 'Reverts' }
  ]
};