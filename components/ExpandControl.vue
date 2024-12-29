<template>
  <div class="segmented-control">
    <button
      @click="handleCollapse"
      :class="{ active: expandState === 'collapsed' }"
      title="Collapse all sections"
    >
      Collapse
    </button>
    <button
      :class="{
        active: expandState === 'mixed',
        disabled: expandState === 'expanded' || expandState === 'collapsed',
      }"
      title="Mixed state"
      disabled
    >
      Mixed
    </button>
    <button
      @click="handleExpand"
      :class="{ active: expandState === 'expanded' }"
      title="Expand all sections"
    >
      Expand
    </button>
  </div>
</template>

<style lang="scss" scoped>
.segmented-control {
  display: inline-flex;
  padding: 0.5rem;
  gap: 0.4rem;
  border-radius: 100px;
  background: var(--bg--dark);

  button {
    border: 0.5px solid transparent;
    border-radius: 100px;
    padding: 0.2rem 0.6rem 0.3rem;
    background: transparent;
    color: var(--color--primary);
    font-weight: 400;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.76;

    &:hover:not(.disabled) {
      opacity: 1;
    }

    &.active {
      border: var(--border);
      background: var(--bg--light);
      opacity: 1;
    }

    &.disabled {
      opacity: 0.32;
      cursor: default;
      pointer-events: none;
    }
  }
}
</style>

<script setup>
const { expandState, expandAll, collapseAll } = inject("directoryControls");

const handleExpand = () => {
  expandAll();
  expandState.value = "expanded";
};

const handleCollapse = () => {
  collapseAll();
  expandState.value = "collapsed";
};
</script>
