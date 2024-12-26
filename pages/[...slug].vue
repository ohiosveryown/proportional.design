<template>
  <div class="app">
    <App-Aside class="aside" />

    <main class="main">
      <ClientOnly>
        <ContentDoc :path="path">
          <template #default="{ doc }">
            <header>
              <img
                class="thumbnail"
                src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1734304570/proportional.design-3.0/hiro--01/IMG_4051_jdqdfh.webp"
                alt="markdown icon"
              />
              <div class="title">
                <h1>index.md</h1>
                <h2>December 20, 2024</h2>
              </div>
              <div class="meta">
                <h3>Markdown</h3>
              </div>
            </header>

            <section class="contact">
              <h4>Contact</h4>
              <p>hello@proportional.design</p>
            </section>

            <section class="updates">
              <h4>Recent updates</h4>
              <div class="updates-wrapper">
                <ul v-if="!loading">
                  <li
                    class="commits"
                    v-for="commit in commits"
                    :key="commit.sha"
                  >
                    <span class="commit-message">{{ commit.message }}</span>
                    <span class="commit-date">{{ commit.date }}</span>
                  </li>
                </ul>
                <p v-else>Loading commits...</p>
                <img
                  class="updates-thumbnail"
                  src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1735231748/proportional.design-3.0/index-thumbnails/01_2x_bhheme.webp"
                  alt=""
                />
              </div>
            </section>

            <section class="inquiry">
              <h4>Project Inquiry</h4>
              <button class="email">Get in touch</button>
            </section>

            <section class="social">
              <h4>Social</h4>
              <a href="#" target="_blank">proportional.design</a>
            </section>

            <article>
              <ContentRenderer :value="doc" />
            </article>
          </template>
          <template #not-found>
            <h1>Hellloooooo</h1>
          </template>
          <template #loading>
            <p>Loading...</p>
          </template>
          <template #error="{ error }">
            <h1>Error: {{ error.message }}</h1>
          </template>
        </ContentDoc>
      </ClientOnly>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

header {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: sticky;
  z-index: var(--z1);
  top: 0;
  margin-bottom: 0.8rem;
}

header:after {
  content: "";
  position: absolute;
  z-index: var(--z0);
  top: -1.2rem;
  left: -1.2rem;
  border-bottom: var(--border);
  width: calc(100% + 2.4rem);
  height: calc(100% + 2.4rem);
  background: var(--bg--dark);
  backdrop-filter: blur(56px);
}

.thumbnail {
  border-radius: var(--border-radius--xs);
  border: 1.5px solid #fff;
  box-shadow: var(--shadow--sm);
  width: 3rem;
  height: 2.4rem;
  object-fit: cover;
  object-position: top;
}

.title {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

h1,
h2 {
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.32);
}

h1 {
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1;
}

h2,
h3 {
  opacity: 0.76;
  font-size: 1.2rem;
  text-transform: capitalize;
}

section {
  border-bottom: var(--border);
  padding: 1.8rem 0;
}

h4 {
  font-weight: 600;
  font-size: 1.2rem;
  text-transform: uppercase;
  opacity: 0.76;
}

li,
p,
a {
  font-size: 1.5rem;
}

a {
  text-decoration: underline;
}

.updates-wrapper {
  display: flex;
  align-items: top;
}

img.updates-thumbnail {
  border-radius: var(--border-radius--md);
  border: 1.5px solid var(--color--primary);
  margin-left: grid-width(1);
  width: grid-width(3.5);
  height: 14rem;
  object-fit: cover;
  box-shadow: var(--shadow);
}

li.commits {
  margin-top: 0.8rem;
  // max-width: 72ch;
  line-height: 1.3;
}

.commit-date {
  display: block;
  margin-top: 0.4rem;
  font-size: 1.2rem;
  opacity: 0.64;
}
</style>

<script setup lang="ts">
const route = useRoute();
const path = computed(() => {
  return route.params.slug ? `/${route.params.slug.join("/")}` : "/";
});

import { useGithubCommits } from "~/composables/updates";
const { commits, loading } = useGithubCommits();
</script>
