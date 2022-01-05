<template>
  <div>
    <p><button ref="btn" class="btn" type="button">Click me!</button></p>
    <div id="result"></div>

    <div class="CountLike" id="Like Count">
      <button class="button button1">
        Like(s): <span class="counterStat">...</span>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      likes() {
        document.getElementById("result").innerHTML = localStorage.clickcount
        this.$refs.btn.addEventListener("click", () => {
          if (typeof Storage !== "undefined") {
            if (localStorage.clickcount) {
              localStorage.clickcount = Number(localStorage.clickcount) + 1
            } else {
              localStorage.clickcount = 1
            }
            document.getElementById("result").innerHTML =
              localStorage.clickcount
          }
        })
      },
    },
    mounted() {
      this.likes()
    },
  }
</script>

<style lang="scss" scoped></style>
