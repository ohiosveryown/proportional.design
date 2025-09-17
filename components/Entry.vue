<template>
  <li class="entry" ref="entryRef">
    <header>
      <span class="meta">
        <span class="category system">{{ item.categories?.[0] || 'ALL' }}</span>
      </span>
      <span class="title-date-likes">
        <span class="title-date">
          <h2 class="serif">{{ item.title }}</h2>
          <!-- <span class="date system">{{
            new Date(item.dateCreated).getFullYear()
          }}</span> -->
          <span class="stage">{{ item.stage }}</span>
          <span class="category">{{ item.categories?.[0] || 'ALL' }}</span>
        </span>
        <button class="button-like" @click.prevent="handleLike">
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
          <span class="likes sans">{{ displayLikes }}</span>
        </button>
      </span>
    </header>

    <NuxtLink :to="`/furniture/${item.slug}`" :prefetch="true">
      <figure>
        <img
          v-if="item.images?.[0]"
          :src="item.images[0]"
          :alt="item.title"
          loading="lazy"
        />
        <figcaption v-else>No Image</figcaption>
      </figure>
    </NuxtLink>
  </li>
</template>

<style lang="scss" scoped>
// li.entry {
//   border-bottom: 1px solid rgba(251, 236, 195, 0.2);
//   padding-bottom: 8rem;
// }

// .wrapper {
//   display: flex;
//   align-items: center;
// }

// .folder {
//   width: 4.8rem;
//   height: auto;
//   object-fit: cover;
// }

// .meta,
// .date {
//   opacity: 0.72;
// }

// .meta {
//   margin-left: 5.9rem;
// }

// .title-date-likes {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   margin: -1.2rem 0 1.2rem;
// }

// .title-date {
//   display: flex;
//   gap: 1rem;
//   align-items: center;
//   justify-content: space-between;
// }

// h2 {
//   color: var(--secondary);
//   text-transform: uppercase;
//   @include breakpoint(md) {
//     margin-top: 0.4rem;
//     font-size: 3.4rem;
//     letter-spacing: -0.02rem;
//   }
// }

// .key,
// .category,
// .date {
//   text-transform: uppercase;
//   @include breakpoint(md) {
//     font-weight: 500;
//     font-size: 1.3rem;
//     letter-spacing: -0.02rem;
//   }
// }

// .date {
//   @include breakpoint(md) {
//     margin-top: -1.3rem;
//   }
// }

// .button-like {
//   display: flex;
//   align-items: center;
//   gap: 0.4rem;
//   margin-top: 1.6rem;
//   border: none;
//   background: none;
//   opacity: 0.72;
//   cursor: cell;
// }

// .button-like svg {
//   transform: scale(0.9);
//   transition: transform 0.2s ease-in-out;
// }

// .button-like:hover svg {
//   transform: scale(1);
// }

// .button-like:active svg {
//   transform: scale(0.8);
// }

// .button-like .likes {
//   margin-top: 0.8rem;
//   font-weight: 550;
//   font-size: 1.5rem;
// }

// .heart-animate {
//   animation: heartBeat 0.3s ease-in-out;
// }

// @keyframes heartBeat {
//   0% {
//     transform: scale(1);
//   }
//   50% {
//     transform: scale(1.2);
//   }
//   100% {
//     transform: scale(1);
//   }
// }

// figure {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 11px;
//   max-height: 60rem;
//   height: 60rem;
//   background: rgba(0, 0, 0, 0.32);
//   overflow: hidden;
// }

// img {
//   height: 100%;
//   width: auto;
//   object-fit: contain;
// }
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
