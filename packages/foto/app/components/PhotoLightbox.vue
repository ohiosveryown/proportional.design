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
        <button
          type="button"
          class="lightboxBack"
          @click.stop="close"
        >
          Back
        </button>

        <div class="lightboxBody">
          <div
            class="lightboxMeta"
            @click.stop
          >
            <div
              v-if="outgoingPhoto"
              class="lightboxMetaInner isOutgoing"
              aria-hidden="true"
            >
              <p
                v-if="outgoingPhoto.takenAt"
                class="metaDate"
              >
                {{ formatTakenAt(outgoingPhoto.takenAt) }}
              </p>
              <div
                v-if="outgoingPhoto.caption || outgoingTags.length"
                class="metaCopy"
              >
                <p
                  v-if="outgoingPhoto.caption"
                  class="metaCaption"
                >
                  {{ outgoingPhoto.caption }}
                </p>
                <p
                  v-if="outgoingTags.length"
                  class="metaTags"
                >
                  <span
                    v-for="tag in outgoingTags"
                    :key="tag"
                    class="metaTag"
                    >{{ tag }}</span
                  >
                </p>
              </div>
            </div>
            <div
              :key="metaKey"
              class="lightboxMetaInner"
              :class="{ isIncoming: swapAnimating }"
            >
              <p
                v-if="activePhoto.takenAt"
                class="metaDate"
              >
                {{ formatTakenAt(activePhoto.takenAt) }}
              </p>
              <div
                v-if="activePhoto.caption || sortedTags.length"
                class="metaCopy"
              >
                <p
                  v-if="activePhoto.caption"
                  class="metaCaption"
                >
                  {{ activePhoto.caption }}
                </p>
                <p
                  v-if="sortedTags.length"
                  class="metaTags"
                >
                  <span
                    v-for="tag in sortedTags"
                    :key="tag"
                    class="metaTag"
                    >{{ tag }}</span
                  >
                </p>
              </div>
            </div>
          </div>

          <div class="lightboxStage">
            <div
              v-if="outgoingPhoto"
              class="lightboxMedia isOutgoing"
              aria-hidden="true"
            >
              <img
                :src="outgoingPhoto.url"
                alt=""
                class="lightboxImg"
              />
            </div>
            <div
              :key="metaKey"
              class="lightboxMedia"
              :class="{ isIncoming: swapAnimating }"
              @click.stop
            >
              <video
                v-if="isVideo(activePhoto)"
                :src="activePhoto.url"
                :poster="activePhoto.thumbUrl || undefined"
                class="lightboxImg lightboxVideo"
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
                  media="(max-width: 700px)"
                />
                <img
                  :src="activePhoto.url"
                  :alt="activePhoto.filename"
                  class="lightboxImg"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        </div>

        <div
          v-if="photos.length"
          ref="stripEl"
          class="lightboxStrip"
          aria-label="Photo filmstrip"
          @click.stop
          @touchstart.stop
        >
          <button
            v-for="(photo, i) in photos"
            :key="photo.slug || photo.url"
            type="button"
            class="lightboxThumb"
            :class="{ isActive: i === openIndex }"
            :data-active="i === openIndex ? 'true' : undefined"
            :aria-current="i === openIndex ? 'true' : undefined"
            :aria-label="thumbLabel(photo, i)"
            @click="selectIndex(i)"
          >
            <span class="lightboxThumbFrame">
              <img
                :src="photo.thumbUrl || photo.url"
                alt=""
                :loading="i === openIndex ? 'eager' : 'lazy'"
                decoding="async"
              />
            </span>
          </button>
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

  const stripEl = ref(null)

  const activePhoto = computed(() => {
    if (openIndex.value < 0) return null
    return props.photos[openIndex.value] || null
  })

  function sortPhotoTags(photo) {
    const tags = photo?.tags
    if (!tags?.length) return []
    return [...tags].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' }),
    )
  }

  const sortedTags = computed(() => sortPhotoTags(activePhoto.value))

  const metaKey = computed(() => {
    const photo = activePhoto.value
    if (!photo) return 'empty'
    return photo.slug || photo.url || 'photo'
  })

  const SWAP_MS = 280
  const swapAnimating = ref(false)
  const outgoingPhoto = ref(null)
  let lastSwapAt = 0
  let swapClearTimer = 0

  const outgoingTags = computed(() => sortPhotoTags(outgoingPhoto.value))

  function clearSwapLayers() {
    outgoingPhoto.value = null
    swapAnimating.value = false
  }

  function prepareSwap(first, prevIdx) {
    clearTimeout(swapClearTimer)
    if (first) {
      clearSwapLayers()
      lastSwapAt = 0
      return
    }
    const now = performance.now()
    const rapid = lastSwapAt > 0 && now - lastSwapAt < SWAP_MS
    lastSwapAt = now
    if (rapid) {
      clearSwapLayers()
      return
    }
    outgoingPhoto.value = props.photos[prevIdx] || null
    swapAnimating.value = true
    swapClearTimer = window.setTimeout(clearSwapLayers, SWAP_MS)
  }

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

  function thumbLabel(photo, i) {
    const caption = photo?.caption?.trim()
    if (caption) return `View ${caption}`
    return `View photo ${i + 1}`
  }

  function close() {
    openIndex.value = -1
  }

  function goNext() {
    moveBy(1)
  }

  function goPrev() {
    moveBy(-1)
  }

  function selectIndex(i) {
    if (i === openIndex.value) return
    openIndex.value = i
  }

  function moveBy(n) {
    const len = props.photos.length
    if (!len || !n) return false
    const next = Math.min(len - 1, Math.max(0, openIndex.value + n))
    if (next === openIndex.value) return false
    openIndex.value = next
    return true
  }

  function scrollActiveThumb(behavior = 'auto') {
    const strip = stripEl.value
    if (!strip || strip.offsetHeight === 0) return false
    const thumb = strip.querySelector('[data-active="true"]')
    if (!thumb) return false
    const stripRect = strip.getBoundingClientRect()
    const thumbRect = thumb.getBoundingClientRect()
    const next =
      strip.scrollTop +
      (thumbRect.top + thumbRect.height / 2) -
      (stripRect.top + stripRect.height / 2)
    if (behavior === 'smooth') {
      strip.scrollTo({ top: next, behavior: 'smooth' })
    } else {
      strip.scrollTop = next
    }
    return true
  }

  function scheduleScrollActiveThumb(behavior = 'auto') {
    nextTick(() => {
      if (scrollActiveThumb(behavior)) return
      requestAnimationFrame(() => {
        scrollActiveThumb(behavior)
      })
    })
  }

  function onStripLayoutChange() {
    if (openIndex.value < 0) return
    scrollActiveThumb('auto')
  }

  function onKey(e) {
    if (props.paused) return
    if (!activePhoto.value) return
    if (e.key === 'Escape') {
      close()
      return
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
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

  const wheelState = {
    acc: 0,
    idleTimer: 0,
  }
  const WHEEL_ITEM_PX = 80
  const WHEEL_IDLE_MS = 120
  const wheelOpts = { passive: false, capture: true }

  function wheelDeltaY(e) {
    if (e.deltaMode === 1) return e.deltaY * 16
    if (e.deltaMode === 2) return e.deltaY * 800
    return e.deltaY
  }

  function onWheel(e) {
    if (props.paused) return
    if (!activePhoto.value) return
    e.preventDefault()
    wheelState.acc += wheelDeltaY(e)
    const steps = Math.trunc(wheelState.acc / WHEEL_ITEM_PX)
    if (steps !== 0) {
      wheelState.acc -= steps * WHEEL_ITEM_PX
      if (!moveBy(steps)) wheelState.acc = 0
    }
    clearTimeout(wheelState.idleTimer)
    wheelState.idleTimer = window.setTimeout(() => {
      wheelState.acc = 0
    }, WHEEL_IDLE_MS)
  }

  const isOpen = computed(() => !!activePhoto.value)
  useBodyScrollLock(isOpen)

  watch(isOpen, (open) => {
    if (!import.meta.client) return
    if (open) window.addEventListener('wheel', onWheel, wheelOpts)
    else window.removeEventListener('wheel', onWheel, wheelOpts)
  })

  onMounted(() => {
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onStripLayoutChange)
    if (isOpen.value) window.addEventListener('wheel', onWheel, wheelOpts)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('resize', onStripLayoutChange)
    window.removeEventListener('wheel', onWheel, wheelOpts)
    clearTimeout(wheelState.idleTimer)
    clearTimeout(swapClearTimer)
  })

  const { preloadPhoto } = usePhotoPreload()
  watch(
    openIndex,
    (idx, prevIdx) => {
      if (idx < 0) {
        clearSwapLayers()
        lastSwapAt = 0
        clearTimeout(swapClearTimer)
        return
      }
      const len = props.photos.length
      if (!len) return
      if (idx + 1 < len) preloadPhoto(props.photos[idx + 1])
      if (idx - 1 >= 0) preloadPhoto(props.photos[idx - 1])
      const first = prevIdx == null || prevIdx < 0
      prepareSwap(first, prevIdx)
      scheduleScrollActiveThumb(first ? 'auto' : 'smooth')
    },
    { immediate: true },
  )

  watch(stripEl, (el) => {
    if (!el || openIndex.value < 0) return
    scheduleScrollActiveThumb('auto')
  })
</script>

<style scoped>
  .lightboxBackdrop {
    display: flex;
    position: fixed;
    z-index: 1000;
    inset: 0;
    overflow: hidden;
    background: #000;
    overscroll-behavior: contain;
  }

  .lightbox-enter-active,
  .lightbox-leave-active {
    transition: opacity 0.38s ease-out;
  }

  .lightbox-enter-active .lightboxMedia,
  .lightbox-leave-active .lightboxMedia,
  .lightbox-enter-active .lightboxMeta,
  .lightbox-leave-active .lightboxMeta,
  .lightbox-enter-active .lightboxStrip,
  .lightbox-leave-active .lightboxStrip {
    transition:
      opacity 0.38s ease-out,
      filter 0.38s ease-out;
  }

  .lightbox-enter-from,
  .lightbox-leave-to {
    opacity: 0;
  }

  .lightbox-enter-from .lightboxMedia,
  .lightbox-leave-to .lightboxMedia,
  .lightbox-enter-from .lightboxMeta,
  .lightbox-leave-to .lightboxMeta,
  .lightbox-enter-from .lightboxStrip,
  .lightbox-leave-to .lightboxStrip {
    opacity: 0;
    filter: blur(10px);
  }

  .lightboxBack {
    position: absolute;
    z-index: 2;
    top: 28px;
    left: 32px;
    margin: 0;
    padding: 0;
    border: 0;
    color: #fff;
    background: none;
    font-size: 14px;
    font-family: inherit;
    line-height: 1;
    opacity: 0.5;
    cursor: pointer;
    appearance: none;
    transition: opacity 0.2s ease;
  }

  .lightboxBack:hover,
  .lightboxBack:focus-visible {
    opacity: 1;
  }

  .lightboxBody {
    position: relative;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  .lightboxMeta {
    position: absolute;
    z-index: 2;
    top: 147px;
    left: 32px;
    width: 320px;
    color: #fff;
  }

  .lightboxMetaInner {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 22px;
    width: 100%;
  }

  .lightboxMetaInner.isOutgoing {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    animation: lightboxSwapOut 0.28s ease-out forwards;
  }

  .lightboxMetaInner.isIncoming,
  .lightboxMedia.isIncoming {
    animation: lightboxSwapIn 0.28s ease-out;
  }

  .lightboxMedia.isOutgoing {
    pointer-events: none;
    animation: lightboxSwapOut 0.28s ease-out forwards;
  }

  @keyframes lightboxSwapIn {
    from {
      opacity: 0;
      filter: blur(10px);
    }
  }

  @keyframes lightboxSwapOut {
    to {
      opacity: 0;
      filter: blur(10px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lightboxMetaInner.isOutgoing,
    .lightboxMetaInner.isIncoming,
    .lightboxMedia.isOutgoing,
    .lightboxMedia.isIncoming {
      animation: none;
    }
  }

  .metaDate {
    margin: 0;
    width: 100%;
    color: #fff;
    font-size: 14px;
    line-height: normal;
    opacity: 0.5;
  }

  .metaCopy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
  }

  .metaCaption {
    margin: 0;
    width: 100%;
    font-size: 20px;
    font-weight: 500;
    line-height: normal;
    text-transform: capitalize;
  }

  .metaTags {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    width: 100%;
  }

  .metaTag {
    color: #fff;
    font-size: 14px;
    text-transform: capitalize;
    opacity: 0.5;
  }

  .metaTag:not(:last-child)::after {
    content: '•';
    margin: 0 3px;
  }

  .lightboxStage {
    display: grid;
    place-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 160px 0 400px;
  }

  .lightboxMedia {
    display: flex;
    grid-area: 1 / 1;
    align-items: center;
    justify-content: center;
    width: fit-content;
    max-width: 100%;
    max-height: 100%;
  }

  .lightboxMedia picture {
    display: contents;
  }

  .lightboxImg {
    display: block;
    max-width: 100%;
    max-height: calc(100dvh - 220px);
    width: auto;
    height: auto;
    object-fit: contain;
  }

  .lightboxStrip {
    display: flex;
    position: absolute;
    z-index: 2;
    top: 0;
    right: 32px;
    bottom: 0;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    padding: calc(50vh - 40px) 0;
    width: 96px;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: none;
    -ms-overflow-style: none;
    touch-action: pan-y;
  }

  .lightboxStrip::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .lightboxThumb {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: flex-end;
    margin: 0;
    padding: 0;
    width: 96px;
    height: 80px;
    border: 0;
    background: none;
    cursor: pointer;
    appearance: none;
  }

  .lightboxThumbFrame {
    display: block;
    overflow: hidden;
    width: 64px;
    height: 80px;
    opacity: 0.5;
    transform-origin: right center;
    transition:
      opacity 0.38s cubic-bezier(0.22, 1, 0.36, 1),
      width 0.38s cubic-bezier(0.22, 1, 0.36, 1),
      height 0.38s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .lightboxThumb:hover .lightboxThumbFrame,
  .lightboxThumb:focus-visible .lightboxThumbFrame {
    opacity: 1;
  }

  .lightboxThumb.isActive .lightboxThumbFrame {
    width: 96px;
    height: 72px;
    opacity: 1;
  }

  .lightboxThumbFrame img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  @media (max-width: 1000px) {
    .lightboxBack {
      top: 28px;
      left: 32px;
    }

    .lightboxBody {
      display: flex;
      flex-direction: column;
      gap: 22px;
      padding: 72px 32px 32px;
      overflow-y: auto;
    }

    .lightboxMeta {
      position: relative;
      top: auto;
      left: auto;
      width: 100%;
    }

    .lightboxStage {
      place-items: start;
      width: 100%;
      height: auto;
      padding: 0;
    }

    .lightboxImg {
      max-width: 100%;
      max-height: calc(100dvh - 220px);
    }

    .lightboxStrip {
      display: none;
    }
  }
</style>
