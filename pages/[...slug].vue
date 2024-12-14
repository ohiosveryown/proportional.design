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

main {
  display: none;
  @include breakpoint(md) {
    display: initial;
  }
}

main {
  padding: 2.4rem 4rem;
}
</style>

<script setup>
const route = useRoute();
const path = computed(() => {
  return route.params.slug ? `/${route.params.slug.join("/")}` : "/";
});
</script>
