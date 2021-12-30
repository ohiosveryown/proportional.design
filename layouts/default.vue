<template>
  <nuxt />
</template>

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
          console.log("it's evening 🌙")
          html.style.background = "#080E2D"
          body.style.cssText = `
            background: url(https://res.cloudinary.com/da32ufmnf/image/upload/v1640758491/proportional.design-v2/bg/evening_wbgosa.svg) no-repeat top center fixed;
            background-size: cover;
            color: #fff;
          `
        } else if (this.currentTime >= 0 && this.currentTime < 7) {
          console.log("it's still night 🌗")
          html.style.background = "#03081D"
          body.style.cssText = `
              background: url(https://res.cloudinary.com/da32ufmnf/image/upload/v1640758898/proportional.design-v2/bg/night_ig0bgl.svg) no-repeat top center fixed;
              background-size: cover;
              color: #fff;
          `
        } else if (this.currentTime >= 7 && this.currentTime < 12) {
          console.log("it's morning time ⛅")
          html.style.background = "#A8D4F5"
          body.style.cssText = `
              background: url(https://res.cloudinary.com/da32ufmnf/image/upload/v1640758051/proportional.design-v2/bg/morning_j4tsrx.svg) no-repeat top center fixed;
              background-size: cover;
              color: #0e0e0f;
            `
        } else if (this.currentTime >= 12 && this.currentTime < 17) {
          console.log("it's the afternoon ☀️")
          html.style.background = "#CCC5EA"
          body.style.cssText = `
            background: url(https://res.cloudinary.com/da32ufmnf/image/upload/v1640835081/proportional.design-v2/bg/afternoon-2_mkebzx.svg) no-repeat top center fixed;
            background-size: cover;
            color: #0e0e0f;
          `
        } else {
          console.log("it's dusk 🌇")
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
