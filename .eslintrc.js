const OFF = 0;

module.exports = {
  extends: ['@poool/eslint-config-node'],
  rules: {
    camelcase: [OFF, { properties: 'never' }],
    'import/order': [1, {
      groups: [
        'builtin',
        'external',
        'internal',
        ['parent', 'sibling', 'index', 'unknown'],
      ],
      'newlines-between': 'always',
    }],
  },
  settings: {
    'import/resolver': {
      'eslint-import-resolver-custom-alias': {
        alias: {
          '@job-guetter/api-core/utils': './core/utils',
          '@job-guetter/api-core/models': './core/models',
          '@job-guetter/api-core/views': './core/views',
          '@job-guetter/api-core/connectors': './core/connectors',
          '@job-guetter/api-core/interceptors': './core/interceptors',
          '@job-guetter/api-core/languages': './core/languages',
        },
      },
    },
  },
  overrides: [{
    files: ['tests/**/*.js'],
    env: {
      jest: true,
    },
    rules: {
      'import/order': OFF,
    },
  }, {
    files: ['script/**/*', './*.js', 'services/**/index.js'],
    rules: {
      'no-console': OFF,
    },
  }],
  globals: {
    __DEV__: true,
  },
};
