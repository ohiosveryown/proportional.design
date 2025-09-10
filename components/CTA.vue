<template>
  <div class="container-cta">
    <button class="cta-btn sans-medium">
      <span class="availability" />
      Available for new projects
      <span class="icon"
        ><svg width="16" height="16" fill="none">
          <path
            fill="var(--content-000)"
            d="M16 11.872c0 .37-.122.683-.367.935a1.198 1.198 0 0 1-.878.367 1.15 1.15 0 0 1-.857-.367 1.293 1.293 0 0 1-.344-.902v-3.96l.167-4.095-1.69 1.891L2.179 15.6c-.267.268-.567.401-.9.401-.223 0-.43-.063-.623-.19a1.512 1.512 0 0 1-.478-.466A1.168 1.168 0 0 1 0 14.72c0-.326.133-.626.4-.9l9.84-9.859 1.902-1.669-4.259.145H4.092c-.341 0-.638-.115-.89-.345a1.135 1.135 0 0 1-.378-.857c0-.334.122-.623.367-.868A1.25 1.25 0 0 1 4.114 0h10.563c.4 0 .719.122.956.367s.356.56.356.946L16 11.872Z"
          /></svg
      ></span>
    </button>
    <footer>Over 100 custom pieces delivered</footer>
  </div>
</template>

<style lang="scss" scoped>
.cta-btn {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  z-index: var(--z1);
  border-radius: 100px;
  padding: 0.67vw 0.67vw 0.67vw 1.44vw;
  font-size: 1vw;
  text-transform: uppercase;
  color: var(--content-000);
  -webkit-text-stroke: 0.15px var(--content-000);
  box-shadow: 0 1.5px 0 0 rgba(255, 255, 255, 0.3) inset,
    0 4px 42px 0 rgba(0, 0, 0, 0.24);
  transition: opacity 0.2s ease;
  will-change: opacity, transform;
  background: linear-gradient(
    180deg,
    rgba(149, 140, 116, 0.3) 0%,
    rgba(69, 112, 93, 0.3) 100%
  );
  backdrop-filter: blur(16px);
  transition: transform 0.2s ease;
  will-change: transform;
}

.cta-btn:hover {
  transform: scale(1.02);
}

.cta-btn:hover .icon {
  transform: scale(0.9);
}

.cta-btn:active {
  transform: scale(0.98);
}

.availability {
  margin-right: 0.2rem;
  border-radius: 100px;
  width: 0.64vw;
  height: 0.64vw;
  background: #b1e847;
  box-shadow: 0 0 12px 4px rgba(177, 232, 71, 0.64);
  transition: transform 0.6s ease;
  will-change: transform;
}

.icon {
  display: grid;
  place-items: center;
  border-radius: 100px;
  padding: 1rem;
  background: var(--base-000);
  box-shadow: 0 1px 1px 0 rgba(255, 255, 255, 0.64) inset;
  transition: transform 0.6s ease;
  will-change: transform;
}

.icon svg {
  transform: scale(0.68);
  opacity: 0.64;
}

footer {
  margin-top: 0.7rem;
  text-align: center;
  font-weight: 500;
  font-size: 1.2rem;
  color: #fff;
  opacity: 0.5;
}
</style>
