<template>
  <header>
    <menu>
      <li>
        <img
          class="avatar"
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733869919/proportional.design-3.0/avatar_2x_cttm0e.webp"
          alt="proportional.design avatar"
        />
      </li>
      <li><button>Contact</button></li>
      <li>
        <button>
          <svg
            class="icon-search"
            xmlns="http://www.w3.org/2000/svg"
            width="31"
            height="20"
            fill="none"
          >
            <g clip-path="url(#a)">
              <path
                fill="#fff"
                fill-opacity=".4"
                fill-rule="evenodd"
                d="M21.608 11.65a4.88 4.88 0 1 1-6.9-6.9 4.88 4.88 0 0 1 6.9 6.9Zm-7.977 1.223a6.506 6.506 0 1 0-.146-.146l-.502-.502-4.025 4.025a.813.813 0 1 0 1.15 1.15l4.025-4.025-.502-.502Z"
                clip-rule="evenodd"
              />
            </g>
            <defs>
              <clipPath id="a">
                <path fill="#fff" d="M.858 0h30v20h-30z" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </li>
    </menu>

    <section>
      <h1>
        <title>proportional.design</title>
        <img
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733867671/proportional.design-3.0/logotype_2x_b662tq.webp"
          alt="proportional.design logotype"
          class="logotype"
        />
      </h1>
      <h2>
        A small-fry studio 🎨 based in Atlanta, Ga 🍑 building functional
        objects 🪑.
      </h2>
    </section>
  </header>
</template>

<style lang="scss" scoped>
@use "/assets/style/grid.scss" as *;

header {
  margin-bottom: 1.4rem;
}

menu {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border-bottom: 0.5px solid rgb(255, 255, 255, 0.24);
  padding: 1rem 1.2rem;
}

menu li:first-of-type {
  flex: 1;
}

menu li:nth-of-type(2) {
  padding-right: 1.8rem;
  border-right: 0.5px solid rgb(255, 255, 255, 0.4);
  opacity: 0.84;
}

menu button {
  font-size: 1.4rem;
}

.icon-search {
  transform: translateY(0.3rem);
}

.avatar {
  width: 2.8rem;
}

section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 0 1.2rem;
  border-bottom: 0.5px solid rgb(255, 255, 255, 0.32);
  padding: 1.5rem 0;
}

.logotype {
  width: 15vw;
}

h2 {
  opacity: 0.84;
  font-weight: 400;
}
</style>
