<template>
  <main>
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
            </div>
          </header>

          <img class="hero" :src="doc.icon" :alt="doc.title" />

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
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

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
  background: rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(3.2rem);
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

.hero {
  margin-top: 2.4rem;
  border-radius: var(--border-radius--sm);
  border: var(--border);
  // box-shadow: var(--shadow);
  object-fit: contain;
  width: 100%;
  max-height: 77rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.32);
  pointer-events: none;
}

section {
  display: flex;
  padding: 2rem 0 1rem;
}

section .details {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  @include breakpoint(md) {
    margin-right: grid-width(1);
    width: grid-width(4);
  }
}

section .comments {
  @include breakpoint(md) {
    width: grid-width(7);
  }
}

details span,
details article {
  font-weight: 500;
  text-shadow: var(--shadow--text);
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
</style>

<script setup>
const route = useRoute();

const contentPath = computed(() => {
  const directory = route.params.directory;
  const slug = route.params.slug;
  return `/${directory}/${slug ? slug.join("/") : ""}`;
});
</script>
