<template>
  <div class="app">
    <Hero ref="hero" class="hero" />

    <!--
    <main>
      <div v-if="pending" aria-live="polite">
        Loading furniture collection...
      </div>

      <div v-else-if="error" role="alert">
        <p>Error loading furniture: {{ error.message }}</p>
      </div>

      <div class="container" v-else>
        <aside>
          <header>{{ headerText }}</header>

          <div class="category-filters">
            <button
              @click="handleFilterClick('all', $event)"
              :class="{ active: isFilterActive('all') }"
              class="filter-button"
            >
              ALL
            </button>
            <button
              v-for="category in availableCategories"
              :key="category"
              @click="handleFilterClick(category, $event)"
              :class="{ active: isFilterActive(category) }"
              class="filter-button"
            >
              {{ category.toUpperCase() }}
            </button>
          </div>

          <footer class="aside-footer">
            <div class="brand-text">
              PROPORTIONAL
              <img
                class="carpenter-icon"
                src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1754495959/proportional.design-4.0/carpenter-01_2x_i8rifn.webp"
                alt="carpenter"
              />
              DESIGN
            </div>
            <div class="footer-actions">
              <button class="primary-btn contact-btn">Contact</button>
              <a
                href="https://instagram.com/proportional.design"
                target="_blank"
                class="instagram-link"
              >
                <div class="instagram-avatar">
                  <img
                    src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733875450/proportional.design-3.0/avatar_w_3x_j45unb.webp"
                    alt="instagram"
                  />
                </div>
              </a>
            </div>
          </footer>
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
  --></div>
</template>

<style lang="scss" scoped></style>

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

/* -----
// Make data reactive for optimistic updates
const data = ref(fetchedData.value);

// Track which items are being liked (to prevent double-clicks)
const likingItems = ref(new Set());

// Filtering and sorting functionality
const sortBy = ref("newest");
const filterBy = ref(["all"]); // Now an array for multi-select

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
  if (!filterBy.value.includes("all")) {
    items = items.filter((item) => filterBy.value.includes(item.category));
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

// Filter handling functions
const handleFilterClick = (category, event) => {
  const isCommandKey = event.metaKey || event.ctrlKey; // metaKey for Mac, ctrlKey for Windows/Linux

  if (category === "all") {
    // Clicking "ALL" always resets to show all
    filterBy.value = ["all"];
    return;
  }

  if (!isCommandKey) {
    // Regular click - single select
    filterBy.value = [category];
  } else {
    // Cmd+click - multi-select
    const currentFilters = [...filterBy.value];

    // Remove "all" if it's currently selected
    const withoutAll = currentFilters.filter((f) => f !== "all");

    if (withoutAll.includes(category)) {
      // Remove this category
      const newFilters = withoutAll.filter((f) => f !== category);
      // If no categories left, default to "all"
      filterBy.value = newFilters.length ? newFilters : ["all"];
    } else {
      // Add this category
      filterBy.value = [...withoutAll, category];
    }
  }
};

const isFilterActive = (category) => {
  return filterBy.value.includes(category);
};

// Dynamic header text based on active filters
const headerText = computed(() => {
  if (filterBy.value.includes("all") || filterBy.value.length === 0) {
    return "All Pieces";
  } else if (filterBy.value.length === 1) {
    return filterBy.value[0];
  } else {
    // Multiple filters selected
    return filterBy.value.join(" + ");
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
---- */
</script>
