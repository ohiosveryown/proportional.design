<template>
  <footer>
    <img
      src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757515092/proportional.design-4.0/saint-01_2x_zqnadq.webp"
      alt="saint"
      class="saint-illustration"
    />
    <h4 class="serif">
      Sustainably sourced furniture that actually fits your space.
    </h4>

    <CTA class="cta" />

    <svg
      class="monogram"
      width="201"
      height="201"
      fill="none"
      viewBox="0 0 201 201"
    >
      <path
        fill="var(--primary)"
        d="m61.828 69.938 5.095 2.918v32.377c0 27.202.192 32.945 1.442 35.204 2.308 4.423 5.865 5.647 16.343 5.647h9.133v10.354H29.43v-10.354h9.325c15.862 0 17.88-2.542 17.4-22.119l-.289-11.295-3.844-.282c-13.555-1.13-30.667 9.035-36.82 21.836-11.248 23.436 2.98 50.357 29.128 55.063 3.46.659 20.189 1.035 42.973 1.035 40.279 0 42.202-.188 45.375-4.988 1.346-1.882 1.538-4.801 1.345-17.226l-.288-14.964-12.017-6.778c-6.634-3.765-19.034-10.824-27.59-15.53l-15.67-8.754v-5.836c0-3.294.192-5.93.385-5.93.205.008 14.812 8.194 32.396 18.166 47.394 26.92 44.318 25.32 50.663 25.414 6.633 0 12.209-2.447 16.343-7.341 6.441-7.718 6.537-18.26.096-25.32-1.538-1.788-2.787-3.577-2.787-4.047 0-.471 1.538-2.259 3.364-4.047 2.884-2.73 3.461-2.919 4.807-1.883 3.364 2.729 7.306 9.507 8.748 15.154 6.248 23.907-18.073 44.803-41.722 35.861l-4.999-1.882v11.483c0 9.036.288 11.859 1.538 13.647 2.499 3.389 7.114 4.801 16.246 4.801h8.172v10.354h-62.295c-59.026 0-62.775-.095-69.793-1.883-4.134-1.035-9.71-3.012-12.401-4.424-6.73-3.482-17.882-14.589-21.054-20.989-9.806-19.484-6.248-41.603 8.94-56.568 9.422-9.225 19.612-13.743 33.263-14.684l7.98-.565.191-17.225.29-17.225zM91.945.677c59.026 0 62.776.094 69.793 1.883 4.134 1.035 9.71 3.012 12.402 4.423 6.729 3.483 17.88 14.59 21.052 20.99 9.806 19.483 6.249 41.602-8.94 56.568-9.421 9.224-19.611 13.742-33.262 14.684l-7.979.564-.193 17.226-.288 17.224-4.999-2.824-5.094-2.918V96.119c0-27.202-.193-32.944-1.443-35.203-2.307-4.424-5.864-5.647-16.343-5.647h-9.132V44.915h64.41v10.354h-9.325c-15.863 0-17.882 2.541-17.401 22.119l.288 11.295 3.846.282c13.555 1.13 30.667-9.035 36.819-21.836 11.248-23.437-2.98-50.357-29.129-55.064-3.461-.658-20.188-1.035-42.971-1.035-40.28 0-42.203.189-45.375 4.989-1.346 1.882-1.538 4.8-1.346 17.225l.288 14.965 12.017 6.777c6.633 3.765 19.034 10.824 27.59 15.53l15.67 8.754v5.836c0 3.294-.192 5.929-.384 5.93-.193 0-14.805-8.189-32.398-18.166-47.393-26.919-44.317-25.32-50.662-25.414-6.633 0-12.209 2.448-16.343 7.342-6.44 7.718-6.537 18.26-.096 25.32 1.538 1.788 2.788 3.576 2.788 4.047s-1.538 2.259-3.365 4.047c-2.883 2.73-3.46 2.918-4.806 1.883-3.365-2.73-7.307-9.507-8.75-15.155C2.637 51.033 26.96 30.137 50.608 39.08l5 1.882V29.478c0-9.035-.29-11.859-1.539-13.647-2.5-3.388-7.114-4.8-16.247-4.8h-8.17V.676z"
      />
    </svg>
    <!-- <p>
      &copy; {{ new Date().getFullYear() }} proportional.design. All rights
      reserved.
    </p> -->

    <video
      autoplay
      loop
      muted
      playsinline
      src="https://res.cloudinary.com/dn1q8h2ga/video/upload/v1759415787/proportional.design-4.0/footer-bg_tijacu.mp4"
      alt="footer-video"
      class="footer-bg"
    />

    <!-- <img
      src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1759414977/proportional.design-4.0/footer-bg_2x_aiqa3j.webp"
      alt="footer-bg"
      class="footer-bg"
    /> -->
  </footer>
</template>

<style lang="scss" scoped>
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  position: relative;
  margin-top: 16rem;
  // border-radius: 2.4rem;
  padding: 18rem 6.4rem 16rem;
  // min-width: 100vw;
  // width: 100vw;
  // background: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1759414977/proportional.design-4.0/footer-bg_2x_aiqa3j.webp")
  //   no-repeat center center;
  // background-size: cover;
}

footer::before {
  content: "";
  position: absolute;
  z-index: var(--z2);
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(180deg, #1c2822 0%, rgba(28, 40, 34, 0) 100%);
  pointer-events: none;
}

footer::after {
  content: "";
  position: absolute;
  z-index: var(--z2);
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(180deg, rgba(28, 40, 34, 0) 0%, #1c2822 100%);
  pointer-events: none;
}

.footer-bg {
  position: absolute;
  z-index: var(--z1);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.saint-illustration,
.monogram {
  position: relative;
  z-index: var(--z2);
  width: 2vw;
  height: auto;
}

.monogram {
  margin-top: 2rem;
  width: 1.4vw;
  height: auto;
  opacity: 1;
}

h4 {
  position: relative;
  z-index: var(--z2);
  width: 24ch;
  text-align: center;
  font-size: clamp(1.2rem, 2.8vw, 4.2rem);
  line-height: 1.2;
}

.cta {
  position: relative !important;
  z-index: var(--z2) !important;
}
</style>
