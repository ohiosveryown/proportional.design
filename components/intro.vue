<template>
  <header ref="header">
    <span @mouseenter="hover = true" @mouseleave="hover = false" class="time" />
    <span :class="{ hoverStyle: hover }" class="tooltip">
      Come back another time of day and get a fresh new interface 🍩</span
    >
    <h1 class="canela">
      <span class="neuebit">proportional.design</span> is a small-fry studio 🎨
      based in Atlanta, Ga 🍑 building functional objects&nbsp;🪑.
    </h1>
  </header>
</template>

<style lang="scss" scoped>
  @import "~static/style/grid.scss";
  header {
    position: sticky;
    top: 4rem;
    z-index: var(--z1);
    margin-bottom: 8rem;
    transition: transform 500ms ease, filter 400ms ease, opacity 400ms ease;
    will-change: filter, transform, opacity;
  }

  .scroll-class {
    opacity: 0.5;
    filter: blur(6px);
    transform: scale(0.84);
  }

  .tooltip {
    display: inline-block;
    margin-left: 1.2rem;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    font-size: 1.3rem;
    color: #fff;
    background: #292726;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.32);
    transition: all 300ms ease;
    opacity: 0;
    animation: moveitback 400ms ease forwards;
    will-change: transform;
  }

  @media (pointer: coarse) {
    .tooltip {
      display: none;
    }
  }

  .time {
    padding: 2.4rem 0;
    font-size: 1.3rem;
    font-weight: 500;
    color: #767676;
    cursor: context-menu;
  }

  .hoverStyle {
    opacity: 1;
    animation: moveit 900ms ease forwards;
    will-change: transform;
  }

  h1 {
    display: inline-block;
    margin-top: 4rem;
    letter-spacing: -0.25px;
    font-size: 3.9rem;
    line-height: 1.3;
    @include breakpoint(md) {
      font-size: 3.4vw;
      text-align: justify;
    }
    @include breakpoint(mdl) {
      font-size: 3.8vw;
    }
  }

  .neuebit {
    font-size: 5.8rem;
    line-height: 0.8;
    @include breakpoint(md) {
      font-size: 5vw;
    }
  }
</style>

<script>
  export default {
    data: () => ({
      hover: false,
      currentTime: new Date().getHours(),
    }),
    methods: {
      timeOfDay() {
        const time = document.querySelector(".time")
        if (this.currentTime >= 20 && this.currentTime <= 24) {
          time.innerText = "Have a Good Night 🌙"
        } else if (this.currentTime >= 0 && this.currentTime < 7) {
          time.innerText = "Night Owl Mode 🌗"
        } else if (this.currentTime >= 7 && this.currentTime < 12) {
          time.innerText = "Good Morning ⛅"
        } else if (this.currentTime >= 12 && this.currentTime < 17) {
          time.innerText = "Good Afternoon ☀️"
        } else {
          time.innerText = "Good Evening 🌇"
        }
      },
      handleScroll() {
        const intro = this.$refs.header
        window.addEventListener(
          "scroll",
          () => {
            let scrollpos = window.scrollY
            if (scrollpos >= 30) {
              intro.classList.add("scroll-class")
            } else {
              intro.classList.remove("scroll-class")
            }
          },
          {
            capture: true,
            passive: true,
          }
        )
      },
    },
    mounted() {
      this.timeOfDay(), this.handleScroll()
    },
  }
</script>
