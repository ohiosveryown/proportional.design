<template>
  <div class="wrapper">
    <main class="">
      <a href="" @click.prevent="$router.back()">
        <button class="back">
          <svg width="14" height="14" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.03 6.098H4.185l4.402-4.447a.974.974 0 0 0 0-1.368.95.95 0 0 0-1.353 0L1.276 6.301a.975.975 0 0 0-.135 1.196.966.966 0 0 0 .174.24l5.92 5.98a.95.95 0 0 0 1.353 0 .974.974 0 0 0 0-1.367L4.313 8.032H16.03a.967.967 0 0 0 0-1.934Z"
              fill="#fff"
            />
          </svg>
        </button>
      </a>

      <h1 class="title neuebit">{{ article.title_full }}</h1>

      <ul if="article.tags" class="tags">
        <li v-if="article.tags.tag_one">#{{ article.tags.tag_one }}</li>
        <li v-if="article.tags.tag_two">#{{ article.tags.tag_two }}</li>
        <li v-if="article.tags.tag_three">#{{ article.tags.tag_three }}</li>
      </ul>

      <div class="images">
        <img class="project-hero" :src="`${article.hero}`" />
      </div>

      <article class="p-timeline">
        <ul class="meta">
          <li class="date">{{ formatDate(article.createdAt) }}</li>
          <li class="dimensions">{{ article.dimensions }}</li>
        </ul>
        <nuxt-content :document="article" />
      </article>
    </main>

    <div class="divider-wrapper">
      <div class="divider" />
    </div>

    <aside class="">
      <div class="cards">
        <div class="card card--contact">
          <header>Get in Touch</header>
          <p>
            Interested in a custom project or want to learn more? Smash that
            contact button below.
          </p>
          <contact class="primary" />
        </div>

        <section class="card card--rating">
          <div class="question">
            <header>Care to rate this project?</header>
            <p>Ratings help me build more things people like</p>
            <ul class="emojis">
              <li class="emoji">🔥</li>
              <li class="emoji">❤️</li>
              <li class="emoji">🤔</li>
              <li class="emoji">👎</li>
            </ul>
          </div>
          <div class="answer">
            <header>Hey, Thanks</header>
            <p>I really appreciate the feedback 🙌.</p>
          </div>
        </section>

        <div class="card card--next-post">
          <header>More From the Timeline</header>
          <p>More posts go here</p>
        </div>
      </div>
    </aside>
  </div>
</template>

<style lang="scss" scoped>
  @import "~static/style/grid.scss";
  @import "~static/style/detail.scss";
</style>

<script>
  export default {
    async asyncData({ $content, params, error }) {
      let article
      try {
        article = await $content("projects", params.slug).fetch()
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
      escape() {
        document.addEventListener("keydown", () => {
          if (event.key === "Escape") {
            this.$nuxt.$options.router.push("/")
          }
        })
      },
    },
    mounted() {
      this.escape()
      const emojis = document.querySelectorAll(".emoji")
      const question = document.querySelector(".question")
      const answer = document.querySelector(".answer")
      emojis.forEach((emoji) => {
        emoji.addEventListener("click", () => {
          question.style.display = "none"
          answer.style.display = "flex"
          answer.style.cssText = `
            display: inherit;
            visibility: visible;
            opacity: 1;
          `
        })
      })
    },
  }
</script>
