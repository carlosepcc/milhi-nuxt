// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@vite-pwa/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/ui",
    "@vueuse/nuxt",
  ],
  imports: {
    dirs: ["stores"],
  },
  css: [
    "@/assets/css/main.css",
    // '@mdi/font/css/materialdesignicons.min.css',
  ],
  ui: {
    fonts: false,
  },
  ssr: false,
  app: {
    pageTransition: { name: "slide-top", mode: "out-in" },
    head: {
      title: "Bisne",
      titleTemplate: "Bisne | %s",
      htmlAttrs: {
        lang: "es-CU",
      },
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      link: [
        // {
        //   rel: 'stylesheet',
        //   href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
        // },
        {
          rel: "icon",
          href: "/favicon.ico",
          sizes: "48x48",
        },

        {
          rel: "icon",
          href: "/favicon.svg",
          sizes: "any",
          type: "image/svg+xml",
        },
        {
          rel: "/apple-touch-icon",
          href: "/apple-touch-icon-180x180.png",
        },
      ],
      meta: [
        {
          name: "description",
          content:
            "Maneja tu inventario de compra-venta en Cuba sin dolores de cabeza.",
        },
      ],
    },
  },
  piniaPersistedstate: {
    storage: "localStorage",
  },
  pwa: {
    registerType:'autoUpdate',
    strategies:'generateSW',

    manifest: {
      name: "Bisne: Registro de compra-venta",
      short_name: "Bisne",
      description: "Registra entradas y salidas de productos asî como puntos de venta y recepción. ",
      theme_color: "#ffffff",
      start_url:'/',
      orientation: 'portrait',
      icons: [
        {
          src: "pwa-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
      screenshots:[
        {
          src: "https://picsum.photos/640/360",//TODO: screenshots
          sizes: "1280x720",
          type: "image/png",
          form_factor: "wide",
        },
        {
          src: "https://picsum.photos/640/360",//TODO: screenshots
          sizes: "320x568",
          type: "image/png",
        },
      ],
      display: "standalone",
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,svg,png,ico,json,webp,woff2}"],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: "/index.html", //ensures SPA routing offline
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|gif|bmp|tiff|webp|svg|icon|woff2?)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "assets",
            expiration: {
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
      ],
    },
    devOptions: {
      enabled: true,
      type: "module",
      navigateFallback: "/",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  nitro:{
    preset: 'static' //WIP: ensures generate mode is properly static
  }
});
