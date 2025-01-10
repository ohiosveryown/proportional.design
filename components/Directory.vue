<template>
  <div>
    <details v-for="(posts, directory) in sortedPosts" :key="directory">
      <summary>
        <span class="folder" />
        <h3>{{ directory }}</h3>
        <svg
          class="chevron"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
        >
          <path
            stroke="#fff"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.25"
            d="m7.75 5.5 4.5 4.5-4.5 4.5"
          />
        </svg>
      </summary>

      <section v-if="posts.finished.length" class="media-finished">
        <header>
          <svg width="20" height="20" fill="none">
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
          <li v-for="post in posts.finished" :key="post._path">
            <NuxtLink :to="post._path">
              <img class="thumbnail" :src="post.icon" :alt="post.title" />
              <span class="title">{{ post.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section v-if="posts.wip.length" class="media-in-progress">
        <header>
          <svg width="20" height="20" fill="none">
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
          <li v-for="post in posts.wip" :key="post._path">
            <NuxtLink :to="post._path">
              <img class="thumbnail" :src="post.icon" :alt="post.title" />
              <span class="title">{{ post.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </details>
  </div>
</template>

<style lang="scss" scoped>
summary::-webkit-details-marker {
  display: none;
}

summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 calc(var(--unit) * 0.5);
  border-radius: var(--radius-md);
  padding: 0.5rem 1.1rem 0.5rem 0.5rem;
  overflow: hidden;
  transition: background var(--ease);
}

summary:hover,
a:hover {
  background: var(--bg-dark);
}

details .folder {
  width: 2.8rem;
  height: 2.8rem;
  background: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1736467584/proportional.design-3.0/icons/folders_yrn157.webp")
    no-repeat -28px 0px;
  background-size: cover;
  transform: scale(1.24);
}

details[open] .folder {
  width: 2.8rem;
  height: 2.8rem;
  background: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1736467584/proportional.design-3.0/icons/folders_yrn157.webp")
    no-repeat 0px 0px;
  background-size: cover;
  transform: scale(1.24);
}

details .chevron {
  opacity: 0.88;
}

details[open] .chevron {
  transform: rotate(90deg);
}

summary h3,
span.title {
  flex: 1;
  font-size: var(--font);
  font-weight: 500;
  pointer-events: none;
}

summary svg {
  margin-top: 0.16rem;
}

section header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0 0.7rem 5rem;
  opacity: 0.76;
}

section h4 {
  font-size: var(--font-xs);
  text-transform: uppercase;
  font-weight: 600;
  pointer-events: none;
}

a {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 0.8rem;
  margin: 0 calc(var(--unit) * 0.5);
  border-radius: var(--radius-md);
  padding: 0.7rem 1.1rem 0.7rem 4rem;
  font-size: var(--font-sm);
  overflow: hidden;
  transition: background var(--ease);
}

.thumbnail {
  width: 3rem;
  height: 2.4rem;
  border-radius: var(--radius-xs);
  border: 1.5px solid var(--color-font);
  object-fit: cover;
  box-shadow: var(--shadow-sm);
}
</style>

<script setup lang="ts">
interface Post {
  _path: string;
  title: string;
  status: "finished" | "wip";
  icon?: string;
  date?: number;
  tags?: string[];
}

const { data: posts } = useAsyncData<Post[]>("posts", async () => {
  const posts = await queryContent<Post>().find();

  return posts.map((post) => ({
    ...post,
    date: post.date ? Date.parse(post.date) : 0,
  }));
});

// Group posts by directory and status
const groupedPosts = computed(() => {
  const groups: Record<string, { finished: Post[]; wip: Post[] }> = {};

  posts.value?.forEach((post: Post) => {
    const directory = post._path?.split("/")[1];
    if (!directory) return;
    if (!groups[directory]) {
      groups[directory] = { finished: [], wip: [] };
    }
    groups[directory][post.status === "finished" ? "finished" : "wip"].push(
      post
    );
  });

  return groups;
});

// Add sort method prop
const props = defineProps<{
  sortMethod: string;
  selectedFilters: string[];
}>();

// Modify the computed property to include filtering
const sortedPosts = computed(() => {
  const groups = groupedPosts.value;
  const entries = Object.entries(groups);

  // Filter posts first
  const filteredEntries = entries
    .map(([dir, group]) => {
      const filtered = {
        finished: group.finished.filter(
          (post) =>
            props.selectedFilters.length === 0 ||
            post.tags?.some((tag) => props.selectedFilters.includes(tag))
        ),
        wip: group.wip.filter(
          (post) =>
            props.selectedFilters.length === 0 ||
            post.tags?.some((tag) => props.selectedFilters.includes(tag))
        ),
      };
      return [dir, filtered];
    })
    .filter(([_, group]) => group.finished.length > 0 || group.wip.length > 0);

  // Then sort the filtered entries
  const sorted = filteredEntries.sort(([dirA], [dirB]) => {
    switch (props.sortMethod) {
      case "za":
        return dirB.localeCompare(dirA);
      case "newest":
        const postsA = groups[dirA].finished.concat(groups[dirA].wip);
        const postsB = groups[dirB].finished.concat(groups[dirB].wip);
        const newestA = Math.max(...postsA.map((p) => p.date || 0));
        const newestB = Math.max(...postsB.map((p) => p.date || 0));
        return newestB - newestA;
      case "oldest":
        const oldestA = Math.min(
          ...groups[dirA].finished
            .concat(groups[dirA].wip)
            .map((p) => p.date || 0)
        );
        const oldestB = Math.min(
          ...groups[dirB].finished
            .concat(groups[dirB].wip)
            .map((p) => p.date || 0)
        );
        return oldestA - oldestB;
      case "az":
      default:
        return dirA.localeCompare(dirB);
    }
  });

  // Convert back to object
  return Object.fromEntries(sorted);
});
</script>
