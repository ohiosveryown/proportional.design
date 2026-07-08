const siteUrl = 'https://fotos.proportional.design'
const siteName = 'Proportional Design'
const siteDescription =
  'Proportional Design is a small furniture studio in Atlanta, Georgia, building functional objects from sustainable materials since 2016.'
const ogImage = `${siteUrl}/og-image.jpg`

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  alias: {
    '#shared': new URL('./shared', import.meta.url).pathname,
  },
  nitro: {
    preset: 'vercel'
  },
  // Prerendering auto-enables payload extraction, which makes every client-side
  // navigation fetch <route>/_payload.json before completing. Our photo pages
  // resolve entirely on the client (no server data), so that round-trip is pure
  // latency — it added a ~400ms stall when opening a photo (payload hit the ISR
  // function). Disable it: the homepage still prerenders (state inlines into the
  // HTML) and photo navigation goes back to instant client-side routing.
  experimental: {
    payloadExtraction: false
  },
  routeRules: {
    // Homepage HTML is identical per request (photos load client-side), so
    // serve it as a static file from the CDN instead of paying a serverless
    // cold start on every visit.
    '/': { prerender: true },
    // Photo permalinks are a growing set (new upload = new slug), so they
    // can't be enumerated at build time. ISR renders each on first hit, then
    // serves the cached HTML from the edge on subsequent requests.
    '/photo/**': { isr: true },
    '/api/photos': {
      headers: {
        'cache-control': 'public, s-maxage=120, stale-while-revalidate=600'
      }
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: `${siteName} — A fine furniture studio in Atlanta, Georgia`,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: siteDescription },
        { name: 'theme-color', content: '#0a0a0a' },
        { name: 'color-scheme', content: 'dark' },
        { name: 'apple-mobile-web-app-title', content: siteName },
        { name: 'format-detection', content: 'telephone=no' },

        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteName },
        { property: 'og:title', content: `${siteName} — A fine furniture studio in Atlanta, Georgia` },
        { property: 'og:description', content: siteDescription },
        { property: 'og:url', content: siteUrl },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'en_US' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${siteName} — A fine furniture studio in Atlanta, Georgia` },
        { name: 'twitter:description', content: siteDescription },
        { name: 'twitter:image', content: ogImage }
      ],
      link: [
        { rel: 'canonical', href: siteUrl },
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: siteName,
            description: siteDescription,
            url: siteUrl,
            image: ogImage,
            foundingDate: '2016',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Atlanta',
              addressRegion: 'GA',
              addressCountry: 'US'
            },
            sameAs: ['https://www.instagram.com/proportional.design']
          })
        },
        {
          async: true,
          src: 'https://plausible.io/js/pa-S3-z8HCc1srXMlnBG4rWl.js'
        },
        {
          innerHTML:
            'window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()'
        }
      ]
    }
  }
})
