<template>
  <header>
    <h1 class="reader-only">proportional.design</h1>
    <Logotype class="logotype" />

    <img
      class="saint-illustration"
      src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757515092/proportional.design-4.0/saint-01_2x_zqnadq.webp"
      alt="woodworking saint illustration"
    />

    <div class="container-description">
      <img
        src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757515691/proportional.design-4.0/laurel_3x_or3qqb.webp"
        alt=""
        class="laurel-left"
      />
      <h2 class="serif">
        A <span class="sm">(Small-fry)</span> studio based in Atlanta, Georgia,
        building furniture & other functional objects, using locally sourced,
        sustainable materials.
      </h2>
      <img
        src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1757515691/proportional.design-4.0/laurel_3x_or3qqb.webp"
        alt=""
        class="laurel-right"
      />
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  flex-direction: column;
  margin: 2.4rem 1rem 0;
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
  padding: 4rem 0;
  width: 3.2rem;
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
  // font-size: 2rem;
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
  padding: 3.2rem;
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
  // width: 2rem;
  width: 1.32vw;
  height: auto;
}

.laurel-right {
  transform: scaleX(-1);
}
</style>
