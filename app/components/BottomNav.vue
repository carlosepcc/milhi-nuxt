<template>
  <nav class="p-2 fixed bottom-0 right-0 left-0 lg:bottom-1 lg:left-1 lg:right-1 lg:rounded-md shadow-md border-t border-muted bg-elevated w-full max-w-xl mx-auto flex">
    <template v-for="route in appConfig.routes" :key="route.name">

      <NuxtLink :to="route.path" class="nav-button flex flex-col items-center text-center" active-class="active"
        title="Settings">
        <u-button class="rounded-full text-muted in-[.active]:text-primary" v-if="route.icons[0]"
          :variant="$route.path == route.path ? 'soft' : 'link'"
          :icon="route.icons[1]" />
        <div v-else class="p-2 w-full rounded-full in-[.active]:bg-accented"><span
            class="brightness-50 dark:brightness-125 contrast-20 sepia in-[.active]:contrast-150">{{ route.emoji
            }}</span></div>
        <small class="text-muted text-sm">{{ route.title }}</small>
      </NuxtLink>
    </template>
  </nav>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<style scoped>
.nav-button {
  @apply transition-all;
  flex: 1;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  /* Increased icon size for better touch interaction */
  transition: all 0.2s;
  margin: 0;
  text-align: center;
  text-decoration: none;
}

.nav-button:not(.active):hover {
  @apply scale-110
}

.nav-button>div {

  font-size: 1.2rem;

}
</style>
