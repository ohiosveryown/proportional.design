<template>
  <div
    v-if="stories.length"
    class="storiesStrip"
    aria-label="Stories"
  >
    <button
      v-for="(story, i) in stories"
      :key="story.filename"
      type="button"
      class="storyRing"
      :class="{ isNew: story.isNew }"
      :aria-label="storyLabel(story, i)"
      @click.stop="$emit('open', i)"
    >
      <span class="storyRingInner">
        <img
          :src="story.thumbUrl || story.url"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </span>
    </button>
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

  .storyRing {
    flex: 0 0 auto;
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
</style>

<script setup>
  defineProps({
    stories: { type: Array, default: () => [] },
  })

  defineEmits(['open'])

  function storyLabel(story, i) {
    const caption = story?.caption?.trim()
    if (caption) return `View story: ${caption}`
    return `View story ${i + 1}`
  }
</script>
