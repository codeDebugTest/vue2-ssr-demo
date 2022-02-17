const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const router = new Router()

const resolve = file => path.resolve(__dirname, file)

const { createBundleRenderer } = require('vue-server-renderer')
const bundle = require('../dist/vue-ssr-server-bundle.json')
const clientManifest = require('../dist/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  template: fs.readFileSync(resolve('../dist/index.ssr.html'), 'utf-8'),
  clientManifest
})

function renderToString (context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      if (err) {
        return reject(err)
      }
      resolve(html)
    })
  })
}

const handleRequest = async (ctx, next) => {
  const url = ctx.path
  console.log('request path: ', url)

  ctx.res.setHeader('Content-Type', 'text/html')
  const context = { url }
  // render context data to HTML
  const html = await renderToString(context)
  ctx.body = html
}

// static resources (js|css|img|index.html|favicon.ico) need't server render
router.get(/^\/(?!((js|css|img)\/)|(index\.html)|(favicon\.ico))/, handleRequest)
module.exports = router
