import { defineStore } from "pinia";

export const useInventoryStore = defineStore("inventory", {
  state: (): InventoryState => ({
    products: [],
    records: [],
    locations: [],
  }),

  getters: {
    // Transactions
    buyTransactions: (state) => state.records.filter((r) => r.units > 0).length,
    sellTransactions: (state) =>
      state.records.filter((r) => r.units < 0).length,

    // Financials
    totalSpent: (state) => {
      return state.records
        .filter((r) => r.units > 0)
        .reduce((sum, record) => sum + record.units * record.price, 0);
    },
    totalIncome: (state) => {
      return state.records
        .filter((r) => r.units < 0)
        .reduce(
          (sum, record) => sum + Math.abs(record.units) * record.price,
          0
        );
    },
    estimatedProfit(): number {
      return this.totalIncome - this.totalSpent;
    },
    profitMargin(): number {
      if (this.totalIncome === 0) return 0;
      return this.estimatedProfit / this.totalIncome;
    },

    // Product and Location helpers
    getProductById: (state) => (id: string) =>
      state.products.find((p) => p.id === id),
    getLocationById: (state) => (id: string) =>
      state.locations.find((l) => l.id === id),

    getProductsByLocation: (state) => (locationId: string) => {
      const productsMap = new Map();
      state.records
        .filter((rec) => rec.location === locationId)
        .forEach((record) => {
          const product = state.products.find((p) => p.id === record.productId);
          if (!product) return;

          if (!productsMap.has(record.productId)) {
            productsMap.set(record.productId, {
              id: record.productId,
              emoji: product.emoji || "📦",
              name: product.name,
              totalBought: 0,
              totalSold: 0,
              totalIncome: 0,
              totalCost: 0,
              avgBuyPrice: 0,
            });
          }

          const productData = productsMap.get(record.productId);
          const units = Number(record.units) || 0;
          const price = Number(record.price) || 0;

          if (record.units > 0) {
            productData.totalBought += units;
            productData.totalCost += units * price;
            productData.avgBuyPrice =
              productData.totalBought > 0
                ? productData.totalCost / productData.totalBought
                : 0;
          } else {
            productData.totalSold += Math.abs(units);
            productData.totalIncome += units * price;
          }
        });

      return Array.from(productsMap.values()).map((p) => ({
        ...p,
        unitsLeft: p.totalBought - p.totalSold,
      }));
    },
  },

  actions: {
    // Product Actions
    addProduct(product: Omit<Product, "id">) {
      const newId = `${Date.now()}-${slugify(product.name)}`;
      this.products.push({ id: newId, ...product });
    },
    updateProduct(updatedProduct: Product) {
      const index = this.products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
    },
    deleteProduct(productId: string) {
      this.products = this.products.filter((p) => p.id !== productId);
      // Also remove associated records
      this.records = this.records.filter((r) => r.productId !== productId);
    },

    // Record Actions
    addRecord(record: Omit<InventoryRecord, "id">) {
      const newId =
        new Date(record.date).getMilliseconds().toString() +
        `-${record.units}-${record.productId.split("-").at(-1)}-${
          record.price
        }`;

      let newRecordValue = recordToV2(record);
      this.records.push({ id: newId, ...newRecordValue });
    },
    updateRecord(updatedRecord: InventoryRecord) {
      const index = this.records.findIndex((p) => p.id === updatedRecord.id);
      if (index !== -1) {
        this.records[index] = updatedRecord;
      }
    },
    deleteRecord(recordId: string) {
      this.records = this.records.filter((r) => r.id !== recordId);
    },

    // Location Actions
    addLocation(location: Omit<InventoryLocation, "id">) {
      const newId = `${Date.now()}-${slugify(location.name)}`;
      this.locations.push({ id: newId, ...location });
    },
    updateLocation(updatedLocation: InventoryLocation) {
      const index = this.locations.findIndex(
        (l) => l.id === updatedLocation.id
      );
      if (index !== -1) {
        this.locations[index] = updatedLocation;
      }
    },
    deleteLocation(locationId: string) {
      if (this.records.some((r) => r.location === locationId)) {
        alert("No se puede eliminar un local con registros de compra / venta todavía asociados.");
        return;
      }
      this.locations = this.locations.filter((l) => l.id !== locationId);
    },
    importData(data: string) {
      console.log("User wants to import data that needs to be parsed: ", data);
      try {
        let parsed: DataToImport = JSON.parse(data);
        console.log("Parsed data to import: ", parsed);

        if (parsed.version && parsed.version == 1) {
          console.log("Parsed data version: ", parsed.version);
          if (parsed.products) {
            if (
              confirm("Se detectaron Productos y se añadirán a los existentes")
            ) {
              let newProducts = parsed.products.filter(
                (pprod) => !this.products.some((p) => p.id == pprod.id)
              );
              newProducts.forEach((newP) => this.products.push(newP));
            }
          }
          if (parsed.locations) {
            if (
              confirm("Se detectaron Locales y se unirán con los existentes")
            ) {
              let newLocations = parsed.locations.filter(
                (ploc) => !this.locations.some((loc) => loc.id == ploc.id)
              );
              this.locations = [...this.locations, ...newLocations];
            }
          }
          if (parsed.records) {
            if (
              confirm(
                "Se detectaron registros. Se reemplazarán los existentes por los importados. Continuar?"
              )
            ) {
              this.records = parsed.records.map(
                (rec) => recordToV2(rec) as InventoryRecord
              );
            }
          }
        } else
          throw new Error("Version: " + parsed.version + " is not supported");
      } catch (error) {
        alert(`Hubo un error al importar los datos: ${JSON.stringify(error)} `);
      } finally {
        alert("Importación finalizada");
      }
    },
  },

  // Enable persistence
  persist: true,
});
