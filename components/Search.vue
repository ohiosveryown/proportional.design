<template>
  <div>
    <button @click="openDialog" class="trigger">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="31"
        height="20"
        fill="none"
      >
        <g clip-path="url(#a)">
          <path
            fill="#fff"
            fill-opacity=".4"
            fill-rule="evenodd"
            d="M21.608 11.65a4.88 4.88 0 1 1-6.9-6.9 4.88 4.88 0 0 1 6.9 6.9Zm-7.977 1.223a6.506 6.506 0 1 0-.146-.146l-.502-.502-4.025 4.025a.813.813 0 1 0 1.15 1.15l4.025-4.025-.502-.502Z"
            clip-rule="evenodd"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M.858 0h30v20h-30z" />
          </clipPath>
        </defs>
      </svg>
    </button>

    <dialog ref="searchDialog">
      <header class="input">
        <input
          v-model="query"
          type="search"
          placeholder="Search media..."
          class="search-input"
        />

        <span class="divider" />
        <form method="dialog">
          <button>
            <svg
              class="icon--close"
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="14.5"
              fill="none"
            >
              <g
                stroke="#fff"
                stroke-linecap="round"
                stroke-width="1.5"
                opacity=".56"
              >
                <path d="m4.637 4 8 8M12.637 4l-8 8" />
              </g>
            </svg>
          </button>
        </form>
      </header>

      <section class="suggestions">
        <header>{{ hoveredTitle || "Suggested media" }}</header>
        <ul class="thumbnails">
          <li
            v-for="post in randomPosts"
            :key="post._id"
            @mouseover="hoveredTitle = post.title"
            @mouseleave="hoveredTitle = ''"
          >
            <NuxtLink :to="post._path">
              <img :src="post.icon" :alt="post.title" />
            </NuxtLink>
          </li>
        </ul>
      </section>

      <!-- Search results -->
      <section v-if="searchResults.length" class="search-results">
        <NuxtLink
          v-for="result in searchResults"
          :key="result._id"
          :to="result._path"
          class="search-result"
        >
          <img
            v-if="result.icon"
            :src="result.icon"
            :alt="result.title"
            class="result-thumb"
          />
          <div class="result-content">
            <h3>{{ result.title }}</h3>
            <p>{{ result.description }}</p>
          </div>
        </NuxtLink>
      </section>
    </dialog>
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

.trigger svg {
  transform: translateY(0.3rem);
}

dialog {
  margin: 0 auto;
  z-index: var(--z2);
  border-radius: var(--border-radius--lg);
  border: var(--border--light);
  width: 56rem;
  padding: 1.6rem 0 0;
  color: var(--color--primary);
  background: var(--bg);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow);
  transform: translateY(12vh);
  @include breakpoint(md) {
    transform: translateY(24vh);
  }
}

dialog::backdrop {
  position: fixed;
  z-index: var(--zmax);
  inset: 0;
  width: 100dvw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.64);
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.64) 80%
  );
}

header.input {
  display: flex;
  position: relative;
  z-index: var(--zmax);
  border-bottom: var(--border);
  padding: 0 1.6rem 1.4rem;
}

svg.icon--close {
  transform: translateY(0.7rem);
}

input {
  flex: 1;
  background: transparent;
}

:deep input[type="search"] {
  margin-left: -1.6rem;
  border: 1px solid var(--border--light);
  border-radius: var(--border-radius--sm);
  color: var(--color--primary);
  font-size: 1.6rem;
  background: transparent !important;
  outline: none;
  &::placeholder {
    color: var(--color--primary);
    opacity: 0.6;
  }
}

input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

span.divider {
  border-right: var(--border);
  margin: 0 1.2rem;
}

section.suggestions {
  margin: 1.6rem 0;
  padding: 0 1.5rem;
  header {
    margin-bottom: 1.2rem;
    font-size: 1.4rem;
    font-weight: 600;
    opacity: 0.72;
  }
}

.thumbnails {
  position: relative;
  display: flex;
  &:before {
    display: none;
    border: 2px soild red;
    content: "";
    position: fixed;
    z-index: var(9999);
    inset: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.01);
    backdrop-filter: blur(24px);
    mask: linear-gradient(90deg, transparent 40%, black 72%);
    pointer-events: none;
    @include breakpoint(md) {
      display: inherit;
    }
  }
}

.thumbnails li:nth-last-child(-n + 2) {
  display: none;
  @include breakpoint(md) {
    display: inherit;
  }
}

.thumbnails img,
.result-thumb {
  margin-right: 1.4rem;
  border: 1.5px solid #fff;
  border-radius: var(--border-radius--sm);
  width: 5.6rem;
  height: 5.6rem;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;
}

.search-input {
  width: 100%;
  padding: 8px 16px;
  border-radius: var(--border-radius--sm);
  border: var(--border);
  background: rgba(0, 0, 0, 0.2);
  color: var(--color--primary);
}

.search-results {
  position: relative;
  inset: 0;
  margin-top: 1.6rem;
  border-top: var(--border);
  max-height: 32rem;
  overflow-y: auto;
}

.search-results .search-result:last-child {
  border-bottom: none;
}

.search-result {
  position: relative;
  z-index: var(--zmax);
  display: flex;
  gap: 1.2rem;
  padding: 1.2rem 1.6rem;
  border-bottom: var(--border);
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.result-thumb {
  margin-right: 0.2rem;
  min-width: 5.6rem;
  min-height: 5.6rem;
}

.result-content {
  h3 {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.2rem;
  }

  p {
    font-size: 1.3rem;
    line-height: 1.4;
    opacity: 0.7;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>

<script setup>
import { queryContent } from "#imports";
import { useDebounceFn } from "@vueuse/core";

const searchDialog = ref(null);
const randomPosts = ref([]);
const hoveredTitle = ref("");
const route = useRoute();
const query = ref("");
const searchResults = ref([]);

const debouncedSearch = useDebounceFn(async () => {
  if (!query.value) {
    searchResults.value = [];
    return;
  }
  try {
    const results = await queryContent()
      .where({
        $or: [
          { title: { $contains: query.value } },
          { tags: { $contains: query.value } },
        ],
      })
      .find();
    searchResults.value = results;
  } catch (error) {
    searchResults.value = [];
  }
}, 300);
watch(query, () => {
  debouncedSearch();
});

const fetchRandomPosts = async () => {
  const allPosts = await queryContent().find();
  const filteredPosts = allPosts.filter((post) => post._path !== "/");
  randomPosts.value = filteredPosts.sort(() => 0.5 - Math.random()).slice(0, 6);
};

const openDialog = async () => {
  await fetchRandomPosts();
  if (searchDialog.value) {
    searchDialog.value.showModal();
  }
};

const closeDialog = () => {
  if (searchDialog.value) {
    searchDialog.value.close();
  }
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    closeDialog();
  }
  if ((event.metaKey || event.ctrlKey) && event.key === "k") {
    openDialog();
  }
};

// Fetch random posts on mount
onMounted(() => {
  fetchRandomPosts();
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

// Watch for route changes to close the dialog
watch(route, () => {
  closeDialog();
});
</script>
