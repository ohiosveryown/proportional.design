<template>
  <div>
    <header>
      <h1>proportional.design</h1>
      <p>Handcrafted pieces built with care and attention to detail.</p>
    </header>
    <NuxtPage class="container" />
  </div>
</template>

<style lang="scss">
h1 {
  @include breakpoint(md) {
    color: red;
  }
}
</style>
