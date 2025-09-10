<template>
  <div class="diamond-row">
    <div class="diamond-image">
      <img
        src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757432809/proportional.design-4.0/preview-thumbnails/preview-01_ydyo89.webp"
        alt=""
      />
    </div>
    <div class="diamond-image">
      <img
        src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757432812/proportional.design-4.0/preview-thumbnails/preview-02_e74y7f.webp"
        alt=""
      />
    </div>
    <div class="diamond-image">
      <img
        src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757432822/proportional.design-4.0/preview-thumbnails/preview-03_sjbhau.webp"
        alt=""
      />
    </div>
    <div class="diamond-image">
      <img
        src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757432826/proportional.design-4.0/preview-thumbnails/preview-04_iwp7ks.webp"
        alt=""
      />
    </div>
    <div class="diamond-image">
      <img
        src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757432829/proportional.design-4.0/preview-thumbnails/preview-05_mwx4wh.webp"
        alt=""
      />
    </div>
    <div class="label primary-btn sans-medium">
      <span class="plus">+</span>
      more
    </div>
  </div>
</template>

<style lang="scss" scoped>
.diamond-row {
  display: flex;
  gap: 0;
  align-items: center;
  width: max-content;
  transform: scale(0.88);
}

.diamond-image {
  border-radius: 0.88vw;
  border: 0.32vw solid var(--base-000);
  width: 2.8vw;
  height: 2.8vw;
  transform: rotate(45deg);
  overflow: hidden;
  transition: transform 0.3s ease;

  img {
    width: 150%;
    height: 150%;
    object-fit: cover;
    transform: rotate(-45deg) scale(1.6);
  }

  &:hover {
    transform: rotate(35deg) translate(-0.3rem, -0.3rem);
  }
}

.diamond-image:not(:first-child) {
  margin-left: -1.2vw;
}

.label {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -1vw;
  border: 0.32vw solid var(--base-000);
  padding: 0 1.5vw 0.05vw 1vw;
  height: 3.2vw;
  font-size: 1.3rem;
  font-size: 1vw;
  text-transform: uppercase;
  transition: transform 0.3s ease;
}

.label:hover {
  transform: scale(1.08);
}

.label .plus {
  font-size: 1.6rem;
  font-size: 1.3vw;
  margin: -0.3rem 0.2rem 0 0;
}
</style>
