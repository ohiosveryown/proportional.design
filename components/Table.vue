<template>
  <div class="table-wrapper">
    <h4>
      <span class="op-7">All files ({{ filteredPosts.length }})</span>
      <span class="dot" :class="{ 'is-active': selectedTags.length > 0 }" />
    </h4>

    <div class="tag-filters">
      <span class="op-7">Filters:</span>
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

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Directory</th>
          <th>Date</th>
          <th class="col-tags">Tags</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in filteredPosts" :key="post._path">
          <td class="title-td">
            <NuxtLink :to="post._path">
              <img class="icon-file" :src="post.icon" :alt="post.title" />
              {{ post.title }}
            </NuxtLink>
          </td>
          <td>{{ getDirectory(post._path) }}</td>
          <td>{{ formatDate(post.date) }}</td>
          <td class="tags col-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.count {
  margin-right: 0.4rem;
  text-transform: capitalize;
}

h4 {
  font-weight: 600;
  font-size: 1.2rem;
  text-transform: uppercase;
  // opacity: 0.76;
}

.dot {
  display: inline-block;
  border-radius: 100px;
  width: 0.7rem;
  height: 0.7rem;
  background: #e75656;
  opacity: 0;
  transform: translate(0.5rem, -0.05rem) scale(0.9);
  transition: all 300ms ease;

  &.is-active {
    opacity: 1;
    background: #e75656;
    transform: translate(0.5rem, -0.05rem) scale(1);
  }
}

.tag-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem;
  margin: 0.8rem 0 0.4rem;
}

.tag-filters span {
  font-size: 1.2rem;
}

.tag-filter {
  display: inline-block;
  border-radius: 100px;
  border: var(--border--light);
  padding: 0.4rem 0.8rem 0.5rem;
  font-weight: 500;
  font-size: 1.2rem;
  text-shadow: var(--shadow--text);
  color: var(--color--primary);
  background: var(--bg);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg--light);
  }

  &.is-active {
    border: 0.5px solid rgb(255, 255, 255, 0.5);
    background: var(--bg--vlight);
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
      background: var(--bg--dark);
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
    border-bottom: var(--border--light);
  }

  th {
    font-weight: 500;
    color: var(--color--primary);
    opacity: 0.76;
  }

  td {
    vertical-align: top;
    opacity: 0.76;
  }
}

table tr:last-of-type td {
  border-bottom: none;
}

.title-td {
  border-radius: var(--border-radius--md) 0 0 var(--border-radius--md);
  font-weight: 500;
  opacity: 1;
}

.title-td a {
  text-shadow: var(--shadow--text);
}

.col-tags {
  display: none;
  @include breakpoint(lg) {
    display: table-cell;
  }
}

.tags {
  border-radius: 0 var(--border-radius--md) var(--border-radius--md) 0;
  opacity: 1;
}

.icon-file {
  display: inline;
  border-radius: var(--border-radius--xs);
  margin-right: 1.2rem;
  margin: 0 1.2rem 0 0.4rem;
  border: 1.5px solid #fff;
  width: 3rem;
  height: 2.4rem;
  object-fit: cover;
  object-position: top;
  box-shadow: var(--shadow--sm);
}

.tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  margin: 0.2rem;
  border-radius: var(--border-radius--sm);
  background: var(--bg--light);
  font-size: 1.2rem;
  opacity: 0.76;

  &:first-child {
    margin-left: 0;
  }
}

.no-results {
  padding: 3.2rem 0 1.5rem;
  text-align: center;
  color: var(--color-primary);
  opacity: 0.76;
  font-size: 1.3rem;
}

.op-7 {
  opacity: 0.76;
}
</style>

<script setup>
const { data: posts } = await useAsyncData("posts", () =>
  queryContent().find()
);

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

const selectedTags = ref([]);

// Get all unique tags
const allTags = computed(() => {
  const tags = new Set();
  posts.value
    .filter((post) => post._path !== "/")
    .forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag) => tags.add(tag));
      }
    });
  return Array.from(tags).sort();
});

// Toggle tag selection
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
};

// Filter posts by selected tags (AND logic)
const filteredPosts = computed(() => {
  const filtered = posts.value.filter((post) => post._path !== "/");

  if (selectedTags.value.length === 0) {
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return filtered
    .filter(
      (post) =>
        // Check if post has tags and includes ALL selected tags
        post.tags && selectedTags.value.every((tag) => post.tags.includes(tag))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});
</script>
