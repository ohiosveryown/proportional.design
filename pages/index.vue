<template>
  <main class="width">
    <intro />
    <projects />
    <floating />
    <timeline />
  </main>
</template>

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
  }
</script>
