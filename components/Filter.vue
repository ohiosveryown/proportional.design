<template>
  <aside class="aside-filtering">
    <header>
      <div class="row">
        <span class="sans-medium">proportional</span>
        <img
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757515092/proportional.design-4.0/saint-01_2x_zqnadq.webp"
          alt=""
          class="saint-illustration"
          aria-hidden="true"
        />

        <span class="sans-medium">design</span>

        <div class="button-group">
          <button class="primary-btn contact-btn sans-medium">contact</button>
          <a
            class="social-link"
            href="https://www.instagram.com/proportional.design/"
            target="_blank"
          >
            <img
              src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733875450/proportional.design-3.0/avatar_w_3x_j45unb.webp"
              alt="instagram avatar"
            />
          </a>
        </div>
      </div>

      <p>
        Recent works and ongoing projects, featuring custom furniture and
        functional objects crafted with care from 2018 to present; plus select
        pieces from our earlier collections.
      </p>
    </header>

    <section class="status-section">
      <div class="filter-title">Stage:</div>
      <div class="filter-buttons">
        <button
          v-for="stage in stages"
          :key="stage.value"
          :class="[
            'filter-btn',
            'sans-medium',
            { active: selectedStage === stage.value },
          ]"
          @click="$emit('stageFilter', stage.value)"
        >
          {{ stage.label }}
        </button>
      </div>
    </section>

    <section class="category-section">
      <div class="filter-title">Category:</div>
      <div class="filter-buttons category-buttons">
        <button
          v-for="category in categories"
          :key="category.value"
          :class="[
            'filter-btn category-btn sans-medium',
            { active: isCategoryActive(category.value) },
          ]"
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
  top: -0.5rem;
}

header {
  position: relative;
  padding: 2.4rem 0;
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
  span {
    opacity: 0.68;
  }
}

p {
  margin-top: 0.4rem;
  max-width: 46ch;
  color: #fff;
  font-weight: 300;
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
  position: relative;
  transition: transform 0.3s ease;
  will-change: transform;
}

.social-link img {
  position: relative;
  z-index: var(--z2);
  border-radius: 1000px;
  border: 3px solid var(--base-000);
  width: 2vw;
  height: auto;
}

.social-link::after {
  content: "";
  position: absolute;
  z-index: var(--z1);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 1000px;
  background: linear-gradient(228deg, #c904ff 10%, #d8066b 50%, #ff941a 92%);
  transform: scale(1.08);
  transform-origin: center center;
  animation: infiniteRotate 3s linear infinite;
}

@keyframes infiniteRotate {
  from {
    transform: scale(1.08) rotate(0deg);
  }
  to {
    transform: scale(1.08) rotate(360deg);
  }
}

.status-section,
.category-section {
  position: relative;
  padding: 1.8rem 0 2.8rem;
}

.filter-title {
  margin-bottom: 1rem;
  color: var(--content-100);
  font-size: 1.1vw;
  text-transform: uppercase;
}

.filter-buttons {
  display: flex;
  gap: 0.4rem;
}

.filter-btn {
  padding: 0.4vw 0.8vw;
  border-radius: 100px;
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

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  transform: scale(0.94);
  transform-origin: left top;
}

.category-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.2rem;
  width: 20%;
  border-radius: 1.8vw;
  padding: 0.05vw 1.6vw 0.8vw;
}

.active {
  background: linear-gradient(
    180deg,
    rgba(149, 140, 116, 0.3) 0%,
    rgba(69, 112, 93, 0.3) 100%
  );
}

.category-icon {
  transform: scale(0.9);
  // min-width: 100%;
  // min-width: 7.6rem;
  // width: 7.6rem;
  // height: auto;
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
  ALL: "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757974033/proportional.design-4.0/categories/all_3x_a79cwj.webp",
  JOINERY:
    "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757974034/proportional.design-4.0/categories/joinery_3x_pu3qnj.webp",
  KEEPING:
    "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757974279/proportional.design-4.0/categories/keeping_3x_qzigmk.webp",
  REPOSE:
    "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757974280/proportional.design-4.0/categories/repose_3x_kzimef.webp",
  SEATING:
    "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757974282/proportional.design-4.0/categories/seating_3x_gt8bfo.webp",
  SURFACES:
    "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757974283/proportional.design-4.0/categories/surfaces_3x_npvuey.webp",
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
