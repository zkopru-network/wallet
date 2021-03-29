import axios from 'axios'
import { createApp } from '.'

export default (context) => new Promise(async (rs, rj) => {
  const { app, router, store } = createApp()
  const { url } = context
  const { fullPath } = router.resolve(url).route
  if (fullPath !== url) {
    return rj({ url: fullPath })
  }

  router.push(url)
  router.onReady(async () => {
    try {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return rj({ code: 404 })
      }
      context.state = store.state
      context.meta = app.$meta()
      rs(app)
    } catch (err) {
      rj(err)
    }
  }, rj)
})
