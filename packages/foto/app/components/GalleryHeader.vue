<template>
  <footer
    ref="footerEl"
    class="galleryFooter"
    :class="{ galleryFooterVisible }"
  >
    <BrandMark />

    <p class="galleryFooterCopy">
      <span class="galleryFooterBrand">proportional.design</span>
      <span class="galleryFooterMuted">
        is a small furniture studio in Atlanta, Georgia, building functional
        objects from sustainable materials since 2016. Contact
      </span>
      <a
        class="galleryFooterIg plausible-event-name=Instagram+Click"
        href="https://www.instagram.com/proportional.design"
        target="_blank"
        rel="noopener noreferrer"
      >
        @proportional.design
      </a>
      <span class="galleryFooterMuted"> or click the button below.</span>
    </p>

    <button
      type="button"
      class="aquaBtn"
      @click="emit('contact-click')"
    >
      <span class="aquaBtnLabel">Get in touch</span>
    </button>
  </footer>
</template>

<style scoped>
  .galleryFooter {
    container-type: inline-size;
    container-name: gallery-footer;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
    margin: 8rem 0 6.4rem;
    width: 100%;
    opacity: 0;
    filter: blur(16px);
    transition:
      opacity 0.6s ease-out,
      filter 0.6s ease-out;
  }

  .galleryFooterVisible {
    opacity: 1;
    filter: blur(0);
  }

  .galleryFooterCopy {
    width: 100%;
    max-width: none;
    color: #fff;
    /* 43px at 1280px container — scales to fill parent on large displays */
    font-size: clamp(2rem, 3.359cqi, 4.8rem);
    font-weight: 500;
    letter-spacing: -0.045em;
    line-height: 0.98;
    text-wrap: pretty;
  }

  .galleryFooterBrand {
    color: #fff;
  }

  .galleryFooterMuted {
    color: rgba(255, 255, 255, 0.6);
  }

  .galleryFooterIg {
    color: #fff;
    font-weight: 500;
    text-decoration: underline;
    text-decoration-color: rgba(255, 255, 255, 0.4);
    text-decoration-thickness: 4%;
    text-underline-offset: 0.12em;
    text-decoration-style: dotted;
  }

  .aquaBtn {
    position: relative;
    isolation: isolate;
    display: flex;
    align-items: center;
    justify-content: center;
    appearance: none;
    margin: 0.6rem 0 0;
    padding: 1.15rem 1.6rem;
    border: 0;
    border-radius: 9999px;
    color: #fff;
    background: linear-gradient(180deg, #444 0%, #000 100%);
    box-shadow:
      0 13px 43px rgba(0, 0, 0, 0.09),
      0 2px 5px rgba(0, 0, 0, 0.05);
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    transition:
      transform 0.1s ease,
      filter 0.15s ease;
  }

  .aquaBtnLabel {
    position: relative;
    z-index: 1;
  }

  .aquaBtn::before {
    content: '';
    position: absolute;
    z-index: 0;
    top: 1px;
    left: 50%;
    width: 89%;
    height: 58%;
    border-radius: 9999px;
    background: linear-gradient(
      180deg,
      #545252 0%,
      rgba(104, 104, 104, 0) 100%
    );
    transform: translateX(-50%);
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
    .galleryFooter {
      gap: 2rem;
      margin: 2rem 0 0;
      padding: 0 1rem calc(1rem + env(safe-area-inset-bottom));
    }

    .galleryFooterCopy {
      font-size: 1.25rem;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .aquaBtn {
      padding: 0.85rem 1.35rem;
      font-size: 0.9375rem;
    }
  }
</style>

<script setup>
  const emit = defineEmits(['contact-click'])

  const footerEl = ref(null)
  const galleryFooterVisible = ref(false)
  let footerObserver = null

  watch(footerEl, (el) => {
    if (footerObserver) {
      footerObserver.disconnect()
      footerObserver = null
    }
    if (!el) return
    footerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) galleryFooterVisible.value = true
      },
      { threshold: 0.2 },
    )
    footerObserver.observe(el)
  })

  onBeforeUnmount(() => footerObserver?.disconnect())
</script>
