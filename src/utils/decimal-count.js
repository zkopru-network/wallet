export default function (numString) {
  if (isNaN(numString)) return 0
  const str = `${numString}`
  if (str.indexOf('.') === -1) return 0
  const [,decimals] = str.split('.')
  return decimals.length
}
