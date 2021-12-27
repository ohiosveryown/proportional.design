export default {
  ssr: false,
  target: "static",

  head: {
    title: "proportional.design",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // global styles
  css: [
    "~/static/style/reset.scss",
    "~/static/style/type.scss",
    "~/static/style/util.scss",
  ],

  plugins: [],
  components: true,
  buildModules: [],
  modules: ["@nuxtjs/pwa", "@nuxt/content"],
  pwa: {
    manifest: {
      lang: "en",
    },
  },
  content: {},
  build: {},
}
