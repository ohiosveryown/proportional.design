<template>
  <menu>
    <div class="label">
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
        <div>
          <input
            type="radio"
            name="sort"
            value="last_updated"
            id="last_updated"
            :checked="selectedSort === 'last_updated'"
          />
          <label for="last_updated">Last updated</label>
        </div>

        <div>
          <input
            type="radio"
            name="sort"
            value="asc"
            id="asc"
            :checked="selectedSort === 'asc'"
          />
          <label for="asc">A–Z</label>
        </div>

        <div>
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

.label {
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

.label svg {
  transform: translateY(0.05rem);
}

label {
  margin-left: 0.4rem;
}
</style>

<script setup>
// Sorting logic
const STORAGE_KEY = "selected-sort";
const emit = defineEmits(["sort"]);
const selectedSort = ref(localStorage.getItem(STORAGE_KEY) || "last_updated");

const handleSort = (e) => {
  selectedSort.value = e.target.value;
  localStorage.setItem(STORAGE_KEY, e.target.value);
  emit("sort", selectedSort.value);
};

onMounted(() => {
  emit("sort", selectedSort.value);
});
</script>
