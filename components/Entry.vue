<template>
  <li class="entry" ref="entryRef">
    <header>
      <span class="key">№00{{ index + 1 }}</span>
      <h2 class="title serif">{{ item.title }}</h2>
    </header>

    <NuxtLink :to="`/furniture/${item.slug}`" :prefetch="true">
      <figure>
        <button
          class="button-like"
          @click.prevent="$emit('like', item.slug, item.id)"
        >
          <svg width="18" height="14" fill="none">
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
  max-width: 64vw;
  content-visibility: auto;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.entry.visible {
  opacity: 1;
  transform: translateY(0);
}

.entry header {
  display: flex;
  gap: 4rem;
  align-items: baseline;
  padding: 0 0.8rem;
}

.entry header .key {
  font-weight: 500;
}

.entry header .title {
  flex: 1;
  -webkit-text-stroke: 0.2px #1e1d1d;
}

.entry:first-of-type {
  padding-left: 2rem;
}

.entry:last-of-type {
  padding-right: 2rem;
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
  height: 80vh;
  object-fit: cover;
}

.button-like {
  position: absolute;
  right: 2rem;
  bottom: 4.8rem;
  z-index: var(--z1);
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.button-like .likes {
  font-weight: 550;
  font-size: 1.2rem;
  color: var(--bg);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.648);
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

defineEmits(["like"]);

const entryRef = ref(null);

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
