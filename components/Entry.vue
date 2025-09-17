<template>
  <li class="entry" ref="entryRef">
    <NuxtLink :to="`/furniture/${item.slug}`" :prefetch="true">
      <img
        v-if="item.images?.[0]"
        :src="item.images[0]"
        :alt="item.title"
        loading="lazy"
      />

      <footer class="sans-regular">
        <span class="category">{{ item.categories?.[0] || "ALL" }}</span>
        <span class="center"
          ><h3 class="title">{{ item.title }}</h3>
          <span class="separator">•</span>
          <span class="stage">{{ item.stage }}</span>
        </span>
        <button class="likes" @click.prevent="handleLike">
          <svg
            width="18"
            height="14"
            fill="none"
            :class="{ 'heart-animate': isAnimating }"
          >
            <path
              fill="var(--primary)"
              fill-rule="evenodd"
              d="M1.375 1.275A4.736 4.736 0 0 1 2.9.33 5.02 5.02 0 0 1 4.696 0a5.02 5.02 0 0 1 1.797.331c.57.219 1.087.54 1.523.944L9 2.186l.984-.911C10.864.459 12.059 0 13.304 0c1.246 0 2.44.459 3.32 1.275C17.506 2.09 18 3.197 18 4.35c0 1.154-.495 2.261-1.375 3.077l-6.716 6.223A1.34 1.34 0 0 1 9 14a1.34 1.34 0 0 1-.909-.349L1.376 7.428A4.345 4.345 0 0 1 .356 6.017 4.076 4.076 0 0 1 0 4.35c0-.571.121-1.137.357-1.665a4.345 4.345 0 0 1 1.018-1.411Z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="">{{ displayLikes }}</span>
        </button>
      </footer>
    </NuxtLink>
  </li>
</template>

<style lang="scss" scoped>
li a {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  position: relative;
  border-radius: 21px;
  padding: 1.2rem;
  background: #2b3c33;
  overflow: hidden;
  aspect-ratio: 1.24;

  @include breakpoint(lg) {
    aspect-ratio: 0.8;
  }
}

li a img {
  border-radius: 9px;
  width: 100%;
  flex: 1;
  object-fit: cover;
  min-height: 0;
}

footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem 0.2rem 0.2rem;
  text-transform: uppercase;
  flex-shrink: 0;
}

.center {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
}

.category,
.likes {
  border-radius: 100px;
  border: 1px solid color-mix(in srgb, var(--content-000) 40%, transparent);
  padding: 0.3rem 0.8rem 0.2rem;
  font-size: 1.3rem;
  opacity: 0.72;
}

.title {
  font-size: 1.5rem;
  width: 100%;
  text-align: center;
}

.stage {
  border-radius: 100px;
  padding: 0.3rem 1.2rem;
  background: linear-gradient(
    180deg,
    rgba(149, 140, 116, 0.3) 0%,
    rgba(69, 112, 93, 0.3) 100%
  );
  font-size: 1.3rem;
}

.separator {
  opacity: 0.64;
}

.stage,
.separator {
  display: none;
  // @include breakpoint(xl) {
  //   display: block;
  // }
}

.likes {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 0.5rem 0.9rem 0.4rem 0.6rem;
  line-height: 1;
}

.likes svg {
  transform: scale(0.8);
  transition: transform 0.3s ease;
  will-change: transform;
}

.likes:hover svg {
  transform: scale(0.9) translateY(-0.05rem);
}

.likes:active svg {
  transform: scale(0.8) translateY(-0.05rem);
}

.heart-animate {
  animation: heartBeat 0.3s ease-in-out;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["like"]);

const entryRef = ref(null);
const isAnimating = ref(false);
const optimisticLikes = ref(props.item.likes || 0);

const displayLikes = computed(() => optimisticLikes.value);

// Watch for changes in props.item.likes to sync with server updates
watch(
  () => props.item.likes,
  (newLikes) => {
    optimisticLikes.value = newLikes || 0;
  }
);

const handleLike = () => {
  // Optimistically increment the like count
  optimisticLikes.value += 1;

  // Trigger animation
  isAnimating.value = true;
  setTimeout(() => {
    isAnimating.value = false;
  }, 300);

  // Emit the like event
  emit("like", props.item.slug, props.item.id);
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  if (entryRef.value) {
    observer.observe(entryRef.value);
  }

  onUnmounted(() => {
    observer.disconnect();
  });
});
</script>
