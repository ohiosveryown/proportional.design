<template>
  <div>
    <button @click="openDialog" class="trigger">
      <svg width="16" height="16" fill="none">
        <path
          fill="#fff"
          fill-rule="evenodd"
          d="M11.392 9.369A3.366 3.366 0 0 1 5.873 5.7a3.367 3.367 0 1 1 5.519 3.668Zm-5.504.843a4.488 4.488 0 1 0-.1-.1l-.347-.347-2.777 2.777a.56.56 0 1 0 .794.794l2.777-2.777-.347-.347Z"
          clip-rule="evenodd"
          opacity=".5"
        />
      </svg>
      <span>Search</span>
      <span class="tooltip">
        <span class="label">Search</span>
        <span class="key">⌘</span>
        <span class="key">K</span>
      </span>
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
          <button class="close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="14.5"
              fill="none"
            >
              <g
                stroke="#fff"
                stroke-linecap="round"
                stroke-width="1.5"
                opacity=".76"
              >
                <path d="m4.637 4 8 8M12.637 4l-8 8" />
              </g>
            </svg>
          </button>
        </form>
      </header>

      <section class="suggestions">
        <!-- <header>{{ hoveredTitle || "Suggested media" }}</header> -->
        <header>Suggested media</header>
        <div class="scroll-container">
          <ul class="thumbnails" ref="thumbnailsContainer">
            <li
              v-for="(post, index) in displayedPosts"
              :key="`${post._id}-${index}`"
              @mouseover="hoveredTitle = post.title"
              @mouseleave="hoveredTitle = ''"
            >
              <NuxtLink :to="post._path">
                <img :src="post.icon" :alt="post.title" />
                <span>{{ post.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
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

.trigger {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0;
  border-radius: var(--radius-xl);
  padding: 0.6rem 1.7rem 0.7rem 1rem;
  cursor: pointer;
  transition: background 200ms ease;

  span {
    font-size: var(--font-xs);
    font-weight: 500;
    letter-spacing: -0.025rem;
  }
}

.trigger:hover {
  background: var(--bg-dark);
}

dialog {
  margin: 0 auto;
  z-index: var(--z2);
  border-radius: var(--radius-lg);
  border: var(--border-light);
  width: 56rem;
  padding: 1.6rem 0 0;
  color: var(--color-font);
  background: var(--bg);
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
  backdrop-filter: blur(2px);
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

:deep(input[type="search"]) {
  margin-left: -1.6rem;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  color: var(--color-font);
  font-size: 1.6rem;
  background: transparent !important;
  outline: none;
  &::placeholder {
    color: var(--color-font);
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

button.close {
  transform: translateY(0.7rem);
}

section.suggestions {
  margin: 1.6rem 0;
  padding: 0 1.5rem;
  header {
    margin-bottom: 0.8rem;
    font-size: var(--font-xs);
    font-weight: 600;
    opacity: 0.72;
  }
}

.scroll-container {
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 60px;
    z-index: 1;
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, var(--bg), transparent);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, var(--bg), transparent);
  }
}

.thumbnails {
  display: flex;
  gap: 0.8rem;
  padding: 0.5rem 0;
  scroll-behavior: smooth;
  scrollbar-width: none;
  animation: scroll 60s linear infinite;
  transform-style: preserve-3d;
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  &:hover {
    animation-play-state: paused;
  }

  @keyframes scroll {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(-200%, 0, 0);
    }
  }

  li {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    gap: 0.8rem;
    border: var(--border);
    border-radius: var(--radius-xl);
    padding: 0.55rem 0.88rem 0.55rem 0.55rem;
    background: var(--bg-light);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transition: background 200ms ease;
  }

  li:hover {
    background: var(--bg-dark);
  }

  img {
    margin-right: 0;
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.thumbnails li:nth-last-child(-n + 2) {
  display: none;
  @include breakpoint(md) {
    display: inherit;
  }
}

.thumbnails img {
  border-radius: var(--radius-md);
  border: 1.5px solid #fff;
  width: 2.4rem;
  height: 2.4rem;
}

.thumbnails img ~ span {
  font-weight: 600;
  font-size: var(--font-xs);
}

.result-thumb {
  margin-right: 1rem;
  border: 1.5px solid #fff;
  border-radius: var(--radius-md);
  width: 5.6rem;
  height: 5.6rem;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;
}

.search-input {
  width: 100%;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  border: var(--border);
  background: rgba(0, 0, 0, 0.2);
  color: var(--color-font);
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

.tooltip {
  display: flex;
  align-items: center;
  position: absolute;
  top: 116%;
  left: 50%;
  padding: 0.24rem 0.32rem 0.32rem 0.64rem;
  background: var(--bg);
  border: var(--border-light);
  border-radius: var(--radius-md);
  font-size: var(--font-xs);
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-50%) translateY(-8px) scale(0.8);
  transform-origin: top;
  transition: all 200ms ease;
  pointer-events: none;
  box-shadow: var(--shadow-sm);
  gap: 0.3rem;
}

.trigger:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(1px) scale(0.9);
  transition: all 200ms ease 400ms;
}

.label {
  margin-right: 0.5rem;
  font-size: var(--font-xxs);
  font-weight: 600;
  letter-spacing: -0.02rem;
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
  min-width: 2rem;
}

.tooltip span + span {
  margin-left: 0.1rem;
}

.thumbnails li a {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}
</style>

<script setup>
import { queryContent } from "#imports";
import { useDebounceFn } from "@vueuse/core";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";

const searchDialog = ref(null);
const randomPosts = ref([]);
const hoveredTitle = ref("");
const route = useRoute();
const query = ref("");
const searchResults = ref([]);
const thumbnailsContainer = ref(null);
const displayedPosts = ref([]);
const allPosts = ref([]);

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
      .only(["_id", "_path", "title", "icon", "description"])
      .limit(10)
      .find();
    searchResults.value = results;
  } catch (error) {
    searchResults.value = [];
  }
}, 300);
watch(query, () => {
  debouncedSearch();
});

// Add shuffle function
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const prefetchPosts = async () => {
  try {
    const posts = await queryContent()
      .where({ _path: { $ne: "/" } })
      .only(["_id", "_path", "title", "icon"])
      .find();

    allPosts.value = shuffleArray([...posts]);
    updateDisplayedPosts();
  } catch (error) {
    console.error("Error fetching posts:", error);
    allPosts.value = [];
  }
};

const updateDisplayedPosts = () => {
  // Duplicate posts 4 times instead of just once
  const duplicatedPosts = [
    ...allPosts.value,
    ...allPosts.value,
    ...allPosts.value,
    ...allPosts.value,
  ];
  displayedPosts.value = duplicatedPosts;
};

const openDialog = () => {
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
  if (event.key === "Escape" && searchDialog.value?.open) {
    event.preventDefault();
    closeDialog();
  }
  if (
    (event.metaKey || event.ctrlKey) &&
    (event.key === "k" || event.key === "K")
  ) {
    event.preventDefault();
    if (!searchDialog.value?.open) {
      openDialog();
    }
  }
};

// Prefetch on mount
onMounted(() => {
  prefetchPosts();
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
