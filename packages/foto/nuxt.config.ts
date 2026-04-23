const siteUrl = 'https://fotos.proportional.design'
const siteName = 'Proportional Design'
const siteDescription =
  'Proportional Design is a small furniture studio in Atlanta, Georgia, building functional objects from sustainable materials since 2016.'
const ogImage = `${siteUrl}/og-image.jpg`

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'vercel'
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
        }
      ]
    }
  }
})
