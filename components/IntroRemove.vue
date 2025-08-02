<template>
  <header>
    <Logotype class="logotype" />
    <h1 class="serif">
      <span class="start sans">proportional design</span> is a small-fry studio
      based in Atlanta, Georgia, committed to building functional furniture that
      marries thoughtful design with practical living. Our approach centers on
      creating pieces that are both beautiful and purposeful—furniture that
      enhances daily life through careful attention to proportion, materiality,
      and craftsmanship.
      <!-- <span class="end">
        <img
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1753995214/proportional.design-4.0/fig--rm_3x_xkrtvt.webp"
          alt="fig"
        />
      </span> -->
    </h1>
  </header>
</template>

<style lang="scss" scoped>
header {
  margin: 5.6rem auto 16rem;
  padding: 0 6.4rem;
  max-width: 200rem;
}

.logotype {
  width: 100%;

  svg {
    width: 100%;
    height: auto;
  }
}

h1 {
  font-size: 4rem;
  line-height: 1.2;
  letter-spacing: -0.75px;
  text-align: justify;
  word-spacing: -2px;
  -webkit-text-stroke: 0.25px #000;
}

span {
  position: relative;
  z-index: var(--z1);
}

.start:after {
  content: "";
  position: absolute;
  z-index: var(--zmin);
  top: -2rem;
  left: -5.2rem;
  width: 11.6rem;
  height: 11.6rem;
  background: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1753995213/proportional.design-4.0/chair_3x_glcrip.webp")
    no-repeat center center;
  background-size: cover;
}

.sans {
  margin-left: 16.4rem;
  font-size: 4.2rem;
  font-weight: 500;
}

.end {
  position: absolute;
  display: inline-block;
  margin: 0.4rem 0 0 1.2rem;
  width: 22rem;
  height: 12.4rem;
  border-radius: 15px;
  box-shadow: 0 60px 80px 0 rgba(0, 0, 0, 0.06),
    0 14px 18px 0 rgba(0, 0, 0, 0.04), 0 4px 5px 0 rgba(0, 0, 0, 0.02);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

<script setup></script>
