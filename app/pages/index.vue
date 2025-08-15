<template>
  <div class="screen space-y-6">
    <h1 class="hidden">Resumen</h1>
    <div class="space-y-4">
      <u-card variant="soft">
        <h3>Total invertido</h3>
        <p>${{ store.totalSpent.toFixed(2) }}</p>
        <small>En {{ store.buyTransactions }} compras</small>
      </u-card>
      <u-card variant="soft">
        <h3>Total de ingresos</h3>
        <p>${{ store.totalIncome.toFixed(2) }}</p>
        <small>Des {{ store.sellTransactions }} ventas</small>
      </u-card>
      <u-card variant="soft" :class="{ 'profit': store.estimatedProfit > 0, 'loss': store.estimatedProfit < 0 }">
        <h3>Ganancia</h3>
        <p :class="{ 'text-warning': store.estimatedProfit < 0 }">{{ store.estimatedProfit.toFixed(2) }} CUP</p>
        <small class="text-warning" v-if="store.estimatedProfit < 0">En recuperación de inversión</small>
      </u-card>
      <u-card variant="soft" v-if="store.records.length > 0">
        <h3>Margen de ganancia</h3>
        <p>{{ (store.profitMargin * 100).toFixed(1) }}%</p>
        <small>Por todas las transacciones</small>
      </u-card>
      <hr />
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
