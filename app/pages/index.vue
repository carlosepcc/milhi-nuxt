<template>
  <div class="screen space-y-6">
    <h1 class="hidden">Resumen</h1>
    <div class="space-y-4 flex flex-wrap justify-center">
      <u-card variant="soft">
        <p class="font-light text-muted">Total invertido</p>
        <p class="text-sm font-light text-muted">En {{ store.buyTransactions }} compras</p>
        <p>${{ store.totalSpent.toFixed(2) }}</p>
      </u-card>
      <u-card  variant="soft">
        <p class="font-light text-muted">Total de ingresos</p>
        <p class="text-sm font-light text-muted">De {{ store.sellTransactions }} ventas</p>
        <p>${{ store.totalIncome.toFixed(2) }}</p>
      </u-card>
      <u-card  variant="soft" :class="{ 'profit': store.estimatedProfit > 0, 'loss': store.estimatedProfit < 0 }">
        <p class="font-light text-muted">Ganancia</p>
        <p class="text-warning" v-if="store.estimatedProfit < 0">En recuperación de inversión</p>
        <p class="" :class="{ 'text-warning': store.estimatedProfit < 0 }">{{ store.estimatedProfit.toFixed(2) }} CUP</p>
      </u-card>
      <u-card  variant="soft" v-if="store.records.length > 0">
        <p class="font-light text-muted">Margen de ganancia</p>
        <p class="text-sm font-light text-muted" >Por todas las transacciones</p>
        <p class="">{{ (store.profitMargin * 100).toFixed(1) }}%</p>
      </u-card>
     <u-separator/>
      <h3>{{ store.products.length }} &nbsp;Productos en total</h3>
    </div>
    <div class="space-y-4 mb-20">
      <template v-for="loc in store.locations" :key="loc.id">
        <u-card variant="soft" class="w-full" v-if="store.getProductsByLocation(loc.id).length">
          <template #header><strong> {{ loc.emoji }} &nbsp; En {{ loc.name }}</strong></template>
          <template v-for="product in store.getProductsByLocation(loc.id)" :key="product.id">
            <div class=" mb-4">
              <b>{{ product.emoji }} {{ product.name }}</b>
              <p :class="{ 'text-warning': product.unitsLeft < 0 }">
                <b>{{ product.unitsLeft }}</b> de {{ product.totalBought }} comprados
              </p>
              <small>
                <p>{{ product.totalIncome.toFixed(2) }} CUP <span class="text-muted">de ingreso total</span></p>
                <p :class="{ 'text-success': product.unitsLeft <= 0 }">{{ (product.unitsLeft * product.avgBuyPrice).toFixed(2) }} CUP
                  <span class="text-muted">por recibir</span></p>
              </small>
            </div>
          </template>
          <template v-if="store.getProductsByLocation(loc.id).length === 0">
            <p>No products in this location</p>
          </template>
        </u-card>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInventoryStore } from '@/stores/useInventoryStore';
useSeoMeta({
  title: "Resumen"
})
const store = useInventoryStore();
</script>
