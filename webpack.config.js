const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  // Evitar problemas com minimatch durante o build
  process.env.EXPO_NO_DOTENV = '1';
  
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      mode: argv.mode || 'production',
      projectRoot: __dirname,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@react-navigation'],
      },
    },
    argv
  );

  // Configurações para produção
  config.output = {
    ...config.output,
    path: path.resolve(__dirname, 'web-build'),
    publicPath: '/',
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
  };

  // Otimizações para desktop
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
  };

  // Entry point
  if (!config.entry) {
    config.entry = path.resolve(__dirname, 'App.tsx');
  }

  return config;
};

