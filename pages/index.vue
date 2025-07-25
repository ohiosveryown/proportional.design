<template>
  <div class="furniture-gallery">
    <header>
      <h1>Furniture Collection</h1>
      <p>Handcrafted pieces built with care and attention to detail.</p>
    </header>

    <div v-if="pending" class="loading">Loading furniture collection...</div>

    <div v-else-if="error" class="error">
      <p>Error loading furniture: {{ error.message }}</p>
    </div>

    <div v-else class="furniture-grid">
      <article v-for="item in data" :key="item.id" class="furniture-card">
        <NuxtLink :to="`/furniture/${item.slug}`" :prefetch="true">
          <div class="image-container">
            <img
              v-if="item.images?.[0]"
              :src="item.images[0]"
              :alt="item.title"
              loading="lazy"
            />
            <div v-else class="no-image">No Image</div>
          </div>

          <div class="content">
            <h2>{{ item.title }}</h2>
            <!-- <p class="description">{{ item.description }}</p> -->

            <div class="meta">
              <span class="category">{{ item.category }}</span>
              <div class="materials">
                <span
                  v-for="material in item.materials"
                  :key="material"
                  class="material-tag"
                >
                  {{ material }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

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

<style lang="scss" scoped>
.furniture-gallery {
  padding: 0 2rem;
  // max-width: 1200px;
  // margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    opacity: 0.8;
  }
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.furniture-grid {
  display: flex;
  gap: 2rem;
}

.furniture-card {
  border: 1px solid #eee;
  min-width: 300px;
  max-width: 300px;
  overflow: hidden;

  a {
    display: block;
    text-decoration: none;
    color: inherit;
  }
}

.image-container {
  aspect-ratio: 4/3;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;
    font-size: 1.1rem;
  }
}

.content {
  padding: 1.5rem;

  h2 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .description {
    color: #666;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  .category {
    background: #f0f0f0;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .materials {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
  }

  .material-tag {
    background: #e3f2fd;
    color: #1976d2;
    padding: 0.2rem 0.5rem;
    border-radius: 0.75rem;
    font-size: 0.8rem;
    font-weight: 500;
  }
}
</style>
