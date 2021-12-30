export const state = () => ({
  storedUserLikes: 1,
})

export const mutations = {
  initializeLikes(state, slug) {
    const storedLikes = Math.abs(Number(localStorage.getItem(slug)))

    if (storedLikes) {
      storedLikes >= 12
        ? (state.storedUserLikes = 12)
        : (state.storedUserLikes = storedLikes)
    } else {
      localStorage.setItem(slug, 1)
      state.storedUserLikes = 1
    }
  },
  incrementLikes(state, slug) {
    state.storedUserLikes = state.storedUserLikes + 1
    localStorage.setItem(slug, state.storedUserLikes)
  },
}
