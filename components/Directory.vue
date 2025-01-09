<template>
  <div>
    <details v-for="(posts, directory) in groupedPosts" :key="directory">
      <summary>
        <h3>{{ directory }}</h3>
      </summary>

      <section v-if="posts.finished.length" class="media-finished">
        <header>
          <h4>Finished media</h4>
        </header>

        <ul>
          <li v-for="post in posts.finished" :key="post._path">
            <NuxtLink :to="post._path">{{ post.title }}</NuxtLink>
          </li>
        </ul>
      </section>

      <section v-if="posts.wip.length" class="media-in-progress">
        <header>
          <h4>WIP media</h4>
        </header>

        <ul>
          <li v-for="post in posts.wip" :key="post._path">
            <NuxtLink :to="post._path">{{ post.title }}</NuxtLink>
          </li>
        </ul>
      </section>
    </details>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
interface Post {
  _path: string;
  title: string;
  status: "finished" | "wip";
}

const { data: posts } = useAsyncData<Post[]>("posts", () =>
  queryContent<Post>().find()
);

// Group posts by directory and status
const groupedPosts = computed(() => {
  const groups: Record<string, { finished: Post[]; wip: Post[] }> = {};

  posts.value?.forEach((post: Post) => {
    const directory = post._path?.split("/")[1];
    if (!directory) return;
    if (!groups[directory]) {
      groups[directory] = { finished: [], wip: [] };
    }
    groups[directory][post.status === "finished" ? "finished" : "wip"].push(
      post
    );
  });

  return groups;
});
</script>
