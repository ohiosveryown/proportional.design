<template>
  <aside ref="asideEl" @scroll="handleScroll">
    <App-Header />
    <Directory />
  </aside>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

aside {
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius--lg);
  height: max-content;
  padding-bottom: 1rem;
  background: var(--bg);
  box-shadow: var(--shadow--inset);
  overflow-y: scroll;
  @include breakpoint(md) {
    width: 32rem;
    max-height: calc(100vh - 2.4rem);
  }
  @include breakpoint(lg) {
    width: 40rem;
    opacity: 1;
  }
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
