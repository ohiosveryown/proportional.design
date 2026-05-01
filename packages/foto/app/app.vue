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

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    height: 100vh;
    background: #0a0a0a;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0a0a0a;
    color: #fff;
    min-height: 100vh;
  }

  :focus {
    outline: none;
  }

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

<script setup>
  const { data, pending, error } = useLazyFetch('/api/photos')
  const photos = computed(() => data.value?.photos || [])

  // Page load gating (wait for full window load, not just Suspense)
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

  // Chat / filter island
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

  // Lightbox
  const openIndex = ref(-1)
  function openLightboxForPhoto(photo) {
    const idx = visiblePhotos.value.findIndex((p) => p.url === photo.url)
    openIndex.value = idx >= 0 ? idx : 0
  }

  // Contact modal
  const contactOpen = ref(false)

  // Edit metadata modal
  const editingPhoto = ref(null)
  function onPhotoUpdated(photo, patch) {
    data.value = {
      ...data.value,
      photos: data.value.photos.map((p) =>
        p.filename === photo.filename ? { ...p, ...patch } : p,
      ),
    }
    editingPhoto.value = null
  }

  // Wiggle / delete mode
  const wiggleMode = ref(false)
  function exitWiggle() {
    wiggleMode.value = false
  }
  function onGalleryClick(e) {
    if (!wiggleMode.value) return
    if (!e.target.closest('.photoWrap')) exitWiggle()
  }

  // Delete flow — page owns the photo list, so API + optimistic rollback live here
  const deleteTarget = ref(null)
  const deleteError = ref('')
  const deleteLoading = ref(false)

  async function onDeleteSubmit(password) {
    const target = deleteTarget.value
    if (!target) return
    const snapshot = data.value
    data.value = {
      ...data.value,
      photos: data.value.photos.filter((p) => p.filename !== target.filename),
    }
    deleteTarget.value = null
    if (!photos.value.length) exitWiggle()

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
