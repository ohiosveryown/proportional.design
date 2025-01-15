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

    <section class="contact spacing">
      <div class="contact-main">
        <h2>Contact</h2>
        <p>hello@proportional.design</p>
      </div>
      <a
        href="https://www.notion.so/1599d0f43b9881238f64e3211d43c345?pvs=106"
        target="_blank"
      >
        <button
          class="contact-button"
          :style="`--bg-url: url('${randomBgUrl}')`"
        >
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

    <section class="updates spacing">
      <h2>Recent updates</h2>
      <div class="updates-content">
        <ul>
          <li class="commits" v-for="commit in commits" :key="commit.sha">
            <span class="commit-message">• {{ commit.message }}</span>
            <span class="commit-date">{{ commit.date }}</span>
          </li>
        </ul>

        <img
          class="updates-thumbnail"
          :src="randomThumbnail"
          alt="Thumbnail image"
        />
      </div>
    </section>

    <section class="social spacing">
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

    <!-- <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
    </p> -->
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

section h2 {
  font-size: var(--font-sm);
  opacity: 0.76;
  text-transform: capitalize;
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
  padding: 0.5rem 1rem 0.65rem 1.2rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    border-radius: var(--radius-xl);
    border: var(--border);
    width: 100%;
    height: 100%;
    background: var(--bg-url) no-repeat center center;
    background-size: 100%;
    box-shadow: var(--shadow-sm);
    transition: background-size 500ms ease;
    overflow: hidden;
    will-change: background-size;
  }

  &:hover::before {
    background-size: 160%;
    transition: background-size 5s ease;
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
  gap: 0.1rem;
}

.commit-message {
  font-size: var(--font-sm);
}

.commit-date {
  margin-left: 0.9rem;
  font-size: var(--font-xs);
  opacity: 0.76;
}

.updates-thumbnail {
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-font);
  width: grid-width(3.5);
  height: 14rem;
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

// Array of background image URLs
const backgroundUrls = [
  "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1736965327/proportional.design-3.0/icons/btn-bg-01_2x_e5rq3a.webp",
  "https://res.cloudinary.com/dn1q8h2ga/image/upload/v1736967397/proportional.design-3.0/icons/btn-bg-03_2x_icshbx.webp",
];

// Random button bg
const randomBgUrl = computed(() => {
  return backgroundUrls[Math.floor(Math.random() * backgroundUrls.length)];
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
