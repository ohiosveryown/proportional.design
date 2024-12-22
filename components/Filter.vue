<template>
  <menu class="custom-select" :tabindex="isOpen ? -1 : 0" @blur="closeDropdown">
    <button
      class="select-button"
      :class="{ 'is-open': isOpen }"
      @click="toggleDropdown"
      :aria-expanded="isOpen"
    >
      <svg class="icon--filter" width="20" height="20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="#fff" />
        <path
          stroke="#fff"
          stroke-linecap="round"
          d="M6 8h8M6.8 10.4h6.4M8 12.8h4"
        />
      </svg>
      <span class="label">Sort:</span>
      <span>{{ selectedOption.label }}</span>
    </button>

    <ul class="options-list" v-if="isOpen" role="listbox">
      <li
        v-for="option in options"
        :key="option.value"
        class="option"
        role="option"
        :aria-selected="modelValue === option.value"
        @click="selectOption(option.value)"
      >
        {{ option.label }}
      </li>
    </ul>
  </menu>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

menu {
  width: 100%;
}

.custom-select {
  position: relative;
}

.select-button.is-open {
  opacity: 1;
}

.select-button {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 1rem;
  border: none;
  width: calc(100% - 1.8rem);
  padding: 1.1rem 0.8rem 1.1rem 1.4rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color--primary);
  opacity: 0.76;
  border-radius: var(--border-radius--sm);
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.32);
    opacity: 1;
  }
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: absolute;
  z-index: var(--z1);
  top: 3.2rem;
  left: 1.8rem;
  margin-top: 0.4rem;
  min-width: 16rem;
  border: var(--border);
  border-radius: var(--border-radius--sm);
  padding: 0.4rem;
  background: var(--bg--vdark);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
}

.option {
  padding: 0.6rem 0.8rem;
  border-radius: var(--border-radius--sm);
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color--primary);
  opacity: 0.76;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    opacity: 1;
  }

  &[aria-selected="true"] {
    background: rgba(255, 255, 255, 0.24);
    opacity: 1;
  }
}
</style>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
const isOpen = ref(false);

const options = [
  { label: "Last Updated", value: "updated" },
  { label: "A-Z", value: "asc" },
  { label: "Z-A", value: "desc" },
];

const selectedOption = computed(
  () => options.find((opt) => opt.value === props.modelValue) || options[0]
);

const toggleDropdown = () => (isOpen.value = !isOpen.value);
const closeDropdown = () => (isOpen.value = false);

const selectOption = (value) => {
  emit("update:modelValue", value);
  closeDropdown();
};
</script>
