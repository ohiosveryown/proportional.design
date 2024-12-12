<template>
  <div class="app">
    <App-Aside />
    <!-- <Navigation /> -->
    <NuxtPage class="main" />
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;
@use "/assets/style/type.scss" as *;

.app {
  display: flex;
  gap: var(--unit);
  margin: 0 auto;
  max-width: 180rem;
  padding: var(--unit);
}

:deep(.main) {
  flex: 1;
  border-radius: var(--border-radius--lg);
  border: var(--border);
  width: 100%;
  padding: 1.2rem;
  max-height: calc(100vh - var(--unit) * 2);
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0 18px 38px 0 rgba(0, 0, 0, 0.1), 0 4px 8px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(100px);
  overflow-y: scroll;
}
</style>
