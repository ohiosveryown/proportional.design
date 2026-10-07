<template>
  <Teleport to="body">
    <Transition name="storyViewer">
      <div
        v-if="openIndex >= 0 && currentStory"
        class="storyViewer"
        role="dialog"
        aria-modal="true"
        aria-label="Story"
      >
        <div class="storyProgress" aria-hidden="true">
          <div
            v-for="(_, i) in currentItems"
            :key="`${openIndex}-${i}`"
            class="storyProgressTrack"
          >
            <div
              :key="i === itemIndex ? progressKey : `done-${i}`"
              class="storyProgressFill"
              :class="{
                isDone: i < itemIndex,
                isActive: i === itemIndex && !cubing,
                isPaused: holding || paused,
              }"
              :style="i === itemIndex ? { animationDuration: `${DURATION_MS}ms` } : undefined"
            />
          </div>
        </div>
        <button
          type="button"
          class="storyClose"
          aria-label="Close"
          @click.stop="close"
        >
          Close
        </button>

        <button
          type="button"
          class="storyDelete"
          aria-label="Remove from story"
          title="Remove from story (⇧?)"
          @click.stop="requestRemove"
        >
          Remove
        </button>

        <div
          ref="cubeEl"
          class="storyCube"
        >
          <div
            class="storyCubeInner"
            :class="{
              isCubing: cubing,
              isNext: cubeDir === 1,
              isPrev: cubeDir === -1,
            }"
            :style="{ '--cube-z': `${cubeZ}px` }"
          >
            <div class="storyFace storyFaceFront">
              <div class="storyMedia">
                <img
                  :src="frontItem.url"
                  :alt="frontItem.caption || 'Story'"
                  class="storyImg"
                  decoding="async"
                />
              </div>
              <p
                v-if="frontItem.caption"
                class="storyCaption"
              >
                {{ frontItem.caption }}
              </p>
            </div>

            <div
              v-if="cubing && sideItem"
              class="storyFace storyFaceSide"
            >
              <div class="storyMedia">
                <img
                  :src="sideItem.url"
                  :alt="sideItem.caption || 'Story'"
                  class="storyImg"
                  decoding="async"
                />
              </div>
              <p
                v-if="sideItem.caption"
                class="storyCaption"
              >
                {{ sideItem.caption }}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="storyHit storyHitPrev"
          aria-label="Previous story"
          :disabled="cubing"
          @pointerdown.stop="onHitDown($event, -1)"
          @pointermove.stop="onHitMove"
          @pointerup.stop="onHitUp($event, -1)"
          @pointercancel.stop="onHitCancel"
          @pointerleave.stop="onHitCancel"
          @click.prevent.stop
        />
        <button
          type="button"
          class="storyHit storyHitNext"
          aria-label="Next story"
          :disabled="cubing"
          @pointerdown.stop="onHitDown($event, 1)"
          @pointermove.stop="onHitMove"
          @pointerup.stop="onHitUp($event, 1)"
          @pointercancel.stop="onHitCancel"
          @pointerleave.stop="onHitCancel"
          @click.prevent.stop
        />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .storyViewer {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #000;
    touch-action: none;
  }

  .storyProgress {
    display: flex;
    gap: 4px;
    position: absolute;
    top: max(10px, env(safe-area-inset-top));
    right: 12px;
    left: 12px;
    z-index: 3;
  }

  .storyProgressTrack {
    flex: 1 1 0;
    overflow: hidden;
    height: 2px;
    border-radius: 1px;
    background: rgba(255, 255, 255, 0.25);
  }

  .storyProgressFill {
    width: 0;
    height: 100%;
    background: #fff;
  }

  .storyProgressFill.isDone {
    width: 100%;
  }

  .storyProgressFill.isActive {
    animation-name: storyProgress;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  .storyProgressFill.isPaused {
    animation-play-state: paused;
  }

  @keyframes storyProgress {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }

  .storyClose,
  .storyDelete {
    position: absolute;
    top: max(28px, calc(env(safe-area-inset-top) + 18px));
    z-index: 3;
    padding: 8px 12px;
    border: 0;
    border-radius: 999px;
    color: #fff;
    background: rgba(0, 0, 0, 0.45);
    font-size: 13px;
    cursor: pointer;
  }

  .storyClose {
    right: 12px;
  }

  .storyDelete {
    left: 12px;
  }

  .storyCube {
    /* Equal chrome bands above/below the photo: progress sits in the
       top band, caption in the bottom — same --story-edge size. */
    --story-edge: max(88px, calc(env(safe-area-inset-top) + 64px));
    --cube-z: 0px;
    position: relative;
    flex: 1 1 auto;
    width: 100%;
    overflow: hidden;
    min-height: 0;
    perspective: 1400px;
    perspective-origin: 50% 50%;
  }

  /* Real cube: faces sit on translateZ(radius). Parent rotateY swings the
     convex corner past the viewport (diagram), not a concave room-corner. */
  .storyCubeInner {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    transform: translateZ(calc(var(--cube-z) * -1));
  }

  .storyCubeInner.isCubing.isNext {
    animation: cubeSpinNext 0.48s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .storyCubeInner.isCubing.isPrev {
    animation: cubeSpinPrev 0.48s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .storyFace {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: #000;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .storyFaceFront {
    transform: translateZ(var(--cube-z));
  }

  /* Next: entering face on the RIGHT; exiting swings LEFT. */
  .storyCubeInner.isNext .storyFaceSide {
    transform: rotateY(90deg) translateZ(var(--cube-z));
  }

  /* Prev: mirror — entering face on the LEFT. */
  .storyCubeInner.isPrev .storyFaceSide {
    transform: rotateY(-90deg) translateZ(var(--cube-z));
  }

  .storyMedia {
    position: absolute;
    top: var(--story-edge);
    right: 16px;
    bottom: var(--story-edge);
    left: 16px;
  }

  .storyImg {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center center;
  }

  .storyCaption {
    position: absolute;
    right: 16px;
    bottom: calc(var(--story-edge) / 2 - 0.6em);
    left: 16px;
    z-index: 1;
    margin: 0;
    color: #fff;
    font-size: 15px;
    line-height: 1.35;
    text-align: center;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.7);
  }

  @keyframes cubeSpinNext {
    from {
      transform: translateZ(calc(var(--cube-z) * -1)) rotateY(0deg);
    }
    to {
      transform: translateZ(calc(var(--cube-z) * -1)) rotateY(-90deg);
    }
  }

  @keyframes cubeSpinPrev {
    from {
      transform: translateZ(calc(var(--cube-z) * -1)) rotateY(0deg);
    }
    to {
      transform: translateZ(calc(var(--cube-z) * -1)) rotateY(90deg);
    }
  }

  .storyHit {
    position: absolute;
    top: 56px;
    bottom: 0;
    z-index: 4;
    width: 50%;
    border: 0;
    background: transparent;
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  .storyHit:disabled {
    pointer-events: none;
  }

  .storyHitPrev {
    left: 0;
  }

  .storyHitNext {
    right: 0;
  }

  .storyViewer-enter-active,
  .storyViewer-leave-active {
    transition: opacity 0.2s ease;
  }

  .storyViewer-enter-from,
  .storyViewer-leave-to {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .storyCubeInner.isCubing.isNext,
    .storyCubeInner.isCubing.isPrev {
      animation-duration: 0.01ms;
    }
  }
</style>

<script setup>
  const DURATION_MS = 5000
  const CUBE_MS = 480
  const TAP_MS = 220
  const SWIPE_PX = 50

  const props = defineProps({
    stories: { type: Array, required: true },
    paused: { type: Boolean, default: false },
  })

  const openIndex = defineModel('openIndex', { type: Number, default: -1 })
  const emit = defineEmits(['delete-request'])

  function requestRemove() {
    if (!currentItem.value || cubing.value) return
    emit('delete-request', currentItem.value)
  }

  const cubeEl = ref(null)
  const cubeZ = ref(0)
  const cubing = ref(false)
  const cubeDir = ref(0)
  const outgoingItem = ref(null)
  const incomingItem = ref(null)
  const progressKey = ref(0)
  const holding = ref(false)
  const itemIndex = ref(0)

  function storyItems(story) {
    if (story?.items?.length) return story.items
    return story ? [story] : []
  }

  const currentStory = computed(() => {
    if (openIndex.value < 0) return null
    return props.stories[openIndex.value] || null
  })

  const currentItems = computed(() => storyItems(currentStory.value))

  const currentItem = computed(() => {
    return currentItems.value[itemIndex.value] || currentItems.value[0] || null
  })

  const frontItem = computed(() => outgoingItem.value || currentItem.value)
  const sideItem = computed(() => incomingItem.value)

  useBodyScrollLock(computed(() => openIndex.value >= 0))

  let timer = 0
  let cubeTimer = 0
  let remainingMs = DURATION_MS
  let segmentStartedAt = 0
  let holdStartedAt = 0
  let holdPointerId = null
  let holdStartX = 0
  let holdStartY = 0
  let swiped = false

  function clearTimer() {
    if (timer) {
      window.clearTimeout(timer)
      timer = 0
    }
  }

  function clearCubeTimer() {
    if (cubeTimer) {
      window.clearTimeout(cubeTimer)
      cubeTimer = 0
    }
  }

  function close() {
    clearTimer()
    clearCubeTimer()
    holding.value = false
    holdStartedAt = 0
    holdPointerId = null
    cubing.value = false
    outgoingItem.value = null
    incomingItem.value = null
    cubeDir.value = 0
    remainingMs = DURATION_MS
    itemIndex.value = 0
    openIndex.value = -1
  }

  function resetSegment() {
    remainingMs = DURATION_MS
    progressKey.value += 1
    armTimer(DURATION_MS)
  }

  function armTimer(ms = remainingMs) {
    clearTimer()
    if (
      openIndex.value < 0 ||
      props.paused ||
      cubing.value ||
      holding.value
    ) {
      return
    }
    remainingMs = ms
    segmentStartedAt = performance.now()
    timer = window.setTimeout(() => {
      remainingMs = DURATION_MS
      goNext()
    }, ms)
  }

  function pauseProgress() {
    if (holding.value || cubing.value) return
    if (segmentStartedAt && !props.paused) {
      const elapsed = performance.now() - segmentStartedAt
      remainingMs = Math.max(0, remainingMs - elapsed)
    }
    holding.value = true
    clearTimer()
    segmentStartedAt = 0
  }

  function resumeProgress() {
    if (!holding.value) return
    holding.value = false
    holdStartedAt = 0
    holdPointerId = null
    if (props.paused || cubing.value || openIndex.value < 0) return
    armTimer(remainingMs)
  }

  function finishCube(nextIndex, dir) {
    cubing.value = false
    outgoingItem.value = null
    incomingItem.value = null
    cubeDir.value = 0
    openIndex.value = nextIndex
    const items = storyItems(props.stories[nextIndex])
    itemIndex.value = dir === 1 ? 0 : Math.max(0, items.length - 1)
    resetSegment()
  }

  function jumpToStory(nextIndex, dir) {
    openIndex.value = nextIndex
    const items = storyItems(props.stories[nextIndex])
    itemIndex.value = dir === 1 ? 0 : Math.max(0, items.length - 1)
    resetSegment()
  }

  function cubeTo(nextIndex, dir) {
    if (cubing.value || nextIndex < 0 || nextIndex >= props.stories.length) return
    if (nextIndex === openIndex.value) return

    holding.value = false
    holdStartedAt = 0
    clearTimer()
    clearCubeTimer()

    const reduce =
      import.meta.client &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      jumpToStory(nextIndex, dir)
      return
    }

    // Half-width = cube radius so adjacent faces meet at a 90° exterior corner.
    cubeZ.value = Math.round((cubeEl.value?.offsetWidth || window.innerWidth) / 2)

    const nextItems = storyItems(props.stories[nextIndex])
    outgoingItem.value = currentItem.value
    incomingItem.value =
      dir === 1 ? nextItems[0] : nextItems[nextItems.length - 1]
    cubeDir.value = dir
    cubing.value = true

    cubeTimer = window.setTimeout(() => finishCube(nextIndex, dir), CUBE_MS)
  }

  function goNext() {
    if (openIndex.value < 0 || cubing.value || !currentItem.value) return
    if (itemIndex.value < currentItems.value.length - 1) {
      itemIndex.value += 1
      resetSegment()
      return
    }
    if (openIndex.value >= props.stories.length - 1) {
      close()
      return
    }
    cubeTo(openIndex.value + 1, 1)
  }

  function goPrev() {
    if (openIndex.value < 0 || cubing.value || !currentItem.value) return
    if (itemIndex.value > 0) {
      itemIndex.value -= 1
      resetSegment()
      return
    }
    if (openIndex.value <= 0) return
    cubeTo(openIndex.value - 1, -1)
  }

  /** Swipe between story rings only (not slides within a story). */
  function goNextStory() {
    if (openIndex.value < 0 || cubing.value) return
    if (openIndex.value >= props.stories.length - 1) return
    cubeTo(openIndex.value + 1, 1)
  }

  function goPrevStory() {
    if (openIndex.value <= 0 || cubing.value) return
    cubeTo(openIndex.value - 1, -1)
  }

  function onHitDown(e, _dir) {
    if (cubing.value || props.paused || e.button) return
    holdPointerId = e.pointerId
    holdStartedAt = performance.now()
    holdStartX = e.clientX
    holdStartY = e.clientY
    swiped = false
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    pauseProgress()
  }

  function onHitMove(e) {
    if (holdPointerId != null && e.pointerId !== holdPointerId) return
    if (!holdStartedAt || swiped || cubing.value) return
    const dx = e.clientX - holdStartX
    const dy = e.clientY - holdStartY
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    if (absX < SWIPE_PX || absX <= absY) return

    swiped = true
    holdStartedAt = 0
    resumeProgress()
    if (dx < 0) goNextStory()
    else goPrevStory()
  }

  function onHitUp(e, dir) {
    if (holdPointerId != null && e.pointerId !== holdPointerId) return
    if (swiped) {
      swiped = false
      holdPointerId = null
      return
    }
    const heldFor = holdStartedAt ? performance.now() - holdStartedAt : 0
    resumeProgress()
    if (heldFor > 0 && heldFor < TAP_MS) {
      if (dir === 1) goNext()
      else goPrev()
    }
  }

  function onHitCancel(e) {
    if (holdPointerId != null && e?.pointerId != null && e.pointerId !== holdPointerId) {
      return
    }
    swiped = false
    resumeProgress()
  }

  watch(openIndex, (idx, prevIdx) => {
    if (idx >= props.stories.length) {
      openIndex.value = props.stories.length ? props.stories.length - 1 : -1
      return
    }
    if (idx < 0) {
      clearTimer()
      clearCubeTimer()
      holding.value = false
      cubing.value = false
      itemIndex.value = 0
      return
    }
    if (prevIdx < 0 || prevIdx === undefined) {
      itemIndex.value = 0
      resetSegment()
    }
  })

  watch(
    () => props.paused,
    (isPaused) => {
      if (isPaused) {
        if (segmentStartedAt && !holding.value) {
          const elapsed = performance.now() - segmentStartedAt
          remainingMs = Math.max(0, remainingMs - elapsed)
          segmentStartedAt = 0
        }
        clearTimer()
      } else if (!cubing.value && !holding.value) {
        armTimer(remainingMs)
      }
    },
  )

  watch(
    () => props.stories.length,
    () => {
      if (openIndex.value >= props.stories.length) {
        openIndex.value = props.stories.length ? props.stories.length - 1 : -1
      }
    },
  )

  watch(
    () => currentItems.value.length,
    (len) => {
      if (openIndex.value < 0) return
      if (len === 0) {
        close()
        return
      }
      if (itemIndex.value >= len) {
        itemIndex.value = len - 1
        resetSegment()
      }
    },
  )

  function onKey(e) {
    if (openIndex.value < 0) return
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === '?') {
      // Shift+/ → "?" — remove current slide from the story (gallery copy kept)
      e.preventDefault()
      requestRemove()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      goNext()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goPrev()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKey)
  })

  onBeforeUnmount(() => {
    clearTimer()
    clearCubeTimer()
    window.removeEventListener('keydown', onKey)
  })
</script>
