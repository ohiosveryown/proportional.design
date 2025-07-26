<template>
  <main>
    <div v-if="pending" aria-live="polite">Loading furniture collection...</div>

    <div v-else-if="error" role="alert">
      <p>Error loading furniture: {{ error.message }}</p>
    </div>

    <ul class="list" v-else>
      <li class="entry" v-for="item in data" :key="item.id">
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

          <footer>
            <span class="tags">{{ item.category }}</span>
            <!-- <ul class="tags">
              <li v-for="material in item.materials" :key="material">
                {{ material }}
              </li>
            </ul> -->
          </footer>
        </NuxtLink>

        <button
          @click.prevent="likeItem(item.slug, item.id)"
          class="like-btn"
          :disabled="likingItems.has(item.id)"
        >
          ❤️ {{ item.likes || 0 }}
        </button>
      </li>
    </ul>
  </main>
</template>

<style lang="scss" scoped>
ul.list {
  display: flex;
  gap: 1.2rem;
  margin-top: 4rem;
}

li.entry {
  min-width: 300px;
  max-width: 300px;
}

li.entry .title {
  font-weight: normal;
  font-size: 2rem;
}

li.entry figure {
  width: 100%;
}

li.entry figure img {
  width: 100%;
  height: 100%;
  min-height: 300px;
  max-height: 300px;
  object-fit: cover;
}

ul.tags {
  display: flex;
  gap: 0.5rem;
}

ul.tags li,
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
</style>

<script setup>
// Fetch furniture data from our API with caching
const { data, pending, error } = await useFetch("/api/furniture", {
  key: "furniture-list",
  server: true,
  default: () => [],
});

// Track which items are being liked (to prevent double-clicks)
const likingItems = ref(new Set());

// Function to handle liking an item
const likeItem = async (slug, itemId) => {
  if (likingItems.value.has(itemId)) return;

  likingItems.value.add(itemId);

  // Find the item and update UI immediately (optimistic update)
  const item = data.value?.find((item) => item.id === itemId);
  if (item) {
    const originalLikes = item.likes || 0;
    item.likes = originalLikes + 1; // Update UI immediately
    
    try {
      // Update database in background
      const response = await $fetch(`/api/furniture/${slug}/like`, {
        method: "POST",
      });
      
      // Sync with actual database value (in case of discrepancy)
      if (response.likes) {
        item.likes = response.likes;
      }
    } catch (error) {
      console.error("Failed to like item:", error);
      // Revert optimistic update on error
      item.likes = originalLikes;
    } finally {
      likingItems.value.delete(itemId);
    }
  }
};

// Set page meta
useHead({
  title: "Furniture Collection - proportional.design",
  meta: [
    {
      name: "description",
      content:
        "Handcrafted furniture pieces built with care and attention to detail.",
    },
  ],
});
</script>

<style lang="scss" scoped></style>
