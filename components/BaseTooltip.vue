<template>
  <div class="tooltip-container" @mouseenter="show" @mouseleave="hide">
    <slot></slot>
    <div
      class="tooltip"
      :class="position"
      :style="tooltipStyle"
      :data-show="isVisible"
    >
      <slot name="content">{{ content }}</slot>
    </div>
  </div>
</template>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  z-index: var(--z1);
  border-radius: var(--radius-md);
  border: var(--border-light);
  padding: 0.5rem 1rem 0.55rem;
  font-size: var(--font-xs);
  font-weight: 500;
  color: var(--color-font);
  background: var(--bg);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  box-shadow: var(--shadow);
  transition: opacity 150ms ease-in-out, transform 150ms ease-in-out;
}

.tooltip[data-show="true"] {
  opacity: 1;
}

.tooltip[data-show="true"].top {
  transform: translateX(-50%) translateY(calc(-1 * var(--tooltip-offset)));
}

.tooltip[data-show="true"].bottom {
  transform: translateX(-50%) translateY(var(--tooltip-offset));
}

.tooltip[data-show="true"].left {
  transform: translateY(-50%) translateX(calc(16px + var(--tooltip-offset)));
}

.tooltip[data-show="true"].right {
  transform: translateY(-50%) translateX(var(--tooltip-offset));
}

.tooltip.top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(calc(var(--tooltip-offset) + 4px));
}

.tooltip.bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(calc(-1 * var(--tooltip-offset) - 4px));
}

.tooltip.left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(calc(var(--tooltip-offset) + 24px));
}

.tooltip.right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(calc(-1 * var(--tooltip-offset) - 4px));
}
</style>

<script setup lang="ts">
interface Props {
  content?: string;
  position?: "top" | "bottom" | "left" | "right";
  offset?: number;
  delay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  position: "top",
  offset: 2,
  delay: 0,
});

const isVisible = ref(false);
const tooltipStyle = computed(() => ({
  "--tooltip-offset": `${props.offset}px`,
}));

const show = () => {
  setTimeout(() => {
    isVisible.value = true;
  }, props.delay);
};

const hide = () => {
  isVisible.value = false;
};
</script>
