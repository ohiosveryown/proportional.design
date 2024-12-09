export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/') {
    const { data } = await useAsyncData('posts', () =>
      queryContent()
        .where({ _partial: false })
        .find()
    )

    if (data.value && data.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.value.length)
      const randomPage = data.value[randomIndex]
      return navigateTo(randomPage._path)
    }
  }
})