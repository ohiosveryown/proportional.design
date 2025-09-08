<template>
  <header>
    <h1 class="reader-only">proportional.design</h1>
    <Logotype class="logotype" />
  </header>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  flex-direction: column;
  margin: 2.4rem 1rem 0;
}

.logotype {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.reader-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  pointer-events: none;
}
</style>
