<template>
  <main>
    <div v-if="pending" aria-live="polite">Loading furniture collection...</div>

    <div v-else-if="error" role="alert">
      <p>Error loading furniture: {{ error.message }}</p>
    </div>

    <ul class="list" v-else>
      <Entry
        v-for="item in data"
        :key="item.id"
        :item="item"
        :is-liking="likingItems.has(item.id)"
        @like="likeItem"
      />
    </ul>
  </main>
</template>

<style lang="scss" scoped>
ul.list {
  display: flex;
  gap: 2rem;
  margin-top: 4rem;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
}
</style>

<script setup>
// Fetch furniture data from our API with caching
const { data, pending, error } = await useFetch("/api/furniture", {
  key: "furniture-global",
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
  title: "proportional.design",
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
