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

<style lang="scss">
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
  padding: 0.6rem 1.7rem 0.7rem 1rem;
  cursor: default;
}

menu button span {
  font-size: var(--font-xs);
  font-weight: 500;
  letter-spacing: -0.025rem;
}

menu button.contact {
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
  margin: 0 1.2rem 0.65rem;
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

onMounted(() => {
  // segmented controls
  document.addEventListener("toggle", updateButtonStates, true);
});

onUnmounted(() => {
  // segmented controls
  document.removeEventListener("toggle", updateButtonStates, true);
});

// Sorting
const sortMethod = ref("newest");

const selectedFilters = ref<string[]>([]);
</script>
