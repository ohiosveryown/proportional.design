<template>
  <li class="entry">
    <NuxtLink :to="`/furniture/${item.slug}`" :prefetch="true">
      <header>
        <span class="key">№00{{ index + 1 }}</span>
        <h2 class="title serif">{{ item.title }}</h2>
      </header>

      <figure>
        <img
          v-if="item.images?.[0]"
          :src="item.images[0]"
          :alt="item.title"
          loading="lazy"
        />
        <figcaption v-else>No Image</figcaption>
      </figure>

      <footer>
        <span class="tags">{{ item.category }}</span>
      </footer>
    </NuxtLink>

    <button @click.prevent="$emit('like', item.slug, item.id)" class="like-btn">
      ❤️ {{ item.likes || 0 }}
    </button>
  </li>
</template>

<style lang="scss" scoped>
.entry {
  flex: 0 0 auto;
  width: max-content;
  max-width: 64vw;
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

.entry:first-of-type {
  padding-left: 2rem;
}

.entry:last-of-type {
  padding-right: 2rem;
}

.entry figure {
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
</style>

<script setup>
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
</script>
