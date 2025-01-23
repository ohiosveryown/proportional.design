<template>
  <main class="main">
    <nav class="hide-sm">
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

    <section class="hide-sm contact spacing">
      <div class="contact-main">
        <h2>Contact</h2>
        <p>hello@proportional.design</p>
      </div>
      <a
        href="https://www.notion.so/1599d0f43b9881238f64e3211d43c345?pvs=106"
        target="_blank"
      >
        <button class="contact-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity=".92">
              <path
                d="M2.33325 4L7.38532 8.2544C7.75919 8.5692 8.30592 8.56767 8.67799 8.2506L13.6666 4M2.83325 13.1667H13.1666C13.7189 13.1667 14.1666 12.7189 14.1666 12.1667V4.5C14.1666 3.94771 13.7189 3.5 13.1666 3.5H2.83325C2.28097 3.5 1.83325 3.94771 1.83325 4.5V12.1667C1.83325 12.7189 2.28097 13.1667 2.83325 13.1667Z"
                stroke="#E6E6E6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
          <span>Get in touch</span>
          <div class="tooltip">
            <span class="label">Contact</span>
            <span class="key">⌘</span>
            <span class="key key-secondary">C</span>
          </div>
        </button>
      </a>
    </section>

    <section class="hide-sm updates spacing">
      <h2>Recent updates</h2>
      <div class="updates-content">
        <template v-if="!loading">
          <ul>
            <li class="commits" v-for="commit in commits" :key="commit.sha">
              <span class="commit-message">☻ {{ commit.message }}</span>
              <span class="commit-date">{{ commit.date }}</span>
            </li>
          </ul>
          <img
            class="updates-thumbnail"
            :src="randomThumbnail"
            alt="Thumbnail image"
          />
        </template>
        <template v-else>
          <ul class="skeleton-list">
            <li class="commits skeleton" v-for="n in 3" :key="n">
              <div class="skeleton-content">
                <span class="commit-message-skeleton"></span>
                <span class="commit-date-skeleton"></span>
              </div>
            </li>
          </ul>
          <div class="updates-thumbnail skeleton" />
        </template>
      </div>
    </section>

    <section class="hide-sm social spacing">
      <div class="avatar-wrapper">
        <img
          class="avatar"
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733875450/proportional.design-3.0/avatar_w_3x_j45unb.webp"
          alt="proportional.design avatar"
        />
      </div>
      <div class="social-content">
        <h2>Social</h2>
        <a href="http://instagram.com/proportional.design" target="_blank"
          >proportional.design</a
        >
      </div>
    </section>

    <section class="hide-sm most-recent spacing">
      <!-- <h2>Most recent</h2> -->
      <ContentList
        path="/"
        :query="{
          where: [{ _path: { $ne: '/' } }, { featured: { $eq: true } }],
          limit: 1,
        }"
        v-slot="{ list }"
      >
        <div v-if="list.length" class="recent-post">
          <img
            v-if="list[0].icon"
            class="icon"
            :src="list[0].icon"
            :alt="`${list[0].title} icon`"
          />
          <h2 class="recent-title">{{ list[0].title }}</h2>
          <p>{{ list[0].description }}</p>
          <!-- <NuxtLink :to="list[0]._path">Read more →</NuxtLink> -->
        </div>
      </ContentList>
    </section>
    <!-- <Table /> -->
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

section.spacing {
  margin: var(--unit) var(--unit) 0;
  border-bottom: var(--border);
  padding-bottom: var(--unit);
}

section h2,
:deep(th) {
  font-size: var(--font-sm);
  opacity: 0.76;
  text-transform: capitalize;
}

:deep(th) {
  font-weight: 600;
  font-size: var(--font-xs);
}

.contact {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem 0.65rem 1.1rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    border-radius: var(--radius-xl);
    border: var(--border);
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #3b3a3a 0%, #2f2e2e 80%);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    will-change: background-size;
  }
}

.contact-button span,
svg {
  position: relative;
  z-index: var(--z1);
}

.tooltip {
  display: flex;
  align-items: center;
  position: absolute;
  top: 3.3rem;
  left: 50%;
  padding: 0.24rem 0.32rem 0.32rem 0.64rem;
  background: var(--bg);
  border: var(--border-light);
  border-radius: var(--radius-md);
  font-size: var(--font-xs);
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-50%) translateY(-8px) scale(0.8);
  transform-origin: top;
  transition: all 200ms ease;
  pointer-events: none;
  z-index: var(--z2);
  box-shadow: var(--shadow-sm);
}

.contact-button:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(1px) scale(0.9);
  transition: all 200ms ease 400ms;
}

.label {
  margin-right: 0.5rem;
  font-size: var(--font-xxs);
  font-weight: 600;
  letter-spacing: 0;
  color: color-mix(in srgb, var(--color-font) 72%, transparent);
}

.key {
  font-size: var(--font-xxs);
  font-weight: 600;
  border-radius: var(--radius-sm);
  padding: 0.2rem 0.7rem;
  background: var(--bg-light);
  border: var(--border);
  text-align: center;
}

.key-secondary {
  display: block;
  margin-left: 0.4rem;
}

.updates-content {
  display: flex;
  gap: var(--unit);
  margin-top: 0.8rem;
}

.updates ul {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  min-width: grid-width(6);
}

.commits {
  display: flex;
  flex-direction: column;
}

.commit-message {
  font-size: var(--font-sm);
}

.commit-date {
  margin-top: -0.1rem;
  margin-left: 1.4rem;
  font-size: var(--font-xs);
  font-weight: 500;
  opacity: 0.76;
}

.updates-thumbnail {
  border-radius: var(--radius-sm);
  // border: 1.5px solid var(--color-font);
  width: grid-width(3.5);
  height: 15.1rem;
  object-fit: cover;
  box-shadow: var(--shadow);
  pointer-events: none;
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
  border: 3px solid var(--bg);
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
    will-change: transform;
    background: linear-gradient(
      228deg,
      #c904ff 10.31%,
      #d8066b 49%,
      #ff941a 91.77%
    );
  }
}

.social-content {
  transform: translateY(-0.1rem);
}

.social-content a {
  display: block;
  margin-top: -0.4rem;
  text-decoration: underline;
}

.social-content a:hover {
  text-decoration: none;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

ul.skeleton-list {
  gap: 0.8rem;
}

.skeleton {
  padding: 0 1rem;
  background: var(--bg-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.9rem 0;
}

.commit-message-skeleton {
  height: 1.2rem;
  width: 80%;
  background: linear-gradient(
    90deg,
    var(--bg-light) 25%,
    color-mix(in srgb, var(--bg-light) 80%, transparent) 50%,
    var(--bg-light) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
  border-radius: var(--radius-sm);
}

.commit-date-skeleton {
  height: 0.9rem;
  width: 40%;
  background: linear-gradient(
    90deg,
    var(--bg-light) 25%,
    color-mix(in srgb, var(--bg-light) 80%, transparent) 50%,
    var(--bg-light) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
  border-radius: var(--radius-sm);
}

.updates-thumbnail.skeleton {
  width: grid-width(3.5);
  height: 15.1rem;
  background: linear-gradient(
    90deg,
    var(--bg-light) 25%,
    color-mix(in srgb, var(--bg-light) 80%, transparent) 50%,
    var(--bg-light) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}

.most-recent {
  margin-bottom: 0.6rem !important;
  border: var(--border) !important;
  border-radius: var(--radius-md);
  padding: 4rem;
  background: rgba(0, 0, 0, 0.2);

  .recent-post {
    margin-top: 0.8rem;

    .icon {
      // width: 2.4rem;
      // height: 2.4rem;
      border-radius: var(--radius-sm);
      border: var(--border);
      object-fit: cover;
    }

    h2 {
      margin: 1.6rem 0 0.1rem;
      font-size: var(--font-sm);
      text-transform: none;
      opacity: 1;
    }

    p {
      font-size: var(--font-sm);
      opacity: 0.76;
      margin-bottom: 0.8rem;
    }

    a {
      font-size: var(--font-sm);
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    }
  }
}

.hide-sm {
}
</style>

<script setup lang="ts">
import { useGithubCommits } from "~/composables/updates";
const { commits, loading } = useGithubCommits();

// Add contact link handler
const handleKeydown = (event: KeyboardEvent) => {
  if (
    (event.metaKey || event.ctrlKey) &&
    (event.key === "c" || event.key === "C")
  ) {
    event.preventDefault();
    window.open(
      "https://www.notion.so/1599d0f43b9881238f64e3211d43c345?pvs=106",
      "_blank"
    );
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

// Random thumbnail
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
