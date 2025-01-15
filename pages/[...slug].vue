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
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.05)),
      var(--bg-url) no-repeat center center;
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
  letter-spacing: 0rem;
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
</style>

<script setup lang="ts">
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

// Randomly select one URL
const randomBgUrl = computed(() => {
  return backgroundUrls[Math.floor(Math.random() * backgroundUrls.length)];
});
</script>
