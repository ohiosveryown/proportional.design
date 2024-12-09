<template>
  <nav>
    <header>
      <button>Contact</button>
      <button class="btn-search">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          fill="none"
        >
          <path
            fill="#fff"
            fill-opacity=".5"
            fill-rule="evenodd"
            d="M14.858 11.829a3.818 3.818 0 1 1-5.4-5.4 3.818 3.818 0 0 1 5.4 5.4Zm-6.281.919a5.091 5.091 0 1 0-.038-.038l-.431-.432-3.15 3.15a.636.636 0 1 0 .9.9l3.15-3.15-.431-.43Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </header>
    <h1>proportional.design</h1>
    <h2>
      A small-fry studio 🎨 based in Atlanta, Ga 🍑 building functional
      objects 🪑.
    </h2>

    <ClientOnly>
      <details
        v-for="(items, folder) in posts"
        :key="folder"
        :open="openStates[folder]"
        @toggle="(e) => handleToggle(folder, e.target.open)"
      >
        <summary>{{ folder }}</summary>
        <ul>
          <li v-for="post in items" :key="post._id">
            <NuxtLink :to="post._path">
              {{ post.title }}
            </NuxtLink>
          </li>
        </ul>
      </details>
    </ClientOnly>

    <!-- <details>
      <summary>Bastogne Slab Desk</summary>
      <ul>
        <li v-for="post in posts" :key="post._id">
          <NuxtLink :to="post._path">
            {{ post.title }}
          </NuxtLink>
        </li>
      </ul>
    </details> -->
  </nav>
</template>

<style lang="scss" scoped>
@import "/assets/style/grid.scss";
@import "/assets/style/type.scss";

nav {
  display: flex;
  width: 352px;
  flex-direction: column;
  border-radius: 5px;
  border: 0.541px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.14);
  box-shadow: 0px 18px 38px 0px rgba(0, 0, 0, 0.1),
    0px 4.021px 8.488px 0px rgba(0, 0, 0, 0.1),
    0px 1.197px 2.527px 0px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(56px);
}

header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-search {
  border-left: 1px solid rgba(255, 255, 255, 0.4);
  padding-left: 6px;
}

h2 {
  margin-bottom: 4rem;
}
</style>

<script setup>
// const posts = await queryContent("").sort({ key: 1 }).skip(1).find();
// const posts = await queryContent().sort({ key: 1 }).find();

const posts = ref({});
const openStates = ref({});
const loading = ref(true);

// Fetch posts
const { data } = await useAsyncData("posts", () =>
  queryContent().where({ _partial: false }).find()
);

// Group posts by directory
if (data.value) {
  posts.value = data.value.reduce((acc, post) => {
    const directory = post._path.split("/")[1] || "root";
    if (!acc[directory]) {
      acc[directory] = [];
    }
    acc[directory].push(post);
    return acc;
  }, {});
}

onMounted(() => {
  // Load saved states
  const stored = localStorage.getItem("detailsStates");
  if (stored) {
    openStates.value = JSON.parse(stored);
  }
});

// Handle details toggle
const handleToggle = (folder, isOpen) => {
  openStates.value[folder] = isOpen;
  localStorage.setItem("detailsStates", JSON.stringify(openStates.value));
};
</script>
