<template>
  <header
    ref="headerEl"
    :class="{ headerVisible }"
  >
    <h1>
      <Logotype /> is a small furniture studio in Atlanta, Georgia, building
      functional objects from sustainable materials since 2016. Contact
      <a
        class="ig"
        href="https://www.instagram.com/proportional.design"
        target="_blank"
      >
        @proportional.design
      </a>
      or
      <button
        type="button"
        class="aquaBtn"
        @click="emit('contact-click')"
      >
        Get in touch
      </button>
    </h1>
  </header>
</template>

<script setup>
  const emit = defineEmits(['contact-click'])

  const headerEl = ref(null)
  const headerVisible = ref(false)
  let headerObserver = null

  watch(headerEl, (el) => {
    if (headerObserver) {
      headerObserver.disconnect()
      headerObserver = null
    }
    if (!el) return
    headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) headerVisible.value = true
      },
      { threshold: 0.2 },
    )
    headerObserver.observe(el)
  })

  onBeforeUnmount(() => headerObserver?.disconnect())
</script>

<style>
  header.headerVisible {
    opacity: 1;
    filter: blur(0);
  }

  header {
    opacity: 0;
    filter: blur(16px);
    transition:
      opacity 0.6s ease-out,
      filter 0.6s ease-out;
    margin: 4rem 0 6.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  header h1 {
    max-width: 800px;
    font-weight: 500;
    font-size: 1.8rem;
    line-height: 1.2;
    letter-spacing: -0.01em;
    text-align: center;
  }

  header p {
    color: #666;
    font-size: 0.875rem;
  }

  .ig {
    background: linear-gradient(
      45deg,
      #feda75 0%,
      #fa7e1e 25%,
      #d62976 50%,
      #962fbf 75%,
      #4f5bd5 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 400;
    text-decoration: underline;
    text-decoration-color: rgba(255, 255, 255, 0.5);
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    text-decoration-style: dotted;
  }

  .aquaBtn {
    position: relative;
    appearance: none;
    border: 0;
    cursor: pointer;
    padding: 0.64rem 1.5rem;
    border-radius: 9999px;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.02em;
    border: 0.5px solid rgba(99, 99, 99, 0.6);
    transform: translateY(4px);
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

    @media (min-width: 640px) {
      transform: translateY(-3px) scale(0.96);
    }
  }

  .aquaBtn::before {
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

  .aquaBtn:hover {
    filter: brightness(1.1);
  }

  .aquaBtn:active {
    transform: translateY(1px);
    filter: brightness(0.95);
  }

  @media (max-width: 640px) {
    header h1 {
      font-size: 2rem;
    }

    header {
      margin: 2rem 0 0;
      padding: 0 1rem calc(1rem + env(safe-area-inset-bottom));
    }
  }
</style>
