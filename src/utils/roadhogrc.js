module.exports = {
  entry: {
    index: './src/index.js',
    vendor: [
      'react-dom',
      'redux-saga',
      'react',
      'react-router',
      'dva-core',
      'react-redux',
      'prop-types',
      'redux'
    ]
  },
  multipage: true,
  publicPath: '/',
  extraBabelPlugins: ['transform-runtime'],
  define: {
    ENV_PROD: false,
    API_TEST: false
  },
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr']
    },
    production: {
      filename: 'assets/[name]-[hash:8].js',
      chunkFilename: 'assets/[name]-[hash:8].js',
      extractCssName: 'assets/[name].[hash:8].css'
    }
  }
};
