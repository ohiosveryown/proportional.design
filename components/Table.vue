<template>
  <section>
    <h4>
      <span class="op-7">All files ({{ filteredPosts.length }})</span>
      <span class="dot" :class="{ 'is-active': selectedTags.length > 0 }" />
    </h4>

    <table>
      <thead>
        <tr>
          <th class="col-name">Name</th>
          <th>Directory</th>
          <th>Date</th>
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
          <td class="tags col-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

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
    opacity: 0.76;
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
  position: sticky;
  top: 5.6rem;
  padding-left: 1.5rem;
}

.col-tags {
  display: none;
  @include breakpoint(lg) {
    display: table-cell;
  }
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
</style>

<script setup lang="ts">
import { computed, ref } from "vue";

// Fetch posts directly in the component
const { data: posts } = await useAsyncData("posts", () =>
  queryContent().find()
);

const selectedTags = ref<string[]>([]);

// Update filteredPosts to use posts.value
const filteredPosts = computed(() => {
  if (!posts.value) return [];

  const filtered = posts.value.filter((post) => post._path !== "/");

  if (selectedTags.value.length === 0) return filtered;

  return filtered.filter((post) =>
    post.tags?.some((tag: string) => selectedTags.value.includes(tag))
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
</script>
