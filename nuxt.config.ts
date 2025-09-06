// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  routeRules: {
    '/': { prerender: true, headers: { 'cache-control': 's-maxage=300' } },
    '/furniture/**': { headers: { 'cache-control': 's-maxage=600' } },
    '/api/furniture': { headers: { 'cache-control': 's-maxage=300' } },
    '/api/furniture/**': { headers: { 'cache-control': 's-maxage=600' } }
  },
  css: ["/assets/style/reset.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "/assets/style/grid.scss" as *;'
        }
      }
    },
    assetsInclude: ['**/*.glsl']
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
})