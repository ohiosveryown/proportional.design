<template>
  <aside class="aside-filtering">
    <header>
      <div class="row">
        <span class="brand-text sans-regular">proportional</span>
        <img
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757515092/proportional.design-4.0/saint-01_2x_zqnadq.webp"
          alt=""
          class="saint-illustration"
          aria-hidden="true"
        />

        <span class="sans-regular">design</span>

        <div class="button-group">
          <button class="primary-btn contact-btn sans-medium">contact</button>
          <a
            class="social-link"
            href="https://www.instagram.com/proportional.design/"
            target="_blank"
          >
            <img
              src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733875450/proportional.design-3.0/avatar_w_3x_j45unb.webp"
              alt=""
            />
          </a>
        </div>
      </div>

      <p>
        Recent works and ongoing projects, featuring custom furniture and
        functional objects crafted with care from 2018 to present, plus select
        pieces from our earlier collections.
      </p>
    </header>

    <section class="status-section">
      <div class="filter-title">Stage:</div>
      <div class="filter-buttons">
        <button
          v-for="stage in stages"
          :key="stage.value"
          :class="['filter-btn', { active: selectedStage === stage.value }]"
          @click="$emit('stageFilter', stage.value)"
        >
          {{ stage.label }}
        </button>
      </div>
    </section>

    <section class="category-section">
      <div class="filter-title">Category:</div>
      <div class="filter-buttons">
        <button
          v-for="category in categories"
          :key="category.value"
          :class="['filter-btn', { active: isCategoryActive(category.value) }]"
          @click="handleCategoryClick(category.value, $event)"
        >
          <img
            v-if="category.image"
            :src="category.image"
            :alt="category.label"
            class="category-icon"
          />
          {{ category.label }}
        </button>
      </div>
    </section>
  </aside>
</template>

<style lang="scss" scoped>
aside {
  position: sticky;
  top: 0;
}

header {
  position: relative;
  padding: 3.2rem 0;
}

header::before,
header::after,
.status-section::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(70, 114, 94, 0) 0%,
    #46725e 50%,
    rgba(70, 114, 94, 0) 100%
  );
}

header::after,
.status-section::after {
  top: auto;
  bottom: 0;
}

.row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.2vw;
  text-transform: uppercase;
}

p {
  max-width: 47ch;
  color: #fff;
  font-size: 0.92vw;
  opacity: 0.5;
}

span {
  opacity: 0.8;
}

.saint-illustration {
  width: 1.6vw;
  height: auto;
}

.button-group {
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 0.64vw;
}

.contact-btn {
  padding: 0.6vw 0.8vw;
  font-size: 0.7vw;
  text-transform: uppercase;
  background: linear-gradient(
    180deg,
    rgba(149, 140, 116, 0.3) 0%,
    rgba(69, 112, 93, 0.3) 100%
  );
  backdrop-filter: blur(16px);
  box-shadow: 0 1.5px 0 0 rgba(255, 255, 255, 0.3) inset,
    0 4px 42px 0 rgba(0, 0, 0, 0.24);
  transition: transform 0.2s ease;
  will-change: transform;
}

.contact-btn:hover,
.social-link:hover {
  transform: scale(1.03);
}

.contact-btn:active,
.social-link:active {
  transform: scale(0.98);
}

.social-link {
  transition: transform 0.3s ease;
  will-change: transform;
}

.social-link img {
  border-radius: 1000px;
  width: 2.1vw;
  height: auto;
}

.status-section,
.category-section {
  position: relative;
  padding: 3.2rem 0 4rem;
}

.filter-title {
  margin-bottom: 1rem;
  color: var(--content-100);
  font-size: 1.1vw;
  text-transform: uppercase;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
}

.filter-btn {
  padding: 0.4vw 0.8vw;
  border-radius: 100px;
  background: linear-gradient(
    180deg,
    rgba(149, 140, 116, 0.3) 0%,
    rgba(69, 112, 93, 0.3) 100%
  );
  color: var(--content-000);
  font-size: 0.76vw;
  text-transform: uppercase;
  font-weight: 500;
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.3s ease;
  will-change: opacity;
}

.filter-btn:hover {
  opacity: 0.76;
}

.filter-btn.active {
  opacity: 1;
}

.category-icon {
  width: 1.2vw;
  height: auto;
  margin-right: 0.5rem;
  opacity: 0.8;
  filter: invert(1);
}
</style>

<script setup>
const props = defineProps({
  selectedStage: {
    type: String,
    default: "ALL",
  },
  selectedCategories: {
    type: Array,
    default: () => ["ALL"],
  },
  availableCategories: {
    type: Array,
    default: () => [],
  },
});

const stages = [
  { label: "ALL", value: "ALL" },
  { label: "FIN", value: "FIN" },
  { label: "WIP", value: "WIP" },
];

// Category image mapping
const categoryImages = {
  ALL: "",
  CABINET: "",
  WORKBENCH: "",
  CHAIR: "",
  DOOR: "",
  "NIGHT TABLE": "",
};

const categories = computed(() => [
  {
    label: "ALL",
    value: "ALL",
    image: categoryImages["ALL"],
  },
  ...props.availableCategories.map((cat) => ({
    label: cat.toUpperCase(),
    value: cat,
    image: categoryImages[cat.toUpperCase()],
  })),
]);

const isCategoryActive = (categoryValue) => {
  return props.selectedCategories.includes(categoryValue);
};

const handleCategoryClick = (categoryValue, event) => {
  const isCommandClick = event.metaKey || event.ctrlKey;

  if (categoryValue === "ALL") {
    // Always reset to ALL when clicking ALL
    emit("categoryFilter", ["ALL"]);
    return;
  }

  let newSelection = [...props.selectedCategories];

  if (isCommandClick) {
    // Multi-select mode
    if (newSelection.includes("ALL")) {
      // If ALL is selected, replace with this category
      newSelection = [categoryValue];
    } else if (newSelection.includes(categoryValue)) {
      // Remove if already selected
      newSelection = newSelection.filter((cat) => cat !== categoryValue);
      // If nothing left, select ALL
      if (newSelection.length === 0) {
        newSelection = ["ALL"];
      }
    } else {
      // Add to selection
      newSelection.push(categoryValue);
    }
  } else {
    // Single select mode
    newSelection = [categoryValue];
  }

  emit("categoryFilter", newSelection);
};

const emit = defineEmits(["stageFilter", "categoryFilter"]);
</script>
