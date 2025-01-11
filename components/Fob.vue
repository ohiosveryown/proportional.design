<template>
  <div class="fob">
    <NuxtLink v-if="prevPost" :to="prevPost._path" class="prev">
      <img
        v-if="prevPost.icon"
        :src="prevPost.icon"
        :alt="prevPost.title"
        class="thumbnail"
      />
      <span class="tooltip">
        <span class="label">Previous</span>
        <span class="key">J</span>
      </span>
    </NuxtLink>

    <span class="divider" :class="{ hidden: !prevPost || !nextPost }" />

    <NuxtLink v-if="nextPost" :to="nextPost._path" class="next">
      <img
        v-if="nextPost.icon"
        :src="nextPost.icon"
        :alt="nextPost.title"
        class="thumbnail"
      />
      <span class="tooltip">
        <span class="label">Next</span>
        <span class="key">K</span>
      </span>
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

.fob {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  position: sticky;
  z-index: var(--z2);
  bottom: 0rem;
  left: 50%;
  margin: 0 auto;
  border-radius: var(--radius-xl);
  border: var(--border-dark);
  width: max-content;
  padding: 0.5rem;
  background: color-mix(in srgb, var(--bg) 56%, transparent);
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-sm);
  transform: translateX(-50%);
  transform-origin: bottom;
  transition: transform 600ms cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

a:hover {
  transform: scale(1.2);
}

a {
  font-weight: 600;
  font-size: var(--font-xs);
  color: var(--text-light);
  text-shadow: none;
  transform-origin: center bottom;
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

a:not(:hover) {
  transition: 200ms ease transform;
}

.prev,
.next {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.divider {
  display: block;
  width: 0.5px;
  height: 1.6rem;
  background: color-mix(in srgb, var(--color-font) 64%, transparent);
}

.thumbnail {
  width: 2.8rem;
  height: 2.8rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-font);
  object-fit: cover;
  box-shadow: var(--shadow-sm);
}

.divider.hidden {
  display: none;
}

.tooltip {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 100%;
  left: 50%;
  padding: 0.24rem 0.32rem 0.32rem 0.64rem;
  background: var(--bg);
  border: var(--border-light);
  border-radius: var(--radius-md);
  font-size: var(--font-xs);
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-50%) translateY(5px) scale(0.8);
  transition: all 200ms ease;
  pointer-events: none;
  box-shadow: var(--shadow-sm);
}

a:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-3px) scale(0.8);
  transition: all 300ms ease 400ms;
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
}
</style>

<script setup lang="ts">
const { page } = useContent();
const route = useRoute();
const router = useRouter();

// Get the current sort method from the route query or default to "newest"
const currentSort = computed(() => (route.query.sort as string) || "newest");

// Get all posts and sort them according to the current sort method
const posts = await queryContent()
  .find()
  .then((posts) => {
    switch (currentSort.value) {
      case "newest":
        return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "oldest":
        return posts.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "az":
        return posts.sort((a, b) => a.title.localeCompare(b.title));
      case "za":
        return posts.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return posts;
    }
  });

const currentIndex = posts.findIndex((post) => post._path === page.value._path);
const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
const nextPost =
  currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

// keyboard navigation
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    // Only trigger if not typing in an input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    switch (e.key.toLowerCase()) {
      case "j":
      case "[":
        if (prevPost) {
          router.push(prevPost._path);
        }
        break;
      case "k":
      case "]":
        if (nextPost) {
          router.push(nextPost._path);
        }
        break;
      case "h":
        router.push("/");
        break;
    }
  };

  window.addEventListener("keydown", handleKeydown);

  // Clean up event listener when component unmounts
  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
});
</script>
