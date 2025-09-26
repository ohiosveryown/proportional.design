<template>
  <header>
    <h1 class="reader-only">proportional.design</h1>
    <Logotype class="logotype" />

    <div class="container-description" ref="descriptionRef">
      <img
        src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757515691/proportional.design-4.0/laurel_3x_or3qqb.webp"
        alt=""
        class="laurel-left"
      />
      <h2 class="serif">
        A <span class="sm">(small-fry)</span> studio based in Atlanta, Georgia,
        building furniture & other functional objects, using locally sourced,
        sustainable materials.
      </h2>
      <img
        src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757515691/proportional.design-4.0/laurel_3x_or3qqb.webp"
        alt=""
        class="laurel-right"
      />
    </div>

    <div class="cta" ref="ctaRef">
      <CTA />
    </div>
    <span class="arrow" />
  </header>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4.4vh 1rem 0;
  transform: scale(0.92);
  transform-origin: center top;
}

.logotype {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.reader-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  pointer-events: none;
}

.saint-illustration {
  margin: 0 auto;
  padding: 1.2rem 0 4.4rem;
  width: 2.8rem;
  height: auto;
}

h2 {
  // font-size: 3.2rem;
  font-size: 2vw;
  line-height: 1.1;
  text-align: center;
  color: var(--content-100);
}

h2 .sm {
  font-size: 1.2vw;
  color: var(--content-100);
}

.container-description {
  display: flex;
  gap: 1.6rem;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 4rem 0 4.8rem;
  padding: 3.2rem;
  clip-path: polygon(0 0, 0% 0, 0% 100%, 0 100%);
  transition: clip-path 1s cubic-bezier(0.8, 0, 0.16, 1) 0.3s;
}

.container-description.revealed {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.container-description::before,
.container-description::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(70, 114, 94, 0) 0%,
    #46725e 50%,
    rgba(70, 114, 94, 0) 100%
  );
}

.container-description::after {
  top: auto;
  bottom: 0;
}

.laurel-left,
.laurel-right {
  width: 1.2vw;
  height: auto;
}

.laurel-right {
  transform: scaleX(-1);
}

.cta {
  clip-path: polygon(0 0, 0% 0, 0% 100%, 0 100%);
  transition: clip-path 1s cubic-bezier(0.8, 0, 0.16, 1) 0.4s;
}

.cta.revealed {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.arrow {
  margin-top: 3.2rem;
  width: 1px;
  height: 20rem;
  background: var(
    --gradient-02,
    linear-gradient(180deg, rgba(70, 114, 94, 0) 0%, #46725e 40%)
  );
}
</style>

<script setup>
const descriptionRef = ref(null);
const ctaRef = ref(null);

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    {
      threshold: 0,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  nextTick(() => {
    if (descriptionRef.value) {
      observer.observe(descriptionRef.value);
    }

    if (ctaRef.value) {
      observer.observe(ctaRef.value);
    }
  });

  onUnmounted(() => {
    observer.disconnect();
  });
});
</script>
