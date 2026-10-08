function isOverlayRoute(path) {
  return path.startsWith('/photo/') || path.startsWith('/story/')
}

export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    // Keep scroll position when opening, closing, or paging overlays
    if (isOverlayRoute(to.path) || isOverlayRoute(from.path)) {
      return false
    }

    return { top: 0 }
  },
}
