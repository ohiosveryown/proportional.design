<template>
  <aside>
    <App-Header />
    <Directory />
  </aside>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

aside {
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius--lg);
  border: var(--border);
  height: max-content;
  padding-bottom: 1rem;
  background: rgba(0, 0, 0, 0.14);
  box-shadow: var(--shadow);
  backdrop-filter: blur(100px);
  overflow-y: scroll;
  @include breakpoint(md) {
    width: 40rem;
    max-height: calc(100vh - 4.8rem);
    // padding: 0 1.2rem 1.5rem;
  }
}
</style>
