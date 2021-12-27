<template>
  <section>
    <header>
      <span>Timeline:</span>
    </header>

    <ul>
      <li v-for="article of articles" :key="article.slug">
        <NuxtLink :to="'/timeline/' + article.slug">
          <img
            v-if="article.thumbnail"
            :src="`${article.thumbnail}`"
            :alt="`${article.label}`"
          />
          <span class="title">{{ article.title }}</span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
  @import "~static/style/grid.scss";
  img {
    max-width: 20rem;
    height: auto;
  }
  a {
    text-decoration: underline;
  }
</style>

<script>
  export default {
    data: () => ({
      articles: null,
    }),
    async fetch() {
      this.articles = await this.$content("timeline", { deep: true })
        .sortBy("createdAt", "desc")
        // .skip(1)
        // .where({ hero: 'yes' })
        .fetch()
    },
  }
</script>
