<template>
  <menu>
    <div class="menu-trigger">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
      >
        <circle cx="10" cy="10" r="7.5" stroke="#fff" />
        <path
          stroke="#fff"
          stroke-linecap="round"
          d="M6 8h8M6.8 10.4h6.4M8 12.8h4"
        />
      </svg>
      Filters
    </div>

    <div class="popover">
      <!-- sorting -->
      <form @change="handleSort">
        <div class="sort-radio">
          <input
            type="radio"
            name="sort"
            value="newest"
            id="newest"
            :checked="selectedSort === 'newest'"
          />
          <label for="newest">Newest First</label>
        </div>

        <div class="sort-radio">
          <input
            type="radio"
            name="sort"
            value="oldest"
            id="oldest"
            :checked="selectedSort === 'oldest'"
          />
          <label for="oldest">Oldest First</label>
        </div>

        <div class="sort-radio">
          <input
            type="radio"
            name="sort"
            value="asc"
            id="asc"
            :checked="selectedSort === 'asc'"
          />
          <label for="asc">A–Z</label>
        </div>

        <div class="sort-radio">
          <input
            type="radio"
            name="sort"
            value="desc"
            id="desc"
            :checked="selectedSort === 'desc'"
          />
          <label for="desc">Z–A</label>
        </div>
      </form>

      <!-- filters -->
      <form>
        <div>
          <input type="checkbox" name="filter" value="all" id="all" />
          <label for="all">All</label>
        </div>
      </form>
    </div>
  </menu>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

menu {
  position: relative;
}

.popover {
  position: absolute;
  z-index: var(--z1);
  top: 90%;
  left: 1.1rem;
  border-radius: var(--border-radius--md);
  border: var(--border);
  min-width: 16rem;
  padding: 1rem 0.8rem;
  background: #0a0a0a;
  box-shadow: var(--shadow);
}

.menu-trigger {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0.8rem;
  border-radius: var(--border-radius--sm);
  padding: 1rem 1.6rem;
  opacity: 0.76;

  &:hover {
    background: var(--bg--dark);
    opacity: 1;
  }
}

.menu-trigger svg {
  transform: translateY(0.05rem);
}

label {
  margin-left: 0.4rem;
  width: 100%;

  font-size: 1.5rem;
  font-weight: 500;
  opacity: 0.76;
  transform: translateY(-0.1rem);

  &:hover {
    opacity: 1;
  }
}

.sort-radio {
  display: flex;
  align-items: center;
  border-radius: var(--border-radius--sm);
  padding: 0.4rem;

  &:hover {
    background: var(--bg--light);
  }
}

input[type="radio"] {
  position: relative;
  appearance: none;
  border-radius: 100px;
  border: none;
  min-width: 16px;
  min-height: 16px;
  width: 16px;
  height: 16px;
  background: transparent;
  cursor: pointer;

  &:checked::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    width: 7px;
    height: 7px;
    background: var(--color--primary);
    transform: translate(-50%, -50%);
  }

  &:checked {
    border: 0.5px solid rgba(255, 255, 255, 0.32);
    background: var(--bg--light);
    & + label {
      opacity: 1;
    }
  }
}
</style>

<script setup>
// Sorting logic
const STORAGE_KEY = "selected-sort";
const emit = defineEmits(["sort"]);
const selectedSort = ref(localStorage.getItem(STORAGE_KEY) || "newest");

const handleSort = (e) => {
  selectedSort.value = e.target.value;
  localStorage.setItem(STORAGE_KEY, e.target.value);
  emit("sort", selectedSort.value);
};

onMounted(() => {
  emit("sort", selectedSort.value);
});
</script>
