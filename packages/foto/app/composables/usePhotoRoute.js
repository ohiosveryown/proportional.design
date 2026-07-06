import {
  findPhotoByRouteSlug,
  isCanonicalPhotoPath,
  photoPath,
} from '~/utils/photo-slug'

const GALLERY_SCROLL_KEY = 'gallery-scroll-y'

function saveGalleryScroll() {
  if (!import.meta.client) return
  sessionStorage.setItem(GALLERY_SCROLL_KEY, String(window.scrollY))
}

function restoreGalleryScroll() {
  if (!import.meta.client) return
  const raw = sessionStorage.getItem(GALLERY_SCROLL_KEY)
  if (raw == null) return
  sessionStorage.removeItem(GALLERY_SCROLL_KEY)
  const y = Number(raw)
  if (!Number.isFinite(y)) return
  requestAnimationFrame(() => {
    window.scrollTo(0, y)
  })
}

export function usePhotoRoute(photos, visiblePhotos, openIndex, { clearFilter }) {
  const route = useRoute()
  const router = useRouter()
  let syncing = false

  function findPhotoBySlug(slug) {
    return findPhotoByRouteSlug(photos.value, slug)
  }

  function openIndexForPhoto(photo) {
    if (!photo) return -1

    let idx = visiblePhotos.value.findIndex(
      (p) => p.filename === photo.filename,
    )
    if (idx < 0) {
      clearFilter()
      idx = visiblePhotos.value.findIndex(
        (p) => p.filename === photo.filename,
      )
    }
    return idx
  }

  function syncOpenIndexFromRoute() {
    const slug = route.params.slug
    if (!slug) {
      openIndex.value = -1
      return
    }

    if (!photos.value.length) return

    const photo = findPhotoBySlug(slug)
    if (!photo) {
      navigateTo('/', { replace: true })
      return
    }

    if (!isCanonicalPhotoPath(photo, route.path)) {
      syncing = true
      router.replace(photoPath(photo)).finally(() => {
        syncing = false
      })
    }

    const idx = openIndexForPhoto(photo)
    openIndex.value = idx >= 0 ? idx : -1
  }

  watch(
    () => route.path,
    (path, prev) => {
      if (prev?.startsWith('/photo/') && path === '/') {
        restoreGalleryScroll()
      }
    },
  )

  watch(
    [() => route.params.slug, photos],
    () => {
      if (syncing) return
      syncing = true
      syncOpenIndexFromRoute()
      nextTick(() => {
        syncing = false
      })
    },
    { immediate: true },
  )

  watch(visiblePhotos, () => {
    if (syncing || !route.params.slug) return
    const photo = findPhotoBySlug(route.params.slug)
    if (!photo) return
    const idx = openIndexForPhoto(photo)
    if (idx >= 0 && openIndex.value !== idx) {
      openIndex.value = idx
    }
  })

  watch(openIndex, (idx) => {
    if (syncing) return

    if (idx < 0) {
      if (route.path.startsWith('/photo/')) {
        syncing = true
        router.push('/').finally(() => {
          syncing = false
          restoreGalleryScroll()
        })
      }
      return
    }

    const photo = visiblePhotos.value[idx]
    if (!photo) return

    const target = photoPath(photo)
    if (route.path === target) return

    syncing = true
    const navigate = route.path.startsWith('/photo/')
      ? router.replace.bind(router)
      : router.push.bind(router)
    navigate(target).finally(() => {
      syncing = false
    })
  })

  function openLightboxForPhoto(photo) {
    saveGalleryScroll()
    router.push(photoPath(photo))
  }

  return {
    openLightboxForPhoto,
    findPhotoBySlug,
  }
}
