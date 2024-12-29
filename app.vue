<template>
  <div class="app">
    <App-Aside />
    <NuxtPage />
  </div>
</template>

<style lang="scss">
@use "/assets/style/grid.scss" as *;
@use "/assets/style/type.scss" as *;

.app {
  display: flex;
  gap: var(--unit);
  margin: 0 auto;
  max-width: 180rem;
  padding: var(--unit);
}

.main {
  flex: 1;
  border-radius: var(--border-radius--lg);
  border: var(--border--light);
  width: 100%;
  padding: 1.2rem;
  background: var(--bg);
  box-shadow: var(--shadow--inset);
  overflow-y: scroll;

  @include breakpoint(md) {
    max-height: calc(100vh - 2.4rem);
  }
}
</style>
