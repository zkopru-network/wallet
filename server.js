const fs = require('fs')
const path = require('path')
const express = require('express')
const compression = require('compression')
const microcache = require('route-cache')

const app = express()

const serve = (_path) => express.static(path.resolve(__dirname, _path))

app.use(compression({ threshold: 0 }))
app.use((req, res, next) => {
  const mimes = [
    'ttf',
    'otf',
    'png',
    'svg',
    'jpg',
    'jpeg',
  ]
  for (const mime of mimes) {
    if (req.path.endsWith(mime)) {
      res.set('Cache-Control', 'max-age=31536000')
      return next()
    }
  }
  next()
})
app.use('/', serve('./build'))
app.use('/wallet/*', serve('./build'))

app.use(microcache.cacheSeconds(1, req => req.originalUrl))

const port = 4000
app.listen(port, () => console.log(`Listening on port ${port}`))

module.exports = app
