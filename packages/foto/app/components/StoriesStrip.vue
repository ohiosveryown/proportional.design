<template>
  <div
    v-if="stories.length"
    class="storiesStrip"
    aria-label="Stories"
  >
    <div
      v-for="(story, i) in stories"
      :key="story.id || story.filename || i"
      class="storyRingWrap"
      :class="{ wiggling: wiggleMode }"
      :style="wiggleMode ? { animationDelay: `${(i % 3) * 0.05}s` } : undefined"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointermove="onPointerMove"
    >
      <button
        type="button"
        class="storyRing"
        :class="{ isNew: story.isNew }"
        :aria-label="storyLabel(story, i)"
        @click.stop="onRingClick(i)"
      >
        <span class="storyRingInner">
          <img
            :src="storyThumb(story)"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </span>
      </button>

      <button
        v-if="wiggleMode"
        type="button"
        class="deleteBtn"
        aria-label="Delete story"
        @click.stop="$emit('delete-request', story)"
      >
        –
      </button>
    </div>
  </div>
</template>

<style scoped>
  .storiesStrip {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 12px;
    margin: 0 0 8px;
    padding: 4px 12px 12px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .storiesStrip::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 640px) {
    .storiesStrip {
      margin-bottom: 16px;
      padding: 0 0 16px;
    }
  }

  .storyRingWrap {
    position: relative;
    flex: 0 0 auto;
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

  .storyRingWrap.wiggling {
    animation: wiggle 0.4s infinite ease-in-out;
    transform-origin: center;
  }

  .storyRing {
    display: grid;
    place-items: center;
    padding: 0;
    width: 68px;
    height: 68px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
  }

  .storyRingInner {
    display: block;
    overflow: hidden;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: #1a1a1a;
  }

  .storyRingInner img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .deleteBtn {
    position: absolute;
    top: -6px;
    left: -6px;
    z-index: 10;
    display: grid;
    place-items: center;
    padding: 0;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 50%;
    color: #fff;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(8px);
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
  }
</style>

<script setup>
  defineProps({
    stories: { type: Array, default: () => [] },
  })

  const wiggleMode = defineModel('wiggleMode', {
    type: Boolean,
    default: false,
  })

  const emit = defineEmits(['open', 'delete-request'])

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

  function onRingClick(i) {
    if (suppressNextClick) {
      suppressNextClick = false
      return
    }
    if (wiggleMode.value) {
      wiggleMode.value = false
      return
    }
    emit('open', i)
  }

  function storyThumb(story) {
    if (story?.thumbUrl) return story.thumbUrl
    const first = story?.items?.[0]
    return first?.thumbUrl || first?.url || story?.url || ''
  }

  function storyLabel(story, i) {
    const name =
      story?.name?.trim() ||
      story?.caption?.trim() ||
      story?.items?.[0]?.caption?.trim()
    if (name) return `View story: ${name}`
    return `View story ${i + 1}`
  }
</script>
