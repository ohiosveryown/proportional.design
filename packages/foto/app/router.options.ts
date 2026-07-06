function isPhotoRoute(path) {
  return path.startsWith('/photo/')
}

export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    // Keep scroll position when opening, closing, or paging the lightbox
    if (isPhotoRoute(to.path) || isPhotoRoute(from.path)) {
      return false
    }

    return { top: 0 }
  },
}
