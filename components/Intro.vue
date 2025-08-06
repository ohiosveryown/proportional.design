<template>
  <header>
    <h1 class="sans lg">
      <span class="row row-one">
        Pr<span class="serif">o</span>p<span class="serif">o</span>rti<span
          class="serif"
          >o</span
        >nal Design is a small-fry</span
      >
      <span class="row row-two"
        >studi<span class="serif">o</span> based in Atlanta, Ge<span
          class="serif"
          >o</span
        >rgia.</span
      >
    </h1>

    <p class="sans lg">
      <span class="row row-three"
        >We Build furniture and <span class="serif">o</span>ther</span
      >
      <span class="row row-four"
        >functi<span class="serif">o</span>nal
        <span class="serif">o</span>bjects using L<span class="serif">o</span
        >cally
      </span>
      <span class="row row-five"
        >s<span class="serif">o</span>urced, Sustainable materials.</span
      >
    </p>

    <p>
      <span class="row row-six">
        Our craftsmanship aims to honor both woodworking
      </span>
      <span class="row row-six">
        heritage, and our responsibility to the environment.
      </span>
    </p>
  </header>
</template>

<style lang="scss" scoped>
header {
  position: relative;
  margin: 0 auto 8rem;
  padding: 5.6rem 3.2rem 0;
  max-width: 200rem;
  text-align: center;
  text-transform: uppercase;
  --font-size: 7.2rem;
}

.lg {
  @include breakpoint(md) {
    margin-bottom: 4rem;
    font-size: var(--font-size);
    line-height: 0.96;
    letter-spacing: -0.15rem;
  }
}

.serif {
  @include breakpoint(md) {
    font-size: calc(var(--font-size) * 0.9);
  }
}

.row {
  display: block;
}
</style>
