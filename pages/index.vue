<template>
  <div class="app">
    <div class="container-intro">
      <Intro />
      <Hero />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app {
  margin: 0 auto;
  width: 98vw;
}

.container-intro {
  display: flex;
  flex-direction: column-reverse;
  gap: 2rem;
  * {
    flex: 1;
  }
  @include breakpoint(mdl) {
    align-items: flex-start;
    flex-direction: row;
  }
}
</style>

<script setup>
// Set page meta
useHead({
  title: "proportional.design",
  meta: [
    {
      name: "description",
      content: "Handcrafted furniture pieces built with love in Atlanta, GA.",
    },
  ],
});

// Fetch furniture data from our API with caching
const {
  data: fetchedData,
  pending,
  error,
} = await useFetch("/api/furniture", {
  key: "furniture-global",
  server: true,
  default: () => [],
});
</script>
