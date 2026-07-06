import { fromPhotoSlug, photoPath } from '~/utils/photo-slug'

export function usePhotoRoute(photos, visiblePhotos, openIndex, { clearFilter }) {
  const route = useRoute()
  const router = useRouter()
  let syncing = false

  function findPhotoBySlug(slug) {
    if (!slug) return null
    const filename = fromPhotoSlug(slug)
    return photos.value.find((p) => p.filename === filename) || null
  }

  function openIndexForSlug(slug) {
    const photo = findPhotoBySlug(slug)
    if (!photo) return -1

    let idx = visiblePhotos.value.findIndex((p) => p.filename === photo.filename)
    if (idx < 0) {
      clearFilter()
      idx = visiblePhotos.value.findIndex((p) => p.filename === photo.filename)
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

    const idx = openIndexForSlug(slug)
    openIndex.value = idx >= 0 ? idx : -1
  }

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
    const idx = openIndexForSlug(route.params.slug)
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
    router.push(photoPath(photo))
  }

  return {
    openLightboxForPhoto,
    findPhotoBySlug,
  }
}
