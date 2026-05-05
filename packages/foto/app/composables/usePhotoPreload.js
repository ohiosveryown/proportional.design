const preloadedUrls = new Set()

export function usePhotoPreload() {
  const canHover = ref(false)

  onMounted(() => {
    canHover.value = window.matchMedia('(hover: hover)').matches
  })

  function preloadPhoto(photo) {
    if (!import.meta.client) return
    if (!photo || photo.resource_type === 'video') return
    const isNarrow = window.matchMedia('(max-width: 639px)').matches
    const target = isNarrow && photo.urlSm ? photo.urlSm : photo.url
    if (!target || preloadedUrls.has(target)) return
    preloadedUrls.add(target)
    const img = new Image()
    img.src = target
  }

  return { canHover, preloadPhoto }
}
