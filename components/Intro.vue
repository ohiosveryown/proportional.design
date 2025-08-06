<template>
  <header>
    <h1 class="sans lg">
      <span class="row row-one">
        Proportional Design is a <span class="sm">(small-fry)</span></span
      >
      <span class="row row-two"
        >studio based in
        <span class="atlanta">Atlanta</span>,&nbsp;Georgia.</span
      >
    </h1>

    <p class="sans lg">
      <span class="row row-three">We Build furniture and&nbsp;other</span>
      <span class="row row-four">functional objects using&nbsp;locally </span>
      <span class="row row-five">sourced, sustainable materials.</span>
    </p>

    <p class="serif md">
      Our craftsmanship aims to honor both woodworking heritage, and our
      responsibility to the environment.
    </p>
  </header>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin: 0 auto 8rem;
  padding: 11.2rem 3.2rem 0;
  max-width: 200rem;
  width: 92vw;
  text-align: center;
  text-transform: uppercase;
}

.lg {
  @include breakpoint(md) {
    margin-bottom: 4rem;
    font-size: 7.2rem;
    line-height: 0.96;
    letter-spacing: -0.15rem;
  }
}

.md {
  position: relative;
  border-block: 1px solid var(--secondary);
  padding: 3.2rem 0;
  color: var(--secondary);

  @include breakpoint(md) {
    max-width: 47ch;
    font-size: 4rem;
    line-height: 1.1;
    letter-spacing: -0.05rem;
  }
}

.sm {
  color: var(--secondary);
  @include breakpoint(md) {
    font-size: 4.8rem;
  }
}

.md:before,
.md:after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto 0;
  width: 2rem;
  height: 5.6rem;
  background: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1754491087/proportional.design-4.0/flourish_iuibe3.svg")
    no-repeat center center;
  background-size: cover;
}

.md:after {
  right: 0;
  left: auto;
  transform: scaleX(-1);
}

.atlanta {
  background: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1754493058/proportional.design-4.0/atl-2_2x_hlqegf.webp")
    no-repeat;
  background-size: 100% 50%;
  background-position: 0 0.4rem;
}

.row {
  display: block;
}
</style>
