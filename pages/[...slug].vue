<template>
  <div class="app">
    <App-Aside class="aside" />
    <main class="main">
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
@use "/assets/style/grid.scss" as *;

// .app {
//   display: flex;
//   gap: var(--unit);
//   margin: 0 auto;
//   max-width: 180rem;
//   padding: var(--unit);
// }

main {
  display: none;
  @include breakpoint(md) {
    display: initial;
    // padding: 7.2rem 14rem;
  }
}
</style>

<script setup>
const route = useRoute();
const path = computed(() => {
  return route.params.slug ? `/${route.params.slug.join("/")}` : "/";
});
</script>
