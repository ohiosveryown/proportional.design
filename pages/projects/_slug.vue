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
      <button class="btn">Like Button</button>
      <p>Likes: <span class="pressed"></span></p>
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

    <aside>
      <div class="cards">
        <div class="card card--contact">
          <header>Get in touch</header>
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
              <counter />
              <!--               <li class="emoji">🔥</li>
              <li class="emoji">❤️</li>
              <li class="emoji">🤔</li>
              <li class="emoji">👎</li> -->
            </ul>
          </div>
          <div class="answer">
            <header>Hey, Thanks</header>
            <p>I really appreciate the feedback 🙌.</p>
          </div>
        </section>

        <div class="card card--next-post">
          <header>You might be interested in:</header>
          <previous :prev="prev" />
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
      var dCounters = document.querySelectorAll(".CountLike")
      ;[].forEach.call(dCounters, function (dCounter) {
        var el = dCounter.querySelector("button")
        var cId = dCounter.id
        var dDatabase = firebase
          .database()
          .ref("Like Number Counter")
          .child(cId)

        // get firebase data
        dDatabase.on("value", function (snap) {
          var data = snap.val() || 0
          dCounter.querySelector("span").innerHTML = data
        })

        // set firebase data
        el.addEventListener("click", function () {
          dDatabase.transaction(function (dCount) {
            return (dCount || 0) + 1
          })
        })
      })

      this.$refs.back.style.cssText = `
        opacity: 1;
      `
      this.wavyEnter()
      this.escape()

      var xhr = new XMLHttpRequest()
      xhr.open(
        "GET",
        "https://api.countapi.xyz/hit/" + this.article.slug + "/awesomeclick"
      )
      xhr.responseType = "json"
      xhr.onload = function () {
        document.querySelector(".pressed").innerText = this.response.value
      }
      xhr.send()

      document.querySelector(".btn").addEventListener("click", () => {
        var xhr = new XMLHttpRequest()
        xhr.open(
          "GET",
          "https://api.countapi.xyz/hit/" + this.article.slug + "/awesomeclick"
        )
        xhr.responseType = "json"
        xhr.onload = function () {
          document.querySelector(".pressed").innerText = this.response.value
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
