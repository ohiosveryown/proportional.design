// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/content'],
  routeRules: {
    '/': { prerender: true }
  },
    // global styles
  css: ["./assets/style/reset.scss", "./assets/style/type.scss"],
  // content
  content: {
    documentDriven: true,
    markdown: {
      anchorLinks: false,
    },
  },
})