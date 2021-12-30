<template>
  <main class="width">
    <intro />
    <projects />
    <floating />
    <timeline />

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
    },
    mounted() {
      this.wavyEnter()
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
