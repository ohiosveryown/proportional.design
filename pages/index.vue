<template>
  <div>
    <projects class="mb-9" />
    <timeline />
  </div>
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
  }
</script>
