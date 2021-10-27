module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['chore', 'feat', 'refactor', 'fix', 'style',
      'docs', 'test', 'deploy']],
  },
};
