<template>
  <section class="hero">
    <Logotype class="logotype" />
    <div class="hero-image" />
  </section>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  width: 100vw;
  height: 100dvh;
}

.hero-image {
  position: absolute;
  top: 0;
  right: 0;
  width: 46%;
  height: calc(100% - 1.6rem);
  border-radius: 9px;
  margin: 0.8rem;
  overflow: hidden;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25),
    0 24px 158px 0 rgba(0, 0, 0, 0.12), 0 6px 36px 0 rgba(0, 0, 0, 0.07),
    0 2px 10px 0 rgba(0, 0, 0, 0.05);
  background: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1756947317/proportional.design-4.0/hero_2x_uajsjm.webp")
    no-repeat center center;
  background-size: cover;
  opacity: 0;
  animation: fadeIn 1s ease-in forwards 2s;
}

.hero-image img {
  width: 100%;
  height: 100%;
  min-height: 100%;
  object-fit: cover;
}

.logotype {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scale(0.65) translate(0);
  transform-origin: center;
  animation: loadAnimation 1.76s cubic-bezier(0.8, 0, 0.16, 1) forwards 1s;
}

@keyframes loadAnimation {
  to {
    transform: scale(0.5) translate(-48%, -50%);
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>

<script setup></script>
