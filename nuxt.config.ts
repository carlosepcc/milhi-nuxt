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
  app: {
    pageTransition: { name: "slide-top", mode: "out-in" },
    head: {
      title: "MiLhi",
      titleTemplate: "MiLhi | %s",
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
    manifest: {
      name: "Milhi: Registro de compra-venta",
      short_name: "Milhi",
      theme_color: "#ffffff",
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
      display: "standalone",
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      navigateFallback: "/",
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|gif|bmp|tiff|webp)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "images",
            expiration: {
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
            },
          },
        },
      ],
    },
    devOptions: {
      enabled: false,
      type: "module",
      navigateFallback: "/",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
