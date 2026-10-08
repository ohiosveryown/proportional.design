import {
  findStoryByRouteId,
  isCanonicalStoryPath,
  storyPath,
} from '~/utils/story-slug'

export function useStoryRoute(stories, storyOpenIndex) {
  const route = useRoute()
  const router = useRouter()
  let syncing = false

  function isStoryRoute(path = route.path) {
    return path.startsWith('/story/')
  }

  function syncOpenIndexFromRoute() {
    if (!isStoryRoute()) {
      if (storyOpenIndex.value >= 0 && !syncing) {
        storyOpenIndex.value = -1
      }
      return
    }

    if (!stories.value.length) return

    const story = findStoryByRouteId(stories.value, route.params.id)
    if (!story) {
      navigateTo('/', { replace: true })
      return
    }

    if (!isCanonicalStoryPath(story, route.path)) {
      syncing = true
      router.replace(storyPath(story)).finally(() => {
        syncing = false
      })
    }

    const idx = stories.value.findIndex((s) => s.id === story.id)
    storyOpenIndex.value = idx >= 0 ? idx : -1
  }

  watch(
    [() => route.params.id, () => route.path, stories],
    () => {
      if (syncing) return
      syncing = true
      syncOpenIndexFromRoute()
      nextTick(() => {
        syncing = false
      })
    },
    { immediate: true },
  )

  watch(stories, () => {
    if (syncing || !isStoryRoute()) return
    const story = findStoryByRouteId(stories.value, route.params.id)
    if (!story) return
    const idx = stories.value.findIndex((s) => s.id === story.id)
    if (idx >= 0 && storyOpenIndex.value !== idx) {
      storyOpenIndex.value = idx
    }
  })

  watch(storyOpenIndex, (idx) => {
    if (syncing) return

    if (idx < 0) {
      if (isStoryRoute()) {
        syncing = true
        router.push('/').finally(() => {
          syncing = false
        })
      }
      return
    }

    const story = stories.value[idx]
    if (!story) return

    const target = storyPath(story)
    if (route.path === target) return

    syncing = true
    const navigate = isStoryRoute()
      ? router.replace.bind(router)
      : router.push.bind(router)
    navigate(target).finally(() => {
      syncing = false
    })
  })

  function openStory(index) {
    if (index < 0 || index >= stories.value.length) return
    storyOpenIndex.value = index
  }

  return { openStory }
}
