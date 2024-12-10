<template>
  <div class="app">
    <Navigation />
    <NuxtPage class="main" />
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;
@use "/assets/style/type.scss" as *;

.app {
  display: flex;
  gap: 2rem;
  padding: 2.4rem;
}

:deep(.main) {
  flex: 1;
  border-radius: 5px;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  min-height: calc(100vh - 4.8rem);
  max-height: calc(100vh - 4.8rem);
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0px 18px 38px 0px rgba(0, 0, 0, 0.1),
    0px 4.021px 8.488px 0px rgba(0, 0, 0, 0.1),
    0px 1.197px 2.527px 0px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(100px);
  overflow-y: scroll;
}
</style>
