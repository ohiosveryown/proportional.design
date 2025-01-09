<template>
  <div class="controls">
    <!-- filters -->
    <div class="sort-controls">
      <select v-model="sortMethod" @change="$emit('update:sort', sortMethod)">
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="az">A to Z</option>
        <option value="za">Z to A</option>
      </select>
    </div>
    <!-- segmented controls -->
    <div class="segmented-controls">
      <button @click="$emit('toggle', false)" :class="{ active: isCollapsed }">
        Collapse
      </button>
      <button :class="['mixed', { active: isMixed }]">Mixed</button>
      <button @click="$emit('toggle', true)" :class="{ active: isExpanded }">
        Expand
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  margin: 0.4rem 0 1.2rem 0;
  padding: 0 1.2rem 0 1.6rem;
}

.segmented-controls {
  display: flex;
  gap: 0.4rem;
  border-radius: var(--radius-md);
  padding: 0.4rem;
  width: max-content;
  background-color: var(--bg-vdark);
}

.segmented-controls button {
  padding: 0.4rem 0.6rem 0.45rem;
  font-size: var(--font-xs);
  font-weight: 500;
  opacity: 0.76;
}

.segmented-controls button:hover {
  opacity: 1;
}

.segmented-controls .active {
  border-radius: var(--radius-sm);
  border: var(--border-light);
  background-color: var(--bg-dark);
  box-shadow: var(--shadow-sm);
  text-shadow: none;
  opacity: 1;
}

.segmented-controls .mixed {
  pointer-events: none;
}

.sort-controls {
  select {
    background: var(--bg-dark);
    color: var(--color-font);
    border: 1px solid var(--bg-vdark);
    border-radius: var(--radius-sm);
    padding: 0.3rem 0.8rem;
    font-size: var(--font-sm);
    cursor: pointer;

    &:hover {
      background: var(--bg-vdark);
    }
  }
}
</style>

<script setup lang="ts">
const props = defineProps<{
  isExpanded: boolean;
  isCollapsed: boolean;
}>();

const isMixed = computed(() => !props.isExpanded && !props.isCollapsed);
const emit = defineEmits(["toggle", "update:sort"]);

// Add sort method ref
const sortMethod = ref("newest");
</script>
