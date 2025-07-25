<template>
  <div class="furniture-detail">
    <div v-if="pending" class="loading">Loading furniture details...</div>

    <div v-else-if="error" class="error">
      <p>{{ error.statusMessage || "Furniture piece not found" }}</p>
      <NuxtLink to="/" class="back-link">← Back to Collection</NuxtLink>
    </div>

    <article v-else class="furniture-article">
      <nav class="breadcrumb">
        <NuxtLink to="/">Collection</NuxtLink>
        <span>/</span>
        <span>{{ data.title }}</span>
      </nav>

      <div class="furniture-content">
        <div class="images-section">
          <div class="main-image">
            <img
              v-if="data.images?.[0]"
              :src="data.images[0]"
              :alt="data.title"
            />
            <div v-else class="no-image">No Image Available</div>
          </div>

          <div v-if="data.images?.length > 1" class="image-thumbnails">
            <button
              v-for="(image, index) in data.images"
              :key="index"
              @click="selectedImageIndex = index"
              :class="{ active: selectedImageIndex === index }"
              class="thumbnail"
            >
              <img :src="image" :alt="`${data.title} - Image ${index + 1}`" />
            </button>
          </div>
        </div>

        <div class="details-section">
          <header>
            <h1>{{ data.title }}</h1>
            <div class="meta-info">
              <span class="category">{{ data.category }}</span>
              <time :datetime="data.dateCreated">
                {{ formatDate(data.dateCreated) }}
              </time>
            </div>
          </header>

          <div class="description">
            <p>{{ data.description }}</p>
          </div>

          <div v-if="data.materials?.length" class="materials">
            <h3>Materials</h3>
            <div class="material-list">
              <span
                v-for="material in data.materials"
                :key="material"
                class="material-tag"
              >
                {{ material }}
              </span>
            </div>
          </div>

          <div class="actions">
            <NuxtLink to="/" class="back-button">
              ← Back to Collection
            </NuxtLink>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;

// Fetch individual furniture piece with caching
const { data, pending, error } = await useFetch(`/api/furniture/${slug}`, {
  key: `furniture-${slug}`,
  server: true,
  default: () => null,
});

// State for image gallery
const selectedImageIndex = ref(0);

// Watch for changes in images to reset selected index
watch(
  () => data?.images,
  () => {
    selectedImageIndex.value = 0;
  },
  { immediate: true }
);

// Update main image when thumbnail is selected
const selectedImage = computed(() => {
  return data?.images?.[selectedImageIndex.value] || data?.images?.[0];
});

// Date formatting
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Set page meta
useHead({
  title: () =>
    data ? `${data.title} - proportional.design` : "Furniture Detail",
  meta: [
    {
      name: "description",
      content: () => data?.description || "Handcrafted furniture piece",
    },
  ],
});
</script>

<style lang="scss" scoped>
.furniture-detail {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;

  .back-link {
    display: inline-block;
    margin-top: 1rem;
    color: #3498db;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.breadcrumb {
  margin-bottom: 2rem;
  font-size: 0.9rem;

  a {
    color: #3498db;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  span {
    margin: 0 0.5rem;
    color: #999;
  }
}

.furniture-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @include breakpoint(md) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.images-section {
  .main-image {
    background: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1rem;

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
      font-size: 1.2rem;
    }
  }

  .image-thumbnails {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;

    .thumbnail {
      flex-shrink: 0;
      width: 80px;
      height: 60px;
      border: 2px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      background: #f5f5f5;
      transition: border-color 0.2s ease;

      &.active {
        border-color: #3498db;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

.details-section {
  header {
    margin-bottom: 2rem;

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .meta-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;

      .category {
        background: #f0f0f0;
        padding: 0.5rem 1rem;
        border-radius: 1.5rem;
        font-weight: 500;
      }

      time {
        color: #666;
        font-size: 0.9rem;
      }
    }
  }

  .description {
    margin-bottom: 2rem;

    p {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #555;
    }
  }

  .materials {
    margin-bottom: 2rem;

    h3 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .material-list {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;

      .material-tag {
        background: #e3f2fd;
        color: #1976d2;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        font-weight: 500;
      }
    }
  }

  .actions {
    .back-button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      text-decoration: none;
      color: #495057;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        background: #e9ecef;
        border-color: #adb5bd;
      }
    }
  }
}
</style>
