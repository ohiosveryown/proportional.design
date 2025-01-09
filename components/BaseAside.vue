<template>
  <aside class="container">
    <header>
      <nuxt-link to="/">
        <div class="logo" />
      </nuxt-link>

      <menu>
        <a
          class="contact"
          href="https://www.notion.so/1599d0f43b9881238f64e3211d43c345?pvs=106"
          target="_blank"
          >Contact</a
        >

        <button class="search">
          <svg width="16" height="16" fill="none">
            <path
              fill="#fff"
              fill-rule="evenodd"
              d="M12.933 9.99a4.898 4.898 0 1 1-7.062-6.787 4.898 4.898 0 0 1 7.062 6.788Zm-8.005 1.228a6.529 6.529 0 1 0-.146-.146l-.504-.504L.24 14.607a.815.815 0 1 0 1.154 1.154l4.04-4.04-.505-.503Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </menu>
    </header>

    <section>
      <h1>
        <title>proportional.design</title>
        <img
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733867671/proportional.design-3.0/logotype_2x_b662tq.webp"
          alt="proportional.design logotype"
          class="logotype"
        />
      </h1>
      <h2>
        A small-fry studio based in Atlanta, Ga building functional objects
        🎨🍑🪑.
      </h2>
    </section>

    <Directory />
  </aside>
</template>

<style lang="scss">
@use "/assets/style/grid.scss" as *;
aside.container {
  max-width: 40rem;
  width: 40rem;
}

header .logo {
  display: block;
  position: relative;
  border-radius: var(--radius-md);
  width: 2.8rem;
  height: 2.8rem;
  background-image: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733875450/proportional.design-3.0/avatar_w_3x_j45unb.webp");
  background-size: cover;
  background-position: center;
}

.logo::after {
  content: "";
  position: absolute;
  bottom: -0.2rem;
  left: 2rem;
  border-radius: var(--radius-lg);
  border: 1.5px solid rgb(0, 0, 0, 0.8);
  width: 10px;
  height: 10px;
  background: #1dda0f;
}

header menu {
  display: flex;
  align-items: center;
}

header menu a {
  position: relative;
  border-right: 0.5px solid rgba(255, 255, 255, 1);
  margin-right: calc(var(--unit) * 1.25);
  padding-right: calc(var(--unit) * 1.25);
  font-weight: 500;
  opacity: 0.56;
}

header menu a:hover {
  opacity: 1;
  transition: opacity 0.2s ease;
}

header menu button {
  padding-right: calc(var(--unit) * 0.5);
  opacity: 0.48;
}

header menu a.contact::before {
  content: "View contact page";
  position: absolute;
  bottom: 0;
  left: 50%;
  border-radius: var(--radius-sm);
  padding: 0.4rem 0.75rem 0.5rem;
  font-size: var(--font-sm);
  font-weight: 400;
  background: var(--bg);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  box-shadow: var(--shadow);
  transform: translate(-50%, 3rem);
}

header menu a.contact:hover::before {
  opacity: 0.76;
  transform: translate(-50%, 4rem);
  transition: all 0.2s ease;
}

section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 0 1.2rem 0.65rem;
  border-bottom: var(--border);
  padding: 2.4rem 0 2rem;
}

section .logotype {
  width: 46%;
  @include breakpoint(md) {
    width: 64%;
  }
  @include breakpoint(lg) {
    width: 54%;
  }
}

section h2 {
  opacity: 0.76;
}
</style>

<script setup lang="ts"></script>
