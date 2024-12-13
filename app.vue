<template>
  <!-- <div class="app">
    <App-Aside />
    <NuxtPage class="main" />
  </div> -->

  <div>
    <!-- Search input -->
    <div class="search">
      <input
        v-model="query"
        type="search"
        placeholder="Search..."
        class="search-input"
      />

      <!-- Search results -->
      <div v-if="searchResults.length" class="search-results">
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
      </div>
    </div>

    <NuxtPage />
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;
@use "/assets/style/type.scss" as *;

.search {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
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
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  border-radius: var(--border-radius--sm);
  border: var(--border);
  margin-top: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.search-result {
  position: relative;
  z-index: var(--zmax);
  display: flex;
  gap: 12px;
  padding: 12px;
  border-bottom: var(--border);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.result-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: var(--border-radius--xs);
}

.result-content {
  h3 {
    font-size: 1.4rem;
    margin-bottom: 4px;
  }

  p {
    font-size: 1.2rem;
    opacity: 0.7;
  }
}

.app {
  display: flex;
  gap: var(--unit);
  margin: 0 auto;
  max-width: 180rem;
  padding: var(--unit);
}

:deep(.main) {
  flex: 1;
  border-radius: var(--border-radius--lg);
  border: var(--border);
  width: 100%;
  padding: 1.2rem;
  max-height: calc(100vh - var(--unit) * 2);
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0 18px 38px 0 rgba(0, 0, 0, 0.1), 0 4px 8px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(100px);
  overflow-y: scroll;
}
</style>

<script setup>
import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { queryContent } from "#imports";

const query = ref("");
const searchResults = ref([]);

const debouncedSearch = useDebounceFn(async () => {
  console.log("Search query:", query.value);

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

    console.log("Search results:", results);
    searchResults.value = results;
  } catch (error) {
    console.error("Search error:", error);
    searchResults.value = [];
  }
}, 300);

watch(query, () => {
  debouncedSearch();
});
</script>
