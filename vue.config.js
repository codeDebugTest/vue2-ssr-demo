const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const WebpackBar = require('webpackbar')
const CssContextLoader = require.resolve('./build-loaders/css-context')
const { merge } = require('lodash')
const path = require('path')

const resolve = file => path.resolve(__dirname, file)
const target = process.env.WEBPACK_TARGET || 'client'
const isServer = target === 'server'
const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  lintOnSave: false,
  css: {
    extract: !isDev,
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  configureWebpack: {
    entry: `./src/entry-${target}.js`,
    // This allows webpack to handle dynamic imports in a Node-appropriate
    // fashion, and also tells `vue-loader` to emit server-oriented code when
    // compiling Vue components.
    target: isServer ? 'node' : 'web',
    // For bundle renderer source map support
    devtool: 'source-map',
    // This tells the server bundle to use Node-style exports
    output: { libraryTarget: isServer ? 'commonjs2' : undefined },
    externals: isServer
      ? nodeExternals({
        // do not externalize dependencies that need to be processed by webpack.
        // you can add more file types here e.g. raw *.vue files
        // you should also whitelist deps that modifies `global` (e.g. polyfills)
        whitelist: [/\.css$/]
      })
      : undefined,
    // Server-side bundle should have one single entry file. Avoid using CommonsChunkPlugin in the server config
    optimization: { splitChunks: isServer ? false : undefined },
    plugins: [isServer ? new VueSSRServerPlugin() : new VueSSRClientPlugin()]
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => merge(options, { optimizeSSR: isServer }))

    // add client/server compile process bar
    config.plugin('loader')
      .use(WebpackBar, [{ name: target, color: isServer ? 'orange' : 'green' }])

    if (!isDev) {
      // copy index.ssr.html for server render
      config.plugin('copy').tap(args => {
        args[0].push({
          from: resolve('public/index.ssr.html'),
          to: resolve('dist/index.ssr.html'),
          toType: 'file'
        })
        return args
      })
    }

    if (isServer) {
      // server side unused hot-reload
      config.plugins.delete('hmr')

      if (!isDev) {
        // css-loader mini-css-extract-plugin(extract-css-loader)，will generate browser sentence such as document.getElementsByTagName xxxxx。
        // this will result in error (document not defined), running on server side。
        // so delete mini-css-extract-plugin and replace with css-context-loader。
        const langs = ['css', 'less']
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']

        langs.forEach(lang => {
          types.forEach(type => {
            const rule = config.module.rule(lang).oneOf(type)
            rule.uses.delete('extract-css-loader')
            rule.use('css-context-loader').loader(CssContextLoader).before('css-loader')
          })
        })
      }
    }
  },
  devServer: { port: isDev && !isServer ? process.env.STATIC_PORT : undefined }
}
