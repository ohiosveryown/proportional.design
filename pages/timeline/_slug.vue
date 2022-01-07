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
          <svg width="14" height="14" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.03 6.098H4.185l4.402-4.447a.974.974 0 0 0 0-1.368.95.95 0 0 0-1.353 0L1.276 6.301a.975.975 0 0 0-.135 1.196.966.966 0 0 0 .174.24l5.92 5.98a.95.95 0 0 0 1.353 0 .974.974 0 0 0 0-1.367L4.313 8.032H16.03a.967.967 0 0 0 0-1.934Z"
              fill="#fff"
            />
          </svg>
        </button>
      </nuxt-link>

      <h1 class="title neuebit">{{ article.title }}</h1>

      <ul if="article.tags" class="tags">
        <li v-if="article.tags.tag_one">#{{ article.tags.tag_one }}</li>
        <li v-if="article.tags.tag_two">#{{ article.tags.tag_two }}</li>
        <li v-if="article.tags.tag_three">#{{ article.tags.tag_three }}</li>
      </ul>

      <div class="images">
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

    <aside>
      <div class="cards">
        <section class="card card--contact">
          <header>Get in touch</header>
          <p>
            Interested in a custom project or want to learn more? Smash that
            chat button below.
          </p>
          <div class="chat-emoji">💬👇</div>
          <!--           <contact class="primary" /> -->
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
          <header>More From the timeline:</header>
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
      const article = await $content("timeline", params.slug).fetch()

      const [prev] = await $content("timeline")
        .only(["title", "slug", "createdAt"])
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
