<template>
  <AppModal
    :open="open"
    title="Get in touch"
    :error="sent ? '' : error"
    :loading="loading"
    confirm-label="Send"
    @close="onClose"
    @confirm="submit"
  >
    <template v-if="sent">
      <p class="modalSuccess">Thanks — message sent.</p>
    </template>
    <template v-else>
      <input
        v-model="email"
        type="email"
        required
        class="modalInput"
        placeholder="Your email"
      />
      <textarea
        v-model="message"
        required
        rows="4"
        class="modalInput modalTextarea"
        placeholder="Message"
      />
    </template>

    <template
      v-if="sent"
      #actions
    >
      <div class="modalActions modalActionsSingle">
        <button
          type="button"
          class="modalSave"
          @click="onClose"
        >
          Close
        </button>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
  const props = defineProps({
    open: { type: Boolean, required: true },
  })

  const emit = defineEmits(['update:open'])

  const email = ref('')
  const message = ref('')
  const error = ref('')
  const loading = ref(false)
  const sent = ref(false)

  watch(
    () => props.open,
    (next) => {
      if (!next) return
      sent.value = false
      error.value = ''
    },
  )

  function onClose() {
    error.value = ''
    emit('update:open', false)
  }

  async function submit() {
    const trimmedEmail = email.value.trim()
    const trimmedMessage = message.value.trim()
    if (!trimmedEmail || !trimmedMessage) {
      error.value = 'Email and message are required.'
      return
    }
    loading.value = true
    error.value = ''
    try {
      const res = await fetch('https://formspree.io/f/mojyyvql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail, message: trimmedMessage }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        error.value =
          data?.errors?.[0]?.message ||
          'Something went wrong. Please try again.'
        return
      }
      sent.value = true
      email.value = ''
      message.value = ''
    } catch {
      error.value = 'Something went wrong. Please try again.'
    } finally {
      loading.value = false
    }
  }
</script>
