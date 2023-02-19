<template>
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

    <section>
      <div class="cover"></div>
      <iframe
        class="pdf"
        src="https://arc.net/e/2395069C-44F6-4C98-96EB-09AFB45A7F26"
        frameborder="0"
        ></iframe
      >
    </section>

    <svg class="waveEnter" viewBox="0 0 469 264" preserveAspectRatio="none">
      <path
        id="waveEnter"
        fill="#000"
        d="M469,264H-0.000001L0,0c226.11113,0,182.887283-0.414484,469.539032,0V263.986786zz"
      />
    </svg>

    <svg class="waveLeave" viewBox="0 0 469 264" preserveAspectRatio="none">
      <path
        id="waveLeave"
        fill="#000"
        d="M469,264H-0.000001L0,263.557617c66.11113,0.429169,351.088104,0.429169,469.539032,0.208344V263.986786z"
      />
    </svg>
  </main>
</template>

<style lang="scss" scoped>
  @import "~static/style/grid.scss";

  .back {
    position: fixed;
    top: 2rem;
    left: 2rem;
    z-index: var(--zmax);
    padding: 1.2rem 1.3rem 1rem;
    border-radius: 100%;
    background: rgba(38, 35, 34, 0.96);
    box-shadow: 0 6px 28px rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
  }

  section {
    position: relative;
    margin: 0 auto;
    max-width: var(--max-width);
    width: 90vw;
  }

  .cover {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 40px;
    background: #fff;
  }

  iframe,
  .pdf {
    margin: 0 auto;
    border: none;
    width: 100%;
    min-height: 100vh;
  }

  .waveEnter {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: var(--zmax);
    left: 0;
    top: 0;
    pointer-events: none;
    transform: scaleY(-1) translateY(1vh);
  }

  .waveLeave {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: var(--zmax);
    left: 0;
    top: 0;
    pointer-events: none;
  }
</style>

<script>
  export default {
    head() {
      return {
        script: [
          { src: "https://identity.netlify.com/v1/netlify-identity-widget.js" },
        ],
      }
    },
    scrollToTop: false,
    methods: {
      wavyEnter() {
        const enter = document.querySelector(".enter")
        const waveEnter = document.querySelector("#waveEnter")

        const shape2 =
          "M469.539032,263.986786H-0.000001L0,229.890961c310.649475,58.156982,255.61113-98.5,469.539032-65.062302V263.986786z"
        const shape3 =
          "M469.539032,263.986786H-0.000001L0,263.557617c66.11113,0.429169,351.088104,0.429169,469.539032,0.208344V263.986786z"

        new TimelineMax({})
          .to(waveEnter, 0.4, {
            attr: { d: shape2 },
            ease: Power1.easeIn,
            fill: "#000",
          })
          .to(waveEnter, 0.4, {
            attr: { d: shape3 },
            ease: Power1.easeOut,
            fill: "#000",
          })
      },
      introEnter() {
        gsap.from(".intro", {
          opacity: 0,
          duration: 1,
          delay: 0.5,
          ease: Power4.easeOut,
        })
      },
      bodyEnter() {
        gsap.from(".entrance", {
          opacity: 0,
          stagger: 0.15,
          skewY: 10,
          y: 100,
          duration: 1,
          delay: 0.75,
          ease: Power4.easeInOut,
        })
      },
    },
    mounted() {
      this.wavyEnter()
      this.introEnter()
      this.bodyEnter()

      console.log(document.querySelector("iframe"))
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
