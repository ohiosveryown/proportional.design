<template>
  <div class="debug sort-control">
    <label for="sort">Sort:</label>
    <select id="sort" v-model="sortBy" @change="handleSort">
      <option value="updated">Last Updated</option>
      <option value="asc">A-Z</option>
      <option value="desc">Z-A</option>
    </select>
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

.sort-control {
  display: flex;
  align-items: center;
  margin: 0 0.8rem 0;
  padding: 1.4rem 1.6rem;
}

select {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  // margin: 0 0.8rem 0;
  border-radius: var(--border-radius--sm);
  border: none;
  // padding: 1.4rem 1.6rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color--primary);
  text-transform: uppercase;
  opacity: 0.76;
  background: transparent;
  appearance: none;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.32);
    opacity: 1;
  }

  &:focus {
    outline: none;
    background: rgba(0, 0, 0, 0.2);
    opacity: 1;
  }

  &:focus:not(:hover) {
    outline: none;
    background: transparent;
    opacity: 0.76;
  }
}

option {
  background: var(--bg--vdark);
  color: var(--color--primary);
  padding: 0.8rem;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  &:checked {
    background: rgba(255, 255, 255, 0.16);
  }
}
</style>

<script setup>
const props = defineProps({
  posts: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:sorted"]);
const STORAGE_KEY = "directory-sort-preference";
const sortBy = ref(localStorage.getItem(STORAGE_KEY) || "updated");

const sortedPosts = computed(() => {
  const entries = Object.entries(props.posts);

  const sortedEntries = entries.sort(([dirA], [dirB]) => {
    switch (sortBy.value) {
      case "updated":
        return dirB.localeCompare(dirA);
      case "asc":
        return dirA.localeCompare(dirB);
      case "desc":
        return dirB.localeCompare(dirA);
      default:
        return 0;
    }
  });

  return Object.fromEntries(sortedEntries);
});

const handleSort = () => {
  localStorage.setItem(STORAGE_KEY, sortBy.value);
  emit("update:sorted", sortedPosts.value);
};

watch(
  sortedPosts,
  (newValue) => {
    emit("update:sorted", newValue);
  },
  { immediate: true }
);
</script>
