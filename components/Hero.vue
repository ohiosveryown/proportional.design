<template>
  <section class="hero">
    <Logotype class="logotype" />

    <div ref="wrapper" class="hero-image-wrapper">
      <button ref="followBtn" class="follow-btn">
        Get in touch
        <span class="icon"
          ><svg width="16" height="16" fill="none">
            <path
              fill="var(--content-000)"
              d="M16 11.872c0 .37-.122.683-.367.935a1.198 1.198 0 0 1-.878.367 1.15 1.15 0 0 1-.857-.367 1.293 1.293 0 0 1-.344-.902v-3.96l.167-4.095-1.69 1.891L2.179 15.6c-.267.268-.567.401-.9.401-.223 0-.43-.063-.623-.19a1.512 1.512 0 0 1-.478-.466A1.168 1.168 0 0 1 0 14.72c0-.326.133-.626.4-.9l9.84-9.859 1.902-1.669-4.259.145H4.092c-.341 0-.638-.115-.89-.345a1.135 1.135 0 0 1-.378-.857c0-.334.122-.623.367-.868A1.25 1.25 0 0 1 4.114 0h10.563c.4 0 .719.122.956.367s.356.56.356.946L16 11.872Z"
            /></svg
        ></span>
      </button>
      <div ref="threeContainer" class="three-container"></div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.follow-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  position: absolute;
  z-index: var(--z1);
  border-radius: 100px;
  border: none;
  padding: 0.4rem 0.4rem 0.4rem 1.6rem;
  font-size: 1.3rem;
  text-transform: uppercase;
  color: var(--content-000);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  background: linear-gradient(
    180deg,
    rgba(149, 140, 116, 0.3) 0%,
    rgba(69, 112, 93, 0.3) 100%
  );
  backdrop-filter: blur(16px);
}

.icon {
  display: grid;
  place-items: center;
  border-radius: 100px;
  padding: 1rem;
  background: var(--base-000);
  box-shadow: 0 1px 1px 0 rgba(255, 255, 255, 0.64) inset;
}

.icon svg {
  transform: scale(0.68);
  opacity: 0.64;
}

.hero-image-wrapper:hover .follow-btn {
  opacity: 1;
}

.hero {
  position: relative;
  width: 100vw;
  height: 100dvh;
}

.hero-image-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  width: 46%;
  height: calc(100% - 1.6rem);
  border-radius: 9px;
  margin: 0.8rem;
  overflow: hidden;
  cursor: none;
}

.three-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.24);
  animation: scaleIn 1.5s ease forwards 1s;
}

.three-container canvas {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}

.three-container:after {
  content: "";
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: var(--base-000);
  animation: maskOff 1.25s cubic-bezier(0.8, 0, 0.16, 1) forwards 1s;
  transform-origin: left;
  pointer-events: none;
}

.logotype {
  position: relative;
  z-index: var(--z2);
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scale(0.8) translate(-2%, 1%);
  transform-origin: center;
  animation: logotypeAnimation 1.25s cubic-bezier(0.8, 0, 0.16, 1) forwards 1s;
}

@keyframes logotypeAnimation {
  to {
    transform: scale(0.5) translate(-48%, -50%);
  }
}

@keyframes scaleIn {
  to {
    transform: scale(1);
  }
}

@keyframes maskOff {
  to {
    transform: scaleX(0);
  }
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useDisplacementEffect } from "~/composables/useDisplacementEffect";

const followBtn = ref(null);
const wrapper = ref(null);
const threeContainer = ref(null);

const { init: initDisplacementEffect, resize: resizeDisplacementEffect } =
  useDisplacementEffect();
let cleanupEffect = null;

const updateButtonPosition = (e) => {
  if (followBtn.value) {
    const rect = wrapper.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    followBtn.value.style.transform = `translate(${x}px, ${y}px)`;
  }
};

const handleResize = () => {
  if (threeContainer.value && resizeDisplacementEffect) {
    resizeDisplacementEffect(threeContainer.value);
  }
};

onMounted(() => {
  if (wrapper.value) {
    wrapper.value.addEventListener("mousemove", updateButtonPosition);
  }

  // Initialize Three.js effect after a delay to match the animation timing
  setTimeout(() => {
    if (threeContainer.value) {
      const imageUrl =
        "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1756947317/proportional.design-4.0/hero_2x_uajsjm.webp";
      cleanupEffect = initDisplacementEffect(threeContainer.value, imageUrl);
    }
  }, 1000);

  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (wrapper.value) {
    wrapper.value.removeEventListener("mousemove", updateButtonPosition);
  }

  if (cleanupEffect) {
    cleanupEffect();
  }

  window.removeEventListener("resize", handleResize);
});
</script>
