<template>
  <div>
    <NuxtLink v-if="prev" :to="{ params: { slug: prev.slug } }">
      <img v-if="prev.hero" :src="`${prev.hero}`" />
      <div class="meta">
        <p>{{ formatDate(prev.createdAt) }}</p>
        <p v-if="!prev.hero" class="title neuebit">{{ prev.title }}</p>
        <p v-if="prev.hero" class="title-move-up neuebit">{{ prev.title }}</p>
      </div>
    </NuxtLink>
    <div v-else>
      <p class="mb-0">proportional.design on Instagram</p>
      <a href="https://instagram.com/proportional.design" target="_blank">
        <figure class="ig">
          <img
            class="ig"
            src="https://res.cloudinary.com/da32ufmnf/image/upload/f_auto,q_50/v1641083808/proportional.design-v2/lzxlxkm3hmdsd9i9j8ao.png"
            alt=""
          />
        </figure>
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "~static/style/grid.scss";

  a {
    display: flex;
    align-items: center;
  }

  img {
    margin-right: 1.2rem;
    width: 20%;
    height: auto;
    border-radius: 16px;
  }

  .ig {
    border-radius: 100px;
  }

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

  .title,
  .title-move-up {
    padding: 0;
    font-size: 2.8rem;
    line-height: 0.8;
    opacity: 1;
    @include breakpoint(xl) {
      font-size: 4rem;
    }
  }

  .title-move-up {
    margin-top: -0.4rem;
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
