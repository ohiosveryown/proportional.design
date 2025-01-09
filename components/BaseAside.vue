<template>
  <aside class="container">
    <header>
      <div class="logo" />
      <menu>
        <a
          class="contact"
          href="https://www.notion.so/1599d0f43b9881238f64e3211d43c345?pvs=106"
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

menu {
  display: flex;
  align-items: center;
}

menu a {
  border-right: 0.5px solid rgba(255, 255, 255, 1);
  margin-right: calc(var(--unit) * 1.25);
  padding-right: calc(var(--unit) * 1.25);
  font-weight: 500;
  opacity: 0.56;
}

menu button {
  padding-right: calc(var(--unit) * 0.5);
  opacity: 0.48;
}
</style>

<script setup lang="ts"></script>
