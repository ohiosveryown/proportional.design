<template>
  <li class="marketing-card">
    <div class="marketing-content">
      <div class="overlay">
        <div class="tagline-container">
          <span class="kicker">Made the right way</span>
          <p class="tagline serif">
            Built by hand in our Atlanta workshop. Careful craftsmanship built
            to last for generations.
          </p>
          <button class="primary-btn contact-btn sans-medium">
            Start your project
          </button>
        </div>
        <div class="figure">
          <video
            autoplay
            loop
            muted
            playsinline
            src="https://res.cloudinary.com/dn1q8h2ga/video/upload/v1758295573/proportional.design-4.0/vid-02_wlxp5o.mp4"
            poster="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1758295221/proportional.design-4.0/wip-01_guxrcj.webp"
            alt="shop video"
          />
        </div>
      </div>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.overlay {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.overlay:after {
  content: "";
  position: absolute;
  width: 300%;
  height: 300%;
  bottom: -200%;
  left: -100%;
  background: radial-gradient(
    ellipse at center,
    rgba(37, 52, 44, 1) 0%,
    rgba(37, 52, 44, 1) 50%,
    rgba(255, 0, 0, 0) 50%,
    rgba(255, 0, 0, 0) 100%
  );
  pointer-events: none;
}

.tagline-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  z-index: var(--z2);
  bottom: 1.6vw;
  padding: 0 8rem;
}

.kicker {
  margin-bottom: 0.8vw;
  font-size: clamp(1.1rem, 0.8vw, 2.4rem);
  color: #fff;
  opacity: 0.5;
}

.tagline {
  margin-bottom: 1.2vw;
  font-size: 1.6vw;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.25px;
  -webkit-text-stroke: 0.5px var(--content-000);
}

.contact-btn {
  padding: 0.6vw 1.2vw;
  font-size: clamp(1.2rem, 0.7vw, 2.8rem);
  text-transform: uppercase;
  box-shadow: 0 1.5px 0 0 rgba(255, 255, 255, 0.3) inset,
    0 4px 42px 0 rgba(0, 0, 0, 0.24);
  transition: transform 0.2s ease;
  will-change: transform;
}

.contact-btn:hover {
  transform: scale(1.03);
}

.contact-btn:active {
  transform: scale(0.98);
}

.marketing-card:hover video {
  transform: scale(1.05) translateY(-14rem);
}

.figure {
  position: absolute;
  inset: 0;
  min-width: 100%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 9px;
  overflow: hidden;
}

.figure video {
  transform: translateY(-14rem);
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.marketing-card {
  display: none;
  align-self: stretch;
  border-radius: 21px;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  padding: 1.2rem;
  background: #25342c;
  overflow: hidden;
  @include breakpoint(xl) {
    display: block;
    grid-column: span 2;
  }
}

.marketing-content {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  overflow: hidden;

  @include breakpoint(lg) {
    flex-direction: row;
  }
}
</style>
