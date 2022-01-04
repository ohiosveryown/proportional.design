<template>
  <section>
    <header>
      <span @mouseenter="hover = true" @mouseleave="hover = false"
        >Finished Projects</span
      >
      <span :class="{ hoverStyle: hover }" class="tooltip">
        Here are some projects I've wrapped up recently 📏</span
      >
    </header>
    <ul>
      <li v-for="article of articles" :key="article.slug">
        <NuxtLink :to="'/projects/' + article.slug">
          <figure><img :src="`${article.hero}`" /></figure>
          <span class="title">{{ article.title }}</span>
        </NuxtLink>
      </li>
      <li>
        <a href="https://instagram.com/proportional.design" target="_blank">
          <figure class="ig">
            <img
              src="https://res.cloudinary.com/da32ufmnf/image/upload/f_auto,q_50/v1641083808/proportional.design-v2/lzxlxkm3hmdsd9i9j8ao.png"
              alt=""
            />
          </figure>
          <span class="title">Instagram</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
  @import "~static/style/grid.scss";

  @media (pointer: coarse) {
    .tooltip {
      display: none;
    }
  }

  .ig {
    position: relative;
  }

  .ig:before,
  .ig:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: var(--zmin);
    background: url("data:image/svg+xml,%3Csvg width='154' height='154' viewBox='0 0 154 154' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='77' cy='77' r='73.5' stroke='url(%23paint0_linear_1713_2456)' stroke-width='4'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_1713_2456' x1='16' y1='19.5' x2='139.5' y2='141' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0.000446688' stop-color='%23E27329'/%3E%3Cstop offset='0.479167' stop-color='%23923FAA'/%3E%3Cstop offset='1' stop-color='%231B6ADF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E")
      no-repeat center center;
    background-size: 100%;
    transform: scale(1.2);
    transform-origin: center;
    animation: 2.5s pulse ease-in-out infinite;
  }

  .ig:before {
    animation-delay: 0.64s;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg) scale(1.2);
    }
    to {
      transform: rotate(720deg) scale(1.2);
    }
  }

  @keyframes border {
    0% {
      transform: rotate(0) scale(1.2);
    }
    50% {
      transform: rotate(180deg) scale(1.25);
    }
    100% {
      transform: rotate(360deg) scale(1.2);
    }
  }

  @keyframes pulse {
    from {
      transform: rotate(0deg) scale(1);
    }
    to {
      transform: rotate(720deg) scale(1.3);
      opacity: 0;
    }
  }

  .tooltip {
    display: none;
    margin-left: 1.2rem;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    font-size: 1.3rem;
    color: #fff;
    background: #292726;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.32);
    transition: all 300ms ease;
    opacity: 0;
    animation: moveitback 400ms ease forwards;
    will-change: transform;
    @include breakpoint(sm) {
      display: inline-block;
    }
  }

  .hoverStyle {
    opacity: 1;
    animation: moveit 900ms ease forwards;
    will-change: transform;
  }

  section {
    position: relative;
    z-index: var(--z1);
    margin-bottom: 5.6rem;
  }

  header {
    margin-bottom: 2.4rem;
    font-size: 1.3rem;
    font-weight: 500;
    color: #848f9e;
    span {
      cursor: context-menu;
    }
  }

  ul {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, 28%);
    justify-content: space-between;
    margin: 0 auto;
    @include breakpoint(sm) {
      grid-template-columns: repeat(auto-fill, 16%);
    }
  }

  figure {
    display: block;
    position: relative;
    aspect-ratio: auto 1;
    /*     overflow: hidden; */
  }

  li:hover img {
    transform: rotate(3deg);
  }

  img {
    border-radius: 100px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 300ms ease;
    will-change: transform;
  }

  .title {
    display: block;
    text-align: center;
    margin: 1.2rem 0 3.2rem;
    text-shadow: 0px 0px 18px rgba(0, 0, 0, 0.34);
  }
</style>

<script>
  export default {
    data: () => ({
      articles: null,
      hover: false,
    }),
    async fetch() {
      this.articles = await this.$content("projects", { deep: true })
        .sortBy("createdAt", "desc")
        // .skip(1)
        // .where({ hero: 'yes' })
        .fetch()
    },
  }
</script>
