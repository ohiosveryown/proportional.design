<template>
  <div class="app">
    <Intro ref="intro" class="intro" />

    <main>
      <div v-if="pending" aria-live="polite">
        Loading furniture collection...
      </div>

      <div v-else-if="error" role="alert">
        <p>Error loading furniture: {{ error.message }}</p>
      </div>

      <div class="container" v-else>
        <!-- sorting & filtering -->
        <aside>
          <header>All Pieces</header>

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
        </aside>

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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include breakpoint(md) {
    margin: 0 auto;
    max-width: 200rem;
    width: 92vw;
    padding: 0 6.4em;
    align-items: flex-start;
    flex-direction: row;
  }
}

aside {
  @include breakpoint(md) {
    position: sticky;
    top: 2rem;
    margin-right: grid-width(0.5);
    width: grid-width(5);
  }
}

.list {
  @include breakpoint(md) {
    width: grid-width(6.5);
  }
}

.intro {
  // position: sticky;
  // top: 0;
  // z-index: var(--z1);
  // transition: transform 500ms ease, opacity 500ms ease, filter 500ms ease 100ms;
}

.fade-out {
  // transform: scale(0.8) translateY(-4rem);
  // opacity: 0.2;
  // filter: blur(10px);
}

// ul.list {
//   position: relative;
//   z-index: var(--z2);
//   display: flex;
//   gap: 2rem;
//   margin-top: 2rem;
//   padding-bottom: 4rem;
//   overflow-x: auto;
//   scrollbar-width: none; /* Firefox */
//   -ms-overflow-style: none; /* IE and Edge */

//   &::-webkit-scrollbar {
//     display: none; /* Chrome, Safari, Opera */
//   }
// }
</style>

<script setup>
// Fetch furniture data from our API with caching
const {
  data: fetchedData,
  pending,
  error,
} = await useFetch("/api/furniture", {
  key: "furniture-global",
  server: true,
  default: () => [],
});

// Make data reactive for optimistic updates
const data = ref(fetchedData.value);

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

// Scroll-based intro animation
const scrollpos = ref(0);
const intro = ref(null);
const scrollThreshold = 50; // Fixed pixel value

// Throttling variables
let ticking = false;
let lastScrollY = 0;

const addClassOnScroll = () => {
  if (intro.value && intro.value.$el && intro.value.$el.classList) {
    intro.value.$el.classList.add("fade-out");
  }
};

const removeClassOnScroll = () => {
  if (intro.value && intro.value.$el && intro.value.$el.classList) {
    intro.value.$el.classList.remove("fade-out");
  }
};

const updateScrollClass = () => {
  if (scrollpos.value >= scrollThreshold) {
    addClassOnScroll();
  } else {
    removeClassOnScroll();
  }
  ticking = false;
};

const handleScroll = () => {
  scrollpos.value = window.scrollY;

  // Only update if we haven't already scheduled an update
  if (!ticking) {
    requestAnimationFrame(updateScrollClass);
    ticking = true;
  }
};

// Set up scroll listener when component mounts
onMounted(async () => {
  // Wait for the next tick to ensure DOM is ready
  await nextTick();

  window.addEventListener("scroll", handleScroll);
});

// Clean up scroll listener when component unmounts
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped></style>
