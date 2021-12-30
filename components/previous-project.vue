<template>
  <div>
    <NuxtLink v-if="prev" :to="{ params: { slug: prev.slug } }">
      <p>{{ formatDate(prev.createdAt) }}</p>
      <p class="title neuebit">{{ prev.title }}</p>
    </NuxtLink>
    <div v-else>
      <p>Nothing new right now.</p>
      <p class="home">
        <nuxt-link to="/">Return Home</nuxt-link>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "~static/style/grid.scss";

  p {
    padding: 0.6rem 0;
    font-size: 1.4rem;
    line-height: 1.3;
    opacity: 0.48;
    @include breakpoint(xl) {
      max-width: 40ch;
      font-size: 1.7rem;
    }
  }

  .title {
    padding: 0;
    font-size: 2.8rem;
    line-height: 0.8;
    opacity: 1;
    @include breakpoint(xl) {
      font-size: 4rem;
    }
  }

  .home {
    margin-top: -0.2rem;
    padding: 0;
    opacity: 1;
    text-decoration: underline;
  }
</style>

<script>
  export default {
    props: {
      prev: {
        type: Object,
        default: () => null,
      },
    },
    methods: {
      formatDate(date) {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(date).toLocaleDateString("en", options)
      },
    },
  }
</script>
