<template>
  <main class="main">
    <ClientOnly>
      <ContentDoc :path="path">
        <template #empty>
          <header>
            <img
              class="thumbnail"
              src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1735235844/proportional.design-3.0/icons/md_rufxgs.webp"
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

          <section class="inquiry">
            <a
              href="https://caramel-plaster-82f.notion.site/1599d0f43b9881238f64e3211d43c345?pvs=105"
              target="_blank"
            >
              <button>
                <h4>Project Inquiry</h4>
                <span class="email">Get in touch</span>
              </button>
            </a>
          </section>

          <section class="updates">
            <h4>Recent updates</h4>
            <div class="updates-wrapper">
              <ul v-if="!loading">
                <li class="commits" v-for="commit in commits" :key="commit.sha">
                  <span class="commit-message">{{ commit.message }}</span>
                  <span class="commit-date">{{ commit.date }}</span>
                </li>
              </ul>
              <p v-else>Loading commits...</p>
              <img
                class="updates-thumbnail"
                :src="randomThumbnail"
                alt="Thumbnail image"
              />
            </div>
          </section>

          <section class="social">
            <div class="avatar-wrapper">
              <img
                class="avatar"
                src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733875450/proportional.design-3.0/avatar_w_3x_j45unb.webp"
                alt="proportional.design avatar"
              />
            </div>
            <div class="social-content">
              <h4>Social</h4>
              <a href="http://instagram.com/proportional.design" target="_blank"
                >proportional.design</a
              >
            </div>
          </section>

          <section>
            <Table />
          </section>
        </template>
      </ContentDoc>
    </ClientOnly>
  </main>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

main {
  display: none;
  @include breakpoint(md) {
    display: initial;
    //   height: 100vh;
  }
}

section.inquiry {
  padding: 0.4rem 0;
}

.inquiry a {
  text-decoration: none;
}

.inquiry button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-radius: var(--border-radius--md);
  width: 100%;
  height: 100%;
  padding: 1rem 0;
}

.inquiry button:after {
  content: "";
  position: absolute;
  inset: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: var(--border-radius--md);
  width: 101.5%;
  height: 100%;
  z-index: var(--z1);
}

.inquiry:hover {
  button:after {
    background: var(--bg--dark);
  }
}

.inquiry h4 {
  position: relative;
  z-index: var(--z2);
  transform: translateY(0rem);
}

.inquiry span {
  position: relative;
  z-index: var(--z2);
  border-radius: 100px;
  border: 1px solid #df8559;
  padding: 0.4rem 0.8rem 0.5rem;
  font-weight: 600;
  font-size: 1.3rem;
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.12);
  background: linear-gradient(180deg, #f46b27 21.5%, #ef621b 100%);
  box-shadow: var(--shadow);
  transition: transform 300ms ease;

  &:hover {
    transform: rotate(2deg);
  }
}

.social {
  display: flex;
  align-items: center;
}

.social img {
  display: block;
  position: relative;
  z-index: 1;
  margin-right: 1rem;
  border-radius: 100px;
  border: 3px solid var(--bg--mdark);
  width: 4rem;
  height: 4rem;
}

@keyframes rotate {
  from {
    transform: scale(1.08) rotate(0deg);
  }
  to {
    transform: scale(1.08) rotate(360deg);
  }
}

.avatar-wrapper {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    z-index: 0;
    inset: 0;
    width: 4rem;
    height: 4rem;
    border-radius: 100px;
    transform: scale(1.08);
    animation: rotate 2s linear infinite;
    background: linear-gradient(
      228deg,
      #c904ff 10.31%,
      #d8066b 49%,
      #ff941a 91.77%
    );
  }
}

.social-content h4 {
  line-height: 1;
}

header {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: sticky;
  z-index: var(--z3);
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
  width: 3rem;
  height: 2.4rem;
  object-fit: cover;
  object-position: top;
  box-shadow: var(--shadow--sm);
  content-visibility: auto;
  contain-intrinsic-size: 800px 600px;
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

section:last-of-type {
  border: none;
  padding-bottom: 0;
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

.updates-wrapper ul,
.updates-wrapper p {
  min-width: grid-width(7.5);
  width: grid-width(7.5);
}

img.updates-thumbnail {
  border-radius: var(--border-radius--md);
  border: 1.5px solid var(--color--primary);
  margin-left: grid-width(1);
  min-width: grid-width(3.5);
  width: grid-width(3.5);
  min-height: 14rem;
  height: 14rem;
  object-fit: cover;
  box-shadow: var(--shadow);
  pointer-events: none;
  transform: translateY(-1rem);
}

li.commits:first-of-type {
  margin-top: 0.6rem;
}

li.commits {
  margin-top: 0.8rem;
  line-height: 1.3;
  // max-width: 72ch;
}

.commit-date {
  display: block;
  margin-top: 0.4rem;
  font-size: 1.2rem;
  opacity: 0.64;
}
</style>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const route = useRoute();
const path = computed(() => {
  return route.params.slug ? `/${route.params.slug.join("/")}` : "/";
});

import { useGithubCommits } from "~/composables/updates";
const { commits, loading } = useGithubCommits();

const thumbnails = [
  "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1735232373/proportional.design-3.0/index-thumbnails/00_tjgzn7.webp",
  "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1735231748/proportional.design-3.0/index-thumbnails/01_2x_bhheme.webp",
  "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1735232374/proportional.design-3.0/index-thumbnails/02_lvzqot.webp",
  "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1735232376/proportional.design-3.0/index-thumbnails/03_sa9wcp.webp",
  "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1735232463/proportional.design-3.0/index-thumbnails/04_y6rpgd.webp",
  "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1735449108/proportional.design-3.0/index-thumbnails/proprotional.design_httpss.mj.run8u_CeAZHM1E_can_you_place_a__05a055af-be2c-4ee5-a722-ff3af8fd827e_1_vqeojd.webp",
];

const randomThumbnail = computed(() => {
  const randomIndex = Math.floor(Math.random() * thumbnails.length);
  return thumbnails[randomIndex];
});
</script>
