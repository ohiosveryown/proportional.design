<template>
  <Teleport to="body">
    <Transition name="storyViewer">
      <div
        v-if="activeStory"
        class="storyViewer"
        role="dialog"
        aria-modal="true"
        aria-label="Story"
        @click="onBackdropClick"
      >
        <div class="storyProgress" aria-hidden="true">
          <div
            v-for="(_, i) in stories"
            :key="i"
            class="storyProgressTrack"
          >
            <div
              :key="`${i}-${openIndex}-${paused ? 'p' : 'r'}`"
              class="storyProgressFill"
              :class="{
                isDone: i < openIndex,
                isActive: i === openIndex && !paused,
              }"
              :style="i === openIndex ? { animationDuration: `${DURATION_MS}ms` } : undefined"
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
          aria-label="Delete story"
          @click.stop="$emit('delete-request', activeStory)"
        >
          Delete
        </button>

        <div class="storyStage" @click.stop>
          <img
            :key="activeStory.filename"
            :src="activeStory.url"
            :alt="activeStory.caption || 'Story'"
            class="storyImg"
            decoding="async"
          />
          <p
            v-if="activeStory.caption"
            class="storyCaption"
          >
            {{ activeStory.caption }}
          </p>
        </div>

        <button
          type="button"
          class="storyHit storyHitPrev"
          aria-label="Previous story"
          @click.stop="goPrev"
        />
        <button
          type="button"
          class="storyHit storyHitNext"
          aria-label="Next story"
          @click.stop="goNext"
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
    z-index: 2;
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
    z-index: 2;
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

  .storyStage {
    display: grid;
    place-items: center;
    position: relative;
    flex: 1 1 auto;
    padding: 56px 16px 32px;
    min-height: 0;
  }

  .storyImg {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 4px;
  }

  .storyCaption {
    position: absolute;
    right: 20px;
    bottom: 24px;
    left: 20px;
    margin: 0;
    color: #fff;
    font-size: 15px;
    line-height: 1.35;
    text-align: center;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.7);
  }

  .storyHit {
    position: absolute;
    top: 56px;
    bottom: 0;
    z-index: 1;
    width: 30%;
    border: 0;
    background: transparent;
    cursor: pointer;
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
</style>

<script setup>
  const DURATION_MS = 5000

  const props = defineProps({
    stories: { type: Array, required: true },
    paused: { type: Boolean, default: false },
  })

  const openIndex = defineModel('openIndex', { type: Number, default: -1 })
  defineEmits(['delete-request'])

  const activeStory = computed(() => {
    if (openIndex.value < 0) return null
    return props.stories[openIndex.value] || null
  })

  useBodyScrollLock(computed(() => openIndex.value >= 0))

  let timer = 0

  function clearTimer() {
    if (timer) {
      window.clearTimeout(timer)
      timer = 0
    }
  }

  function close() {
    openIndex.value = -1
  }

  function goNext() {
    if (openIndex.value < 0) return
    if (openIndex.value >= props.stories.length - 1) {
      close()
      return
    }
    openIndex.value += 1
  }

  function goPrev() {
    if (openIndex.value <= 0) return
    openIndex.value -= 1
  }

  function onBackdropClick() {
    // Hits handle navigation; backdrop close is via Close button.
  }

  function armTimer() {
    clearTimer()
    if (openIndex.value < 0 || props.paused) return
    timer = window.setTimeout(goNext, DURATION_MS)
  }

  watch(
    [openIndex, () => props.paused, () => props.stories.length],
    () => {
      if (openIndex.value >= props.stories.length) {
        openIndex.value = props.stories.length ? props.stories.length - 1 : -1
      }
      armTimer()
    },
    { immediate: true },
  )

  function onKey(e) {
    if (openIndex.value < 0) return
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
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
    window.removeEventListener('keydown', onKey)
  })
</script>
