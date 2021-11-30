export default (text, style = {}) => {
  const el = document.createElement('div')
  el.style.whiteSpace = 'no-wrap'
  el.style.width = 'auto'
  el.style.height = 'auto'
  Object.assign(el.style, style)
  el.innerHTML = text
  document.body.appendChild(el)
  const width = Math.ceil(el.clientWidth)
  document.body.removeChild(el)
  return width
}
