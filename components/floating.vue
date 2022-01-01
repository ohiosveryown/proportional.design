<template>
  <section class="projects">
    <ul>
      <li v-for="article of articles" :key="article.slug">
        <NuxtLink :to="'/projects/' + article.slug">
          <figure>
            <img :src="`${article.hero}`" />
            <figcaption class="title">{{ article.title }}</figcaption>
          </figure>
          <!--           <span class="title">{{ article.title }}</span> -->
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
  @import "~static/style/grid.scss";

  section {
    position: relative;
    opacity: 0;
    pointer-events: none;
    transition: all 300ms ease;
  }

  .scroll-class {
    opacity: 1;
    pointer-events: inherit;
  }

  li {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 6vw;
    height: auto;
    opacity: 1;
    &:hover {
      opacity: 1;
    }
    @include breakpoint(mdl) {
      display: inherit;
    }
  }

  figcaption {
    display: block;
    text-align: center;
    text-shadow: 0 0 18px rgba(0, 0, 0, 0.34);
    font-size: 1.7rem;
    will-change: transform;
  }

  img {
    border-radius: 100px;
    width: 6vw;
    height: 6vw;
    overflow: hidden;
    object-fit: cover;
    transition: transform 300ms ease;
    transform: scale(0.8);
    will-change: transform;
  }

  @keyframes float01 {
    0% {
      transform: translate(0, 0) scale(0.8);
    }
    50% {
      transform: translate(-0.2rem, -0.8rem) scale(0.8);
    }
    100% {
      transform: translate(0, 0) scale(0.8);
    }
  }

  @keyframes float02 {
    0% {
      transform: translate(0, 0) scale(0.8);
    }
    50% {
      transform: translate(0.3rem, 0.6rem) scale(0.8);
    }
    100% {
      transform: translate(0, 0) scale(0.8);
    }
  }

  @keyframes float03 {
    0% {
      transform: translate(0, 0) scale(0.8);
    }
    50% {
      transform: translate(-0.2rem, -0.8rem) scale(0.8);
    }
    100% {
      transform: translate(0, 0) scale(0.8);
    }
  }

  li:nth-of-type(1) {
    top: 6vh;
    left: 4vw;
    img,
    figcaption {
      animation: float01 5s ease-in-out infinite;
    }
  }

  li:nth-of-type(2) {
    top: 12vh;
    left: 12vw;
    img,
    figcaption {
      animation: float02 5s ease-in-out 2s infinite;
    }
  }

  li:nth-of-type(3) {
    top: 25vh;
    left: 6vw;
    img,
    figcaption {
      animation: float03 5s ease-in-out 2s infinite;
    }
  }

  li:nth-of-type(4) {
    opacity: 0;
    top: 32vh;
    left: 12vw;
    img,
    figcaption {
      animation: float02 5s ease-in-out 2s infinite;
    }
  }

  li:nth-of-type(5) {
    top: 4vh;
    left: 80vw;
    img,
    figcaption {
      animation: float03 5s ease-in-out 2s infinite;
    }
  }

  li:nth-of-type(6) {
    top: 13vh;
    left: 90vw;
    img,
    figcaption {
      animation: float01 5s ease-in-out infinite;
    }
  }

  li:nth-of-type(7) {
    top: 22vh;
    left: 82vw;
    img,
    figcaption {
      animation: float02 5s ease-in-out 2s infinite;
    }
  }

  li:nth-of-type(n + 8) {
    display: none;
  }
</style>

<script>
  export default {
    data: () => ({
      articles: null,
    }),
    async fetch() {
      this.articles = await this.$content("projects", { deep: true })
        .sortBy("createdAt", "desc")
        .fetch()
    },
    methods: {
      handle() {
        const projects = document.querySelector(".projects")
        window.addEventListener(
          "scroll",
          () => {
            let scrollpos = window.scrollY
            if (scrollpos >= 800) {
              projects.classList.add("scroll-class")
            } else {
              projects.classList.remove("scroll-class")
            }
          },
          {
            capture: true,
            passive: true,
          }
        )
      },
    },
    mounted() {
      this.handle()
    },
  }
</script>
