<template>
  <main
    class="errorPage"
    :class="{ errorPageVisible }"
  >
    <div class="errorContent">
      <p
        class="errorCode"
        aria-hidden="true"
      >
        {{ statusCode }}
      </p>

      <h1 class="errorTitle">{{ title }}</h1>
      <p
        v-if="isNotFound && subtitle"
        class="errorSubtitle"
      >
        {{ subtitle }}
      </p>
      <p
        v-else-if="message"
        class="errorMessage"
      >
        {{ message }}
      </p>

      <button
        type="button"
        class="homeBtn"
        @click="goHome"
      >
        Back to gallery
      </button>
    </div>
  </main>
</template>

<script setup>
  const NOT_FOUND_LINES = [
    "This joint didn't fit.",
    'No piece lives at this address.',
    'We checked the lumber rack. Nothing here.',
    'Wrong grain direction.',
    "Measure twice. This URL wasn't cut once.",
  ]

  const props = defineProps({
    error: {
      type: Object,
      required: true,
    },
  })

  const route = useRoute()

  function hashString(value) {
    let hash = 0
    for (let i = 0; i < value.length; i++) {
      hash = (hash * 31 + value.charCodeAt(i)) | 0
    }
    return Math.abs(hash)
  }

  const statusCode = computed(() => props.error?.statusCode || 500)
  const isNotFound = computed(() => statusCode.value === 404)
  const subtitle = computed(() => {
    if (!isNotFound.value) return ''
    return NOT_FOUND_LINES[hashString(route.path || '/404') % NOT_FOUND_LINES.length]
  })
  const message = computed(() => {
    if (isNotFound.value) return ''
    return props.error?.statusMessage || props.error?.message || 'Something went wrong.'
  })
  const title = computed(() =>
    isNotFound.value ? 'Page not found' : 'Something went wrong',
  )

  useHead({
    title: `${title.value} — Proportional Design`,
    meta: [{ name: 'robots', content: 'noindex' }],
  })

  const errorPageVisible = ref(false)

  onMounted(() => {
    requestAnimationFrame(() => {
      errorPageVisible.value = true
    })
  })

  function goHome() {
    clearError({ redirect: '/' })
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    height: 100vh;
    background: #0a0a0a;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0a0a0a;
    color: #fff;
    min-height: 100vh;
  }

  :focus {
    outline: none;
  }
</style>

<style scoped>
  .errorPage {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem 1.5rem;
    background: #0a0a0a;
    opacity: 0;
    filter: blur(16px);
    transition:
      opacity 0.6s ease-out,
      filter 0.6s ease-out;
  }

  .errorPageVisible {
    opacity: 1;
    filter: blur(0);
  }

  .errorContent {
    position: relative;
    width: min(100%, 28rem);
    text-align: center;
  }

  .errorCode {
    position: absolute;
    inset: 50% auto auto 50%;
    transform: translate(-50%, -58%);
    font-size: clamp(7rem, 28vw, 11rem);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -0.04em;
    color: rgba(255, 255, 255, 0.04);
    pointer-events: none;
    user-select: none;
  }

  .errorTitle {
    position: relative;
    font-size: 1.8rem;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .errorSubtitle {
    position: relative;
    margin-top: 0.65rem;
    color: rgba(255, 255, 255, 0.52);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.4;
  }

  .errorMessage {
    position: relative;
    margin-top: 0.75rem;
    color: #666;
    font-size: 0.95rem;
    line-height: 1.4;
    word-break: break-all;
  }

  .homeBtn {
    position: relative;
    appearance: none;
    border: 0;
    cursor: pointer;
    margin-top: 2rem;
    padding: 0.64rem 1.5rem;
    border-radius: 9999px;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.02em;
    border: 0.5px solid rgba(99, 99, 99, 0.6);
    background: linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 50%, #0f0f0f 100%);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.12) inset,
      0 -1px 0 rgba(0, 0, 0, 0.6) inset,
      0 0 0 1px rgba(0, 0, 0, 0.6),
      0 2px 4px rgba(0, 0, 0, 0.5),
      0 12px 32px rgba(0, 0, 0, 0.55);
    transition:
      transform 0.1s ease,
      filter 0.15s ease;
  }

  .homeBtn::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 6%;
    right: 6%;
    height: 48%;
    border-radius: 9999px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.22) 0%,
      rgba(255, 255, 255, 0.03) 100%
    );
    pointer-events: none;
  }

  .homeBtn:hover {
    filter: brightness(1.1);
  }

  .homeBtn:active {
    transform: translateY(1px);
    filter: brightness(0.95);
  }

  @media (max-width: 640px) {
    .errorTitle {
      font-size: 2rem;
    }
  }
</style>
