const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
    'react-native/Libraries/Components/TextInput': 'react-native-web/dist/exports/TextInput'
  };
  config.resolve.fallback = {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url"),
    "path": require.resolve("path-browserify"),
    "fs": false
  };

  // Ignore TextInputState module for web build
  config.plugins.push(
    new webpack.IgnorePlugin({
      resourceRegExp: /^react-native\/Libraries\/Components\/TextInput\/TextInputState$/
    })
  );

  return config;
};
