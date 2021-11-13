const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { importer } = require('ipfs-unixfs-importer')
const cidbadge = require('cidbadge')

// first calculate the cid for static assets like svg/png/jpg/ttf
// then replace their occurences in bundles like js/html files

async function main() {
  const assetDir = path.join(__dirname, '../build')
  const outputDir = path.join(__dirname, '../ipfs')
  try {
    fs.rmSync(outputDir, { recursive: true })
  } catch (_) { console.log(_)}
  fs.mkdirSync(outputDir)
  let files = fs.readdirSync(assetDir)
  const processedFiles = {}

  // first process assets
  const assetExtensions = ['.svg', '.png', '.jpeg', '.jpg', '.ttf']
  for (const file of files) {
    if (assetExtensions.indexOf(path.extname(file)) === -1) continue
    const cid = await generateCid(path.join(assetDir, file))
    fs.copyFileSync(path.join(assetDir, file), path.join(outputDir, cid.toString()))
    processedFiles[file] = `ipfs/${cid.toString()}`
  }
  files = files.filter(f => !processedFiles[f]).sort((a, b) => {
    // sort the bundles that rely on chunks last
    if (a.startsWith('main') || a.startsWith('vendors-main')) {
      return 1
    } else if (b.startsWith('main') || b.startsWith('vendors-main')) {
      return -1
    }
    return 0
  })
  // now process the js
  for (const file of files) {
    if (path.extname(file) !== '.js') continue
    // first replace all instances of previous files
    let data = fs.readFileSync(path.join(assetDir, file)).toString()
    for (const assetFilename of Object.keys(processedFiles)) {
      //
      data = data.replace(`/${assetFilename}`, `/${processedFiles[assetFilename]}`)
      data = data.replace(assetFilename, processedFiles[assetFilename])
      data = data.replace(assetFilename.slice(0, -3), processedFiles[assetFilename])
      // when automatically loading filenames don't append .js
      data = data.replace('+".js"', '+""')
      const bundles = ['group-wallet', 'vendors-group-wallet']
      for (const name of bundles) {
        if (data.indexOf(`:"${name}"`) === -1) continue
        const filename = files.find(f => f.startsWith(`${name}.`))
        if (!processedFiles[filename]) {
          throw new Error(`${name} chunk has not been processed`)
        }
        data = data.replace('[e]||e)+"."+', '[e]||"")+""+')
        data = data.replace(`:"${name}"`, `:"${processedFiles[filename]}"`)
        data = data.replace(filename.split('.')[1], '')
        for (const numberedChunk of files.filter(f => /^\d\.[a-z0-9]+\.js$/.test(f))) {
          if (!processedFiles[numberedChunk])
            throw new Error('Numbered chunk has not been processed yet')
          data = data.replace(numberedChunk.split('.')[1], processedFiles[numberedChunk])
        }
      }
    }
    const bundleData = Buffer.from(data)
    const tmpPath = path.join(outputDir, 'tmp')
    fs.writeFileSync(tmpPath, bundleData)
    const cid = await generateCid(tmpPath)
    console.log('bundle', cid)
    fs.renameSync(tmpPath, path.join(outputDir, cid))
    processedFiles[file] = `ipfs/${cid.toString()}`
  }
  files = files.filter(f => !processedFiles[f])
  // now process any html
  for (const file of files) {
    if (path.extname(file) !== '.html') continue
    // first replace all instances of previous files
    let data = fs.readFileSync(path.join(assetDir, file)).toString()
    for (const assetFilename of Object.keys(processedFiles)) {
      //
      data = data.replace(`/${assetFilename}`, `/${processedFiles[assetFilename]}`)
      data = data.replace(assetFilename, processedFiles[assetFilename])
    }
    const bundleData = Buffer.from(data)
    const tmpPath = path.join(outputDir, 'tmp')
    fs.writeFileSync(tmpPath, bundleData)
    const cid = await generateCid(tmpPath)
    fs.renameSync(tmpPath, path.join(outputDir, cid))
    console.log('html', cid.toString())
    processedFiles[file] = `ipfs/${cid.toString()}`
  }
  const link = `https://ipfs.tubby.cloud/${processedFiles['index.html']}`
  const badge = cidbadge(processedFiles['index.html'].split('/').pop())
  fs.writeFileSync(path.join(__dirname, '../ipfs_badge.svg'), Buffer.from(badge))
  const readmePath = path.join(__dirname, '../README.md')
  const readme = fs.readFileSync(readmePath).toString()
  const updatedReadme = readme.replace(
    /^.+<!-- badge -->/gm,
    `[![](./ipfs_badge.svg)](${link}) <!-- badge -->`
  )
  fs.writeFileSync(readmePath, updatedReadme)
}

async function generateCid(filepath) {
  const block = { get: () => { throw new Error() }, put: () => { throw new Error() } }
  const options = { onlyHash: true }
  let lastCid
  const content = fs.createReadStream(filepath)
  for await (const entry of importer([{ content }], block, options)) {
    lastCid = entry.cid
  }
  return lastCid.toString()
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
