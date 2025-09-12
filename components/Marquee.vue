<template>
  <div class="marquee" @mouseenter="onHover" @mouseleave="onLeave">
    <div
      class="marquee-content sans"
      :style="{ transform: `translateX(${translateX}px)` }"
    >
      <div class="marquee-item">{{ text }}</div>
      <div class="marquee-item">•</div>
      <div class="marquee-item">{{ text }}</div>
      <div class="marquee-item">•</div>
      <div class="marquee-item">{{ text }}</div>
      <div class="marquee-item">•</div>
      <div class="marquee-item">{{ text }}</div>
      <div class="marquee-item">•</div>
      <div class="marquee-item">{{ text }}</div>
      <div class="marquee-item">•</div>
      <div class="marquee-item">{{ text }}</div>
      <div class="marquee-item">•</div>
      <div class="marquee-item">{{ text }}</div>
      <div class="marquee-item">•</div>
      <div class="marquee-item">{{ text }}</div>
      <div class="marquee-item">•</div>
      <div class="marquee-item">{{ text }}</div>
      <div class="marquee-item">•</div>
      <div class="marquee-item">{{ text }}</div>
      <div class="marquee-item">•</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.marquee {
  position: relative;
  margin: 4rem 0;
  width: 100%;
  padding: 0.8rem 0;
  background: linear-gradient(90deg, #b1e847 0%, #7fb83d 100%);
  overflow: hidden;
  white-space: nowrap;
  transform: rotate(-1deg);
  box-shadow: 0 0.75px 1px 0 rgba(255, 255, 255, 0.5) inset,
    0 5px 24px 0 rgba(0, 0, 0, 0.4);
}

.marquee::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 20%;
  height: 100%;
  background: linear-gradient(90deg, #1c2822 0%, rgba(28, 40, 34, 0) 100%);
}

.marquee::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 20%;
  height: 100%;
  background: linear-gradient(90deg, rgba(28, 40, 34, 0) 0%, #1c2822 100%);
}

.marquee-content {
  display: inline-flex;
  will-change: transform;
}

.marquee-item {
  flex-shrink: 0;
  margin-right: 1rem;
  color: var(--base-000);
  text-transform: uppercase;
  letter-spacing: 0.24px;
  opacity: 0.72;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  text: {
    type: String,
    default: "Handcrafted furniture built to last generations",
  },
  speed: {
    type: Number,
    default: 1, // base speed multiplier
  },
});

const isHovered = ref(false);
const translateX = ref(0);
const animationId = ref(null);
const contentWidth = ref(0);

const animate = () => {
  const baseSpeed = 50 * props.speed; // pixels per second
  const currentSpeed = isHovered.value ? baseSpeed * 0.3 : baseSpeed;

  translateX.value -= currentSpeed / 60; // 60fps

  // Reset when half the content has scrolled (for seamless loop)
  if (translateX.value <= -contentWidth.value / 2) {
    translateX.value = 0;
  }

  animationId.value = requestAnimationFrame(animate);
};

const calculateContentWidth = () => {
  // Approximate width calculation based on content
  const textLength = props.text.length;
  const avgCharWidth = 12; // approximate character width
  const itemCount = 20; // number of items in template
  contentWidth.value = (textLength * avgCharWidth + 20) * (itemCount / 2); // padding + half items for reset
};

const onHover = () => {
  isHovered.value = true;
};

const onLeave = () => {
  isHovered.value = false;
};

onMounted(() => {
  calculateContentWidth();
  animate();
});

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value);
  }
});
</script>
