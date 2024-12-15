<template>
  <div>
    <button @click="openDialog" class="trigger">
      <svg
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

    <dialog ref="searchDialog">
      <p>Search dialog</p>
      <form method="dialog">
        <button>OK</button>
      </form>
    </dialog>
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

.trigger svg {
  transform: translateY(0.3rem);
}

dialog::backdrop {
  position: fixed;
  z-index: var(--zmax);
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); // Adjust opacity as needed
}

form button {
  color: red;
}
</style>

<script setup>
const searchDialog = ref(null);

const openDialog = () => {
  if (searchDialog.value) {
    searchDialog.value.showModal();
  }
};

// rm
onMounted(() => {
  if (searchDialog.value) {
    searchDialog.value.showModal();
  }
});
</script>
