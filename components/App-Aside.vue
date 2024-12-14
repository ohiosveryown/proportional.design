<template>
  <aside ref="asideEl" @scroll="handleScroll">
    <header>
      <menu>
        <li>
          <nuxt-link to="/"
            ><img
              class="avatar"
              src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733875450/proportional.design-3.0/avatar_w_3x_j45unb.webp"
              alt="proportional.design avatar"
          /></nuxt-link>
        </li>
        <li>
          <a
            href="https://www.notion.so/1599d0f43b9881238f64e3211d43c345?pvs=106"
            target="_blank"
          >
            <button>Contact</button>
          </a>
        </li>
        <li>
          <button>
            <svg
              class="icon-search"
              xmlns="http://www.w3.org/2000/svg"
              width="31"
              height="20"
              fill="none"
            >
              <g clip-path="url(#a)">
                <path
                  fill="#fff"
                  fill-opacity=".4"
                  fill-rule="evenodd"
                  d="M21.608 11.65a4.88 4.88 0 1 1-6.9-6.9 4.88 4.88 0 0 1 6.9 6.9Zm-7.977 1.223a6.506 6.506 0 1 0-.146-.146l-.502-.502-4.025 4.025a.813.813 0 1 0 1.15 1.15l4.025-4.025-.502-.502Z"
                  clip-rule="evenodd"
                />
              </g>
              <defs>
                <clipPath id="a">
                  <path fill="#fff" d="M.858 0h30v20h-30z" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </li>
      </menu>
    </header>

    <section>
      <h1>
        <title>proportional.design</title>
        <img
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733867671/proportional.design-3.0/logotype_2x_b662tq.webp"
          alt="proportional.design logotype"
          class="logotype"
        />
      </h1>
      <h2>
        A small-fry studio based in Atlanta, Ga building functional objects
        🎨🍑🪑.
      </h2>
    </section>

    <Directory />
  </aside>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

aside {
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: var(--border-radius--lg);
  border: var(--border--light);
  height: max-content;
  padding-bottom: 1rem;
  background: var(--bg);
  box-shadow: var(--shadow--inset);
  overflow-y: scroll;
  @include breakpoint(md) {
    flex: inherit;
    width: 32rem;
    max-height: calc(100vh - 2.4rem);
  }
  @include breakpoint(lg) {
    width: 40rem;
    opacity: 1;
  }
}

header {
  position: sticky;
  top: 0;
  z-index: var(--z1);
  border-bottom: var(--border);
  padding: 1.3rem 1.2rem 1.4rem;
  background: var(--bg--dark);
  backdrop-filter: blur(12px);
}

menu {
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
}

menu li:first-of-type {
  position: relative;
  flex: 1;
  &::after {
    content: "";
    position: absolute;
    bottom: -0.2rem;
    left: 2rem;
    border-radius: 100px;
    border: 1.5px solid rgb(0, 0, 0, 0.8);
    width: 10px;
    height: 10px;
    background: #1dda0f;
  }
}

menu li:nth-of-type(2) {
  padding-right: 1.8rem;
  border-right: var(--border);
  opacity: 0.84;
}

menu button {
  font-size: 1.4rem;
}

.icon-search {
  transform: translateY(0.3rem);
}

.avatar {
  position: relative;
  border-radius: var(--border-radius--md);
  width: 2.8rem;
}

section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 0 1.2rem 1.6rem;
  border-bottom: var(--border);
  padding: 2.4rem 0 2rem;
}

.logotype {
  width: 46%;
  @include breakpoint(md) {
    width: 64%;
  }
  @include breakpoint(lg) {
    width: 54%;
  }
}

h2 {
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 1.4;
  opacity: 0.8;
}
</style>

<script setup>
import { useDebounceFn, useStorage } from "@vueuse/core";
const route = useRoute();
const asideEl = ref(null);
const scrollPosition = useStorage("asideScrollPos", 0);

const handleScroll = useDebounceFn(() => {
  if (asideEl.value) {
    scrollPosition.value = asideEl.value.scrollTop;
    console.log("Saved scroll position:", scrollPosition.value);
  }
}, 150);

// Watch route changes
watch(
  () => route.path,
  async () => {
    await nextTick();
    const savedPos = localStorage.getItem("asideScrollPos");
    if (savedPos && asideEl.value) {
      asideEl.value.scrollTop = parseInt(savedPos);
      // console.log("Restored scroll position:", savedPos);
    }
  }
);

onMounted(async () => {
  await nextTick();
  const savedPos = localStorage.getItem("asideScrollPos");
  if (savedPos && asideEl.value) {
    asideEl.value.scrollTop = parseInt(savedPos);
    // console.log("Initial scroll position:", savedPos);
  }
});

onUnmounted(() => {
  if (asideEl.value) {
    const scrollPos = asideEl.value.scrollTop;
    localStorage.setItem("asideScrollPos", scrollPos);
    // console.log("Saved scroll position on unmount:", scrollPos);
  }
});
</script>
