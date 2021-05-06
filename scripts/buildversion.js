const fs = require('fs')
const path = require('path')

const currentBuild = fs.readFileSync(path.join(__dirname, '../src/buildnum.js')).toString()
const [,num] = currentBuild.match(/export default (\d+)/)
fs.writeFileSync(
  path.join(__dirname, '../src/buildnum.js'),
  `export default ${+num+1}`
)
