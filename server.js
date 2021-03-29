const { createBundleRenderer } = require('vue-server-renderer')
const fs = require('fs')
const path = require('path')
const express = require('express')
const compression = require('compression')
const microcache = require('route-cache')
const bundle = require('./build/vue-ssr-server-bundle.json')

function createRenderer(bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    basedir: path.resolve(__dirname, './build')
  }))
}

const template = fs.readFileSync('./static/index.ejs', 'utf-8')

const app = express()

let renderer
let readyPromise = Promise.resolve()
if (process.env.NODE_ENV === 'development') {
  console.log('Development mode, hot reload enabled')
  readyPromise = require('./server-hot-reload')(app, template, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
} else {
  const clientManifest = require('./build/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest,
  })
}

const serve = (_path) => express.static(path.resolve(__dirname, _path))

app.use(compression({ threshold: 0 }))
app.use('/build', serve('./build'))
app.use(microcache.cacheSeconds(1, req => req.originalUrl))

app.get('*', async (req, res) => {
  const context = {
    title: 'Hello World',
    url: req.url,
    cookie: req.headers['cookie'],
  }
  await readyPromise
  renderer.renderToString(context, (err, html) => {
    if (err) {
      console.log(err)
      res.status(500).json({
        message: 'Error rendering'
      })
    } else {
      res.send(html)
    }
  })
})

const port = 4000
app.listen(port, () => console.log(`Listening on port ${port}`))

module.exports = app
