<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modalBackdrop"
      @click.self="emit('close')"
    >
      <div
        ref="modalEl"
        class="modal"
      >
        <p class="modalTitle">{{ title }}</p>
        <slot />
        <p
          v-if="error"
          class="modalError"
        >
          {{ error }}
        </p>
        <slot name="actions">
          <div class="modalActions">
            <button
              type="button"
              class="modalCancel"
              @click="emit('close')"
            >
              {{ cancelLabel }}
            </button>
            <button
              type="button"
              :class="confirmVariant === 'confirm' ? 'modalConfirm' : 'modalSave'"
              :disabled="loading || disableConfirm"
              @click="emit('confirm')"
            >
              {{ loading ? '...' : confirmLabel }}
            </button>
          </div>
        </slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
  const props = defineProps({
    open: { type: Boolean, required: true },
    title: { type: String, required: true },
    error: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    confirmLabel: { type: String, default: 'Save' },
    cancelLabel: { type: String, default: 'Cancel' },
    confirmVariant: { type: String, default: 'save' },
    disableConfirm: { type: Boolean, default: false },
  })

  const emit = defineEmits(['close', 'confirm'])

  const modalEl = ref(null)

  watch(
    () => props.open,
    (open) => {
      if (!open) return
      nextTick(() => {
        const focusable = modalEl.value?.querySelector('input, textarea')
        focusable?.focus()
      })
    },
    { immediate: true },
  )

  function onKey(e) {
    if (e.key === 'Escape' && props.open) {
      e.stopImmediatePropagation()
      emit('close')
    }
  }

  onMounted(() => window.addEventListener('keydown', onKey))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style>
  .modalBackdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(6px);
    z-index: 2000;
    display: grid;
    place-items: center;
    padding: 1rem;
  }

  .modal {
    background: #1c1c1e;
    border-radius: 15px;
    padding: 1.5rem;
    width: min(500px, 100%);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .modalTitle {
    padding-bottom: 10px;
    font-size: 1rem;
    text-align: center;
  }

  .modalInput {
    border: none;
    border-radius: 8px;
    padding: 0.625rem 0.75rem;
    width: 100%;
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
    font-size: 1rem;
  }

  .modalInput::placeholder {
    color: #555;
  }

  .modalError {
    font-size: 0.8rem;
    color: #ff6b6b;
    text-align: center;
  }

  .modalSuccess {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.75);
    text-align: center;
    padding: 0.5rem 0 0.25rem;
  }

  .modalTextarea {
    resize: vertical;
    min-height: 96px;
    font-family: inherit;
    line-height: 1.4;
  }

  .modalActionsSingle {
    grid-template-columns: 1fr;
  }

  .modalActions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .modalCancel,
  .modalConfirm,
  .modalSave {
    border-radius: 8px;
    padding: 0.625rem 1.4rem;
    font-size: 0.9375rem;
    cursor: pointer;
    border: 0;
  }

  .modalCancel {
    background: none;
    color: #fff;
  }

  .modalConfirm {
    background: #ff3b30;
    color: #fff;
    font-weight: 500;
  }

  .modalSave {
    background: #fff;
    color: #000;
    font-weight: 500;
  }

  .modalConfirm:disabled,
  .modalSave:disabled {
    opacity: 0.5;
    cursor: default;
  }
</style>
