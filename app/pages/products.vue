<template>
  <div class="screen space-y-8">
    <h1 class="hidden">Productos</h1>
    <u-card variant="subtle">
      <form class="w-full flex" @submit.prevent="addProduct">
        <div class="w-full space-y-3">
          <div class="gap-3 flex">
            <u-input class="w-16" type="text" v-model="newProduct.emoji" maxlength="2" placeholder="emoji" />
            <u-input class="w-full" type="text" v-model="newProduct.name" placeholder="Nombre del producto.."
              required />
          </div>
          <u-textarea class="w-full mb-2" v-model="newProduct.description"
            placeholder="Descripción opcional..." variant="ghost" :rows="2" ></u-textarea>
          <div class="flex justify-end">
            <u-button icon="i-lucide-plus" type="submit">
              Añadir producto
            </u-button>
          </div>
        </div>
      </form>
    </u-card>

    <u-card class="mb-20">
      <template #header>
        <h2 class="mb-2">Lista de productos</h2>
        <u-select placeholder="Filtrar por local (coming soon)" disabled />
      </template>
      <div class="max-h-[60vh] overflow-y-auto">
        <p v-if="store.products.length === 0">No products added yet.</p>
        <ul class="space-y-4">
          <transition-group name="list">
            <sortable-draggable group="products" @start="drag = true" @end="drag = false" v-model="store.products"
              item-key="id" class="space-y-4" handle=".product-handle">
              <template #item="{ element }">
                <u-card v-if="element" variant="soft" @click="editProduct(element)">
                  <div class="flex items-start gap-4 justify-between ">
                    <div class="max-w-10 product-handle">
                      <u-input v-if="editingProduct && editingProduct.id == element.id" class="min-w-10" type="text"
                        v-model="editingProduct.emoji" maxlength="2" placeholder="emoji" />
                      <span v-else class="text-3xl min-w-10">{{ element.emoji }}</span>
                    </div>
                    <div class="space-y-1 flex-1 flex flex-col">
                      <template v-if="editingProduct && editingProduct.id == element.id">
                        <u-input v-model="editingProduct.name" placeholder="Nombre del producto..." />
                        <u-textarea v-model="editingProduct.description" placeholder="Descripción..." />
                      </template>
                      <template v-else>
                        <strong>{{ element.name }}</strong>
                        <p class="text-muted text-sm italic">{{ element.description }}</p>
                      </template>
                    </div>
                    <div class="flex flex-col">
                      <u-button v-if="editingProduct && editingProduct.id == element.id" size="sm" variant="subtle"
                        @click.stop="updateProduct()" class="small">Guardar</u-button>
                      <u-button v-else size="sm" variant="subtle" color="neutral" @click.stop="editProduct(element)"
                        class="small">Editar</u-button>
                    </div>
                  </div>
                  <template #footer>
                    <div @click.stop class="space-y-2">
                      <template v-for="loc in store.locations" :key="loc.id">
                        <u-card variant="soft" class="w-full"
                          v-if="store.getProductsByLocation(loc.id).some(p => p.id == element.id)">
                          <template v-for="p in store.getProductsByLocation(loc.id)" :key="p.id">
                            <div v-if="p.id == element.id" class=" flex justify-between">
                              <details>
                                <summary  :title="loc.name" :class="{ 'text-warning': p.unitsLeft < 0 }">
                                  <span class="mr-2">{{ loc.emoji }}</span> <b>{{ p.unitsLeft }}</b> de {{ p.totalBought }} comprados
                                </summary>
                                <div class="text-sm pt-2 ps-2">
                                  <p>{{ p.totalIncome.toFixed(2) }} CUP <span class="text-muted">de ingreso total</span>
                                  </p>
                                  <p :class="{ 'text-success': p.unitsLeft <= 0 }">{{ (p.unitsLeft *
                                    p.avgBuyPrice).toFixed(2) }} CUP
                                    <span class="text-muted">por recibir</span>
                                  </p>
                                </div>
                              </details>
                              <div :title="loc.name">
                                <u-badge variant="soft" color="neutral" class="font-black"> {{ loc.name.split(' ').at(0)?.at(0)}}{{loc.name.split(' ').at(1)?.at(0)??'' }}</u-badge>
                              </div>
                            </div>
                          </template>
                        </u-card>
                      </template>
                    </div>
                  </template>
                </u-card>
              </template>
            </sortable-draggable>
          </transition-group>
        </ul>
      </div>
    </u-card>

    <!-- Edit Product Form -->
    <dialog :open="editingProduct !== null" class="edit-form">
      <h3>Edit Product</h3>
      <form v-if="editingProduct" class="w-full flex" @submit.prevent="updateProduct">
        <div class="w-full">
          <div class="flex w-full mb-2">
            <u-input style="width: 24px;" type="text" v-model="editingProduct.emoji" maxlength="2" placeholder=": )" />
            <u-input class="w-full" type="text" v-model="editingProduct.name" placeholder="Product name.." required />
          </div>
          <u-textarea class="w-full mb-2" v-model="editingProduct.description"
            placeholder="Optional product description..."></u-textarea>
          <div class="flex justify-end">
            <u-button type="submit" class="primary">Guardar cambios</u-button>
            <u-button type="button" @click="cancelEdit" class="secondary">Cancelar</u-button>
          </div>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useInventoryStore } from '~/stores/useInventoryStore';
useSeoMeta({
  title: "Productos"
})
import SortableDraggable from 'vuedraggable'
const store = useInventoryStore();
const drag = ref(false)
const newProduct = ref({
  name: '',
  description: '',
  emoji: '📦',
});

const editingProduct = useState<Product | null>('editingProduct', () => null);

const addProduct = () => {
  if (!newProduct.value.name.trim()) return;
  store.addProduct({
    ...newProduct.value,
    name: newProduct.value.name.trim(),
  });
  newProduct.value = { name: '', description: '', emoji: '📦' };
};

const editProduct = (product: Product) => {
  editingProduct.value = { ...product }; // Create a copy to avoid modifying the original directly
};

const updateProduct = () => {
  if (editingProduct.value) {
    store.updateProduct(editingProduct.value);
    cancelEdit();
  }
};

const cancelEdit = () => {
  editingProduct.value = null;
};
</script>
