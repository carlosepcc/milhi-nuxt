<script setup>
// If you want to use it in setup, import from the nuxtApp.
const { $pwa } = useNuxtApp()

const toast = useToast()

onMounted(() => {
  if ($pwa.offlineReady)
    toast.success('App ready to work offline')
})
</script>

<template>
  <!-- You can use $pwa directly in templates! -->
<div v-if="$pwa && $pwa.serviceWorkerActivated" class="p-2">
  
    <u-card variant="subtle">
      <div v-if="!$pwa.isPWAInstalled" class="flex gap-2 justify-between items-center -m-2">
        <small class="flex-1 ps-2 text-muted"><b>Instale Milhi</b> para una mejor experiencia</small>
          <u-button color="warning" size="xs" variant="ghost" icon="material-symbols:install-mobile-rounded"  @click="$pwa.install()">
            Instalar
          </u-button>
      </div>
    </u-card>
    <u-card variant="subtle" v-show="$pwa.needRefresh">
      <small class="text-muted">
        Nuevas características disponibles. Puedes recargar para actualizarte.
      </small>
  
      <u-button variant="subtle" icon="line-md:downloading" @click="$pwa.updateServiceWorker()">
        Recargar
      </u-button>
    </u-card>
</div>
</template>