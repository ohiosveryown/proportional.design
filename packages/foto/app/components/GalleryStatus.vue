<template>
  <div
    v-if="loading"
    class="loadingScreen"
  >
    <svg
      class="spinner"
      viewBox="0 0 50 50"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-dasharray="100 25"
      />
    </svg>
  </div>

  <div
    v-else-if="error"
    class="error"
  >
    Error loading photos: {{ error }}
  </div>

  <div
    v-else-if="empty"
    class="empty"
  >
    No photos yet. Share some from your iPhone!
  </div>
</template>

<script setup>
  defineProps({
    loading: { type: Boolean, default: false },
    error: { type: [String, Object, null], default: null },
    empty: { type: Boolean, default: false },
  })
</script>

<style>
  .error,
  .empty {
    text-align: center;
    padding: 4rem 1rem;
    color: #666;
  }

  .error {
    color: #ff6b6b;
  }

  .loadingScreen {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    background: #0a0a0a;
    z-index: 1500;
  }

  .spinner {
    width: 32px;
    height: 32px;
    color: #fff;
    animation: spin 0.9s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
