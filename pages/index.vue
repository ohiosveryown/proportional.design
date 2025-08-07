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

          <!-- <select v-model="sortBy" class="sort-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-liked">Most Liked</option>
          </select> -->

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
  display: flex;
  flex-direction: column;
  min-height: 50vh;

  @include breakpoint(md) {
    position: sticky;
    top: 2rem;
    margin-right: grid-width(0.5);
    width: grid-width(5);
  }
}

aside header {
  color: var(--primary);
  font-size: 2.4rem;
  font-weight: 500;
  text-transform: capitalize;
}

.filter-button {
  background: none;
  border: none;
  color: rgba(251, 236, 195, 0.6);
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: -0.025rem;
  margin-right: 1.2rem;
  margin-bottom: 1rem;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: rgba(251, 236, 195, 0.8);
  }

  &.active {
    color: var(--primary);
    font-weight: 500;
  }

  &:last-child {
    margin-right: 0;
  }
}

.aside-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.4rem;
  border-block: 1px solid rgba(251, 236, 195, 0.2);
  padding-block: 1.2rem;

  .brand-text {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 1.6rem;
    font-weight: 500;
    letter-spacing: -0.025rem;
  }

  .carpenter-icon {
    width: 2.4rem;
    height: auto;
    object-fit: cover;
  }

  .footer-actions {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .contact-btn {
    transform: scale(0.9);
  }

  .contact-btn:hover {
    transform: scale(0.94);
  }

  .contact-btn:active {
    transform: scale(0.88);
  }

  .instagram-link {
    display: block;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .instagram-avatar {
    position: relative;
    width: 4.2rem;
    height: 4.2rem;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 100px;
      background: linear-gradient(
        45deg,
        #f09433 0%,
        #e6683c 25%,
        #dc2743 50%,
        #cc2366 75%,
        #bc1888 100%
      );
      animation: instagram-ring-rotate 3s linear infinite;
      z-index: 0;
    }

    img {
      border: 2px solid var(--bg);
      width: 4rem;
      height: 4rem;
      object-fit: cover;
      border-radius: 100px;
      position: relative;
      z-index: 1;
    }
  }
}

@keyframes instagram-ring-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.list {
  display: flex;
  flex-direction: column;
  @include breakpoint(md) {
    gap: 5.6rem;
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
</script>

<style lang="scss" scoped></style>
