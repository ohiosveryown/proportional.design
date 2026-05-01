<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="activePhoto"
        class="lightboxBackdrop"
        @click="close"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchCancel"
      >
        <div class="lightboxStage">
          <div class="lightboxMedia">
            <video
              v-if="isVideo(activePhoto)"
              :src="activePhoto.url"
              :poster="activePhoto.thumbUrl || undefined"
              class="lightboxImg lightboxVideo"
              :class="{ navBlur }"
              autoplay
              loop
              muted
              playsinline
              controls
            />
            <picture v-else>
              <source
                v-if="activePhoto.urlSm"
                :srcset="activePhoto.urlSm"
                media="(max-width: 639px)"
              />
              <img
                :src="activePhoto.url"
                :alt="activePhoto.filename"
                class="lightboxImg"
                :class="{ navBlur }"
                decoding="async"
              />
            </picture>
          </div>

          <div
            class="lightboxMeta"
            :class="{ navBlur }"
            @click.stop
          >
            <p
              v-if="activePhoto.caption"
              class="metaCaption"
            >
              {{ activePhoto.caption }}
            </p>
            <div
              v-if="
                activePhoto.takenAt ||
                (activePhoto.tags && activePhoto.tags.length)
              "
              class="metaTags"
            >
              <span
                v-if="activePhoto.takenAt"
                class="metaTag metaTagDate"
                >{{ formatTakenAt(activePhoto.takenAt) }}</span
              >
              <span
                v-for="tag in sortedTags"
                :key="tag"
                class="metaTag"
                >{{ tag }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
  const props = defineProps({
    photos: { type: Array, required: true },
    paused: { type: Boolean, default: false },
  })

  const openIndex = defineModel('openIndex', { type: Number, default: -1 })
  const emit = defineEmits(['edit-request'])

  const activePhoto = computed(() => {
    if (openIndex.value < 0) return null
    return props.photos[openIndex.value] || null
  })

  const sortedTags = computed(() => {
    const tags = activePhoto.value?.tags
    if (!tags?.length) return []
    return [...tags].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' }),
    )
  })

  function isVideo(photo) {
    return photo?.resource_type === 'video'
  }

  function formatTakenAt(iso) {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
      })
    } catch {
      return ''
    }
  }

  function close() {
    openIndex.value = -1
  }

  const navBlur = ref(false)

  function triggerNavBlur() {
    navBlur.value = true
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        navBlur.value = false
      })
    })
  }

  function goNext() {
    if (!props.photos.length) return
    triggerNavBlur()
    openIndex.value = (openIndex.value + 1) % props.photos.length
  }

  function goPrev() {
    if (!props.photos.length) return
    triggerNavBlur()
    openIndex.value =
      (openIndex.value - 1 + props.photos.length) % props.photos.length
  }

  function onKey(e) {
    if (props.paused) return
    if (!activePhoto.value) return
    if (e.key === 'Escape') {
      close()
      return
    }
    if (e.key === 'ArrowRight') goNext()
    if (e.key === 'ArrowLeft') goPrev()
    if (e.key === '?') {
      e.preventDefault()
      emit('edit-request', activePhoto.value)
    }
  }

  const touchState = {
    startX: 0,
    startY: 0,
    startTime: 0,
    active: false,
    swiped: false,
  }

  function onTouchStart(e) {
    if (e.touches.length !== 1) {
      touchState.active = false
      return
    }
    const t = e.touches[0]
    touchState.startX = t.clientX
    touchState.startY = t.clientY
    touchState.startTime = Date.now()
    touchState.active = true
    touchState.swiped = false
  }

  function onTouchMove(e) {
    if (!touchState.active || touchState.swiped) return
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    const dx = t.clientX - touchState.startX
    const dy = t.clientY - touchState.startY
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    if (absX >= 50 && absX > absY) {
      touchState.swiped = true
      if (dx < 0) goNext()
      else goPrev()
      return
    }
    if (dy >= 70 && absY > absX) {
      touchState.swiped = true
      close()
    }
  }

  function onTouchEnd(e) {
    if (touchState.swiped) {
      e.preventDefault()
      e.stopPropagation()
    }
    touchState.active = false
  }

  function onTouchCancel() {
    touchState.active = false
    touchState.swiped = false
  }

  onMounted(() => window.addEventListener('keydown', onKey))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

  const isOpen = computed(() => !!activePhoto.value)
  useBodyScrollLock(isOpen)
</script>

<style>
  .lightboxBackdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    height: 100lvh;
    background: rgba(0, 0, 0, 0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: 18px;
    overscroll-behavior: contain;
  }

  .lightbox-enter-active,
  .lightbox-leave-active {
    transition:
      opacity 0.2s ease-in-out,
      backdrop-filter 0.2s ease-in-out;
  }

  .lightbox-enter-active .lightboxImg,
  .lightbox-leave-active .lightboxImg,
  .lightbox-enter-active .lightboxMeta,
  .lightbox-leave-active .lightboxMeta {
    transition:
      opacity 0.2s ease-in-out,
      filter 0.2s ease-in-out;
  }

  .lightbox-enter-from,
  .lightbox-leave-to {
    opacity: 0;
    backdrop-filter: blur(0px);
  }

  .lightbox-enter-from .lightboxImg,
  .lightbox-leave-to .lightboxImg,
  .lightbox-enter-from .lightboxMeta,
  .lightbox-leave-to .lightboxMeta {
    opacity: 0;
    filter: blur(20px);
  }

  .lightboxStage {
    position: relative;
    width: min(1100px, 100%);
    display: grid;
    place-items: center;
    pointer-events: none;
    overflow: visible;
  }

  .lightboxMedia {
    width: 100%;
    height: 100%;
    pointer-events: auto;
    display: grid;
    place-items: center;
    overflow: visible;
  }

  .lightboxImg {
    max-width: min(1100px, calc(100vw - 36px));
    max-height: calc(100dvh - 220px);
    box-shadow: 0 30px 100px rgba(0, 0, 0, 0.55);
    object-fit: contain;
    background: rgba(255, 255, 255, 0.04);
    pointer-events: none;
    transition: filter 260ms ease-out;
  }

  .lightboxImg.navBlur {
    filter: blur(20px);
    transition: none;
  }

  .lightboxVideo {
    pointer-events: auto;
  }

  .lightboxMeta {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translate(-50%, 100%);
    width: min(420px, calc(100vw - 36px));
    padding: 0.75rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    pointer-events: auto;
    transition: filter 260ms ease-out;
  }

  .lightboxMeta.navBlur {
    filter: blur(10px);
    transition: none;
  }

  .metaCaption {
    font-weight: 500;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.85);
    text-align: center;
    line-height: 1.4;
    letter-spacing: 0.25px;
    text-transform: capitalize;
  }

  .metaTagDate {
    text-transform: none;
  }

  .metaTags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .metaTag {
    text-transform: capitalize;
    font-size: 13px;
    font-family: 'Georgia', 'Times New Roman', Times, serif;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.01em;
  }

  .metaTag:not(:last-child)::after {
    content: '•';
    margin: 0 4px;
    color: rgba(255, 255, 255, 0.35);
  }

  @media (max-width: 640px) {
    .lightboxStage {
      width: min(1100px, 100%);
    }
  }
</style>
