<template>
  <main class="main">
    <nav>
      <img
        class="thumbnail"
        src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1735235844/proportional.design-3.0/icons/md_rufxgs.webp"
        alt="markdown icon"
      />
      <header>
        <h1>index.md</h1>
        <h2>December 20, 2024</h2>
      </header>
      <span class="filetype">Markdown</span>
    </nav>

    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
    </p>
  </main>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

nav {
  justify-content: flex-start;
  gap: calc(var(--unit) * 0.8);
  max-height: 5.4rem;
}

nav .thumbnail {
  border-radius: var(--radius-sm);
  border: var(--border);
  width: 2.4rem;
  height: 2.4rem;
  object-fit: cover;
}

nav header,
nav span {
  margin-bottom: 0.4rem;
}

nav header {
  flex: 1;
}

nav h1 {
  font-size: var(--font-sm);
  font-weight: 500;
}

nav h2,
nav span {
  font-size: var(--font-xs);
  font-weight: 500;
  opacity: 0.76;
  text-transform: capitalize;
}

nav span {
  font-weight: 400;
}
</style>

<script setup lang="ts"></script>
