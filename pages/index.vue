<template>
  <div class="app">
    <Intro />

    <main>
      <div v-if="pending" aria-live="polite">
        Loading furniture collection...
      </div>

      <div v-else-if="error" role="alert">
        <p>Error loading furniture: {{ error.message }}</p>
      </div>

      <div v-else>
        <!-- sorting & filtering -->
        <!-- <div class="controls">
          <select v-model="filterBy" class="filter-select">
            <option value="all">All Categories</option>
            <option
              v-for="category in availableCategories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>

          <select v-model="sortBy" class="sort-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-liked">Most Liked</option>
          </select>
        </div> -->

        <ul class="list">
          <Entry
            v-for="(item, index) in sortedData"
            :key="item.id"
            :item="item"
            :index="index"
            @like="likeItem"
          />
        </ul>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
ul.list {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  padding-bottom: 4rem;
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

// Filtering and sorting functionality
const sortBy = ref("newest");
const filterBy = ref("all");

// Get unique categories from the data
const availableCategories = computed(() => {
  if (!data.value) return [];
  const categories = [...new Set(data.value.map((item) => item.category))];
  return categories.filter(Boolean).sort();
});

const sortedData = computed(() => {
  if (!data.value) return [];

  let items = [...data.value];

  // Filter by category first
  if (filterBy.value !== "all") {
    items = items.filter((item) => item.category === filterBy.value);
  }

  // Then sort the filtered items
  switch (sortBy.value) {
    case "oldest":
      return items.sort(
        (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated)
      );
    case "most-liked":
      return items.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    case "newest":
    default:
      return items.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      );
  }
});

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
