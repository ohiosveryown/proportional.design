<template>
  <div>
    <!-- local storage -->
    <!--     <p><button ref="btn" class="btn" type="button">Click me!</button></p>
    <div id="result"></div> -->

    <div class="CountLike" id="Like Count">
      <button class="button button1">
        ❤️
        <span class="counterStat">...</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  button {
    border: 0.5px solid rgba(255, 255, 255, 0.24);
    border-radius: 32px;
    padding: 0.6rem 0.8rem;
    background: rgba(255, 255, 255, 0.16);
    transition: background 300ms ease;
    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
</style>

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
      // this.likes()
    },
  }
</script>

<style lang="scss" scoped></style>
