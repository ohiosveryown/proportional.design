<template>
  <button
    @click="incrementLike(postId)"
    :disabled="loading"
    class="like-button"
  >
    ❤️ {{ count }}
  </button>
</template>

<script setup>
const props = defineProps(["postId"]);
const { count, loading, getLikes, incrementLike } = useLikes();

onMounted(() => {
  getLikes(props.postId);
});
</script>
