export function useChatFilter(photos) {
  const chatMessages = ref([])
  const activeFilter = ref(null)
  const chatLoading = ref(false)

  const visiblePhotos = computed(() => {
    const tags = activeFilter.value?.tags
    if (!tags?.length) return photos.value
    const union = new Set()
    for (const t of tags) for (const f of t.filenames) union.add(f)
    return photos.value.filter((p) => union.has(p.filename))
  })

  const availableTags = computed(() => {
    const map = new Map()
    for (const p of photos.value) {
      for (const raw of p.tags || []) {
        const label = String(raw).trim().toLowerCase()
        if (!label) continue
        if (!map.has(label)) map.set(label, new Set())
        map.get(label).add(p.filename)
      }
    }
    return [...map.entries()]
      .map(([label, filenames]) => ({ label, filenames: [...filenames] }))
      .sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }),
      )
  })

  watch(
    activeFilter,
    () => {
      if (typeof window === 'undefined') return
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    { flush: 'post' },
  )

  async function onSend(text) {
    chatMessages.value.push({ role: 'user', content: text })
    chatLoading.value = true
    try {
      const res = await $fetch('/api/chat', {
        method: 'POST',
        body: {
          messages: chatMessages.value,
          activeTags: (activeFilter.value?.tags || []).map((t) => t.label),
        },
      })
      if (!res.success) {
        chatMessages.value.push({
          role: 'assistant',
          content: res.error || 'Something went wrong.',
        })
        return
      }
      chatMessages.value.push({
        role: 'assistant',
        content: res.reply || '',
      })
      if (res.clearFilter) {
        activeFilter.value = null
      }
      if (res.filter?.tags?.length) {
        activeFilter.value = {
          tags: res.filter.tags.map((t) => ({
            label: t.label,
            filenames: new Set(t.filenames),
          })),
        }
      }
    } catch {
      chatMessages.value.push({
        role: 'assistant',
        content: 'Something went wrong.',
      })
    } finally {
      chatLoading.value = false
    }
  }

  function onRemoveTag(label) {
    const tags = activeFilter.value?.tags || []
    const next = tags.filter((t) => t.label !== label)
    activeFilter.value = next.length ? { tags: next } : null
  }

  function onApplyTag({ label, filenames }) {
    const current = activeFilter.value?.tags || []
    if (current.some((t) => t.label === label)) return
    activeFilter.value = {
      tags: [...current, { label, filenames: new Set(filenames) }],
    }
  }

  return {
    chatMessages,
    activeFilter,
    chatLoading,
    visiblePhotos,
    availableTags,
    onSend,
    onRemoveTag,
    onApplyTag,
  }
}
