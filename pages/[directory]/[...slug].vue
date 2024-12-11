<template>
  <!-- <Navigation /> -->
  <main class="debug">
    <!-- <h1>This is slug content...</h1> -->
    <ClientOnly>
      <ContentDoc :path="contentPath">
        <template #default="{ doc }">
          <article :class="`${route.params.directory}-content`">
            <h1>{{ doc.title }}</h1>
            <img :src="doc.icon" :alt="doc.title" />
            <ContentRenderer :value="doc" />
          </article>
        </template>
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
main {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.2rem;
  overflow-x: hidden;
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
