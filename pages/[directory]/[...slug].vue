<template>
  <div class="app">
    <App-Aside class="aside" />
    <main class="main">
      <ClientOnly>
        <ContentDoc :path="contentPath">
          <template #default="{ doc }">
            <header>
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
                </NuxtLink>
              </div>
            </header>

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
                <details open>
                  <summary>project</summary>
                  <span class="project">{{ doc.project }}</span>
                </details>

                <details open>
                  <summary>date</summary>
                  <span class="date">{{ doc.date }}</span>
                </details>

                <details open>
                  <summary>tags</summary>
                  <span class="tags">{{
                    doc.tags ? doc.tags.join(", ") : "No tags"
                  }}</span>
                </details>
              </div>

              <details class="comments" open>
                <summary>comments</summary>
                <article :class="`${route.params.directory}-content`">
                  <ContentRenderer :value="doc" />
                </article>
              </details>
            </section>
          </template>

          <!-- misc templates -->
          <template #not-found>
            <h1>Content not found</h1>
          </template>
          <template #loading>
            <p>Loading...</p>
          </template>
          <template #error="{ error }">
            <h1>Error: {{ error.message }}</h1>
          </template>
        </ContentDoc>
      </ClientOnly>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

.aside {
  display: none;
  @include breakpoint(md) {
    display: initial;
  }
}

header {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: sticky;
  z-index: var(--z1);
  top: 0;
  margin-bottom: 0.8rem;
}

header:after {
  content: "";
  position: absolute;
  z-index: var(--z0);
  top: -1.2rem;
  left: -1.2rem;
  border-bottom: var(--border);
  width: calc(100% + 2.4rem);
  height: calc(100% + 2.4rem);
  background: var(--bg--dark);
  backdrop-filter: blur(56px);
}

.thumbnail {
  border-radius: var(--border-radius--xs);
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
}

.meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

h1,
h2 {
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.32);
}

h1 {
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1;
}

h2,
h3,
h4 {
  opacity: 0.76;
  font-size: 1.2rem;
  text-transform: capitalize;
}

h4 {
  text-transform: uppercase;
}

a.close {
  border-left: var(--border);
  margin-left: 1rem;
  padding: 0 0.5rem 0 1rem;
  transform: translateY(0.1rem);
  cursor: default;
  // @include breakpoint(md) {
  //   display: none;
  // }
}

figure {
  display: grid;
  place-items: center;
  margin-top: 2.4rem;
  border-radius: var(--border-radius--md);
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
    border-radius: var(--border-radius--sm);
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
  font-weight: 500;
  text-shadow: var(--shadow--text);
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
  text-shadow: var(--shadow--text);
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
</style>

<script setup>
const route = useRoute();

const contentPath = computed(() => {
  const directory = route.params.directory;
  const slug = route.params.slug;
  return `/${directory}/${slug ? slug.join("/") : ""}`;
});
</script>
