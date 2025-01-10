<template>
  <div class="interior">
    <ContentDoc :path="contentPath">
      <template #default="{ doc }">
        <nav>
          <img class="thumbnail" :src="doc.icon" :alt="doc.title" />
          <div class="title">
            <h1>{{ doc.title }}</h1>
            <h2>{{ doc.date }}</h2>
          </div>
          <div class="meta">
            <h3>{{ doc.type }} –</h3>
            <h4>{{ doc.size }}</h4>

            <BaseTooltip position="left" content="ESC" :delay="500">
              <NuxtLink to="/" class="close">
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
                    opacity=".56"
                  >
                    <path d="m4.637 4 8 8M12.637 4l-8 8" />
                  </g>
                </svg>
              </NuxtLink>
            </BaseTooltip>
          </div>
        </nav>

        <main>
          <figure>
            <img
              v-if="doc.type === 'photo'"
              class="hero"
              :src="doc.icon"
              :alt="doc.title"
            />
            <video
              v-else-if="doc.type === 'mp4'"
              class="hero"
              :src="doc.icon"
              controls
              muted
              loop
            ></video>
          </figure>
        </main>
      </template>
    </ContentDoc>
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

nav {
  gap: 0.8rem;
  max-height: 5.4rem;
}

.thumbnail {
  border-radius: var(--radius-xs);
  border: 1.5px solid #fff;
  box-shadow: var(--shadow--sm);
  width: 3rem;
  height: 2.4rem;
  object-fit: cover;
  object-position: top;
}

.title {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.1rem;
}

.meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

h1 {
  font-size: var(--font-sm);
  font-weight: 500;
  line-height: 1;
}

h2,
h3,
h4 {
  opacity: 0.76;
  font-size: var(--font-xs);
  text-transform: capitalize;
}

h2 {
  opacity: 0.64;
}

h4 {
  text-transform: uppercase;
}

.close {
  margin-left: 1rem;
  border-left: var(--border);
  padding: 0 0.5rem 0 1rem;
  transform: translateY(0.07rem);
  cursor: default;
}

main {
  padding: var(--unit);
}

figure {
  display: grid;
  place-items: center;
  border-radius: var(--radius-md);
  border: var(--border);
  width: 100%;
  padding: 2.2rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  @include breakpoint(md) {
    padding: 4.4rem 4rem;
  }
  @include breakpoint(lg) {
    padding: 5.6rem;
  }
  @include breakpoint(xl) {
    padding: 7.2rem;
  }

  img {
    pointer-events: none;
  }
}

img.hero,
video.hero {
  border-radius: 3px;
  border: var(--border);
  box-shadow: var(--shadow);
  object-fit: contain;
  @include breakpoint(md) {
    border-radius: var(--radius-sm);
  }
  // @include breakpoint(lg) {
  //   max-height: 120rem;
  // }
}
</style>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const contentPath = computed(() => {
  const directory = route.params.directory;
  const slug = Array.isArray(route.params.slug)
    ? route.params.slug.join("/")
    : route.params.slug;
  return `/${directory}/${slug}`;
});

// Add keyboard event listener
onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    router.push("/");
  }
}
</script>
