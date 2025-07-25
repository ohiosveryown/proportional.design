<template>
  <main>
    <div v-if="pending" aria-live="polite">Loading furniture collection...</div>

    <div v-else-if="error" role="alert">
      <p>Error loading furniture: {{ error.message }}</p>
    </div>

    <ul class="list" v-else>
      <li class="entry" v-for="item in data" :key="item.id">
        <NuxtLink :to="`/furniture/${item.slug}`" :prefetch="true">
          <header>
            <h2 class="title">{{ item.title }}</h2>
          </header>

          <figure>
            <img
              v-if="item.images?.[0]"
              :src="item.images[0]"
              :alt="item.title"
              loading="lazy"
            />
            <figcaption v-else>No Image</figcaption>
          </figure>

          <footer>
            <span>{{ item.category }}</span>
            <ul class="tags">
              <li v-for="material in item.materials" :key="material">
                {{ material }}
              </li>
            </ul>
          </footer>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>

<style lang="scss" scoped>
ul.list {
  display: flex;
  gap: 1.2rem;
  margin-top: 4rem;
}

li.entry {
  min-width: 300px;
  max-width: 300px;
}

li.entry .title {
  font-size: 2rem;
}

li.entry figure {
  width: 100%;
}

li.entry figure img {
  width: 100%;
  height: 100%;
  min-height: 300px;
  max-height: 300px;
  object-fit: cover;
}

ul.tags {
  display: flex;
  gap: 0.5rem;
}

ul.tags li {
  font-weight: 600;
  font-size: 1.2rem;
  letter-spacing: -0.75px;
  text-transform: uppercase;
  background-color: #f0f0f0;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
}
</style>

<script setup>
// Fetch furniture data from our API with caching
const { data, pending, error } = await useFetch("/api/furniture", {
  key: "furniture-list",
  server: true,
  default: () => [],
});

// Set page meta
useHead({
  title: "Furniture Collection - proportional.design",
  meta: [
    {
      name: "description",
      content:
        "Handcrafted furniture pieces built with care and attention to detail.",
    },
  ],
});
</script>

<style lang="scss" scoped></style>
