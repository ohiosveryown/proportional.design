<template>
  <ClientOnly>
    <details
      v-for="(items, directory) in groupedPosts"
      :key="directory"
      :open="openStates[directory]"
      @toggle="(e) => handleToggle(directory, e.target.open)"
    >
      <summary>
        <img
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733756746/proportional.design-3.0/icons/icon--folder--01_3x_eaz3f9.webp"
          alt=""
          class="directory-icon"
        />
        {{ directory }}
      </summary>

      <!-- Finished items -->
      <div v-if="getStatusGroup(items, 'finished').length" class="status-group">
        <h4>
          <svg width="20" height="20" fill="none">
            <path
              fill="#fff"
              fill-rule="evenodd"
              d="M1.5 4.75c0-.69.56-1.25 1.25-1.25h6.5c.69 0 1.25.56 1.25 1.25v3.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-3.5ZM12.75 5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h4.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25h-4.5Zm-3.5 5.5c.69 0 1.25.56 1.25 1.25v2.5c0 .69-.56 1.25-1.25 1.25H3.6c-.69 0-1.25-.56-1.25-1.25v-2.5c0-.69.56-1.25 1.25-1.25h5.65Z"
              clip-rule="evenodd"
            />
          </svg>
          Finished media
        </h4>
        <ul>
          <li v-for="post in getStatusGroup(items, 'finished')" :key="post._id">
            <NuxtLink :to="post._path">
              <img :src="post.icon" :alt="post.title" />
              <span>{{ post.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Unfinished items -->
      <div
        v-if="getStatusGroup(items, 'unfinished').length"
        class="status-group"
      >
        <h4>
          <svg width="20" height="20" fill="none">
            <path
              fill="#fff"
              fill-rule="evenodd"
              d="M1.5 4.75c0-.69.56-1.25 1.25-1.25h6.5c.69 0 1.25.56 1.25 1.25v3.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-3.5ZM12.75 5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h4.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25h-4.5Zm-3.5 5.5c.69 0 1.25.56 1.25 1.25v2.5c0 .69-.56 1.25-1.25 1.25H3.6c-.69 0-1.25-.56-1.25-1.25v-2.5c0-.69.56-1.25 1.25-1.25h5.65Z"
              clip-rule="evenodd"
            />
          </svg>
          WIP media
        </h4>
        <ul>
          <li
            v-for="post in getStatusGroup(items, 'unfinished')"
            :key="post._id"
          >
            <NuxtLink :to="post._path">
              <img :src="post.icon" :alt="post.title" />
              <span>{{ post.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </details>
  </ClientOnly>
</template>

<style scoped>
summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  position: relative;
  padding-right: 24px;
  text-transform: capitalize;
}

summary::-webkit-details-marker {
  display: none;
}

summary::after {
  content: "";
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: url("https://res.cloudinary.com/dn1q8h2ga/image/upload/v1733755752/proportional.design-3.0/chevron_xfdpr7.svg")
    no-repeat center;
  background-size: contain;
  transition: transform 0.2s ease;
}

details[open] > summary::after {
  transform: translateY(-50%) rotate(90deg);
}

summary,
li {
  border-radius: 5px;
  padding: 0.4rem 0.8rem;
  overflow: hidden;
}

summary {
  margin-bottom: 0.2rem;
  font-weight: 550;
}

li {
  padding-left: 1.6rem;
}

li a {
  display: flex;
  align-content: center;
  gap: 1rem;
}

li img,
.directory-icon {
  width: 2.8rem;
  object-fit: cover;
}

li span {
  margin-top: 0.2rem;
  font-weight: 500;
}

summary:hover,
li:hover {
  background: rgba(0, 0, 0, 0.32);
}

h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1.4rem;
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.12);
}

.status-group {
  margin-left: 1rem;
  margin-bottom: 1rem;
}

.status-group h4 {
  font-size: 0.8em;
  opacity: 0.6;
  margin-bottom: 0.5rem;
}
</style>

<script setup>
const { data: posts } = await useAsyncData("posts", () =>
  queryContent().where({ _partial: false }).find()
);

const openStates = ref({});

// Load saved states on mount
onMounted(() => {
  const saved = localStorage.getItem("directoryStates");
  if (saved) {
    openStates.value = JSON.parse(saved);
  }
});

// Handle details toggle
const handleToggle = (directory, isOpen) => {
  openStates.value[directory] = isOpen;
  localStorage.setItem("directoryStates", JSON.stringify(openStates.value));
};

const groupedPosts = computed(() => {
  if (!posts.value) return {};

  return posts.value.reduce((acc, post) => {
    const directory = post._path.split("/")[1];

    // Skip if directory is empty, undefined, or root
    if (!directory || directory === "root" || directory === "") return acc;

    if (!acc[directory]) {
      acc[directory] = [];
    }
    acc[directory].push(post);
    return acc;
  }, {});
});

const getStatusGroup = (items, status) => {
  return items.filter((item) => item.status === status);
};
</script>
