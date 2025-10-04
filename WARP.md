# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository type: Nuxt 4 SPA with PWA and Pinia (TypeScript), Tailwind v4 via Vite plugin. Source root is app/.

Commands
- Install dependencies (no lockfile present; use your preferred package manager):
  - npm install
- Start dev server (hosted, port 3008):
  - npm run dev
  - Access at http://localhost:3008
- Build for production (SPA, SSR disabled):
  - npm run build
- Preview production build locally:
  - npm run preview
- Static site generation (Nitro preset: static):
  - npm run generate
- Generate PWA icons/assets from public/favicon.svg:
  - npm run generate-pwa-assets

Notes
- Linting: no linter/formatter scripts or configs detected.
- Tests: no test runner configured; there is no command to run a single test.
- README.md includes generic Nuxt setup instructions; prefer the port and scripts here (dev runs on 3008 per package.json).

Architecture overview
- Framework/runtime
  - Nuxt 4 (nuxt.config.ts)
    - ssr: false (SPA-only)
    - nitro.preset: 'static' (optimized for generate/hosting as static)
  - Vite plugin: @tailwindcss/vite (Tailwind v4). Global styles imported in app.vue and app/assets/css/main.css
  - UI: @nuxt/ui (UApp wrapper, components, locale set to es)
  - State: Pinia with @pinia-plugin-persistedstate/nuxt — store persisted to localStorage
  - Utilities: @vueuse/nuxt
  - PWA: @vite-pwa/nuxt (generateSW, autoUpdate)

- Source layout (app/ as source root)
  - app/app.vue: wraps the app in <UApp :locale="es">, mounts <NuxtLayout> and <NuxtPage>, adds <NuxtPwaAssets/> and <PwaChecker/>
  - app/app.config.ts: UI config and navigation metadata (routes array) used by the bottom nav
  - app/layouts/default.vue: shared layout shell; injects <BottomNav/>
  - app/components/
    - BottomNav.vue: builds bottom navigation from appConfig.routes; uses NuxtLink and @nuxt/ui button variants
    - PwaChecker.vue: surfaces install/update prompts via $pwa, uses useToast() for UX
    - Button/Fab.vue: floating action button component
  - app/pages/
    - index.vue: dashboard/summary — reads from inventory store getters (totals, margins); uses cup() currency helper
    - products.vue: create/edit products; drag-and-drop ordering via vuedraggable
    - record.vue: timeline of buy/sell records; modal/collapsible editors; adds/edits/deletes records; uses helpers to normalize entries
    - settings.vue: manage locations; import/export JSON of products/locations/records; shows PWA developer info
  - app/stores/useInventoryStore.ts (Pinia)
    - State: products[], records[], locations[], isHydrating
    - Getters: buyTransactions, sellTransactions, totalSpent, totalIncome, estimatedProfit, profitMargin; helpers getProductById/getLocationById/getRecordById; getProductsByLocation builds per-location aggregates (unitsLeft, avgBuyPrice, totals)
    - Actions: add/update/delete for products, records, locations; importData(versioned JSON) with guarded merging/replacement; persistence hooks (beforeHydrate/afterHydrate) toggle isHydrating
  - app/utils/
    - recordToV2.ts: normalizes records; ensures sell records have negative units
    - stringUtils.ts: slugify; currency helpers currency/cup/usd
  - app/assets/css/
    - main.css: imports tailwind and @nuxt/ui, animation.css, base typographic and utility styles
    - animation.css: transition classes for page/list motions
    - water.css: additional prototype UI aesthetics
  - public/
    - PWA icons (maskable and standard), favicon, robots.txt

- Nuxt configuration (nuxt.config.ts) highlights
  - modules: ['@vite-pwa/nuxt', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', '@nuxt/ui', '@vueuse/nuxt']
  - css: '@/assets/css/main.css'
  - app.head: Spanish locale (es-CU), icons, and meta description
  - pwa:
    - registerType: 'autoUpdate', strategies: 'generateSW'
    - manifest: names/icons/screenshots; display: 'standalone', display_override: ['fullscreen','minimal-ui']
    - workbox: caches core assets (js, css, html, svg, png, ico, json, webp, woff2), CacheFirst for assets, cleanupOutdatedCaches, skipWaiting, clientsClaim
    - devOptions: enabled in dev, navigateFallback: '/'
  - vite: Tailwind plugin

Operational conventions
- Data persistence: inventory store persists to localStorage; hydration flags (isHydrating) are managed in Pinia persist hooks — expect initial render gating on hydration for certain views
- Navigation: the bottom nav is driven by appConfig.routes (name/title/emoji/path/icons). Update app/app.config.ts to change visible sections
- Currency: use utils helpers (cup/usd) for display consistency