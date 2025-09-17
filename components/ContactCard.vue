<template>
  <li class="marketing-card">
    <div class="marketing-content">
      <img 
        src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1754594907/proportional.design-4.0/marketing-image.webp" 
        alt="Workshop craftsmanship"
      />
      <div class="marketing-text">
        <p class="tagline">Made the right way</p>
        <h3 class="headline">
          EVERY PIECE IS BUILT BY HAND IN OUR ATLANTA WORKSHOP.<br>
          NO SHORTCUTS, NO MASS PRODUCTION—JUST CAREFUL<br>
          CRAFTSMANSHIP BUILT TO LAST FOR GENERATIONS.
        </h3>
        <button class="cta-button">START YOUR PROJECT</button>
      </div>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.marketing-card {
  grid-column: span 2;
  align-self: stretch;
  
  @include breakpoint(xl) {
    grid-column: span 2;
  }
}

.marketing-content {
  display: flex;
  flex-direction: column;
  border-radius: 21px;
  background: #2b3c33;
  overflow: hidden;
  height: 100%;
  position: relative;
  
  @include breakpoint(lg) {
    flex-direction: row;
  }
}

.marketing-content img {
  width: 100%;
  height: 50%;
  object-fit: cover;
  
  @include breakpoint(lg) {
    width: 50%;
    height: 100%;
  }
}

.marketing-text {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex: 1;
  background: rgba(0, 0, 0, 0.1);
}

.tagline {
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

.headline {
  font-size: 1.4rem;
  line-height: 1.4;
  margin-bottom: 2rem;
  color: #fff;
  
  @include breakpoint(lg) {
    font-size: 1.6rem;
  }
}

.cta-button {
  padding: 0.8rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 100px;
  color: #fff;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
}
</style>