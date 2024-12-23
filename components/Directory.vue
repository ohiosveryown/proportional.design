<template>
  <ClientOnly>
    <!-- <div class="filter-tags">
      <button
        v-for="tag in availableTags"
        :key="tag"
        @click="toggleTag(tag)"
        :class="{ active: selectedTags.includes(tag) }"
        class="tag-button"
      >
        {{ tag }}
        <svg
          v-if="selectedTags.includes(tag)"
          class="icon--remove"
          width="12"
          height="12"
          fill="none"
          viewBox="0 0 12 12"
          @click.stop="removeTag(tag)"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            d="M3 3l6 6M9 3L3 9"
          />
        </svg>
      </button>
    </div>

    <Filter v-model="sortBy" @update:modelValue="handleSort" /> -->

    <Controls @sort="handleSort" />

    <details
      v-for="(items, directory) in sortedPosts"
      :key="directory"
      :open="openStates[directory]"
      @toggle="(e) => handleToggle(directory, e.target.open)"
    >
      <summary>
        <div class="icon-directory" />
        <h3>{{ directory }}</h3>
      </summary>

      <!-- Finished items -->
      <section
        v-if="getStatusGroup(items, 'finished').length"
        class="finished status-group"
      >
        <header>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
          >
            <path
              fill="#fff"
              fill-rule="evenodd"
              d="M1.5 4.75c0-.69.56-1.25 1.25-1.25h6.5c.69 0 1.25.56 1.25 1.25v3.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-3.5ZM12.75 5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h4.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25h-4.5Zm-3.5 5.5c.69 0 1.25.56 1.25 1.25v2.5c0 .69-.56 1.25-1.25 1.25H3.6c-.69 0-1.25-.56-1.25-1.25v-2.5c0-.69.56-1.25 1.25-1.25h5.65Z"
              clip-rule="evenodd"
            />
          </svg>
          <h4>Finished media</h4>
        </header>
        <ul>
          <li v-for="post in getStatusGroup(items, 'finished')" :key="post._id">
            <NuxtLink
              :to="post._path"
              :class="{ active: isActiveLink(post._path) }"
            >
              <img class="icon-file" :src="post.icon" :alt="post.title" />
              <span>{{ post.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <!-- Unfinished items -->
      <section
        v-if="getStatusGroup(items, 'unfinished').length"
        class="wip status-group"
      >
        <header>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
          >
            <path
              fill="#fff"
              fill-rule="evenodd"
              d="M1.5 4.75c0-.69.56-1.25 1.25-1.25h6.5c.69 0 1.25.56 1.25 1.25v3.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-3.5ZM12.75 5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h4.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25h-4.5Zm-3.5 5.5c.69 0 1.25.56 1.25 1.25v2.5c0 .69-.56 1.25-1.25 1.25H3.6c-.69 0-1.25-.56-1.25-1.25v-2.5c0-.69.56-1.25 1.25-1.25h5.65Z"
              clip-rule="evenodd"
            />
          </svg>
          <h4>WIP media</h4>
        </header>
        <ul>
          <li
            v-for="post in getStatusGroup(items, 'unfinished')"
            :key="post._id"
          >
            <NuxtLink
              :to="post._path"
              :class="{ active: isActiveLink(post._path) }"
            >
              <img class="icon-file" :src="post.icon" :alt="post.title" />
              <span>{{ post.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </details>
  </ClientOnly>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

.filter-tags {
  position: relative;
}

.icon--remove {
  position: relative;
  z-index: var(--zmax);
  transform: rotate(12deg);
  cursor: grab;
}

.tag-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.2rem;
  color: var(--color--primary);
  opacity: 0.7;
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius--sm);
  border: var(--border--light);
  background: transparent;
  cursor: pointer;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.08);
  }

  &.active {
    background: rgba(255, 255, 255, 0.16);
    opacity: 1;
  }

  .icon--close {
    opacity: 0.56;
  }
}

details {
  &[open] {
    margin-bottom: 0.6rem;
  }
}

details:last-of-type {
  &[open] {
    opacity: 0.9;
    margin-bottom: 0rem;
  }
}

summary {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  list-style: none;
  position: relative;
  margin: 0 0.8rem 0;
  padding: 0.6rem 0.8rem;
  @include breakpoint(md) {
    gap: 0.4rem;
    padding: 0.8rem 0.8rem;
  }
  &:focus {
    outline: none;
    background: rgba(0, 0, 0, 0.2);
  }
}

summary h3 {
  font-size: 1.6rem;
  font-weight: 500;
  pointer-events: none;
  @include breakpoint(md) {
    font-size: 1.5rem;
    letter-spacing: 0.25px;
  }
}

summary,
li {
  border-radius: var(--border-radius--sm);
  overflow: default;
}

summary:hover {
  background: rgba(0, 0, 0, 0.32);
}

summary::-webkit-details-marker {
  display: none;
}

summary::after {
  content: "";
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  background: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733932989/proportional.design-3.0/chevron_jpthtr.svg")
    no-repeat center;
  background-size: contain;
  transition: transform 0.2s ease;
}

details[open] > summary::after {
  transform: translate(-1px, -50%) rotate(90deg);
}

ul {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

ul > * {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none;
}

.icon-directory {
  width: 3.6rem;
  height: 2.8rem;
  background: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733929950/folder-sprite_3x_ajronm.webp")
    no-repeat 0.75px -0.5px;
  background-size: cover;
}

details[open] .icon-directory {
  width: 3.6rem;
  height: 2.8rem;
  background: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733929950/folder-sprite_3x_ajronm.webp")
    no-repeat -35px -0.5px;
  background-size: cover;
}

section header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-left: 1.4rem;
  padding: 1.1rem 3rem;
  opacity: 0.76;
}

section header svg {
  transform: translateY(0.1rem);
}

section header h4 {
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
}

// li {
//   content-visibility: auto;
// }

li a {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 0 0.8rem 0 3.2rem;
  border-radius: var(--border-radius--sm);
  padding: 0.9rem 0.8rem 0.5rem 0.7rem;
  font-size: 1.6rem;
  font-weight: 500;
  @include breakpoint(md) {
    font-size: 1.5rem;
    font-weight: 400;
    letter-spacing: 0.25px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.32);
  }

  &:focus {
    outline: none;
    background: rgba(0, 0, 0, 0.2);
  }

  &:focus:not(:hover) {
    outline: none;
    background: rgba(0, 0, 0, 0.2);
  }
}

li span {
  transform: translateY(-0.2rem);
}

.icon-file {
  border-radius: var(--border-radius--xs);
  border: 1.5px solid #fff;
  width: 3rem;
  height: 2.4rem;
  object-fit: cover;
  object-position: top;
  transform: translateY(-0.2rem);
  box-shadow: var(--shadow--sm);
}

h3,
a {
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.32);
}

.active {
  background: rgba(0, 0, 0, 0.32);
  // pointer-events: none;
}
</style>

<script setup>
const { data: posts } = await useAsyncData("posts", () =>
  queryContent().where({ _partial: false }).find()
);

// Sorting & Filtering
import Filter from "~/components/Filter.vue";
const sortBy = ref("updated"); // Add this line

const route = useRoute();

const handleSort = (value) => {
  sortBy.value = value;
  localStorage.setItem("directory-sort", value);
};

// Add isActive computed property
const isActiveLink = (path) => {
  return route.path === path;
};

const openStates = ref({});

// Load saved states on mount
onMounted(() => {
  const savedSort = localStorage.getItem("directory-sort");
  if (savedSort) {
    sortBy.value = savedSort;
  }
  const saved = localStorage.getItem("directoryStates");
  if (saved) {
    openStates.value = JSON.parse(saved);
  }
});

// Handle details toggle
const handleToggle = (directory, isOpen) => {
  openStates.value[directory] = isOpen;
  localStorage.setItem("directoryStates", JSON.stringify(openStates.value));
};

const groupedPosts = computed(() => {
  if (!posts.value) return {};

  const filtered = selectedTags.value.length
    ? posts.value.filter((post) =>
        selectedTags.value.every((tag) => post.tags?.includes(tag))
      )
    : posts.value;

  return filtered.reduce((acc, post) => {
    const directory = post._path.split("/")[1];
    if (!directory || directory === "root" || directory === "") return acc;
    if (!acc[directory]) acc[directory] = [];
    acc[directory].push(post);
    return acc;
  }, {});
});

const sortedPosts = computed(() => {
  const sorted = { ...groupedPosts.value };

  // Convert to array of [directory, posts] pairs for sorting
  const entries = Object.entries(sorted);

  // Sort directories based on sortBy value
  const sortedEntries = entries.sort(([dirA], [dirB]) => {
    switch (sortBy.value) {
      case "updated":
        // Get latest post date from each directory
        const latestA = Math.max(
          ...sorted[dirA].map((post) => new Date(post.date))
        );
        const latestB = Math.max(
          ...sorted[dirB].map((post) => new Date(post.date))
        );
        return latestB - latestA;
      case "asc":
        return dirA.localeCompare(dirB);
      case "desc":
        return dirB.localeCompare(dirA);
      default:
        return 0;
    }
  });

  // Convert back to object
  return Object.fromEntries(sortedEntries);
});

const getStatusGroup = (items, status) => {
  return items.filter((item) => item.status === status);
};

// tags

const STORAGE_KEY = "selected-tags";
const selectedTags = ref([]);

// Load saved tags
onMounted(() => {
  const savedTags = localStorage.getItem(STORAGE_KEY);
  if (savedTags) {
    selectedTags.value = JSON.parse(savedTags);
  }
});

// Update storage when tags change
watch(
  selectedTags,
  (newTags) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTags));
  },
  { deep: true }
);

const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag);
};

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    removeTag(tag);
  }
};

const availableTags = computed(() => {
  if (!posts.value) return [];
  const tags = posts.value.flatMap((post) => post.tags || []);
  return [...new Set(tags)];
});

const Tag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index !== -1) {
    selectedTags.value.splice(index, 1);
  }
};
</script>
