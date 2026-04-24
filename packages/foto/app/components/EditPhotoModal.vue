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
    <input
      v-model="password"
      type="password"
      class="modalInput"
      placeholder="Password"
      @keydown.enter="submit"
    />
  </AppModal>
</template>

<script setup>
  const props = defineProps({
    photo: { type: Object, default: null },
  })

  const emit = defineEmits(['close', 'updated'])

  const caption = ref('')
  const tagsRaw = ref('')
  const takenAt = ref('')
  const password = ref('')
  const error = ref('')
  const loading = ref(false)

  watch(
    () => props.photo,
    (next) => {
      if (!next) return
      caption.value = next.caption || ''
      tagsRaw.value = (next.tags || []).join(', ')
      takenAt.value = next.takenAt ? next.takenAt.slice(0, 10) : ''
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
      } else {
        emit('updated', photo, {
          caption: nextCaption,
          tags: nextTags,
          takenAt: nextTakenAt || photo.uploadedAt,
        })
      }
    } catch {
      error.value = 'Something went wrong'
    } finally {
      loading.value = false
    }
  }
</script>
