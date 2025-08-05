<template>
  <li class="entry" ref="entryRef">
    <header>
      <span class="key">№00{{ index + 1 }}</span>
      <h2 class="title serif">{{ item.title }}</h2>
    </header>

    <NuxtLink :to="`/furniture/${item.slug}`" :prefetch="true">
      <figure>
        <button class="button-like" @click.prevent="handleLike">
          <svg
            width="18"
            height="14"
            fill="none"
            :class="{ 'heart-animate': isAnimating }"
          >
            <path
              fill="var(--bg)"
              fill-rule="evenodd"
              d="M1.375 1.275A4.736 4.736 0 0 1 2.9.33 5.02 5.02 0 0 1 4.696 0a5.02 5.02 0 0 1 1.797.331c.57.219 1.087.54 1.523.944L9 2.186l.984-.911C10.864.459 12.059 0 13.304 0c1.246 0 2.44.459 3.32 1.275C17.506 2.09 18 3.197 18 4.35c0 1.154-.495 2.261-1.375 3.077l-6.716 6.223A1.34 1.34 0 0 1 9 14a1.34 1.34 0 0 1-.909-.349L1.376 7.428A4.345 4.345 0 0 1 .356 6.017 4.076 4.076 0 0 1 0 4.35c0-.571.121-1.137.357-1.665a4.345 4.345 0 0 1 1.018-1.411Z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="likes">{{ item.likes || 0 }}</span>
        </button>
        <img
          v-if="item.images?.[0]"
          :src="item.images[0]"
          :alt="item.title"
          loading="lazy"
        />
        <figcaption v-else>No Image</figcaption>
      </figure>
    </NuxtLink>
  </li>
</template>

<style lang="scss" scoped>
.entry {
  flex: 0 0 auto;
  width: max-content;
  max-width: 44vw;
  content-visibility: auto;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.entry:hover .button-like {
  opacity: 1;
}

.entry.visible {
  opacity: 1;
  transform: translateY(0);
}

.entry header {
  display: flex;
  gap: 0.8rem;
  align-items: baseline;
  padding: 0 0.8rem;
}

.entry header .key {
  font-weight: 500;
  font-size: 1.2rem;
}

.entry header .title {
  flex: 1;
  font-size: 1.9rem;
  -webkit-text-stroke: 0.2px #1e1d1d;
}

.entry:first-of-type {
  padding-left: 3.2rem;
}

.entry:last-of-type {
  padding-right: 3.2rem;
}

.entry figure {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.entry figure img {
  border-radius: 9px;
  width: auto;
  height: 60vh;
  object-fit: cover;
}

.button-like {
  position: absolute;
  right: 1.2rem;
  bottom: 3.8rem;
  z-index: var(--z1);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.2rem;
  cursor: cell;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.button-like svg {
  transition: transform 0.1s ease;
}

.button-like:active svg {
  transform: scale(0.9);
}

.button-like .likes {
  font-weight: 550;
  font-size: 1.2rem;
  color: var(--bg);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.648);
}

.heart-animate {
  animation: heartBeat 0.3s ease-in-out;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["like"]);

const entryRef = ref(null);
const isAnimating = ref(false);

const handleLike = () => {
  // Trigger animation
  isAnimating.value = true;
  setTimeout(() => {
    isAnimating.value = false;
  }, 300);

  // Emit the like event
  emit("like", props.item.slug, props.item.id);
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  if (entryRef.value) {
    observer.observe(entryRef.value);
  }

  onUnmounted(() => {
    observer.disconnect();
  });
});
</script>
