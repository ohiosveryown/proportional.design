<template>
  <main
    class="gallery"
    :class="{ galleryHasFilter: !!activeFilter?.tags?.length }"
    @click="onGalleryClick"
    @contextmenu.prevent
  >
    <GalleryStatus
      :loading="showSpinner"
      :error="error"
      :empty="!showSpinner && photos.length === 0"
    />

    <template v-if="!showSpinner && photos.length">
      <PhotoGrid
        v-model:wiggle-mode="wiggleMode"
        :photos="visiblePhotos"
        :lightbox-open="openIndex >= 0"
        @photo-click="openLightboxForPhoto"
        @delete-request="deleteTarget = $event"
      />
      <PhotoLightbox
        v-model:open-index="openIndex"
        :photos="visiblePhotos"
        :paused="!!editingPhoto"
        @edit-request="editingPhoto = $event"
      />
    </template>

    <DeletePhotoModal
      :target="deleteTarget"
      :error="deleteError"
      :loading="deleteLoading"
      @close="deleteTarget = null"
      @submit="onDeleteSubmit"
    />
    <ContactModal v-model:open="contactOpen" />
    <EditPhotoModal
      :photo="editingPhoto"
      @close="editingPhoto = null"
      @updated="onPhotoUpdated"
    />

    <GalleryHeader
      v-if="!showSpinner"
      @contact-click="contactOpen = true"
    />

    <FilterIsland
      v-if="!showSpinner && photos.length"
      :messages="chatMessages"
      :active-filter="activeFilter"
      :available-tags="availableTags"
      :loading="chatLoading"
      @send="onSend"
      @remove-tag="onRemoveTag"
      @apply-tag="onApplyTag"
    />
  </main>
</template>

<script setup>
  import { photoPath } from '~/utils/photo-slug'

  const siteUrl = 'https://fotos.proportional.design'
  const siteName = 'Proportional Design'
  const siteDescription =
    'Proportional Design is a small furniture studio in Atlanta, Georgia, building functional objects from sustainable materials since 2016.'

  const route = useRoute()
  const router = useRouter()
  const { data, pending, error } = useLazyFetch('/api/photos')
  const photos = computed(() => data.value?.photos || [])

  const pageLoaded = ref(false)
  onMounted(() => {
    if (document.readyState === 'complete') {
      pageLoaded.value = true
      return
    }
    window.addEventListener(
      'load',
      () => {
        pageLoaded.value = true
      },
      { once: true },
    )
  })
  const showSpinner = computed(() => pending.value || !pageLoaded.value)

  const {
    chatMessages,
    activeFilter,
    chatLoading,
    visiblePhotos,
    availableTags,
    onSend,
    onRemoveTag,
    onApplyTag,
  } = useChatFilter(photos)

  function clearFilter() {
    activeFilter.value = null
  }

  const openIndex = ref(-1)
  const { openLightboxForPhoto, findPhotoBySlug } = usePhotoRoute(
    photos,
    visiblePhotos,
    openIndex,
    { clearFilter },
  )

  const activePhoto = computed(() => {
    const slug = route.params.slug
    if (slug) return findPhotoBySlug(slug)
    if (openIndex.value < 0) return null
    return visiblePhotos.value[openIndex.value] || null
  })

  useHead(() => {
    const photo = activePhoto.value
    if (!photo) {
      return {
        title: `${siteName} — A fine furniture studio in Atlanta, Georgia`,
        meta: [
          { property: 'og:title', content: `${siteName} — A fine furniture studio in Atlanta, Georgia` },
          { property: 'og:description', content: siteDescription },
          { property: 'og:url', content: siteUrl },
          { property: 'og:type', content: 'website' },
        ],
        link: [{ rel: 'canonical', href: siteUrl }],
      }
    }

    const title = photo.caption
      ? `${photo.caption} — ${siteName}`
      : siteName
    const url = `${siteUrl}${photoPath(photo)}`
    const description = [photo.caption, ...(photo.tags || [])]
      .filter(Boolean)
      .join(' · ') || siteDescription

    return {
      title,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: photo.url },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: photo.url },
      ],
      link: [{ rel: 'canonical', href: url }],
    }
  })

  const contactOpen = ref(false)

  const editingPhoto = ref(null)
  function onPhotoUpdated(photo, patch) {
    data.value = {
      ...data.value,
      photos: data.value.photos.map((p) =>
        p.filename === photo.filename ? { ...p, ...patch } : p,
      ),
    }
    if (
      patch.slug &&
      findPhotoBySlug(route.params.slug)?.filename === photo.filename
    ) {
      router.replace(photoPath({ ...photo, ...patch }))
    }
    editingPhoto.value = null
  }

  const wiggleMode = ref(false)
  function exitWiggle() {
    wiggleMode.value = false
  }
  function onGalleryClick(e) {
    if (!wiggleMode.value) return
    if (!e.target.closest('.photoWrap')) exitWiggle()
  }

  const deleteTarget = ref(null)
  const deleteError = ref('')
  const deleteLoading = ref(false)

  async function onDeleteSubmit(password) {
    const target = deleteTarget.value
    if (!target) return
    const wasOpen =
      openIndex.value >= 0 &&
      visiblePhotos.value[openIndex.value]?.filename === target.filename
    const snapshot = data.value
    data.value = {
      ...data.value,
      photos: data.value.photos.filter((p) => p.filename !== target.filename),
    }
    deleteTarget.value = null
    if (!photos.value.length) exitWiggle()
    if (wasOpen) openIndex.value = -1

    deleteLoading.value = true
    deleteError.value = ''
    try {
      const res = await $fetch('/api/delete-photo', {
        method: 'DELETE',
        body: {
          publicId: target.filename,
          password,
          resource_type: target.resource_type,
        },
      })
      if (!res.success) {
        data.value = snapshot
        deleteTarget.value = target
        deleteError.value = res.error || 'Incorrect password'
      }
    } catch {
      deleteError.value = 'Something went wrong'
    } finally {
      deleteLoading.value = false
    }
  }
</script>

<style scoped>
  .gallery {
    margin: 0 auto;
    @media (min-width: 640px) {
      margin-top: 40px;
      padding: 2rem 1rem;
      max-width: 1400px;
    }
  }

  @media (max-width: 640px) {
    .gallery.galleryHasFilter {
      padding-top: 112px;
    }
  }
</style>
