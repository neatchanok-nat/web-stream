import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Keep component names flat (MovieCard instead of CardsMovieCard)
  components: [{ path: '~/components', pathPrefix: false }],

  // Session-private pages render on the client only: their content depends
  // entirely on localStorage, so SSR would flash guest markup first.
  routeRules: {
    '/account': { ssr: false },
    '/payment': { ssr: false },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'th', class: 'dark' },
      title: 'DUDI ดูดิ — ดูหนัง ละคร ซีรีส์ และไลฟ์สด',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        {
          name: 'description',
          content:
            'DUDI บริการสตรีมมิงบันเทิงไทย ดูหนัง ละคร ซีรีส์ รายการวาไรตี้ และไลฟ์สด ได้ทุกที่ทุกเวลา',
        },
        { name: 'theme-color', content: '#0B0B0F' },
      ],
      link: [
        // Brand mark — SVG for modern browsers, ICO/PNG as fallbacks
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '16x16 32x32 48x48' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})
