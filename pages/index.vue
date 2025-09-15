<template>
  <div class="app">
    <section class="section-first">
      <Intro class="intro" />
      <Hero class="hero" />
    </section>
    <Marquee class="marquee" />
    <section class="portfolio">
      <ul class="entries-list">
        <Entry 
          v-for="(item, index) in fetchedData" 
          :key="item.id || item.slug" 
          :item="item" 
          :index="index"
          @like="handleLike"
        />
      </ul>
    </section>
  </div>
</template>

<style lang="scss" scoped>
// .app {
//   margin: 0 auto;
//   width: 98vw;
// }

/* remove */
.app {
  padding-bottom: 4rem;
}

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

.portfolio {
  margin-top: 4rem;
}

.entries-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4rem;
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
  refresh
} = await useFetch("/api/furniture", {
  key: "furniture-global",
  server: true,
  default: () => [],
});

// Handle like functionality
const handleLike = async (slug, id) => {
  try {
    await $fetch(`/api/furniture/${slug}/like`, {
      method: 'POST',
      body: { id }
    });
    
    // Refresh the fetched data to sync with server
    await refresh();
  } catch (error) {
    console.error('Failed to like item:', error);
    
    // On error, refresh to restore correct state
    await refresh();
  }
};
</script>
