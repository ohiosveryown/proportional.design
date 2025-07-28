<template>
  <li class="entry">
    <NuxtLink :to="`/furniture/${item.slug}`" :prefetch="true">
      <header>
        <h2 class="title">{{ item.title }}</h2>
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

      <!-- <footer>
        <span class="tags">{{ item.category }}</span>
      </footer> -->
    </NuxtLink>

    <button
      @click.prevent="$emit('like', item.slug, item.id)"
      class="like-btn"
      :disabled="isLiking"
    >
      ❤️ {{ item.likes || 0 }}
    </button>
  </li>
</template>

<style lang="scss" scoped>
.entry {
  min-width: 300px;
  max-width: 300px;
}

.entry:hover .title {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.2s;
}

.entry:first-of-type {
  padding-left: 2rem;
}

.entry:last-of-type {
  padding-right: 2rem;
}

.entry .title {
  padding-bottom: 0.2rem;
  font-weight: 500;
  font-size: 1.6rem;
  letter-spacing: -0.25px;
  opacity: 0;
  transform: translateY(0.25rem);
  transition: opacity 0.2s ease, transform 0.01s ease 0.2s;
}

.entry figure {
  width: 100%;
}

.entry figure img {
  width: 100%;
  height: 100%;
  min-height: 300px;
  max-height: 300px;
  object-fit: cover;
}

.tags {
  border-radius: 5px;
  padding: 0.2rem 0.5rem;
  width: max-content;
  font-weight: 600;
  font-size: 1.2rem;
  letter-spacing: -0.75px;
  text-transform: uppercase;
  background-color: #f0f0f0;
}

.like-btn {
  margin-top: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  isLiking: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["like"]);
</script>
