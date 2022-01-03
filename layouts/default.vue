<template>
  <div>
    <img
      class="haze"
      src="https://res.cloudinary.com/da32ufmnf/image/upload/f_auto,q_50/v1640883977/proportional.design-v2/bg/haze_o1m70z.png"
      alt="haze image"
    />
    <nuxt />
  </div>
</template>

<style lang="scss" scoped>
  @import "~static/style/grid.scss";

  .haze {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: auto;
    object-fit: cover;
    pointer-events: none;
  }
</style>

<script>
  export default {
    data: () => ({
      currentTime: new Date().getHours(),
    }),
    scrollToTop: false,
    methods: {
      timeOfDay() {
        const body = document.body
        const html = document.documentElement
        if (this.currentTime >= 20 && this.currentTime <= 24) {
          console.log("have a good night 🌙")
          html.style.background = "#080E2D"
          body.style.cssText = `
            background: url(https://res.cloudinary.com/da32ufmnf/image/upload/v1640758491/proportional.design-v2/bg/evening_wbgosa.svg) no-repeat top center fixed;
            background-size: cover;
            color: #fff;
          `
        } else if (this.currentTime >= 0 && this.currentTime < 7) {
          console.log("night owl mode 🌗")
          html.style.background = "#03081D"
          body.style.cssText = `
              background: url(https://res.cloudinary.com/da32ufmnf/image/upload/v1640758898/proportional.design-v2/bg/night_ig0bgl.svg) no-repeat top center fixed;
              background-size: cover;
              color: #fff;
          `
        } else if (this.currentTime >= 7 && this.currentTime < 12) {
          console.log("good morning ⛅")
          html.style.background = "#A8D4F5"
          body.style.cssText = `
              background: url(https://res.cloudinary.com/da32ufmnf/image/upload/v1640758051/proportional.design-v2/bg/morning_j4tsrx.svg) no-repeat top center fixed;
              background-size: cover;
              color: #0e0e0f;
            `
        } else if (this.currentTime >= 12 && this.currentTime < 17) {
          console.log("good afternoon ☀️")
          html.style.background = "#CCC5EA"
          body.style.cssText = `
            background: url(https://res.cloudinary.com/da32ufmnf/image/upload/v1640835081/proportional.design-v2/bg/afternoon-2_mkebzx.svg) no-repeat top center fixed;
            background-size: cover;
            color: #0e0e0f;
          `
        } else {
          console.log("good evening 🌇")
          html.style.background = "#060210"
          body.style.cssText = `
            background: url(https://res.cloudinary.com/da32ufmnf/image/upload/v1640757207/proportional.design-v2/bg/dusk_q3xtfh.svg) no-repeat top center fixed;
            background-size: cover;
            color: #fff;
          `
        }
      },
    },
    mounted() {
      this.timeOfDay()
    },
  }
</script>
