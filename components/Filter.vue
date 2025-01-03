<template>
  <menu>
    <div class="tools">
      <div
        class="menu-trigger"
        @click="isOpen = !isOpen"
        @click.stop="togglePopover"
        ref="triggerRef"
      >
        <svg
          class="op-7"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
        >
          <circle cx="10" cy="10" r="7.5" stroke="#fff" />
          <path
            stroke="#fff"
            stroke-linecap="round"
            d="M6 8h8M6.8 10.4h6.4M8 12.8h4"
          />
        </svg>
        <span class="op-7">Filter</span>
        <span class="dot" :class="{ 'is-active': hasActiveFilters }" />
      </div>
    </div>

    <div
      class="popover"
      :class="{ 'is-open': isOpen }"
      ref="popoverRef"
      tabindex="-1"
      @keydown.esc="closePopover"
      @mouseleave="handleMouseLeave"
      @click.stop
      @scroll.stop
    >
      <!-- sorting -->
      <span class="header">Sort by</span>
      <form @change="handleSort">
        <div class="sort-radio">
          <input
            type="radio"
            name="sort"
            value="newest"
            id="newest"
            :checked="selectedSort === 'newest'"
          />
          <label for="newest">Newest first</label>
        </div>

        <div class="sort-radio">
          <input
            type="radio"
            name="sort"
            value="oldest"
            id="oldest"
            :checked="selectedSort === 'oldest'"
          />
          <label for="oldest">Oldest first</label>
        </div>

        <div class="sort-radio">
          <input
            type="radio"
            name="sort"
            value="asc"
            id="asc"
            :checked="selectedSort === 'asc'"
          />
          <label for="asc">A–Z</label>
        </div>

        <div class="sort-radio">
          <input
            type="radio"
            name="sort"
            value="desc"
            id="desc"
            :checked="selectedSort === 'desc'"
          />
          <label for="desc">Z–A</label>
        </div>
      </form>

      <!-- filters -->
      <form class="filters">
        <span class="header">Filter by</span>
        <div class="filter-checkbox" v-for="tag in availableTags" :key="tag">
          <input
            type="checkbox"
            name="filter"
            :value="tag"
            :id="tag"
            v-model="selectedTags"
            @change="handleTagChange"
          />
          <label :for="tag">{{ tag }}</label>
        </div>
      </form>
    </div>
    <div class="hr" />
  </menu>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

.tools {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin-bottom: 0.7rem;
  width: 100%;
  padding-right: 1.1rem;
}

.tools button {
  border-radius: var(--border-radius--sm);
  padding: 0.7rem 0.7rem;
  transition: background 300ms ease;
  opacity: 0.56;
  &:hover {
    background: var(--bg--dark);
    opacity: 1;
  }
}

.hr {
  border-bottom: 0.5px solid rgb(255, 255, 255, 0.2);
  margin: 0 1.2rem 1.2rem;
}

menu {
  position: relative;
}

.menu-trigger {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  margin-right: 0.2rem;
  margin-left: 0.8rem;
  border-radius: var(--border-radius--sm);
  padding: 0.6rem 1.6rem 0.6rem 1.7rem;
  cursor: pointer;

  .op-7 {
    opacity: 0.64;
  }

  &:hover {
    background: var(--bg--dark);
    .op-7 {
      opacity: 1;
    }
  }
}

.menu-trigger svg {
  transform: translateY(0.03rem);
}

.dot {
  border-radius: 100px;
  width: 0.7rem;
  height: 0.7rem;
  background: none;
  transition: all 300ms ease;
  transform: translate(0.2rem, 0.1rem) scale(0.9);
  @include breakpoint(md) {
    transform: translate(0.2rem, 0.15rem) scale(0.9);
  }

  &.is-active {
    opacity: 1;
    background: #e75656;
    transform: translate(0.2rem, 0.1rem) scale(0.9);
    @include breakpoint(md) {
      transform: translate(0.2rem, 0.15rem) scale(1);
    }
  }
}

.popover {
  position: fixed;
  z-index: var(--z1);
  top: 22.5rem;
  left: 2.4rem;
  border-radius: var(--border-radius--md);
  border: var(--border);
  min-width: 19.2rem;
  max-height: 33.7rem;
  padding: 1rem 0.8rem;
  background: #0a0a0a;
  box-shadow: var(--shadow);
  opacity: 0;
  overflow-y: auto;
  pointer-events: none;
  transform: translateY(-1rem) scale(0.95);
  transform-origin: top;
  transition: opacity 200ms ease, transform 200ms ease;
  will-change: opacity, transform;

  &.is-open {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }
}

span.header {
  display: block;
  margin: 0.2rem 0 0.4rem 0.6rem;
  opacity: 0.6;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
}

label {
  margin-left: 0.4rem;
  width: 100%;
  font-size: 1.4rem;
  font-weight: 400;
  transform: translateY(-0.1rem);
  text-transform: capitalize;
}

.sort-radio,
.filter-checkbox {
  display: flex;
  align-items: center;
  border-radius: var(--border-radius--sm);
  padding: 0.4rem;
  opacity: 0.76;
  transition: background 200ms ease, opacity 200ms ease;

  &:hover {
    background: var(--bg--light);
    opacity: 1;
  }

  &:has(input:checked) {
    opacity: 1;
  }
}

.sort-radio label {
  transform: translate(0.4rem, -0.1rem);
}

input[type="radio"] {
  position: relative;
  appearance: none;
  border-radius: 100px;
  border: none;
  min-width: 16px;
  min-height: 16px;
  width: 16px;
  height: 16px;
  background: transparent;

  &:checked::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    width: 7px;
    height: 7px;
    background: var(--color--primary);
    transform: translate(-50%, -50%);
  }

  &:checked {
    border: 0.5px solid rgba(255, 255, 255, 0.32);
    background: var(--bg--light);
    & + label {
      opacity: 1;
    }
  }
}

.filters {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);

  &:last-of-type {
    border-top: 1px solid var(--bg--light);
  }
}

input[type="checkbox"] {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 6px;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  border: none;
  background: transparent;

  &:checked {
    &::after {
      content: "✓";
      color: transparent;
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 14px;
      transform: translate(-50%, -50%);

      background: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1735221728/proportional.design-3.0/checkbox_ls5w2x.svg")
        no-repeat center center;
      background-size: cover;
    }

    & + label {
      opacity: 1;
    }
  }
}
</style>

<script setup>
const directoryControls = inject("directoryControls");
const isOpen = ref(false);
const STORAGE_KEY = "selected-sort";
const TAGS_STORAGE_KEY = "selected-tags";
const emit = defineEmits(["sort", "filter"]);
const selectedSort = ref(localStorage.getItem(STORAGE_KEY) || "newest");
const selectedTags = ref(
  JSON.parse(localStorage.getItem(TAGS_STORAGE_KEY) || "[]")
);
const availableTags = ref([]);
const popoverRef = ref(null);
const triggerRef = ref(null);

const fetchTags = async () => {
  const posts = await queryContent().find();
  const tags = new Set();

  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => tags.add(tag));
    }
  });

  availableTags.value = Array.from(tags).sort();
};

const handleTagChange = () => {
  updateTags();
};

const updateTags = () => {
  localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(selectedTags.value));
  emit("filter", selectedTags.value);
};

// Existing sort handler
const handleSort = (e) => {
  selectedSort.value = e.target.value;
  localStorage.setItem(STORAGE_KEY, e.target.value);
  emit("sort", selectedSort.value);
};

const handleKeyPress = (event) => {
  if (event.key.toLowerCase() === "f") {
    isOpen.value = !isOpen.value;
  }
};

const handleMouseLeave = () => {
  setTimeout(() => {
    isOpen.value = false;
  }, 300);
};

const hasActiveFilters = computed(() => {
  return selectedTags.value.length > 0;
});

const handleClickOutside = (e) => {
  if (
    popoverRef.value &&
    !popoverRef.value.contains(e.target) &&
    !triggerRef.value.contains(e.target)
  ) {
    isOpen.value = false;
  }
};

const handleScroll = (e) => {
  if (popoverRef.value && !popoverRef.value.contains(e.target)) {
    isOpen.value = false;
  }
};

onMounted(async () => {
  await fetchTags();
  emit("sort", selectedSort.value);
  emit("filter", selectedTags.value);
  window.addEventListener("keydown", handleKeyPress);
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("scroll", handleScroll, true);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("scroll", handleScroll, true);
});
</script>
