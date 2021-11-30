export function tryLoadAssetIcon(symbol) {
  try {
    return require(`../../assets/token_icons/${symbol.toUpperCase()}.svg`)
  } catch (_) {
    return require('../../assets/token_no_icon.png')
  }
}
