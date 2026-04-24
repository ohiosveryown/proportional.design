<template>
  <div
    ref="gridEl"
    class="grid"
  >
    <div
      v-for="(photo, i) in photos"
      :key="photo.url"
      class="photoWrap"
      :class="{ wiggling: wiggleMode, revealed: revealed.has(photo.url) }"
      :style="itemStyle(photo, i)"
      :data-photo-url="photo.url"
      :data-photo-index="i"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointermove="onPointerMove"
    >
      <button
        type="button"
        class="photo"
        :style="photoStyle(photo)"
        @click="onPhotoClick(photo)"
      >
        <video
          v-if="isVideo(photo)"
          :src="photo.url"
          :poster="photo.thumbUrl || undefined"
          muted
          autoplay
          loop
          playsinline
          preload="metadata"
        />
        <img
          v-else
          :src="photo.thumbUrl || photo.url"
          :alt="photo.filename"
          :width="photo.width || undefined"
          :height="photo.height || undefined"
          loading="lazy"
        />
      </button>

      <span class="caption">{{ captionNumber(i) }}</span>

      <button
        v-if="wiggleMode"
        type="button"
        class="deleteBtn"
        aria-label="Delete photo"
        @click.stop="emit('delete-request', photo)"
      >
        –
      </button>
    </div>

    <div
      class="monthLabel"
      :class="{ monthLabelVisible: isScrolling && !!currentMonth }"
      aria-hidden="true"
    >
      {{ currentMonth }}
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    photos: { type: Array, required: true },
  })

  const wiggleMode = defineModel('wiggleMode', {
    type: Boolean,
    default: false,
  })
  const emit = defineEmits(['photo-click', 'delete-request'])

  const gridEl = ref(null)
  const revealed = ref(new Set())
  const observed = new WeakSet()
  const videoObserved = new WeakSet()
  const scanObserved = new WeakSet()
  let observer = null
  let videoObserver = null
  let scanObserver = null

  const activeIndices = new Set()
  const currentMonth = ref('')
  const isScrolling = ref(false)
  let scrollIdleTimer = null

  function formatMonth(iso) {
    if (!iso) return ''
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
      })
    } catch {
      return ''
    }
  }

  function updateMonthLabel() {
    if (!activeIndices.size) return
    let min = Infinity
    for (const i of activeIndices) if (i > 0 && i < min) min = i
    if (min === Infinity) return
    const photo = props.photos[min]
    const next = formatMonth(photo?.takenAt || photo?.uploadedAt)
    if (next && next !== currentMonth.value) currentMonth.value = next
  }

  function onScroll() {
    isScrolling.value = true
    if (scrollIdleTimer) clearTimeout(scrollIdleTimer)
    scrollIdleTimer = setTimeout(() => {
      isScrolling.value = false
    }, 1200)
  }

  function observeAll() {
    if (!gridEl.value) return
    if (observer) {
      gridEl.value.querySelectorAll('.photoWrap').forEach((el) => {
        if (observed.has(el)) return
        const url = el.dataset.photoUrl
        if (!url || revealed.value.has(url)) return
        observer.observe(el)
        observed.add(el)
      })
    }
    if (videoObserver) {
      gridEl.value.querySelectorAll('.photo video').forEach((el) => {
        if (videoObserved.has(el)) return
        videoObserver.observe(el)
        videoObserved.add(el)
      })
    }
    if (scanObserver) {
      gridEl.value.querySelectorAll('.photoWrap').forEach((el) => {
        if (scanObserved.has(el)) return
        scanObserver.observe(el)
        scanObserved.add(el)
      })
    }
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        let changed = false
        const next = new Set(revealed.value)
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const url = entry.target.dataset.photoUrl
          if (url && !next.has(url)) {
            next.add(url)
            changed = true
          }
          observer.unobserve(entry.target)
        }
        if (changed) revealed.value = next
      },
      { rootMargin: '0px 0px -5% 0px' },
    )
    videoObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target
          if (entry.isIntersecting) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        }
      },
      { rootMargin: '1px' },
    )
    scanObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number(entry.target.dataset.photoIndex)
          if (Number.isNaN(idx)) continue
          if (entry.isIntersecting) activeIndices.add(idx)
          else activeIndices.delete(idx)
        }
        updateMonthLabel()
      },
      { rootMargin: '-80px 0px -80% 0px' },
    )
    observeAll()
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  watch(
    () => props.photos.length,
    () => {
      activeIndices.clear()
      nextTick(observeAll)
    },
  )

  onBeforeUnmount(() => {
    observer?.disconnect()
    videoObserver?.disconnect()
    scanObserver?.disconnect()
    if (scrollIdleTimer) clearTimeout(scrollIdleTimer)
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', onScroll)
    }
  })

  function itemStyle(_photo, i) {
    const delay = i < 12 ? i * 0.04 : 0
    const style = {
      transition: `opacity 0.5s ease-out ${delay}s, filter 0.5s ease-out ${delay}s`,
    }
    if (wiggleMode.value) style.animationDelay = `${(i % 3) * 0.05}s`
    return style
  }

  function isVideo(photo) {
    return photo.resource_type === 'video'
  }

  function photoStyle(photo) {
    if (photo.width && photo.height) {
      return { aspectRatio: `${photo.width} / ${photo.height}` }
    }
    return { aspectRatio: '1 / 1' }
  }

  function captionNumber(i) {
    return String(i + 1).padStart(2, '0')
  }

  let pressTimer = null
  let pointerMoved = false
  let suppressNextClick = false

  function onPointerDown(e) {
    if (e.button !== 0 && e.pointerType !== 'touch') return
    pointerMoved = false
    pressTimer = setTimeout(() => {
      if (!pointerMoved) {
        wiggleMode.value = true
        suppressNextClick = true
      }
    }, 600)
  }

  function onPointerUp() {
    clearTimeout(pressTimer)
  }

  function onPointerMove() {
    pointerMoved = true
    clearTimeout(pressTimer)
  }

  function onPhotoClick(photo) {
    if (suppressNextClick) {
      suppressNextClick = false
      return
    }
    if (wiggleMode.value) {
      wiggleMode.value = false
      return
    }
    emit('photo-click', photo)
  }
</script>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    align-items: start;
    gap: 36px 20px;
  }

  .photoWrap {
    position: relative;
    opacity: 0;
    filter: blur(10px);
  }

  .photoWrap.revealed {
    opacity: 1;
    filter: blur(0px);
  }

  @keyframes wiggle {
    0% {
      transform: rotate(-1.5deg) scale(1);
    }
    50% {
      transform: rotate(1.5deg) scale(1);
    }
    100% {
      transform: rotate(-1.5deg) scale(1);
    }
  }

  .photoWrap.wiggling {
    animation: wiggle 0.4s infinite ease-in-out;
    transform-origin: center;
  }

  .photo {
    width: 100%;
    overflow: hidden;
    background: #1a1a1a;
    display: block;
    cursor: pointer;
    border: 0;
    padding: 0;
    appearance: none;
  }

  .photo img,
  .photo video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .caption {
    display: block;
    margin-top: 8px;
    text-align: right;
    font-size: 12px;
    letter-spacing: -0.04em;
    color: rgba(255, 255, 255, 0.4);
    font-family: ui-monospace, monospace;
    font-variant-numeric: tabular-nums;
  }

  .deleteBtn {
    position: absolute;
    top: -14px;
    left: -14px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(8px);
    color: #fff;
    font-size: 18px;
    line-height: 1;
    display: grid;
    place-items: center;
    cursor: pointer;
    z-index: 10;
    padding: 0;
  }

  .monthLabel {
    position: fixed;
    bottom: calc(16px + env(safe-area-inset-bottom));
    left: 50%;
    z-index: 400;
    padding: 8px 14px;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: rgba(255, 255, 255, 0.88);
    background: rgba(0, 0, 0, 0.32);
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    box-shadow:
      0 10px 40px rgba(0, 0, 0, 0.45),
      0 0.5px 0 rgba(255, 255, 255, 0.4) inset;
    opacity: 0;
    transform: translate(-50%, 8px);
    pointer-events: none;
    transition:
      opacity 280ms ease,
      transform 280ms ease;
    white-space: nowrap;
  }

  .monthLabel.monthLabelVisible {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  @media (min-width: 640px) {
    .monthLabel {
      bottom: auto;
      top: max(16px, env(safe-area-inset-top));
      transform: translate(-50%, -8px);
    }

    .monthLabel.monthLabelVisible {
      transform: translate(-50%, 0);
    }
  }

  @media (max-width: 1100px) {
    .grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (max-width: 640px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .photo {
      aspect-ratio: 1 / 1 !important;
    }

    .caption {
      display: none;
    }
  }
</style>
