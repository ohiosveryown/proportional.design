<template>
  <div>
    <NuxtPage />
    <!-- <img
      src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733444492/proportional.design-3.0/bg-01_kaaqx9.webp"
      alt=""
      class="bg"
    /> -->
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;
@use "/assets/style/type.scss" as *;

:deep(.app) {
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
  background: rgba(0, 0, 0, 0.2);
  box-shadow: var(--shadow);
  backdrop-filter: blur(100px);
  overflow-y: scroll;
  @include breakpoint(md) {
    max-height: calc(100vh - 2.4rem);
  }
}

.bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  opacity: 0.7;
  z-index: var(--zmin);
}
</style>
