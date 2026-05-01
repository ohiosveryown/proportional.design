export function useBodyScrollLock(active) {
  let savedScrollY = 0
  let locked = false

  function lock() {
    if (!import.meta.client || locked) return
    savedScrollY = window.scrollY || window.pageYOffset || 0
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    locked = true
  }

  function unlock() {
    if (!import.meta.client || !locked) return
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    window.scrollTo(0, savedScrollY)
    locked = false
  }

  watch(active, (isActive) => {
    if (isActive) lock()
    else unlock()
  })

  onBeforeUnmount(unlock)
}
