<template>
  <div class="app">
    <section class="section-first">
      <Intro class="intro" />
      <Hero class="hero" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
// .app {
//   margin: 0 auto;
//   width: 98vw;
// }

.section-first {
  display: flex;
  flex-direction: column-reverse;
  gap: 2rem;
  .intro {
    flex: 1;
  }
  .hero {
    flex: 0.88;
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
