const path = require('path');

module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
      modules: 'auto',
      exclude: [
        '@babel/plugin-transform-regenerator',
        '@babel/transform-async-to-generator',
      ],
    }],
  ],
  plugins: [
    ['@babel/plugin-proposal-object-rest-spread', {
      useBuiltIns: true,
    }],
    ['@babel/plugin-transform-regenerator', {
      async: false,
    }],
    ['@babel/plugin-transform-runtime', {
      helpers: false,
      regenerator: true,
      absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package')),
    }],
    '@babel/plugin-transform-parameters',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/proposal-optional-chaining',
    '@babel/proposal-nullish-coalescing-operator',
  ],
};
