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
  modules: ["@nuxtjs/pwa", "@nuxt/content", "@nuxt/image", "@nuxtjs/axios"],
  pwa: {
    manifest: {
      lang: "en",
    },
  },
  publicRuntimeConfig: {
    axios: {
      baseURL:
        process.env.NODE_ENV === "production"
          ? process.env.BASE_URL || "http://192.168.0.195:8008"
          : "http://192.168.0.195:8008",
    },
  },
  server: {
    port: 8008,
    host: "0.0.0.0",
  },
  content: {},
  image: {
    cloudinary: {
      baseURL: "https://res.cloudinary.com/da32ufmnf/image/upload/",
    },
    domains: ["res.cloudinary.com"],
    quality: 2,
    rotate: 45,
  },
  build: {},
}
