const webpack = require('webpack')
const axios = require('axios')
const MemoryFS = require('memory-fs')
const fs = require('fs')
const path = require('path')
const Router = require('koa-router')

const webpackConfig = require('@vue/cli-service/webpack.config')
const serverCompiler = webpack(webpackConfig)
const mfs = new MemoryFS()
serverCompiler.outputFileSystem = mfs

let bundle
serverCompiler.watch({}, (err, stats) => {
  if (err) {
    throw err
  }

  stats = stats.toJson()
  stats.errors.forEach(error => console.error(error))
  stats.warnings.forEach(warn => console.warn(warn))
  const bundlePath = path.join(
    webpackConfig.output.path,
    'vue-ssr-server-bundle.json'
  )
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  console.log('new bundle generated')
})

const { createBundleRenderer } = require('vue-server-renderer')
function renderToString (context, renderer) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}
async function handleSsrRequest (ctx) {
  console.log('request path: ', ctx.path)
  if (!bundle) {
    ctx.body = 'you can visit the site until webpack compile completed'
    return
  }

  const clientManifestResp = await axios.get(`http://localhost:${process.env.STATIC_PORT}/vue-ssr-client-manifest.json`)
  const clientManifest = clientManifestResp.data

  const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template: fs.readFileSync(path.resolve(__dirname, '../public/index.ssr.html'), 'utf-8'),
    clientManifest
  })
  const html = await renderToString(ctx, renderer)
  ctx.body = html
}

async function handleStaticResourceRequest (ctx) {
  console.log('get static resource: ', ctx.path)
  let resource
  try {
    resource = await axios.get(
            `http://localhost:${process.env.STATIC_PORT}/${ctx.path}`,
            { responseType: 'stream' }
    )
  } catch (e) {
    console.log('static resources not found', ctx.path)
    ctx.status = '404'
    return
  }

  ctx.body = resource.data
}

const router = new Router()
// because it can't read dist statice files on development mode, so we can proxy request by statice server.
router.get(/^\/((js|css|img|)\/(.*)|favicon\.ico)$/, handleStaticResourceRequest)
// for hot-update resource request
router.get(/.*\.hot-update\.(json|js)/, handleStaticResourceRequest)

router.get(/.*/, handleSsrRequest)
module.exports = router
