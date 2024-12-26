<template>
  <menu>
    <div class="menu-trigger">
      <svg
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
      Filters
    </div>

    <div class="popover">
      <!-- sorting -->
      <form @change="handleSort">
        <div class="sort-radio">
          <input
            type="radio"
            name="sort"
            value="newest"
            id="newest"
            :checked="selectedSort === 'newest'"
          />
          <label for="newest">Newest First</label>
        </div>

        <div class="sort-radio">
          <input
            type="radio"
            name="sort"
            value="oldest"
            id="oldest"
            :checked="selectedSort === 'oldest'"
          />
          <label for="oldest">Oldest First</label>
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
  </menu>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

menu {
  position: relative;
}

.popover {
  position: fixed;
  z-index: var(--z1);
  top: 23.3rem;
  left: 2.4rem;
  border-radius: var(--border-radius--md);
  border: var(--border);
  min-width: 18rem;
  max-height: 32rem;
  padding: 1rem 0.8rem;
  background: #0a0a0a;
  box-shadow: var(--shadow);
  overflow-y: auto;

  // position: absolute;
  // top: 90%;
  // left: 1.1rem;
  // max-height: 22.5rem;
}

.menu-trigger {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0.8rem;
  border-radius: var(--border-radius--sm);
  padding: 1rem 1.6rem;
  opacity: 0.76;

  &:hover {
    background: var(--bg--dark);
    opacity: 1;
  }
}

.menu-trigger svg {
  transform: translateY(0.05rem);
}

label {
  margin-left: 0.4rem;
  width: 100%;
  font-size: 1.5rem;
  font-weight: 500;
  transform: translateY(-0.1rem);
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
import { ref, onMounted } from "vue";

const STORAGE_KEY = "selected-sort";
const TAGS_STORAGE_KEY = "selected-tags";

const emit = defineEmits(["sort", "filter"]);
const selectedSort = ref(localStorage.getItem(STORAGE_KEY) || "newest");
const selectedTags = ref(
  JSON.parse(localStorage.getItem(TAGS_STORAGE_KEY) || "[]")
);
const availableTags = ref([]);

// Get all unique tags from content
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
  // If no tags selected, show all posts
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

onMounted(async () => {
  await fetchTags();
  emit("sort", selectedSort.value);
  emit("filter", selectedTags.value);
});
</script>
