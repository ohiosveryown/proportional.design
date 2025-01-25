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
              <span class="tooltip">
                <span class="label">Close</span>
                <span class="key">Esc</span>
              </span>
            </NuxtLink>
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

          <section>
            <div class="details">
              <div class="detail-item">
                <h5 class="detail-header">project</h5>
                <p class="detail-content">{{ doc.project }}</p>
              </div>

              <div class="detail-item">
                <h5 class="detail-header">date</h5>
                <p class="detail-content date">{{ doc.date }}</p>
              </div>

              <div class="detail-item">
                <h5 class="detail-header">tags</h5>
                <ul class="tags detail-content">
                  <li v-for="tag in doc.tags" :key="tag" class="tag">
                    {{ tag }}
                  </li>
                </ul>
              </div>

              <div class="detail-item">
                <h5 class="detail-header">Likes</h5>
                <button
                  @click="handleLike"
                  :disabled="loading"
                  class="like-button detail-content"
                >
                  <svg
                    class="heart"
                    :class="{ animate: isAnimating }"
                    width="16"
                    height="16"
                    fill="none"
                  >
                    <path
                      fill="url(#a)"
                      fill-rule="evenodd"
                      d="M2.07 3.32a3.652 3.652 0 0 1 5.165 0L8 4.085l.765-.765a3.652 3.652 0 1 1 5.165 5.165l-5.223 5.223a1 1 0 0 1-1.414 0L2.07 8.485a3.652 3.652 0 0 1 0-5.165Z"
                      clip-rule="evenodd"
                    />
                    <defs>
                      <linearGradient
                        id="a"
                        x1="8"
                        x2="8"
                        y1="2.25"
                        y2="14.415"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FF7A7A" />
                        <stop offset=".145" stop-color="#FF4646" />
                        <stop offset="1" stop-color="#C73A3A" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div class="divider" />
                  <span class="count">{{ count }}</span>
                  <span class="tooltip-like">
                    <span class="label">Like</span>
                    <span class="key">L</span>
                  </span>
                </button>
              </div>
            </div>

            <div class="comments detail-item">
              <h5 class="detail-header">comments</h5>
              <article :class="`${route.params.directory}-content`">
                <ContentRenderer :value="doc" />
              </article>
            </div>
          </section>

          <Fob :prev-post="'/posts/previous'" :next-post="'/posts/next'" />
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
  position: relative;
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
  position: relative;
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

section {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 2rem 0.8rem 1rem;
  @include breakpoint(mdl) {
    flex-direction: row;
    gap: 0;
  }
}

section .details {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  @include breakpoint(mdl) {
    margin-right: grid-width(1);
    width: grid-width(4);
  }
}

section .comments {
  width: 100%;
  @include breakpoint(mdl) {
    width: grid-width(6.5);
  }
}

details span,
details article {
  // font-weight: 500;
  text-shadow: var(--shadow-text);
}

details span {
  text-transform: capitalize;
}

:deep(p) {
  padding-bottom: 0.6rem;
  line-height: 1.55;
}

:deep(p:last-of-type) {
  padding-bottom: 0;
}

summary {
  opacity: 0.72;
  font-weight: 600;
  font-size: 1.4rem;
  text-transform: capitalize;
  text-shadow: var(--shadow-text);
  cursor: context-menu;
}

:deep(sup) {
  opacity: 0.8;
}

:deep(#footnote-label) {
  display: none;
}

:deep(.footnotes ol) {
  border-top: var(--border);
  padding: 1.2rem 0 0 0;
  font-size: 1.3rem;
  opacity: 0.8;
}

:deep(.footnotes a:hover) {
  text-decoration: underline;
}

.tags {
  display: flex;
  gap: 0.2rem;
  margin-top: 0.2rem;
}

.tag {
  margin: 0.4rem 0.3rem 0 0;
  width: max-content;
  font-weight: 500;
  font-size: 1.2rem;
  text-shadow: none;
  border-radius: var(--radius-sm);
  border: var(--border-light);
  padding: 0.2rem 0.5rem;
  background: var(--bg-vdark);
  background: rgb(255, 255, 255, 0.08);
  color: var(--text-light);
}

.tooltip {
  display: flex;
  align-items: center;
  position: absolute;
  top: 50%;
  right: 0%;
  padding: 0.24rem 0.32rem 0.32rem 0.64rem;
  background: var(--bg);
  border: var(--border-light);
  border-radius: var(--radius-md);
  font-size: var(--font-xs);
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-20%) translateY(-50%) scale(0.8);
  transform-origin: right center;
  transition: all 200ms ease;
  pointer-events: none;
  box-shadow: var(--shadow-sm);
  gap: 0.3rem;

  @media (pointer: coarse) {
    display: none;
  }
}

.close:hover .tooltip {
  opacity: 1;
  transform: translateX(-30%) translateY(-50%) scale(0.9);
  transition: all 300ms ease 400ms;
}

.label {
  margin-right: 0.6rem;
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

.like-container {
  display: flex;
  justify-content: center;
  // margin: 2rem 0;
}

.like-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.28rem;
  border: var(--border);
  border-radius: var(--radius-md);
  padding: 0.3rem 0.72rem 0.4rem 0.5rem;
  background: var(--bg-dark);
  box-shadow: var(--shadow-sm);
  transition: all 200ms ease;

  &:hover {
    background: var(--bg-vdark);
  }
}

.heart {
  margin-top: 0.05rem;
  transform-origin: center;

  &.animate {
    animation: pop 400ms ease;
  }
}

.divider {
  margin: 0 0.3rem 0rem 0.2rem;
  width: 0.1rem;
  height: 1.2rem;
  background: var(--color-font);
  opacity: 0.4;
}

@keyframes pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.count {
  font-size: var(--font-sm);
  font-weight: 600;
  text-align: right;
  transform: translateY(-0.05rem);
}

.detail-item {
  margin-bottom: 0.8rem;
}

.detail-header {
  opacity: 0.72;
  font-weight: 600;
  font-size: 1.4rem;
  text-transform: capitalize;
  text-shadow: var(--shadow-text);
  margin-bottom: 0.2rem;
}

.detail-content {
  font-weight: 500;
  text-shadow: var(--shadow-text);
  text-transform: capitalize;
}

.detail-content.date {
  font-weight: 400;
}

.detail-content article {
  text-transform: none;
}

.tooltip-like {
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

  @media (pointer: coarse) {
    display: none;
  }
}

.like-button:hover .tooltip-like {
  opacity: 1;
  transform: translateX(-50%) translateY(1px) scale(0.9);
  transition: all 200ms ease 400ms;
}
</style>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const { count, loading, getLikes, incrementLike } = useLikes();

const contentPath = computed(() => {
  const directory = route.params.directory;
  const slug = Array.isArray(route.params.slug)
    ? route.params.slug.join("/")
    : route.params.slug;
  return `/${directory}/${slug}`;
});

// Get the current post's likes when mounted
onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  getLikes(contentPath.value);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

function handleKeydown(event: KeyboardEvent) {
  // If the event target is an input or textarea, don't handle shortcuts
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement
  ) {
    return;
  }

  if (event.key === "Escape") {
    router.push("/");
  } else if (event.key === "l" || event.key === "L") {
    handleLike();
  }
}

// Add ref for animation state
const isAnimating = ref(false);

// Update like handler
const handleLike = async () => {
  if (!loading.value) {
    isAnimating.value = true;
    await incrementLike(contentPath.value);
    // Reset animation after it completes
    setTimeout(() => {
      isAnimating.value = false;
    }, 400);
  }
};
</script>
