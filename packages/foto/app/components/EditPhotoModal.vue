<template>
  <AppModal
    :open="!!photo"
    title="Edit details"
    :error="error"
    :loading="loading"
    confirm-label="Save"
    :disable-confirm="!password"
    @close="onClose"
    @confirm="submit"
  >
    <input
      v-model="caption"
      type="text"
      class="modalInput"
      placeholder="Caption"
    />
    <input
      v-model="tagsRaw"
      type="text"
      class="modalInput"
      placeholder="Tags (comma-separated)"
    />
    <input
      v-model="takenAt"
      type="date"
      class="modalInput"
    />
    <select
      v-model="storyId"
      class="modalInput modalSelect"
      :disabled="!storyOptions.length"
    >
      <option value="">
        {{ storyOptions.length ? 'Add to story (optional)' : 'No stories yet' }}
      </option>
      <option
        v-for="story in storyOptions"
        :key="story.id"
        :value="story.id"
      >
        {{ storyLabel(story) }}
      </option>
    </select>
    <input
      v-model="password"
      type="password"
      class="modalInput"
      placeholder="Password"
      @keydown.enter="submit"
    />
  </AppModal>
</template>

<style scoped>
  .modalSelect {
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23999' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    padding-right: 2rem;
  }

  .modalSelect:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .modalSelect option {
    color: #111;
    background: #fff;
  }
</style>

<script setup>
  const props = defineProps({
    photo: { type: Object, default: null },
    stories: { type: Array, default: () => [] },
  })

  const emit = defineEmits(['close', 'updated', 'added-to-story'])

  const caption = ref('')
  const tagsRaw = ref('')
  const takenAt = ref('')
  const storyId = ref('')
  const password = ref('')
  const error = ref('')
  const loading = ref(false)

  const storyOptions = computed(() =>
    (props.stories || []).filter((s) => s?.id && s.items?.length),
  )

  function storyLabel(story) {
    const count = story.items?.length || 0
    const name = story.name || story.caption || 'Untitled story'
    return count > 1 ? `${name} (${count})` : name
  }

  watch(
    () => props.photo,
    (next) => {
      if (!next) return
      caption.value = next.caption || ''
      tagsRaw.value = (next.tags || []).join(', ')
      takenAt.value = next.takenAt ? next.takenAt.slice(0, 10) : ''
      storyId.value = ''
      password.value = ''
      error.value = ''
    },
  )

  function onClose() {
    error.value = ''
    emit('close')
  }

  async function submit() {
    if (!password.value || !props.photo) return
    loading.value = true
    error.value = ''

    const photo = props.photo
    const nextCaption = caption.value
    const nextTags = tagsRaw.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const nextTakenAt = takenAt.value
      ? new Date(takenAt.value).toISOString()
      : ''
    const selectedStoryId = storyId.value

    try {
      const res = await $fetch('/api/update-photo', {
        method: 'PATCH',
        body: {
          publicId: photo.filename,
          caption: nextCaption,
          tags: nextTags,
          takenAt: nextTakenAt,
          password: password.value,
          resource_type: photo.resource_type,
        },
      })
      if (!res.success) {
        error.value = res.error || 'Incorrect password'
        return
      }

      const patch = {
        caption: nextCaption,
        tags: nextTags,
        takenAt: nextTakenAt || photo.uploadedAt,
        slug: res.slug,
      }
      emit('updated', photo, patch)

      if (selectedStoryId) {
        const addRes = await $fetch('/api/add-to-story', {
          method: 'POST',
          body: {
            publicId: photo.filename,
            storyId: selectedStoryId,
            password: password.value,
            resource_type: photo.resource_type,
            caption: nextCaption,
            takenAt: nextTakenAt,
          },
        })
        if (!addRes.success) {
          error.value =
            addRes.error || 'Saved details, but failed to add to story'
          return
        }
        emit('added-to-story', addRes)
      }

      storyId.value = ''
      emit('close')
    } catch {
      error.value = 'Something went wrong'
    } finally {
      loading.value = false
    }
  }
</script>
