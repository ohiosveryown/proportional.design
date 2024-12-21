<template>
  <div class="app">
    <App-Aside class="aside" />
    <main class="main">
      <ClientOnly>
        <ContentDoc :path="path">
          <template #default="{ doc }">
            <section class="contact">
              <h3>Contact</h3>
              <ul>
                <li>hello@proportional.design</li>
              </ul>
            </section>

            <section class="updates">
              <h3>Recent updates</h3>
              <ul v-if="!loading">
                <li v-for="commit in commits" :key="commit.sha">
                  {{ commit.message }} ({{ commit.date }})
                </li>
              </ul>
              <p v-else>Loading commits...</p>
            </section>

            <section class="inquiry">
              <h3>Project Inquiry</h3>
              <button class="email">Get in touch</button>
            </section>

            <section class="social">
              <h3>Social</h3>
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

section {
  border-bottom: var(--border);
  padding: 1.8rem 0;
}

h3 {
  font-weight: 600;
  font-size: 1.2rem;
  text-transform: uppercase;
  opacity: 0.76;
}

li,
p,
a {
  font-size: 1.6rem;
}

a {
  text-decoration: underline;
}

main {
  display: none;
  @include breakpoint(md) {
    display: initial;
  }
}

main {
  padding: 2.4rem 4rem;
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
