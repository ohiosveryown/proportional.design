<template>
  <section>
    <div class="toolbar">
      <div class="button-container">
        <div class="tooltip">
          <span class="label">Switch view</span>
          <span class="key">⌘</span>
          <span class="key key-secondary">V</span>
        </div>
        <button class="view-toggle" @click="toggleView">
          <!-- {{ isGridView ? "⊞" : "≣" }} -->
          <svg v-if="isGridView" width="20" height="20" fill="none">
            <mask id="a" fill="#fff">
              <rect width="5" height="5" x="4" y="4" rx=".5" />
            </mask>
            <rect
              width="5"
              height="5"
              x="4"
              y="4"
              stroke="#fff"
              stroke-width="1.5"
              mask="url(#a)"
              rx=".5"
            />
            <mask id="b" fill="#fff">
              <rect width="5" height="5" x="4" y="11" rx=".5" />
            </mask>
            <rect
              width="5"
              height="5"
              x="4"
              y="11"
              stroke="#fff"
              stroke-width="1.5"
              mask="url(#b)"
              rx=".5"
            />
            <mask id="c" fill="#fff">
              <rect width="5" height="5" x="11" y="4" rx=".5" />
            </mask>
            <rect
              width="5"
              height="5"
              x="11"
              y="4"
              stroke="#fff"
              stroke-width="1.5"
              mask="url(#c)"
              rx=".5"
            />
            <mask id="d" fill="#fff">
              <rect width="5" height="5" x="11" y="11" rx=".5" />
            </mask>
            <rect
              width="5"
              height="5"
              x="11"
              y="11"
              stroke="#fff"
              stroke-width="1.5"
              mask="url(#d)"
              rx=".5"
            />
          </svg>

          <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4.25" y="5" width="3" height="3" rx="0.5" stroke="white" />
            <path d="M10.25 6.5H15.75" stroke="white" stroke-linecap="round" />
            <rect
              x="4.25"
              y="12"
              width="3"
              height="3"
              rx="0.5"
              stroke="white"
            />
            <path d="M10.25 13.5H15.75" stroke="white" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <h2 class="count-label">
        <span class="op-7">All files ({{ filteredPosts.length }})</span>
        <span class="dot" :class="{ 'is-active': selectedTags.length > 0 }" />
      </h2>

      <h2 class="toolbar-label op-7">Filters:</h2>

      <button
        v-for="tag in allTags"
        :key="tag"
        class="tag-filter"
        :class="{ 'is-active': selectedTags.includes(tag) }"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <p v-if="filteredPosts.length === 0" class="no-results">
      Looks like we came up empty. Try removing some filters to see more content
      👍.
    </p>

    <!-- Table View -->
    <table v-else-if="!isGridView">
      <thead>
        <tr>
          <th class="col-name">Name</th>
          <th class="col-directory">Directory</th>
          <th class="col-date">Date</th>
          <th class="col-tags">Tags</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in filteredPosts" :key="post._path">
          <td class="title">
            <NuxtLink :to="post._path">
              <img class="icon-file" :src="post.icon" :alt="post.title" />
              {{ post.title }}
            </NuxtLink>
          </td>
          <td class="op-7">{{ getDirectory(post._path) }}</td>
          <td class="op-7">{{ formatDate(post.date) }}</td>
          <td class="tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Grid View -->
    <div v-else class="grid-view">
      <div v-for="post in filteredPosts" :key="post._path" class="grid-item">
        <NuxtLink :to="post._path" class="grid-card">
          <img class="icon-file" :src="post.icon" :alt="post.title" />
          <div class="grid-content">
            <h3>{{ post.title }}</h3>
            <p class="directory op-7">{{ getDirectory(post._path) }}</p>
            <p class="date op-7">{{ formatDate(post.date) }}</p>
            <div class="tags">
              <span v-for="tag in post.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

h2,
h2 span {
  font-size: var(--font-sm);
  font-weight: 500;
  opacity: 0.76;
  text-transform: capitalize;
}

.dot {
  display: inline-block;
  margin-right: 1rem;
  border-radius: var(--radius-lg);
  width: 0.7rem;
  height: 0.7rem;
  background: var(--bg-vlight);
  opacity: 1;
  transform: translate(0.5rem, -0.05rem) scale(0.8);
  transition: all 300ms ease;

  &.is-active {
    opacity: 1;
    background: var(--color-active);
    transform: translate(0.5rem, -0.05rem) scale(1);
  }
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
  margin: 2rem 0 0.8rem;
  padding-left: 1.4rem;
}

.toolbar span {
  font-size: var(--font-xs);
}

.count-label {
  border-left: var(--border-vdark);
  padding-left: 0.8rem;
}

.toolbar-label {
  border-left: var(--border-vdark);
  padding-left: 0.8rem;
}

.button-container {
  position: relative;
}

.tooltip {
  position: absolute;
  top: 40%;
  left: 0%;
  z-index: var(--z1);
  padding: 0.24rem 0.32rem 0.32rem 0.64rem;
  background: var(--bg);
  border: var(--border-light);
  border-radius: var(--radius-md);
  font-size: var(--font-xs);
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(2rem) translateY(-40%) scale(0.8);
  transform-origin: center left;
  transition: all 200ms ease;
  pointer-events: none;
  box-shadow: var(--shadow-sm);
}

.button-container:hover .tooltip {
  opacity: 1;
  transform: translateX(2.6rem) translateY(-40%) scale(0.9);
  transition: all 200ms ease 400ms;
}

.tag-filter {
  display: inline-block;
  margin-left: 0.3rem;
  border-radius: var(--radius-xl);
  border: var(--border);
  padding: 0.4rem 0.8rem 0.5rem;
  letter-spacing: 0.02rem;
  font-weight: 500;
  font-size: var(--font-xxs);
  color: var(--color-font);
  background: var(--bg-light);
  text-shadow: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: var(--bg-vlight);
  }

  &.is-active {
    background: var(--bg-vvlight);
  }
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.4rem;

  tr {
    content-visibility: auto;
    contain-intrinsic-size: 800px 600px;
    transition: background 300ms ease;
    &:hover {
      background: var(--bg-dark);
    }
  }

  thead tr {
    content-visibility: visible;
    &:hover {
      background: none;
    }
  }

  th,
  td {
    padding: 1.4rem 0.5rem 1rem 0;
    text-align: left;
    border-bottom: var(--border-light);
  }

  th {
    font-weight: 500;
    color: var(--color-font);
    opacity: 1;
  }

  td {
    vertical-align: top;
  }
}

table tr:last-of-type td {
  border-bottom: none;
}

.title-td {
  border-radius: var(--radius-md) 0 0 var(--radius-md);
  font-weight: 500;
  opacity: 1;
}

td a {
  padding-left: 1.2rem;
  font-weight: 500;
  text-shadow: var(--shadow-text);
  opacity: 1;
}

.col-name {
  padding-left: 1.5rem;
}

.col-tags {
  display: none;
  @include breakpoint(lg) {
    display: table-cell;
  }
}

.col-directory,
.col-name,
.col-tags,
.col-date {
  position: sticky;
  z-index: var(--z1);
  top: 5.4rem;
  background: color-mix(in srgb, var(--bg-vdark) 76%, transparent);
  backdrop-filter: blur(10px);
}

.tags {
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  opacity: 1;
}

.icon-file {
  display: inline;
  border-radius: var(--radius-xs);
  margin-right: 1.2rem;
  margin: 0 1.2rem 0 0.4rem;
  border: 1.5px solid #fff;
  width: 3rem;
  height: 2.4rem;
  object-fit: cover;
  object-position: top;
  box-shadow: var(--shadow-sm);
}

.tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  margin: 0.2rem;
  border-radius: var(--radius-sm);
  background: var(--bg-light);
  font-size: 1.2rem;
  opacity: 0.76;

  &:first-child {
    margin-left: 0;
  }
}

.op-7 {
  opacity: 0.76;
}

.header-row {
  display: flex;
  align-items: center;
  padding-left: 1.4rem;
}

.view-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: var(--z2);
  margin-right: 0.4rem;
  border-radius: var(--radius-sm);
  color: var(--color-font);
  background: var(--bg-vdark);
  opacity: 0.76;
  transform: translateY(0.05rem);
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    opacity: 1;
    background: var(--bg-dark);
  }
}

.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem auto 0;
  padding: 0 1.2rem;
}

.grid-card {
  display: block;
  background: var(--bg-light);
  border-radius: var(--radius-md);
  padding: 2rem;
  transition: all 0.2s ease;
  height: 100%;

  &:hover {
    transform: translateY(-2px);
    background: var(--bg-dark);
  }

  .icon-file {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1.5rem;
  }

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.6rem;
    font-weight: 500;
  }

  .directory,
  .date {
    font-size: 1.3rem;
    margin: 0.5rem 0;
  }

  .tags {
    margin-top: 1.5rem;
  }
}

.no-results {
  text-align: center;
  padding: 4rem 0;
  opacity: 0.7;
}

.label {
  margin-right: 0.5rem;
  font-size: var(--font-xxs);
  font-weight: 600;
  letter-spacing: 0rem;
  color: color-mix(in srgb, var(--color-font) 72%, transparent);
}

.key {
  font-size: var(--font-xxs);
  font-weight: 600;
  border-radius: var(--radius-sm);
  padding: 0.2rem 0.7rem;
  background: var(--bg-light);
  border: var(--border);
  text-align: center;
}

.key-secondary {
  margin-left: 0.4rem;
}
</style>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";

// Fetch posts directly in the component
const { data: posts } = await useAsyncData("posts", () =>
  queryContent().find()
);

const selectedTags = ref<string[]>([]);

// Get all unique tags from posts
const allTags = computed(() => {
  if (!posts.value) return [];

  const tags = new Set<string>();
  posts.value.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
});

// Toggle tag selection
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
};

// Update filteredPosts to include sorting by date
const filteredPosts = computed(() => {
  if (!posts.value) return [];

  const filtered = posts.value
    .filter((post) => post._path !== "/")
    .sort((a, b) => {
      return new Date(b.date) - new Date(a.date); // Most recent first
    });

  if (selectedTags.value.length === 0) {
    return filtered;
  }

  return filtered.filter((post) =>
    selectedTags.value.every((tag) => post.tags?.includes(tag))
  );
});

const totalPosts = computed(
  () => posts.value.filter((post) => post._path !== "/").length
);

const sortedPosts = computed(() => {
  // Filter out the root page before sorting
  const filteredPosts = posts.value.filter((post) => post._path !== "/");

  return filteredPosts.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
});

const getDirectory = (path) => {
  return path.split("/")[1]; // Gets the directory name from the path
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isGridView = ref(false);

// Use onMounted to handle localStorage after initial render
onMounted(() => {
  const savedView = localStorage.getItem("isGridView");
  if (savedView !== null) {
    isGridView.value = savedView === "true";
  }
  window.addEventListener("keydown", handleKeydown);
});

const toggleView = () => {
  isGridView.value = !isGridView.value;
  if (process.client) {
    localStorage.setItem("isGridView", isGridView.value.toString());
  }
};

// Add keyboard shortcut handler
const handleKeydown = (event: KeyboardEvent) => {
  if (
    (event.metaKey || event.ctrlKey) &&
    (event.key === "v" || event.key === "V")
  ) {
    event.preventDefault();
    toggleView();
  }
};

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
