<template>
  <div>
    <aside class="slide">
      <h1 class="title neuebit">{{ article.title }}</h1>

      <footer>
        <small class="time-date">
          {{ formatDate(article.createdAt) }}
          {{ formatTime(article.createdAt) }}
        </small>
        <small v-if="article.dimensions">{{ article.dimensions }}</small>
      </footer>

      <ul if="article.tags" class="tags">
        <li v-if="article.tags.tag_one">#{{ article.tags.tag_one }}</li>
        <li v-if="article.tags.tag_two">#{{ article.tags.tag_two }}</li>
        <li v-if="article.tags.tag_three">#{{ article.tags.tag_three }}</li>
      </ul>

      <article class="p">
        <nuxt-content :document="article" />
      </article>

      <section>
        <contact class="primary" />
        <nuxt-link to="/">
          <button class="secondary neuebit uc">Go Back</button>
        </nuxt-link>
      </section>

      <section class="rating">
        <div class="question">
          <header>Care to rate this project?</header>
          <ul class="emojis">
            <li class="emoji">🔥</li>
            <li class="emoji">❤️</li>
            <li class="emoji">🤔</li>
            <li class="emoji">👎</li>
          </ul>
        </div>
        <div class="answer">
          Hey, thanks. I really appreciate the feedback 🙌.
        </div>
      </section>
    </aside>

    <div v-if="article.one_imgs" class="one">
      <img :src="`${article.one_imgs.one_of_one}`" />
    </div>

    <div v-if="article.two_imgs" class="two">
      <img :src="`${article.two_imgs.one_of_two}`" />
      <img :src="`${article.two_imgs.two_of_two}`" />
    </div>

    <div v-if="article.three_imgs" class="three">
      <img :src="`${article.three_imgs.one_of_three}`" />
      <img :src="`${article.three_imgs.two_of_three}`" />
      <img :src="`${article.three_imgs.three_of_three}`" />
    </div>

    <div v-if="article.four_imgs" class="four">
      <img :src="`${article.four_imgs.one_of_four}`" />
      <img :src="`${article.four_imgs.two_of_four}`" />
      <img :src="`${article.four_imgs.three_of_four}`" />
      <img :src="`${article.four_imgs.four_of_four}`" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "~static/style/grid.scss";

  aside {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: var(--zmax);
    padding: 3.2rem 3.6rem;
    width: 100vw;
    height: 30vh;
    overflow-y: scroll;
    color: #fff;
    background: linear-gradient(
      134.5deg,
      rgba(97, 86, 78, 0.82) 0%,
      rgba(12, 12, 14, 0.82) 69.19%
    );
    box-shadow: inset 0px 0px 0px 1px rgba(255, 255, 255, 0.24);
    backdrop-filter: blur(32px);
    border-radius: 20px 20px 0 0;
    @include breakpoint(md) {
      top: 0;
      right: 0;
      left: auto;
      padding-top: 5.6rem;
      border-radius: 20px 0 0 20px;
      width: 44vw;
      height: 100vh;
    }
    @include breakpoint(mdl) {
      padding-top: 5.6rem;
      width: 40vw;
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

  .p {
    margin: 1.2rem 0;
    max-width: 47ch;
    @include breakpoint(mdl) {
      font-size: 1.8rem;
    }
    @include breakpoint(xl) {
      font-size: 2.6rem;
    }
  }

  .tags {
    display: flex;
    color: #e3d8ff;
    li {
      margin-right: 0.8rem;
    }
  }

  footer {
    display: flex;
    flex-direction: column;
    margin: 2rem 0 0.2rem;
    font-size: 1.7rem;
    font-weight: 600;
    color: #8b8a89;
    @include breakpoint(md) {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .primary,
  .secondary {
    position: relative;
    margin: 4.8rem 2rem 4.8rem 0;
    bottom: auto;
    font-size: 1.8rem;
  }

  .secondary {
    width: max-content;
    padding: 1.6rem 0.2rem;
    border-radius: 16px;
    color: #fff;
    background: none;
  }

  @media (pointer: fine) {
    button:hover {
      transform: none;
    }
    .secondary:hover {
      text-decoration: underline;
    }
  }

  .rating {
    ul {
      display: flex;
      margin: 0.6rem 0 2rem;
    }
    li {
      margin-right: 0.6rem;
      padding: 0.8rem;
      border-radius: 100%;
      background: rgba(38, 36, 35, 0);
      transition: background 300ms ease;
      cursor: pointer;
    }
  }

  @media (pointer: fine) {
    .rating li:hover {
      background: rgba(38, 36, 35, 1);
    }
  }
</style>

<script>
  export default {
    async asyncData({ $content, params, error }) {
      let article
      try {
        article = await $content("timeline", params.slug).fetch()
      } catch (e) {
        error({ message: "Projects not found" })
      }
      return { article }
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
  }
</script>
