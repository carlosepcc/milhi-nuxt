<template>
  <div class="screen space-y-4">
    <h1 class="hidden">Registro</h1>

    <u-collapsible v-model:open="isNewRecordFormOpen">
      <template #content>
        <form @submit.prevent class="rounded-md mb-6 p-0.5">
          <u-card variant="subtle">
            <div class="cursor-pointer flex items-center justify-between mb-6">
              <h3>Registrar nuevo movimiento</h3>
              <u-button color="neutral" @click="isNewRecordFormOpen = false" size="sm" icon="material-symbols:close"
                variant="ghost" />
            </div>
            <fieldset class="flex flex-col gap-3 mb-3 pb-3">
              <div class="flex gap-3">
                <u-input icon="material-symbols:today" variant="subtle" class="flex-1" type="date"
                  v-model="newRecord.date" required />
                <u-select icon="material-symbols:store" variant="subtle" class="flex-1" :ui="{ content: 'min-w-fit' }"
                  label-key="name" value-key="id" v-model="newRecord.location" required :items="store.locations">
                  <template #item-leading="{ item }">
                    {{ item.emoji }}
                  </template>
                  <template #leading>
                    <template v-if="newRecord.location">
                      {{ store.getLocationById(newRecord.location)?.emoji }}
                    </template>
                  </template>
                  <template #content-bottom>
                    <nuxt-link href="/settings" class="p-1">
                      <u-button class="w-full" color="neutral" variant="link" icon="mdi:storefront-plus">Nuevo
                        local</u-button>
                    </nuxt-link>
                  </template>
                </u-select>
              </div>
              <div class="flex gap-3 ">

                <u-select icon="mage:box-3d-check-fill" size="xl" class="w-full" variant="subtle" label-key="name"
                  value-key="id" :items="store.products" v-model="newRecord.productId"
                  placeholder="Seleccione el producto">
                  <template #leading="{ modelValue }">
                    <span v-if="modelValue && store.getProductById(modelValue)?.emoji"
                      v-text="store.getProductById(modelValue)?.emoji"></span>
                  </template>
                  <template #item-leading="{ item }">
                    {{ item.emoji }}
                  </template>
                  <template #content-top>
                    <nuxt-link href="/products" class="p-1">
                      <u-button class="w-full" variant="link" color="neutral" icon="mage:box-3d-plus-fill">Nuevo
                        producto</u-button>
                    </nuxt-link>
                  </template>
                </u-select>
              </div>
              <div class="flex gap-3">
                <u-form-field label="Cantidad de unidades">

                  <u-input size="xl" placeholder="Cantidad" variant="outline" type="number"
                    v-model.number="newRecord.units" required />
                </u-form-field>
                <u-form-field label="Precio unitario">
                  <u-input size="xl" variant="outline" type="number" v-model.number="newRecord.price" min="0" step="10"
                    required>
                    <template #leading>
                      <b class="text-muted">CUP</b>
                    </template>
                  </u-input>
                </u-form-field>
              </div>
              <u-textarea :rows="2" variant="ghost" class="w-full" placeholder="Detalles opcionales.."
                v-model="newRecord.details" />

            </fieldset>
            <div v-if="isNewRecordFormOpen" class="flex justify-end gap-3 " @click.stop="isNewRecordFormOpen = true">
              <u-button :disabled="isNewRecordFormOpen && !isNewRecordValid" icon="i-lucide-arrow-down" class="flex-1"
                size="xl" color="info" variant="solid" @click.prevent="handleAddEntry">Entrada</u-button>
              <u-button :disabled="isNewRecordFormOpen && !isNewRecordValid"
                icon="material-symbols:add-shopping-cart-outline-rounded" class="flex-1" size="xl" variant="solid"
                @click.prevent="handleAddSell">Venta</u-button>
            </div>
          </u-card>
        </form>
      </template>
    </u-collapsible>
    <u-modal :open="editingRecord != null">
      <template #content>
        <form @submit.prevent class="rounded-md" v-if="editingRecord != null">
          <u-card variant="subtle">
            <template #header>
              <div class="cursor-pointer flex items-center justify-between"
                @click.stop="isEditingRecordFormOpen = !isEditingRecordFormOpen">
                <h3>Editar movimiento</h3>
                <u-button @click="cancelEditRecord()" variant="ghost" color="neutral"
                  icon="material-symbols:close"></u-button>
              </div>
            </template>
            <fieldset class="flex flex-col gap-3 mb-3 pb-3">
              <div class="flex gap-3 ">
                <u-input size="xl" placeholder="Cantidad" class="max-w-28" variant="subtle" type="number"
                  v-model.number="editingRecord.units" required />
                <u-select icon="i-lucide-box" size="xl" class="w-full" variant="subtle" label-key="name" value-key="id"
                  :items="store.products" v-model="editingRecord.productId" placeholder="Seleccione el producto">
                  <template #leading="{ modelValue }">
                    <span v-if="modelValue && store.getProductById(modelValue)?.emoji"
                      v-text="store.getProductById(modelValue)?.emoji"></span>
                  </template>
                  <template #item-leading="{ item }">
                    {{ item.emoji }}
                  </template>
                  <template #content-top>
                    <nuxt-link href="/products" class="p-1">
                      <u-button size="xl" class="w-full" variant="ghost">+ Nuevo producto</u-button>
                    </nuxt-link>
                  </template>
                </u-select>
                <!-- <label class="w-full">
              <select class="w-full" v-model="editingRecord.productId" required>
                <option value="" disabled>Selecciona un producto</option>
                <option v-for="product in store.products" :key="product.id" :value="product.id">
                  {{ product.emoji }} {{ product.name }}
                </option>
              </select>
            </label> -->
              </div>
              <div class="flex gap-3">
                <u-input size="xl" variant="subtle" class="flex-1" type="date" v-model="editingRecord.date" required />
                <u-select size="xl" variant="subtle" class="flex-1" :ui="{ content: 'min-w-fit' }" label-key="name"
                  value-key="id" v-model="editingRecord.location" required :items="store.locations">
                  <template #item-leading="{ item }">
                    {{ item.emoji }}
                  </template>
                  <template #leading>
                    <template v-if="newRecord.location">
                      {{ store.getLocationById(newRecord.location)?.emoji }}
                    </template>
                  </template>

                  <template #content-bottom>
                    <nuxt-link href="/settings" class="p-1">
                      <u-button class="w-full" color="neutral" variant="link" icon="material-symbols:add">Nuevo
                        local</u-button>
                    </nuxt-link>
                  </template>
                </u-select>
              </div>
              <div class="flex gap-3">
                <u-form-field label="Precio unitario">
                  <u-input size="xl" variant="subtle" type="number" v-model.number="editingRecord.price" min="0"
                    step="10" required>
                    <template #leading>
                      <b class="text-muted">CUP</b>
                    </template>
                  </u-input>
                </u-form-field>
                <!-- <label>
              Cantidad (u)
              <u-input variant="subtle" type="number" v-model.number="editingRecord.units" min="1" required/>
            </label> -->
                <!-- <label>
              Precio unitario
              <input type="number" v-model.number="editingRecord.price" min="0" step="0.01" required>
            </label> -->
              </div>
              <label style="display: block;">
                <u-textarea size="xl" variant="subtle" class="w-full" placeholder="Detalles opcionales.."
                  v-model="editingRecord.details" />
              </label>
            </fieldset>
            <div class="flex justify-end gap-3 " v-if="editingRecord != null">
              <u-button :disabled="isEditingRecordFormOpen && !isEditingRecordValid" icon="i-lucide-arrow-down"
                class="flex-1" size="xl" color="info" :variant="editingRecord.units >= 0 ? 'solid' : 'subtle'"
                @click.prevent="store.updateRecord(editingRecord); cancelEditRecord()">Entrada</u-button>
              <u-button :disabled="isEditingRecordFormOpen && !isEditingRecordValid"
                icon="material-symbols:add-shopping-cart-outline-rounded" class="flex-1" size="xl"
                :variant="editingRecord.units < 0 ? 'solid' : 'subtle'"
                @click.prevent="store.updateRecord({ ...editingRecord, units: Math.abs(editingRecord.units) * -1 }); cancelEditRecord()">Venta</u-button>
            </div>
          </u-card>
        </form>
      </template>
    </u-modal>
    <div class="flex gap-3 sticky top-0 z-10 bg-muted rounded-md">
      <u-select variant="ghost" :icon="'material-symbols:store'" class="w-full" :ui="{ content: 'min-w-fit' }"
        :default-value="store.locations[0]?.id" v-model="recordFilters.location"
        :items="[{ id: 'all', name: 'Todos', emoji: '' }, ...store.locations]" value-key="id" label-key="name">
        <template #leading>
          <template v-if="recordFilters.location != 'all'">
            {{ store.getLocationById(recordFilters.location)?.emoji }}
          </template>
        </template>
        <template #item-leading="{ item }">{{ item.emoji }}</template>
      </u-select>
      <u-select variant="ghost" class="w-full" v-model="recordSorting.date"
        :icon="recordSorting.date == 'desc' ? 'material-symbols:clock-arrow-up-outline-rounded' : 'material-symbols:clock-arrow-down-outline-rounded'"
        :items="[{
          label: 'Recientes al inicio', value: 'desc', icon: 'material-symbols:clock-arrow-up-outline-rounded'
        }, {
          label: 'Recientes al final', value: 'asc', icon: 'material-symbols:clock-arrow-down-outline-rounded'
        },]">
      </u-select>
    </div>

    <section class="mb-28">
      <p class="my-4" v-if="filteredSortedRecords.length === 0">Sin movimientos registrados.</p>


      <UTimeline :default-value="2" :items="filteredSortedRecords" class="max-w-128">

        <template #indicator="{ item }">
          <div class="rounded-full p-0.5 aspect-1 size-full text-center bg-elevated border-2"
            :class="item.units > 0 ? 'border-secondary' : 'border-primary'">{{
              store.getProductById(item.productId)?.emoji }}
          </div>
        </template>
        <template #date="{ item }">
          <div class="flex gap-1">
            <!-- Card -->
            <u-card @click="handleEditRecord(item)" :title="getProductName(item.productId)" variant="soft"
              class="flex-1 -mt-1">
              <div class="flex justify-between gap-2 text-sm">
                <!-- First column -->
                <div class="">
                  <div class="space-x-2">
                    <b class="text-secondary" :class="item.units > 0 ? 'text-info' : 'text-success'">{{ item.units
                      }}</b>
                    <strong>{{ getProductName(item.productId) }}</strong>
                  </div>
                  <div class="flex gap-3 items-baseline mt-2">
                    <b>${{ item.price }}</b>
                    <template v-if="item.units > 1">
                      <span>.</span>
                      <b>${{ (item.price *
                        Math.abs(item.units)) }}</b>
                    </template>
                  </div>
                </div>
                <!-- Second column -->
                <div class="flex flex-col justify-between items-end">

                  <small class="gap-1 items-end flex flex-col justify-between h-full">
                    <span>{{ getLocationEmoji(item.location) }}</span><span>{{ item.date.substring(5) }}</span>
                  </small>
                </div>
              </div>

              <i>{{ item.details }}</i>
            </u-card>
            <!-- Actions -->
            <div class="pt-2">
              <u-button size="xs" variant="link" color="neutral" icon="material-symbols:delete"
                @click="deleteRecord(item)" />

            </div>
          </div>
        </template>
      </UTimeline>
    </section>
    <ButtonFab :color="isNewRecordFormOpen ? 'neutral' : 'primary'" :variant="isNewRecordFormOpen ? 'outline' : 'solid'"
      @click="isNewRecordFormOpen = !isNewRecordFormOpen"
      :icon="isNewRecordFormOpen ? 'material-symbols:keyboard-arrow-up' : undefined" />
    <!-- <u-button size="xl" class="fixed bottom-24 right-4 shadow-2xl" icon="material-symbols:add"></u-button> -->

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useInventoryStore } from '~/stores/useInventoryStore';
useSeoMeta({
  title: "Registro"
})
const store = useInventoryStore();
const isNewRecordFormOpen = useState<boolean>('isNewRecordFormOpen', () => false)
const newRecord = useState<Omit<InventoryRecord, 'id'>>('newRecord', () => ({
  productId: '',
  location: '',
  type: 'sell' as 'buy' | 'sell',
  units: 10,
  price: 100,
  date: new Date().toISOString(),
  details: '',
}));
const isNewRecordValid = computed<boolean>(() => {
  const { date, location, price, productId, units } = newRecord.value
  if (date && location && price && productId) return true
  else return false
})
const recordFilters = useState<{ location: 'all' | string }>('recordFilters', () => ({ location: 'all' }));
const recordSorting = useState<{ date: 'desc' | 'asc' }>('recordSorting', () => ({ date: 'desc' }));

const editingRecord = useState<InventoryRecord | null>('editingRecord', () => null);
const handleEditRecord = (record: InventoryRecord) => {
  editingRecord.value = { ...record };
}

const isEditingRecordFormOpen = computed(() => editingRecord != null)
const cancelEditRecord = () => {
  editingRecord.value = null;
};
const isEditingRecordValid = computed<boolean>(() => {
  if (!editingRecord.value) return false
  const { date, location, price, productId, units } = editingRecord.value
  if (date && location && price && productId) return true
  else return false
})
const updateRecord = () => {
  if (editingRecord.value) {
    store.updateRecord(editingRecord.value);
    cancelEditRecord();
  }
};
const addRecord = (data: CreateInventoryRecord = newRecord.value) => {
  if (!data.productId || !data.location) return;
  store.addRecord(data);
  // Reset form
  newRecord.value = {
    ...newRecord.value,
    productId: '',
    units: 1,
    details: '',
  };
};
const handleAddEntry = () => addRecord({ ...newRecord.value, type: "buy" })
const handleAddSell = () => addRecord(recordToV2({ ...newRecord.value, type: "sell" }))


const deleteRecord = (record: InventoryRecord) => {
  const productName = getProductName(record.productId);
  if (confirm(`You are about to delete the ${record.units} ${getProductEmoji(record.productId)} ${productName} record permanently. Are you sure?`)) {
    store.deleteRecord(record.id);
  }
}

const getProductName = (id: string) => store.getProductById(id)?.name || 'Unknown';
const getProductEmoji = (id: string) => store.getProductById(id)?.emoji || '📦';
const getLocationEmoji = (id: string) => store.getLocationById(id)?.emoji || '🏪';

const filteredSortedRecords = computed(() => {
  let records = [...store.records];

  if (recordFilters.value.location != 'all') {
    records = records.filter(r => r.location === recordFilters.value.location);
  }

  records.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return recordSorting.value.date === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return records;
});

onMounted(() => {
  newRecord.value.location ||= store.locations[0]?.id ?? newRecord.value.location
  newRecord.value.date = newRecord.value.date ?? new Date().toString()
})
</script>
