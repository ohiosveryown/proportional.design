<template>
  <main>
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
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 7.2rem 14rem;
  overflow-x: hidden;
}
</style>

<script setup>
const route = useRoute();
const path = computed(() => {
  return route.params.slug ? `/${route.params.slug.join("/")}` : "/";
});
</script>
