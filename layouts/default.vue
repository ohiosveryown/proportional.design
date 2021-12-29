<template>
  <nuxt />
</template>

<style lang="scss" scoped></style>

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
          body.style.cssText = `
            background: url(https://res.cloudinary.com/da32ufmnf/image/upload/v1640758491/proportional.design-v2/bg/evening_wbgosa.svg) no-repeat top center fixed;
            background-size: cover;
            color: #fff;
          `
        } else if (this.currentTime >= 0 && this.currentTime < 7) {
          console.log("it's still night 🌗")
          body.style.cssText = `
              background: url(https://res.cloudinary.com/da32ufmnf/image/upload/v1640758898/proportional.design-v2/bg/night_ig0bgl.svg) no-repeat top center fixed;
              background-size: cover;
              color: #fff;
            `
        } else if (this.currentTime >= 7 && this.currentTime < 12) {
          console.log("it's morning time ⛅")
          body.style.cssText = `
              background: url(https://res.cloudinary.com/da32ufmnf/image/upload/v1640758051/proportional.design-v2/bg/morning_j4tsrx.svg) no-repeat top center fixed;
              background-size: cover;
              color: #0e0e0f;
            `
        } else if (this.currentTime >= 12 && this.currentTime < 17) {
          console.log("it's the afternoon ☀️")
          body.style.cssText = `
            background: url(https://res.cloudinary.com/da32ufmnf/image/upload/v1640759377/proportional.design-v2/bg/afternoon_qliyuv.svg) no-repeat top center fixed;
            background-size: cover;
            color: #fff;
          `
        } else {
          console.log("it's dusk 🌇")
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
