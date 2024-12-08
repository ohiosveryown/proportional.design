<template>
  <div class="app">
    <Navigation />

    <main class="debug">
      <ClientOnly>
        <ContentDoc :path="path">
          <template #default="{ doc }">
            <article>
              <ContentRenderer :value="doc" />
            </article>
          </template>
          <template #not-found>
            <h1>Hellloooooo</h1>
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
.app {
  display: flex;
  gap: 2rem;
}

.debug {
  flex: 1;
  padding: 2rem;
}
</style>

<script setup>
const route = useRoute();
const path = computed(() => {
  return route.params.slug ? `/${route.params.slug.join("/")}` : "/";
});
</script>
