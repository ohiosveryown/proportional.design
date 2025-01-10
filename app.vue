<template>
  <div class="app">
    <BaseAside />
    <NuxtPage class="container" />
  </div>
</template>

<style lang="scss">
@use "/assets/style/grid.scss" as *;

.app {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--unit);
  margin: 0 auto;
  max-width: 180rem;
  padding: var(--unit);
  @include breakpoint(md) {
    flex-direction: row;
  }
}

.container {
  @include breakpoint(md) {
    max-height: calc(100vh - 2.4rem);
  }
}
</style>
