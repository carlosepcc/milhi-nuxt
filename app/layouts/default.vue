<template>
    <main>
      <slot />
    </main>
    <BottomNav />
</template>

<script setup lang="ts">

  const route = useRoute()
useHead({
  meta: [{ property: 'og:title', content: `MiLhi - ${route.meta.title}` }]
})

// This layout doesn't require any specific logic.
</script>

<style scoped>
/* Scoped styles for the layout can be added here if needed */
</style>
