<template>
  <div>
    <button @click="addLike">Likes: {{ initialLikes }}</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        initialLikes: 3,
        userLikeCount: 0,
      }
    },
    async fetch() {
      const { data } = await this.$axios.get(
        `/.netlify/functions/fetch_likes_for_blog?slug=${this.$route.params.slug}`
      )
      this.initialLikes = data.likes
    },
    mounted() {
      this.$store.commit("initializeLikes", this.$route.params.slug)
      console.log(this.initialLikes)
    },
    fetchOnServer: false,
    methods: {
      async addLike() {
        if (this.storedUserLikes < 12) {
          this.initialLikes++
          this.$store.commit("incrementLikes", this.$route.params.slug)
          this.incrementLikes()
        }
      },
      async incrementLikes() {
        await this.$axios.post(
          `/.netlify/functions/register-like?slug=${this.$route.params.slug}`
        )
      },
    },
    computed: {
      likesMaxed() {
        return this.userLikeCount >= 12
      },
      storedUserLikes() {
        return this.$store.state.storedUserLikes
      },
    },
  }
</script>
