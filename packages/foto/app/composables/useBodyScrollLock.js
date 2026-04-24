export function useBodyScrollLock(active) {
  watch(active, (locked) => {
    if (!import.meta.client) return
    document.body.style.overflow = locked ? 'hidden' : ''
  })

  onBeforeUnmount(() => {
    if (!import.meta.client) return
    document.body.style.overflow = ''
  })
}
