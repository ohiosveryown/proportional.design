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
  background: var(--bg--dark);
  padding: 0.4rem;
  border-radius: 100px;
  gap: 0.4rem;

  button {
    padding: 0.6rem 1.2rem;
    border-radius: 100px;
    border: none;
    background: transparent;
    color: var(--color-text);
    font-size: 1.4rem;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.76;

    &:hover:not(.disabled) {
      opacity: 1;
    }

    &.active {
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
