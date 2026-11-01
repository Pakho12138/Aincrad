import ImgLazy from '../plugins/vuepress-plugin-img-lazy/ImgLazy'

const SCROLLBAR_HIDE_DELAY = 900
const THUMB_MIN = 32

function setupOverlayScrollbar() {
  if (typeof window === 'undefined' || window.__AINCRAD_SCROLLBAR_BOUND__) return
  window.__AINCRAD_SCROLLBAR_BOUND__ = true

  const rail = document.createElement('div')
  rail.className = 'aincrad-scrollbar'
  rail.setAttribute('aria-hidden', 'true')

  const thumb = document.createElement('div')
  thumb.className = 'aincrad-scrollbar__thumb'
  rail.appendChild(thumb)
  document.body.appendChild(rail)

  let hideTimer = null
  let dragging = false
  let dragStartY = 0
  let dragStartScroll = 0

  const getMetrics = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0
    const viewH = window.innerHeight || document.documentElement.clientHeight || 0
    const scrollH = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      viewH
    )
    const maxScroll = Math.max(scrollH - viewH, 0)
    const thumbH = maxScroll <= 0 ? viewH : Math.max((viewH / scrollH) * viewH, THUMB_MIN)
    const track = Math.max(viewH - thumbH, 0)
    const thumbTop = maxScroll <= 0 ? 0 : (scrollTop / maxScroll) * track
    return { scrollTop, viewH, scrollH, maxScroll, thumbH, thumbTop }
  }

  const updateThumb = () => {
    const { maxScroll, thumbH, thumbTop } = getMetrics()
    if (maxScroll <= 0) {
      rail.classList.remove('is-visible')
      return
    }
    thumb.style.height = `${thumbH}px`
    thumb.style.transform = `translate3d(0, ${thumbTop}px, 0)`
  }

  const show = () => {
    if (document.documentElement.classList.contains('page-loading')) return
    if (document.documentElement.classList.contains('page-loading-exit')) return
    const { maxScroll } = getMetrics()
    if (maxScroll <= 0) return
    updateThumb()
    rail.classList.add('is-visible')
    if (hideTimer) clearTimeout(hideTimer)
    if (!dragging) {
      hideTimer = setTimeout(() => {
        rail.classList.remove('is-visible')
      }, SCROLLBAR_HIDE_DELAY)
    }
  }

  const onScroll = () => {
    show()
  }

  const onResize = () => {
    updateThumb()
  }

  thumb.addEventListener('mousedown', (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragging = true
    dragStartY = e.clientY
    dragStartScroll = window.pageYOffset || document.documentElement.scrollTop || 0
    rail.classList.add('is-visible')
    if (hideTimer) clearTimeout(hideTimer)
    document.body.style.userSelect = 'none'
  })

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return
    const { viewH, scrollH, maxScroll, thumbH } = getMetrics()
    if (maxScroll <= 0) return
    const track = Math.max(viewH - thumbH, 0)
    const deltaY = e.clientY - dragStartY
    const scrollDelta = track <= 0 ? 0 : (deltaY / track) * maxScroll
    window.scrollTo(0, Math.min(maxScroll, Math.max(0, dragStartScroll + scrollDelta)))
    updateThumb()
  })

  window.addEventListener('mouseup', () => {
    if (!dragging) return
    dragging = false
    document.body.style.userSelect = ''
    hideTimer = setTimeout(() => {
      rail.classList.remove('is-visible')
    }, SCROLLBAR_HIDE_DELAY)
  })

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })

  // 首屏 / 路由切换后同步一次
  updateThumb()
}

export default ({
  Vue,
  siteData,
  isServer,
  router
}) => {
  Vue.component(ImgLazy.name, ImgLazy);

  if (!isServer) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupOverlayScrollbar)
    } else {
      setupOverlayScrollbar()
    }

    if (router && router.afterEach) {
      router.afterEach(() => {
        // 等页面内容高度稳定后再量一次
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event('scroll'))
        })
      })
    }
  }
}
