<template>
  <div>
    <h2>{{ article.title }}</h2>
    <img
      v-if="article.img_one"
      :src="`${article.img_one}`"
      :alt="`${article.label}`"
    />
    <nuxt-content :document="article" />
  </div>
</template>

<style lang="scss" scoped>
  img {
    width: 100vw;
    height: 20rem;
    object-fit: cover;
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
  }
</script>
