<template>
  <div class="controls">
    <div class="popover">
      <span
        class="popover-trigger"
        @click="isOpen = !isOpen"
        @click.stop="togglePopover"
        @click.outside="handleClickOutside"
        ref="triggerRef"
      >
        <svg width="20" height="20" fill="none">
          <path
            fill="#fff"
            fill-rule="evenodd"
            d="M13.13 7.477a.995.995 0 0 0-.014-.977 1 1 0 1 0 .013.977Zm1.057.023a2 2 0 0 1-3.874 0H4.5a.5.5 0 0 1 0-1h5.813a2 2 0 0 1 3.874 0H15.5a.5.5 0 0 1 0 1h-1.313Zm-7.303 6a1 1 0 1 0 1.731-1 1 1 0 0 0-1.731 1Zm-1.071-1H4.5a.5.5 0 0 0 0 1h1.313a2 2 0 0 0 3.874 0H15.5a.5.5 0 0 0 0-1H9.687a2 2 0 0 0-3.874 0Z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="label-filter">Filter & Sort</span>
        <span class="label-configure">Configure</span>
        <span
          class="popover-trigger-indicator"
          :class="{ active: hasActiveFilters }"
        />
      </span>

      <menu
        :class="{ 'is-open': isOpen }"
        ref="popoverRef"
        tabindex="-1"
        @keydown.esc="closePopover"
        @mouseleave="handleMouseLeave"
        @click.stop
        @scroll.stop
      >
        <!-- sort controls -->
        <section>
          <header>Sort by</header>
          <label
            v-for="option in sortOptions"
            :key="option.value"
            :class="{ active: sort === option.value }"
          >
            <input
              type="radio"
              :value="option.value"
              :checked="sort === option.value"
              @change="$emit('update:sort', option.value)"
              name="sort-option"
            />
            {{ option.label }}
          </label>
        </section>

        <section>
          <header>Filter by</header>
          <label
            v-for="filter in filterOptions"
            :key="filter.value"
            :class="{ active: selectedFilters.includes(filter.value) }"
          >
            <input
              type="checkbox"
              :value="filter.value"
              :checked="selectedFilters.includes(filter.value)"
              @change="toggleFilter(filter.value)"
            />
            {{ filter.label }}
          </label>
        </section>
      </menu>
    </div>

    <!-- segmented controls -->
    <div class="segmented-controls">
      <button @click="$emit('toggle', false)" :class="{ active: isCollapsed }">
        Collapse
      </button>
      <button :class="['mixed', { active: isMixed }]">Mixed</button>
      <button @click="$emit('toggle', true)" :class="{ active: isExpanded }">
        Expand
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

.controls {
  position: sticky;
  z-index: var(--z1);
  top: 5.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  padding: 1.2rem 1.2rem 1rem 0.9rem;
  background: var(--bg-vdark);
  @include breakpoint(md) {
    box-shadow: var(--shadow-sm);
  }
}

.label-filter {
  @include breakpoint(md) {
    display: none;
  }
  @include breakpoint(lg) {
    display: block;
  }
}

.label-configure {
  display: none;
  @include breakpoint(md) {
    display: block;
  }
  @include breakpoint(lg) {
    display: none;
  }
}

span.popover-trigger {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  position: relative;
  border-radius: var(--radius-md);
  padding: 0.5rem 0.8rem 0.5rem 0.5rem;
  font-size: var(--font-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}

span.popover-trigger:hover {
  background: var(--bg-light);
}

span.popover-trigger-indicator {
  margin-top: 0.2rem;
  margin-left: 0.4rem;
  width: 0.7rem;
  height: 0.7rem;
  background: var(--color-active);
  border-radius: var(--radius-xl);
  opacity: 0;
  transition: opacity 300ms ease;
}

span.popover-trigger-indicator.active {
  opacity: 1;
}

span.popover-trigger:hover {
  opacity: 1;
}

.segmented-controls {
  display: flex;
  gap: 0.4rem;
  border-radius: var(--radius-md);
  padding: 0.24rem 0.24rem 0.28rem;
  width: max-content;
  background-color: var(--bg-light);
}

.segmented-controls button {
  border-radius: 0.7rem;
  padding: 0.5rem 0.9rem 0.55rem;
  font-size: var(--font-xs);
  font-weight: 500;
  opacity: 0.76;
}

.segmented-controls button:hover {
  background-color: var(--bg-dark);
  opacity: 1;
}

.segmented-controls .active {
  border: var(--border);
  background-color: var(--bg-vdark);
  box-shadow: var(--shadow-sm);
  text-shadow: none;
  opacity: 1;
}

.segmented-controls .active:hover {
  background-color: var(--bg-vdark);
}

.segmented-controls .mixed {
  pointer-events: none;
}

.popover menu {
  display: flex;
  flex-direction: column;
  background: var(--bg);
  position: fixed;
  top: 34rem;
  left: 2rem;
  border: var(--border-dark);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
  max-height: 30rem;
  min-width: 19.2rem;
  padding: 1rem 0.8rem;
  opacity: 0;
  overflow-y: auto;
  transform: translateY(-1rem) scale(0.95);
  transform-origin: top;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  will-change: opacity, transform;
  z-index: var(--z1);
  @include breakpoint(md) {
    top: 23rem;
    max-height: 33.7rem;
  }
}

.popover menu.is-open {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

menu header {
  gap: 0.6rem;
  padding: 0.24rem 0 0.4rem 0.5rem;
  opacity: 0.56;
  font-size: var(--font-xxs);
  text-transform: uppercase;
  font-weight: 600;
  pointer-events: none;
}

menu section {
  border-bottom: var(--border-dark);
  padding-bottom: 1rem;
}

menu section:last-child {
  border-bottom: none;
  padding: 1rem 0 0;
}

.popover menu label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-radius: var(--radius-sm);
  padding: 0.3rem 0.3rem 0.4rem;
  font-size: var(--font-sm);
  font-weight: 500;
  opacity: 0.76;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.popover menu label:has(input:checked) {
  opacity: 1;
}

.popover menu label:hover {
  background: var(--bg-dark);
  opacity: 1;
}

input[type="radio"] {
  position: relative;
  appearance: none;
  margin-top: 0.4rem;
  border-radius: 100px;
  border: none;
  min-width: 16px;
  min-height: 16px;
  width: 16px;
  height: 16px;
  background: transparent;

  &:checked::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    width: 7px;
    height: 7px;
    background: var(--color-font);
    transform: translate(-50%, -50%);
  }

  &:checked {
    border: var(--border-dark);
    background: var(--bg-dark);
    & + label {
      opacity: 1;
    }
  }
}

input[type="checkbox"] {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 6px;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  border: none;
  background: transparent;

  &:checked {
    &::after {
      content: "✓";
      color: transparent;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: 0.2rem;
      font-size: 14px;
      transform: translate(-50%, -50%);
      background: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1735221728/proportional.design-3.0/checkbox_ls5w2x.svg")
        no-repeat center center;
      background-size: cover;
    }

    & + label {
      opacity: 1;
    }
  }
}
</style>

<script setup lang="ts">
const props = defineProps<{
  isExpanded: boolean;
  isCollapsed: boolean;
  sort: string;
  selectedFilters: string[];
}>();

const popoverRef = ref(null);
const triggerRef = ref(null);
const isOpen = ref(false);

// menu
const handleMouseLeave = () => {
  isOpen.value = false;
};

const handleClickOutside = (e) => {
  if (
    popoverRef.value &&
    !popoverRef.value.contains(e.target) &&
    !triggerRef.value.contains(e.target)
  ) {
    isOpen.value = false;
  }
};

const handleScroll = (e) => {
  if (popoverRef.value && !popoverRef.value.contains(e.target)) {
    isOpen.value = false;
  }
};

const isMixed = computed(() => !props.isExpanded && !props.isCollapsed);
const emit = defineEmits(["toggle", "update:sort", "update:selectedFilters"]);

// Add sort method ref
const sortMethod = ref("newest");

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
];

// filtering
const { data: allTags } = useAsyncData("tags", async () => {
  const posts = await queryContent().find();
  const tags = new Set(posts.flatMap((post) => post.tags || []));
  return Array.from(tags).sort();
});

const filterOptions = computed(() =>
  (allTags.value || []).map((tag) => ({
    value: tag,
    label: tag.charAt(0).toUpperCase() + tag.slice(1),
  }))
);

const toggleFilter = (value: string) => {
  const newFilters = props.selectedFilters.includes(value)
    ? props.selectedFilters.filter((f) => f !== value)
    : [...props.selectedFilters, value];
  emit("update:selectedFilters", newFilters);
};

const hasActiveFilters = computed(() => props.selectedFilters.length > 0);

// event listeners
onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("scroll", handleScroll, true);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("scroll", handleScroll, true);
});
</script>
