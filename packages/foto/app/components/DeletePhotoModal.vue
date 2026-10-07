<template>
  <AppModal
    :open="!!target"
    :title="title"
    :error="error"
    :loading="loading"
    confirm-label="Delete"
    confirm-variant="confirm"
    :disable-confirm="!password"
    @close="onClose"
    @confirm="onConfirm"
  >
    <input
      v-model="password"
      type="password"
      class="modalInput"
      placeholder="Password"
      @keydown.enter="onConfirm"
    />
  </AppModal>
</template>

<script setup>
  defineProps({
    target: { type: Object, default: null },
    title: { type: String, default: 'Delete photo?' },
    error: { type: String, default: '' },
    loading: { type: Boolean, default: false },
  })

  const emit = defineEmits(['close', 'submit'])

  const password = ref('')

  function onClose() {
    password.value = ''
    emit('close')
  }

  function onConfirm() {
    if (!password.value) return
    emit('submit', password.value)
    password.value = ''
  }
</script>
