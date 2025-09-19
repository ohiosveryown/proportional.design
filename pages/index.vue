<template>
  <div class="app">
    <section class="section-first">
      <Intro class="intro" />
      <Hero class="hero" />
    </section>
    <Marquee class="marquee" />
    <section class="section-portfolio">
      <Filter
        class="aside-filtering"
        :selectedStage="selectedStage"
        :selectedCategories="selectedCategories"
        :availableCategories="availableCategories"
        @stageFilter="handleStageFilter"
        @categoryFilter="handleCategoryFilter"
      />
      <ul class="entries-list">
        <template
          v-for="(item, index) in filteredData"
          :key="item.id || item.slug"
        >
          <Entry :item="item" :index="index" @like="handleLike" class="entry" />
          <ContactCard v-if="index === 6" />
        </template>
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

.section-portfolio {
  margin: 15rem auto 0;
  width: 100%;
  padding: 0 2.4rem;
  @include breakpoint(mdl) {
    display: flex;
    align-items: flex-start;
    gap: grid-width(0.5);
  }
}

.aside-filtering {
  @include breakpoint(mdl) {
    width: grid-width(4);
  }
}

.entries-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style: none;

  @include breakpoint(lg) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include breakpoint(xl) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.entry {
  width: 100%;
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
  refresh,
} = await useFetch("/api/furniture", {
  key: "furniture-global",
  server: true,
  default: () => [],
});

// Filtering
const selectedStage = ref("ALL");
const selectedCategories = ref(["ALL"]);

const availableCategories = computed(() => {
  const categories = [
    ...new Set(fetchedData.value.flatMap((item) => item.categories || [])),
  ];
  return categories.filter(Boolean);
});

const filteredData = computed(() => {
  let filtered = fetchedData.value;

  if (selectedStage.value !== "ALL") {
    filtered = filtered.filter((item) => item.stage === selectedStage.value);
  }

  if (!selectedCategories.value.includes("ALL")) {
    filtered = filtered.filter((item) =>
      item.categories?.some((category) =>
        selectedCategories.value.includes(category)
      )
    );
  }

  return filtered;
});

const handleStageFilter = (stage) => {
  selectedStage.value = stage;
};

const handleCategoryFilter = (categories) => {
  selectedCategories.value = categories;
};

// Handle like functionality
const handleLike = async (slug, id) => {
  try {
    await $fetch(`/api/furniture/${slug}/like`, {
      method: "POST",
      body: { id },
    });

    // Refresh the fetched data to sync with server
    await refresh();
  } catch (error) {
    console.error("Failed to like item:", error);

    // On error, refresh to restore correct state
    await refresh();
  }
};
</script>
