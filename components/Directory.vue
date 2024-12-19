<template>
  <ClientOnly>
    <select v-model="sortBy" @change="handleSort">
      <option value="updated">Sort: Last Updated</option>
      <option value="asc">Sort: A-Z</option>
      <option value="desc">Sort: Z-A</option>
    </select>

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

select {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0.8rem 0;
  border-radius: var(--border-radius--sm);
  border: none;
  padding: 1.4rem 1.6rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color--primary);
  text-transform: uppercase;
  opacity: 0.76;
  background: transparent;
  appearance: none;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.32);
    opacity: 1;
  }

  &:focus {
    outline: none;
    background: rgba(0, 0, 0, 0.2);
    opacity: 1;
  }

  &:focus:not(:hover) {
    outline: none;
    background: transparent;
    opacity: 0.76;
  }
}

option {
  background: var(--bg--vdark);
  color: var(--color--primary);
  padding: 0.8rem;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  &:checked {
    background: rgba(255, 255, 255, 0.16);
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
  margin-left: 0.3rem;
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
  margin: 0 0.8rem 0 2rem;
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
  pointer-events: none;
}
</style>

<script setup>
const { data: posts } = await useAsyncData("posts", () =>
  queryContent().where({ _partial: false }).find()
);

// Sorting
const STORAGE_KEY = "directory-sort-preference";
const sortBy = ref("updated");
const sortedPosts = computed(() => {
  const sorted = { ...groupedPosts.value };

  // Convert to array of [directory, posts] pairs for sorting
  const entries = Object.entries(sorted);

  // Sort directories
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

const handleSort = () => {
  localStorage.setItem(STORAGE_KEY, sortBy.value);
  // Trigger re-render
  nextTick();
};

const route = useRoute();

// Add isActive computed property
const isActiveLink = (path) => {
  return route.path === path;
};

const openStates = ref({});

// Load saved states on mount
onMounted(() => {
  const saved = localStorage.getItem("directoryStates");
  if (saved) {
    openStates.value = JSON.parse(saved);
  }

  const savedSort = localStorage.getItem(STORAGE_KEY);
  if (savedSort) {
    sortBy.value = savedSort;
  }
});

// Handle details toggle
const handleToggle = (directory, isOpen) => {
  openStates.value[directory] = isOpen;
  localStorage.setItem("directoryStates", JSON.stringify(openStates.value));
};

const groupedPosts = computed(() => {
  if (!posts.value) return {};

  return posts.value.reduce((acc, post) => {
    const directory = post._path.split("/")[1];

    // Skip if directory is empty, undefined, or root
    if (!directory || directory === "root" || directory === "") return acc;

    if (!acc[directory]) {
      acc[directory] = [];
    }
    acc[directory].push(post);
    return acc;
  }, {});
});

const getStatusGroup = (items, status) => {
  return items.filter((item) => item.status === status);
};
</script>
