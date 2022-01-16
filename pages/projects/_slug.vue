<template>
  <div class="wrapper">
    <svg
      class="waveEnter"
      viewBox="0 0 469.539032 263.986786"
      preserveAspectRatio="none"
    >
      <path
        id="waveEnter"
        fill="#000"
        d="M469.539032,263.986786H-0.000001L0,0c226.11113,0,182.887283-0.414484,469.539032,0V263.986786zz"
      />
    </svg>

    <svg
      class="waveLeave"
      viewBox="0 0 469.539032 263.986786"
      preserveAspectRatio="none"
    >
      <path
        id="waveLeave"
        fill="#000"
        d="M469.539032,263.986786H-0.000001L0,263.557617c66.11113,0.429169,351.088104,0.429169,469.539032,0.208344V263.986786z"
      />
    </svg>
    <main>
      <nuxt-link to="/">
        <button ref="back" class="back">
          <svg width="20" height="20">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="m18.264 11.227-.845-.805v7.61a.968.968 0 0 1-1.023.967H3.926a.812.812 0 0 1-.055 0 .968.968 0 0 1-.968-.967V10.063l-1.167 1.111a1.054 1.054 0 0 1-1.438 0 .935.935 0 0 1 0-1.368l2.605-2.48V2.588a.968.968 0 0 1 1.935 0v2.896l4.415-4.2c.198-.19.459-.284.72-.284.26 0 .52.094.72.283l9.01 8.575a.935.935 0 0 1 0 1.369 1.054 1.054 0 0 1-1.439 0ZM4.838 16.955h10.645V8.722a.98.98 0 0 1 .01-.133l-5.52-5.254-5.135 4.886v8.734Z"
              fill="#fff"
            />
          </svg>
        </button>
      </nuxt-link>

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
          <li class="date">{{ formatDate(article.date) }}</li>
          <li class="dimensions">{{ article.dimensions }}</li>
        </ul>
        <nuxt-content :document="article" />
      </article>
    </main>

    <div class="divider-wrapper">
      <div class="divider" />
    </div>

    <aside>
      <div class="cards">
        <section class="card card--contact">
          <header>Get in touch</header>
          <p>
            Interested in a custom project or want to learn more? Smash that
            chat button below.
          </p>
          <div class="chat-emoji">💬👇</div>
        </section>

        <section class="card card--rating">
          <div class="question">
            <header>Care to spare an emoji?</header>
            <p>
              You're choices are: you like it, it's fire, hmm, and oh,
              interesting...
            </p>
            <div class="ratings">
              <div class="rate heart">
                <div class="heart-emoji">❤️</div>
                <span class="count heart-count">...</span>
              </div>

              <div class="rate fire">
                <div class="fire-emoji">🔥</div>
                <span class="count fire-count">...</span>
              </div>

              <div class="rate thinking">
                <div class="thinking-emoji">🤔</div>
                <span class="count thinking-count">...</span>
              </div>

              <div class="rate interesting">
                <div class="interesting-emoji">👀</div>
                <span class="count interesting-count">...</span>
              </div>
            </div>
          </div>
        </section>

        <section class="card card--next-post">
          <header>You might be interested in:</header>
          <previous :prev="prev" />
        </section>
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
    async asyncData({ $content, params }) {
      const article = await $content("projects", params.slug).fetch()

      const [prev] = await $content("projects")
        .only(["title", "slug", "createdAt", "hero"])
        .sortBy("createdAt", "asc")
        .surround(params.slug)
        .fetch()

      return {
        article,
        prev,
      }
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
      wavyEnter() {
        const waveEnter = document.querySelector("#waveEnter")

        const shape2 =
          "M469.539032,263.986786H-0.000001L0,229.890961c310.649475,58.156982,255.61113-98.5,469.539032-65.062302V263.986786z"
        const shape3 =
          "M469.539032,263.986786H-0.000001L0,263.557617c66.11113,0.429169,351.088104,0.429169,469.539032,0.208344V263.986786z"

        new TimelineMax({
          repeat: 0,
          repeatDelay: 0,
        })
          .to(waveEnter, 0.5, {
            attr: { d: shape2 },
            ease: Power3.easeIn,
            fill: "#000",
          })
          .to(waveEnter, 0.5, {
            attr: { d: shape3 },
            ease: Power1.easeOut,
            fill: "#000",
          })
      },
    },

    mounted() {
      this.$refs.back.style.cssText = `
        opacity: 1;
      `
      this.wavyEnter()
      this.escape()

      const xhr = new XMLHttpRequest()
      xhr.open(
        "GET",
        "https://api.countapi.xyz/hit/" +
          this.article.slug +
          "q" +
          "/awesomeclick"
      )
      xhr.responseType = "json"
      xhr.onload = function () {
        document.querySelector(".heart-count").innerText = this.response.value
      }
      xhr.send()

      const fireCount = new XMLHttpRequest()
      fireCount.open(
        "GET",
        "https://api.countapi.xyz/hit/" +
          this.article.slug +
          "f" +
          "/awesomeclick"
      )
      fireCount.responseType = "json"
      fireCount.onload = function () {
        document.querySelector(".fire-count").innerText = this.response.value
      }
      fireCount.send()

      const thinkCount = new XMLHttpRequest()
      thinkCount.open(
        "GET",
        "https://api.countapi.xyz/hit/" +
          this.article.slug +
          "t" +
          "/awesomeclick"
      )
      thinkCount.responseType = "json"
      thinkCount.onload = function () {
        document.querySelector(".thinking-count").innerText =
          this.response.value
      }
      thinkCount.send()

      const interestingCount = new XMLHttpRequest()
      interestingCount.open(
        "GET",
        "https://api.countapi.xyz/hit/" +
          this.article.slug +
          "i" +
          "/awesomeclick"
      )
      interestingCount.responseType = "json"
      interestingCount.onload = function () {
        document.querySelector(".interesting-count").innerText =
          this.response.value
      }
      interestingCount.send()

      document.querySelector(".heart").addEventListener("click", () => {
        gsap.to(".heart-emoji", {
          scale: 1.4,
          duration: 0.2,
          ease: Power4.easeIn,
        })
        gsap.to(".heart-emoji", {
          scale: 1,
          duration: 0.2,
          delay: 0.2,
          ease: Power1.easeOut,
        })

        const xhr = new XMLHttpRequest()
        xhr.open(
          "GET",
          "https://api.countapi.xyz/hit/" +
            this.article.slug +
            "q" +
            "/awesomeclick"
        )
        xhr.responseType = "json"
        xhr.onload = function () {
          document.querySelector(".heart-count").innerText = this.response.value
        }
        xhr.send()
      })

      document.querySelector(".fire").addEventListener("click", () => {
        gsap.to(".fire-emoji", {
          scale: 1.4,
          duration: 0.2,
          ease: Power4.easeIn,
        })
        gsap.to(".fire-emoji", {
          scale: 1,
          duration: 0.2,
          delay: 0.2,
          ease: Power1.easeOut,
        })

        const xhr = new XMLHttpRequest()
        xhr.open(
          "GET",
          "https://api.countapi.xyz/hit/" +
            this.article.slug +
            "f" +
            "/awesomeclick"
        )
        xhr.responseType = "json"
        xhr.onload = function () {
          document.querySelector(".fire-count").innerText = this.response.value
        }
        xhr.send()
      })

      document.querySelector(".thinking").addEventListener("click", () => {
        gsap.to(".thinking-emoji", {
          scale: 1.4,
          duration: 0.2,
          ease: Power4.easeIn,
        })
        gsap.to(".thinking-emoji", {
          scale: 1,
          duration: 0.2,
          delay: 0.2,
          ease: Power1.easeOut,
        })

        const xhr = new XMLHttpRequest()
        xhr.open(
          "GET",
          "https://api.countapi.xyz/hit/" +
            this.article.slug +
            "t" +
            "/awesomeclick"
        )
        xhr.responseType = "json"
        xhr.onload = function () {
          document.querySelector(".thinking-count").innerText =
            this.response.value
        }
        xhr.send()
      })

      document.querySelector(".interesting").addEventListener("click", () => {
        gsap.to(".interesting-emoji", {
          scale: 1.4,
          duration: 0.2,
          ease: Power4.easeIn,
        })
        gsap.to(".interesting-emoji", {
          scale: 1,
          duration: 0.2,
          delay: 0.2,
          ease: Power1.easeOut,
        })

        const xhr = new XMLHttpRequest()
        xhr.open(
          "GET",
          "https://api.countapi.xyz/hit/" +
            this.article.slug +
            "i" +
            "/awesomeclick"
        )
        xhr.responseType = "json"
        xhr.onload = function () {
          document.querySelector(".interesting-count").innerText =
            this.response.value
        }
        xhr.send()
      })
    },

    beforeDestroy() {
      this.$refs.back.style.cssText = `
        opacity: 0;
      `
    },

    transition: {
      beforeLeave(el) {
        const wavy = () => {
          const wave = document.querySelector("#waveLeave")

          const shape2 =
            "M469.539032,263.986786H-0.000001L0,229.890961c310.649475,58.156982,255.61113-98.5,469.539032-65.062302V263.986786z"
          const shape3 =
            "M469.539032,263.986786H-0.000001L0,0c226.11113,0,182.887283-0.414484,469.539032,0V263.986786zz"

          new TimelineMax({
            repeat: 0,
            repeatDelay: 0,
          })
            .to(wave, 0.3, {
              attr: { d: shape2 },
              ease: Power1.easeIn,
              fill: "#000",
            })
            .to(wave, 0.4, {
              attr: { d: shape3 },
              ease: Power1.easeOut,
              fill: "#000",
            })
        }
        wavy()
      },
    },
  }
</script>
