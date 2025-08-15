<script setup lang="ts">
import {es} from '@nuxt/ui/locale'
</script>

<style>
@import "tailwindcss";
</style>

<template>
<UApp :locale="es">
  <NuxtPwaAssets/>
  <PwaChecker/>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <NuxtRouteAnnouncer />
</UApp>
</template>
