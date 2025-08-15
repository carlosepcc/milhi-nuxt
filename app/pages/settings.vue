<template>
  <div class="screen">
    <h1 class="hidden">Configuración</h1>
    <section class="py-4">

      <UCard variant="subtle">
        <template #header>
          <h3>Locales</h3>
          <p class="text-balance text-muted">Donde se venden los productos</p>
        </template>



        <ul>
          <li v-for="location in store.locations" :key="location.id"
            class="flex gap-3 items-center justify-between py-2">
            <div class="flex w-full items-center gap-4 flex-1">

              <template v-if="editingLocation != null && editingLocation.id == location.id">
                <u-input variant="subtle" class="max-w-10" type="text" v-model="editingLocation.emoji" maxlength="2"
                  placeholder=":)" /> </template>
              <span v-else class="text-3xl" @click="editLocation(location)">{{ location.emoji }}</span>

              <template v-if="editingLocation != null && editingLocation.id == location.id">
                <u-input variant="subtle" type="text" class="w-full" v-model="editingLocation.name" required />
              </template>
              <div v-else class="flex flex-col flex-1" @click="editLocation(location)">
                <strong>{{ location.name }}</strong>
                <small class="text-muted font-mono">@{{ location.id.split('-').at(-1) }}</small>
              </div>
            </div>
            <div class="space-x-2">
              <template v-if="editingLocation != null && editingLocation.id == location.id">
                <u-button variant="subtle" @click="updateLocation()" class="small">Guardar</u-button>

                <u-button color="neutral" variant="subtle" @click="cancelEditLocation()"
                  class="small danger">Cancelar</u-button>
              </template>
              <template v-else>
                <!-- <u-button color="neutral" variant="subtle" @click="editLocation(location)"
                  class="small">Editar</u-button> -->
                <u-button color="neutral" variant="subtle" @click="deleteLocation(location.id)"
                  class="small danger">Eliminar</u-button>
              </template>
            </div>
          </li>
        </ul>
        <template #footer>
          <form @submit.prevent="addLocation">
            <div class="flex items-center gap-3">
              <u-input variant="ghost" class="max-w-12" type="text" v-model="newLocation.emoji" maxlength="2"
                placeholder=":)" />
              <u-input variant="ghost" type="text" class="w-full" v-model="newLocation.name"
                placeholder="Nuevo local..." required />
              <u-button icon="mdi:storefront-plus" type="submit">Añadir</u-button>
            </div>
          </form>
        </template>
      </UCard>


    </section>

    <h2 class="py-4  mt-12">Datos</h2>
    <section class="space-y-4">

      <u-card variant="subtle">
        <template #header>
          <div class="flex justify-between"><strong>Respaldo</strong>
            <div class="space-x-2">
              <u-button icon="line-md:file-upload-twotone" variant="ghost" size="sm"
                @click.prevent="handleExportData()">Exportar</u-button>
              <u-button icon="line-md:file-download-twotone" variant="ghost" size="sm"
                @click.prevent="handleImportData(dataToImport)" :disabled="!dataToImport">Importar</u-button>

            </div>
          </div>
        </template>
        <u-textarea placeholder="Pegue aquí los datos.." :rows="8" class="w-full" v-model="dataToImport"></u-textarea>
      </u-card>
    </section>
    <u-card variant="subtle" class="my-20 space-y-4">
      <template #header><b>Información para desarrolladores</b></template>
      <u-card>
        <template #header><b>PWA</b></template>
        <pre class="m text-xs">{{ $pwa }}</pre>
      </u-card>
    </u-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useInventoryStore } from '~/stores/useInventoryStore';
useSeoMeta({
  title: "Configuración"
})
const store = useInventoryStore();

const newLocation = ref({
  name: '',
  emoji: '🏪',
});
const dataToImport = useState<string>('dataToImport')
function handleImportData(data: string = dataToImport.value) {
  store.importData(data)
}
const toast = useToast()
function handleExportData() {
  const { products, locations, records } = store
  const stringToImport = JSON.stringify({ version: 1, products, locations, records })
  const { copy, isSupported } = useClipboard()
  dataToImport.value = stringToImport
  try {
    if (!isSupported.value) {
      throw new Error('Copiar al portapapeles no está soportado en este navegador.')
    }
    copy(stringToImport);
    toast.add({ title: "Se han copiado los datos al portapapeles:", description: stringToImport.substring(0, 40) + '...' })
  } catch (e) {
    toast.add({ title: "Deberá copiar los datos manualmente", description: `${e}`, color: 'warning' })
  }
}
const editingLocation = ref<InventoryLocation | null>(null);
const showEditLocationForm = useState('isEditingLocation', () => false)
const addLocation = () => {
  if (!newLocation.value.name.trim()) return;
  store.addLocation(newLocation.value);
  newLocation.value = { name: '', emoji: '🏪' };
};

const editLocation = (location: InventoryLocation) => {
  showEditLocationForm.value = true
  editingLocation.value = { ...location }; // Create a copy
};

const updateLocation = () => {
  if (editingLocation.value) {
    store.updateLocation(editingLocation.value);
    cancelEditLocation();
  }
};

const cancelEditLocation = () => {
  showEditLocationForm.value = false
  editingLocation.value = null;
};

const deleteLocation = (id: string) => {
  const locationName = store.getLocationById(id)?.name || 'this location';
  if (confirm(`Are you sure you want to delete ${locationName}? This cannot be undone.`)) {
    store.deleteLocation(id);
  }
};

const { $pwa } = useNuxtApp()
</script>
