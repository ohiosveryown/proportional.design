<template>
  <div
    v-if="stories.length"
    class="storiesStrip"
    aria-label="Stories"
  >
    <div
      v-for="(story, i) in stories"
      :key="story.id || story.filename || i"
      class="storyFig"
      :class="{ wiggling: wiggleMode }"
      :style="wiggleMode ? { animationDelay: `${(i % 3) * 0.05}s` } : undefined"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointermove="onPointerMove"
    >
      <div class="storyBadgeSlot">
        <span
          v-if="story.isNew"
          class="storyNewBadge"
        >
          New
        </span>
      </div>

      <div class="storyRingWrap">
        <button
          type="button"
          class="storyRing"
          :class="{ isNew: story.isNew }"
          :aria-label="storyAriaLabel(story, i)"
          @click.stop="onRingClick(i)"
        >
          <span
            v-if="story.isNew"
            class="storyRingGradient"
            aria-hidden="true"
          />
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

      <p class="storyName">
        {{ storyName(story, i) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
  .storiesStrip {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    gap: 8px;
    margin: 0 0 8px;
    padding: 32px 12px 0px;
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
      margin-bottom: 24px;
      padding: 0 0 16px;
    }
  }

  .storyFig {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    align-items: center;
    gap: 8px;
    width: 72px;
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

  .storyFig.wiggling {
    animation: wiggle 0.4s infinite ease-in-out;
    transform-origin: center top;
  }

  /* Reserved row so New / non-New rings stay aligned; badge never covers the thumb */
  .storyBadgeSlot {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    height: 22px;
  }

  .storyNewBadge {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 5px;
    color: #fff;
    background: rgba(255, 255, 255, 0.18);
    font-size: 11px;
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;
  }

  .storyRingWrap {
    position: relative;
    flex: 0 0 auto;
    width: 64px;
    height: 64px;
  }

  .storyRing {
    display: grid;
    place-items: center;
    position: relative;
    padding: 0;
    width: 68px;
    height: 68px;
    border: 2px solid rgba(255, 255, 255, 0.32);
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
  }

  .storyRing.isNew {
    border-color: transparent;
  }

  /* Instagram-style rotating conic ring for unseen / new stories */
  .storyRingGradient {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #fff;
    /* animation: storyRingSpin 4s linear infinite; */
  }

  .storyRingGradient::after {
    content: '';
    position: absolute;
    /* Thin stroke; remaining space to the thumb is the black gutter */
    inset: 2px;
    border-radius: 50%;
    background: #000;
  }

  @keyframes storyRingSpin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .storyRingGradient {
      animation: none;
    }
  }

  .storyRingInner {
    position: relative;
    z-index: 1;
    display: block;
    overflow: hidden;
    /* Leaves a clear gap inside the ring (matches design gutter) */
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #1a1a1a;
  }

  .storyRingInner img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .storyName {
    overflow: hidden;
    margin: 0;
    width: 100%;
    min-width: 0;
    color: #fff;
    font-size: 12px;
    line-height: 1.2;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
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

  function storyName(story, i) {
    return (
      story?.name?.trim() ||
      story?.caption?.trim() ||
      story?.items?.[0]?.caption?.trim() ||
      `Story ${i + 1}`
    )
  }

  function storyAriaLabel(story, i) {
    const name = storyName(story, i)
    return story?.isNew ? `View new story: ${name}` : `View story: ${name}`
  }
</script>
