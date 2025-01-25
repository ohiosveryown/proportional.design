<template>
  <aside class="container">
    <nav class="">
      <nuxt-link to="/">
        <div class="logo" />
      </nuxt-link>

      <menu>
        <Search />

        <a
          href="https://www.notion.so/1599d0f43b9881238f64e3211d43c345?pvs=106"
          target="_blank"
        >
          <button class="contact">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.5">
                <path
                  d="M2.33325 4L7.38532 8.2544C7.75919 8.5692 8.30592 8.56767 8.67799 8.2506L13.6666 4M2.83325 13.1667H13.1666C13.7189 13.1667 14.1666 12.7189 14.1666 12.1667V4.5C14.1666 3.94771 13.7189 3.5 13.1666 3.5H2.83325C2.28097 3.5 1.83325 3.94771 1.83325 4.5V12.1667C1.83325 12.7189 2.28097 13.1667 2.83325 13.1667Z"
                  stroke="#E6E6E6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>

            <span>Contact</span>
            <span class="tooltip">
              <span class="label">Contact</span>
              <span class="key">⌘</span>
              <span class="key key-secondary">C</span>
            </span>
          </button>
        </a>
      </menu>
    </nav>

    <header>
      <h1>
        <title>proportional.design</title>
        <img
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733867671/proportional.design-3.0/logotype_2x_b662tq.webp"
          alt="proportional.design logotype"
          class="logotype"
        />
      </h1>
      <h2>
        A small-fry studio based in Atlanta, Ga building functional furniture
        🎨🍑🪑.
      </h2>
    </header>

    <Filter
      @toggle="toggleAll"
      :is-expanded="allExpanded"
      :is-collapsed="allCollapsed"
      :sort="sortMethod"
      :selected-filters="selectedFilters"
      @update:sort="sortMethod = $event"
      @update:selected-filters="selectedFilters = $event"
    />
    <Directory :sort-method="sortMethod" :selected-filters="selectedFilters" />
  </aside>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

aside.container {
  @include breakpoint(md) {
    flex: inherit;
    min-width: 32rem;
    width: 32rem;
    max-height: calc(100vh - 2.4rem);
  }
  @include breakpoint(lg) {
    min-width: 40rem;
    width: 40rem;
    opacity: 1;
  }
}

nav .logo {
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

nav menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

menu button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0rem;
  border-radius: var(--radius-xl);
  padding: 0.6rem 1.6rem 0.7rem 1.2rem;
  cursor: pointer;
}

menu button span {
  font-size: var(--font-xs);
  font-weight: 500;
  letter-spacing: -0.025rem;
}

menu button.contact {
  position: relative;
  background: var(--bg-vdark);
  transition: box-shadow 300ms ease;
  box-shadow: rgba(134, 143, 151, 0.2) 0px 0px 0px 0.25px inset,
    rgba(134, 143, 151, 0.72) 1px 1px 0px -0.5px inset,
    rgba(134, 143, 151, 0.72) -1px -1px 0px -0.5px inset;
}

menu button.contact:hover {
  box-shadow: rgba(134, 143, 151, 0.7) 0px 0px 0px 0.25px inset,
    rgba(134, 143, 151, 0.9) 1px 1px 0px -0.5px inset,
    rgba(134, 143, 151, 0.9) -1px -1px 0px -0.5px inset;
}

nav ~ header {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 0 1.2rem;
  border-bottom: var(--border);
  padding: 2.4rem 0 2rem;
}

nav ~ header .logotype {
  width: 46%;
  @include breakpoint(md) {
    width: 64%;
  }
  @include breakpoint(lg) {
    width: 54%;
  }
}

nav ~ header h2 {
  opacity: 0.76;
}

.tooltip {
  display: flex;
  align-items: center;
  position: absolute;
  top: 116%;
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
  box-shadow: var(--shadow-sm);
}

button:hover .tooltip {
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
// segmented controls
const allExpanded = ref(false);
const allCollapsed = ref(true);
const updateButtonStates = () => {
  const details = document.querySelectorAll("details");
  allExpanded.value = Array.from(details).every((detail) => detail.open);
  allCollapsed.value = Array.from(details).every((detail) => !detail.open);
};
const toggleAll = (expanded: boolean) => {
  document.querySelectorAll("details").forEach((detail) => {
    detail.open = expanded;
  });
  updateButtonStates();
};

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
  // segmented controls
  document.addEventListener("toggle", updateButtonStates, true);
  // Add keyboard listener
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  // segmented controls
  document.removeEventListener("toggle", updateButtonStates, true);
  // Remove keyboard listener
  window.removeEventListener("keydown", handleKeydown);
});

// Sorting
const sortMethod = ref("newest");

const selectedFilters = ref<string[]>([]);
</script>
