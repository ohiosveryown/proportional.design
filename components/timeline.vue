<template>
  <section>
    <header class="section-header">
      <span
        class="trigger"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
      >
        Timeline
      </span>
      <span :class="{ hoverStyle: hover }" class="tooltip">
        This is where I post updates of projects – in a timeline ⏱️</span
      >
    </header>

    <ul>
      <li class="entry" v-for="article of articles" :key="article.slug">
        <NuxtLink :to="'/timeline/' + article.slug">
          <header class="title neuebit">
            {{ article.title }}
          </header>
          <p class="description">{{ article.description }}</p>
          <span class="tags">{{ article.tags }}</span>

          <!--           <span>{{ article.address.street }}</span>
          <span>{{ article.address.city }}</span> -->

          <div class="image-wrapper">
            <img v-if="article.img_one" :src="`${article.img_one}`" />
            <img v-if="article.img_two" :src="`${article.img_two}`" />
            <img v-if="article.img_three" :src="`${article.img_three}`" />
            <img v-if="article.img_four" :src="`${article.img_four}`" />
          </div>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
  @import "~static/style/grid.scss";

  section {
    position: relative;
    z-index: var(--z3);
  }

  .section-header {
    padding-bottom: 2rem;
    color: #848f9e;
    font-size: 1.3rem;
    font-weight: 500;
  }

  .trigger {
    padding: 2.8rem 0;
    cursor: context-menu;
  }

  @media (pointer: coarse) {
    .tooltip {
      display: none;
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
    @include breakpoint(md) {
      display: inline-block;
    }
  }

  .hoverStyle {
    opacity: 1;
    animation: moveit 900ms ease forwards;
    will-change: transform;
  }

  .entry {
    position: relative;
    z-index: var(--z2);
    margin-bottom: 4rem;
    padding: 3.2rem 2rem 2.4rem;
    border-radius: 2.2rem;
    color: #fff;
    background: linear-gradient(
      134deg,
      rgba(97, 86, 78, 0.8) 0%,
      rgba(12, 12, 14, 0.88) 69%
    );
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
    filter: drop-shadow(0 4px 28px rgba(0, 0, 0, 0.24));
    backdrop-filter: blur(8px);
    @include breakpoint(md) {
      padding: 3.2rem 3.2rem 2.4rem;
    }
    @include breakpoint(mdl) {
      padding: 4rem 3.2rem 2.4rem;
    }
    p {
      max-width: 47ch;
      @include breakpoint(mdl) {
        font-size: 1.8rem;
      }
      @include breakpoint(xl) {
        font-size: 2.6rem;
      }
    }
  }

  .title {
    margin-bottom: 1.2rem;
    font-size: 4.4rem;
    line-height: 0.8;
    @include breakpoint(md) {
      font-size: 3.8vw;
    }
    @include breakpoint(lg) {
      font-size: 3.4vw;
    }
  }

  .description {
    margin-bottom: 1.2rem;
    @include breakpoint(mdl) {
      margin-bottom: 0.2rem;
    }
  }

  .tags {
    display: flex;
    margin-bottom: 2.2rem;
    color: #e3d8ff;
    li {
      margin-right: 0.8rem;
    }
  }

  .image-wrapper {
    margin: 2rem 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>

<script>
  export default {
    data: () => ({
      articles: null,
      hover: false,
    }),
    async fetch() {
      this.articles = await this.$content("timeline", { deep: true })
        .sortBy("createdAt", "desc")
        // .skip(1)
        // .where({ hero: 'yes' })
        .fetch()
    },
    methods: {
      formatDate(date) {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(date).toLocaleDateString("en", options)
      },
      formatTime(time) {
        return new Date(time).toLocaleTimeString("en", { timeStyle: "short" })
      },
    },
    mounted() {},
  }
</script>
