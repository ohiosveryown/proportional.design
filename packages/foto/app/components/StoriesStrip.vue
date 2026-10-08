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
          <svg
            v-if="story.isNew"
            class="storyRingSvg"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle
              class="storyRingSolid"
              cx="50"
              cy="50"
              r="45.5"
            />
            <g class="storyRingOrbit">
              <circle
                v-for="seg in RING_SEGMENTS"
                :key="seg"
                class="storyRingSeg"
                cx="50"
                cy="50"
                r="45.5"
                pathLength="30"
                :transform="`rotate(${(seg - 1) * (360 / RING_SEGMENTS)} 50 50)`"
                :style="{ '--seg': seg - 1 }"
              />
            </g>
          </svg>
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
    gap: 4px;
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
      gap: 8px;
      margin-bottom: 24px;
      padding: 0 0 16px;
    }
  }

  .storyFig {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    align-items: center;
    gap: 10px;
    width: 88px;
  }

  @media (min-width: 640px) {
    .storyFig {
      gap: 8px;
      width: 72px;
    }
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
    height: 26px;
  }

  @media (min-width: 640px) {
    .storyBadgeSlot {
      height: 22px;
    }
  }

  .storyNewBadge {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px;
    border-radius: 6px;
    color: #fff;
    background: rgba(255, 255, 255, 0.18);
    font-size: 12px;
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;
  }

  @media (min-width: 640px) {
    .storyNewBadge {
      padding: 6px;
      border-radius: 5px;
      font-size: 11px;
    }
  }

  .storyRingWrap {
    position: relative;
    flex: 0 0 auto;
    width: 80px;
    height: 80px;
  }

  @media (min-width: 640px) {
    .storyRingWrap {
      width: 64px;
      height: 64px;
    }
  }

  .storyRing {
    display: grid;
    place-items: center;
    position: relative;
    padding: 0;
    width: 80px;
    height: 80px;
    border: 2px solid rgba(255, 255, 255, 0.32);
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
  }

  @media (min-width: 640px) {
    .storyRing {
      width: 68px;
      height: 68px;
    }
  }

  .storyRing.isNew {
    border-color: transparent;
  }

  /*
   * Story ring: 30 staggered segments grow → solid → shrink,
   * while the whole ring orbits slowly. Stroke ≈ 3.5% of ring diameter.
   */
  .storyRingSvg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
  }

  .storyRingSolid {
    display: none;
    fill: none;
    stroke: #d7d7dc;
    stroke-width: 3.185;
    stroke-linecap: round;
  }

  .storyRingOrbit {
    transform-origin: center;
    transform-box: view-box;
    animation: storyRingOrbit 9s linear infinite;
  }

  .storyRingSeg {
    fill: none;
    stroke: #d7d7dc;
    stroke-width: 3.185;
    stroke-linecap: round;
    stroke-dasharray: 0.1 29.9;
    animation: storyRingSeg 2.5s infinite;
    animation-delay: calc(var(--seg) * 1.25s / 30);
  }

  @keyframes storyRingSeg {
    0% {
      stroke-dasharray: 0.1 29.9;
      animation-timing-function: ease-out;
    }
    50% {
      stroke-dasharray: 1 29;
      animation-timing-function: ease-in-out;
    }
    100% {
      stroke-dasharray: 0.1 29.9;
    }
  }

  @keyframes storyRingOrbit {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .storyRingSolid {
      display: block;
    }

    .storyRingOrbit {
      display: none;
      animation: none;
    }

    .storyRingSeg {
      animation: none;
    }
  }

  .storyRingInner {
    position: relative;
    z-index: 1;
    display: block;
    overflow: hidden;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #1a1a1a;
  }

  .storyRing.isNew .storyRingInner {
    width: 78%;
    height: 78%;
  }

  @media (min-width: 640px) {
    .storyRingInner {
      width: 52px;
      height: 52px;
    }

    .storyRing.isNew .storyRingInner {
      width: 78%;
      height: 78%;
    }
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
    font-size: 13px;
    line-height: 1.2;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (min-width: 640px) {
    .storyName {
      font-size: 12px;
    }
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
  const RING_SEGMENTS = 30

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
