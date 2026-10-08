<template>
  <main
    class="gallery"
    :class="{
      galleryHasFilter: !!activeFilter?.tags?.length,
      galleryHasStories: stories.length > 0,
    }"
    @click="onGalleryClick"
    @contextmenu.prevent
  >
    <GalleryStatus
      :loading="showSpinner"
      :error="error"
      :empty="!showSpinner && !photos.length && !stories.length"
    />

    <template v-if="!showSpinner && (photos.length || stories.length)">
      <StoriesStrip
        v-model:wiggle-mode="storyWiggleMode"
        :stories="stories"
        @open="openStory"
        @delete-request="onStoryDeleteRequest"
      />
      <PhotoGrid
        v-if="photos.length"
        v-model:wiggle-mode="wiggleMode"
        :photos="visiblePhotos"
        :lightbox-open="openIndex >= 0"
        @photo-click="openLightboxForPhoto"
        @delete-request="onPhotoDeleteRequest"
        @photo-error="onPhotoError"
      />
      <PhotoLightbox
        v-if="photos.length"
        v-model:open-index="openIndex"
        :photos="visiblePhotos"
        :paused="!!editingPhoto"
        @edit-request="editingPhoto = $event"
      />
      <StoryViewer
        v-model:open-index="storyOpenIndex"
        :stories="stories"
        :paused="!!deleteTarget"
        @delete-request="onStoryItemDeleteRequest"
      />
    </template>

    <DeletePhotoModal
      :target="deleteTarget"
      :title="deleteModalTitle"
      :error="deleteError"
      :loading="deleteLoading"
      @close="deleteTarget = null"
      @submit="onDeleteSubmit"
    />
    <ContactModal v-model:open="contactOpen" />
    <EditPhotoModal
      :photo="editingPhoto"
      :stories="liveStories"
      @close="editingPhoto = null"
      @updated="onPhotoUpdated"
      @added-to-story="onAddedToStory"
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
  // Client-only fetch: without this, the prerender/ISR render runs it at build
  // time and bakes a frozen photo list into the static HTML — new uploads then
  // never appear until a redeploy. server:false keeps the prerendered shell fast
  // while fetching the live list in the browser.
  const { data, pending, error } = useLazyFetch('/api/photos', {
    server: false,
  })
  const photos = computed(() => data.value?.photos || [])

  const { data: storiesData, refresh: refreshStories } = useLazyFetch(
    '/api/stories',
    { server: false },
  )

  function normalizeStory(story) {
    if (story?.items?.length) {
      return {
        ...story,
        name: story.name || story.caption || 'Untitled story',
      }
    }
    return {
      id: story.filename,
      name: story.storyName || story.caption || 'Untitled story',
      isNew: story.isNew,
      thumbUrl: story.thumbUrl || story.url,
      items: [story],
    }
  }

  const liveStories = computed(() =>
    (storiesData.value?.stories || []).map(normalizeStory),
  )

  const stories = liveStories

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
  const storyOpenIndex = ref(-1)
  const { openLightboxForPhoto, findPhotoBySlug } = usePhotoRoute(
    photos,
    visiblePhotos,
    openIndex,
    { clearFilter },
  )

  function openStory(index) {
    openIndex.value = -1
    storyOpenIndex.value = index
  }

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
          {
            property: 'og:title',
            content: `${siteName} — A fine furniture studio in Atlanta, Georgia`,
          },
          { property: 'og:description', content: siteDescription },
          { property: 'og:url', content: siteUrl },
          { property: 'og:type', content: 'website' },
        ],
        link: [{ rel: 'canonical', href: siteUrl }],
      }
    }

    const title = photo.caption ? `${photo.caption} — ${siteName}` : siteName
    const url = `${siteUrl}${photoPath(photo)}`
    const description =
      [photo.caption, ...(photo.tags || [])].filter(Boolean).join(' · ') ||
      siteDescription

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

  // A thumbnail failed to load even after a retry (asset gone from Cloudinary
  // while a cached list still references it). Prune it from the source data so
  // the grid, lightbox, and tag counts stay consistent — same mutation the
  // optimistic delete uses. Idempotent: no-op if it's already gone.
  function onPhotoError(photo) {
    if (!data.value?.photos?.some((p) => p.filename === photo.filename)) return
    const wasOpen =
      openIndex.value >= 0 &&
      visiblePhotos.value[openIndex.value]?.filename === photo.filename
    data.value = {
      ...data.value,
      photos: data.value.photos.filter((p) => p.filename !== photo.filename),
    }
    if (wasOpen) openIndex.value = -1
  }

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
  }

  async function onAddedToStory() {
    await refreshStories()
  }

  const wiggleMode = ref(false)
  const storyWiggleMode = ref(false)

  function exitWiggle() {
    wiggleMode.value = false
  }
  function exitStoryWiggle() {
    storyWiggleMode.value = false
  }
  function onGalleryClick(e) {
    if (wiggleMode.value && !e.target.closest('.photoWrap')) exitWiggle()
    if (storyWiggleMode.value && !e.target.closest('.storyRingWrap')) {
      exitStoryWiggle()
    }
  }

  const deleteTarget = ref(null)
  const deleteError = ref('')
  const deleteLoading = ref(false)

  const deleteModalTitle = computed(() => {
    const t = deleteTarget.value
    if (!t) return 'Delete photo?'
    if (t.kind === 'story') return 'Delete story?'
    if (t.kind === 'story-item') return 'Remove from story?'
    return 'Delete photo?'
  })

  function onPhotoDeleteRequest(photo) {
    deleteTarget.value = { kind: 'photo', ...photo }
  }

  function onStoryDeleteRequest(story) {
    deleteTarget.value = { kind: 'story', ...story }
  }

  function onStoryItemDeleteRequest(item) {
    deleteTarget.value = { kind: 'story-item', ...item }
  }

  async function onDeleteSubmit(password) {
    const target = deleteTarget.value
    if (!target) return

    deleteLoading.value = true
    deleteError.value = ''

    try {
      if (target.kind === 'story') {
        await deleteWholeStory(target, password)
      } else if (target.kind === 'story-item') {
        await deleteStoryItem(target, password)
      } else {
        await deleteGalleryPhoto(target, password)
      }
    } catch {
      deleteTarget.value = target
      deleteError.value = 'Something went wrong'
    } finally {
      deleteLoading.value = false
    }
  }

  async function deleteWholeStory(target, password) {
    const storyId = target.id
    const wasOpen =
      storyOpenIndex.value >= 0 &&
      stories.value[storyOpenIndex.value]?.id === storyId
    const liveSnapshot = storiesData.value

    storiesData.value = {
      ...storiesData.value,
      stories: (storiesData.value?.stories || []).filter(
        (s) => s.id !== storyId,
      ),
    }
    deleteTarget.value = null
    if (wasOpen) storyOpenIndex.value = -1
    if (!stories.value.length) exitStoryWiggle()

    const res = await $fetch('/api/delete-story', {
      method: 'DELETE',
      body: { storyId, password },
    })
    if (!res.success) {
      storiesData.value = liveSnapshot
      deleteTarget.value = target
      deleteError.value = res.error || 'Incorrect password'
    } else {
      exitStoryWiggle()
    }
  }

  async function deleteStoryItem(target, password) {
    const openStory =
      storyOpenIndex.value >= 0 ? stories.value[storyOpenIndex.value] : null
    const wasOpen =
      !!openStory &&
      openStory.items?.some((item) => item.filename === target.filename)
    const liveSnapshot = storiesData.value

    storiesData.value = {
      ...storiesData.value,
      stories: (storiesData.value?.stories || [])
        .map((s) => {
          if (!s.items?.length) {
            return s.filename === target.filename ? null : s
          }
          const items = s.items.filter(
            (item) => item.filename !== target.filename,
          )
          if (!items.length) return null
          return { ...s, items }
        })
        .filter(Boolean),
    }
    deleteTarget.value = null
    if (wasOpen && !stories.value.length) storyOpenIndex.value = -1

    // Deletes only the foto-stories/ asset; gallery foto/ copies are untouched.
    const res = await $fetch('/api/delete-photo', {
      method: 'DELETE',
      body: {
        publicId: target.filename,
        password,
        resource_type: target.resource_type,
      },
    })
    if (!res.success) {
      storiesData.value = liveSnapshot
      deleteTarget.value = target
      deleteError.value = res.error || 'Incorrect password'
    }
  }

  async function deleteGalleryPhoto(target, password) {
    const wasPhotoOpen =
      openIndex.value >= 0 &&
      visiblePhotos.value[openIndex.value]?.filename === target.filename
    const photoSnapshot = data.value

    data.value = {
      ...data.value,
      photos: data.value.photos.filter((p) => p.filename !== target.filename),
    }
    deleteTarget.value = null
    if (!photos.value.length) exitWiggle()
    if (wasPhotoOpen) openIndex.value = -1

    const res = await $fetch('/api/delete-photo', {
      method: 'DELETE',
      body: {
        publicId: target.filename,
        password,
        resource_type: target.resource_type,
      },
    })
    if (!res.success) {
      data.value = photoSnapshot
      deleteTarget.value = target
      deleteError.value = res.error || 'Incorrect password'
    }
  }
</script>

<style scoped>
  .gallery {
    margin: 0 auto;
    @media (min-width: 640px) {
      margin-top: 20px;
      padding: 2rem 1rem;
      max-width: 1400px;
    }
  }

  @media (max-width: 640px) {
    .gallery.galleryHasStories {
      padding-top: 64px;
    }

    .gallery.galleryHasFilter {
      padding-top: 112px;
    }
  }
</style>
