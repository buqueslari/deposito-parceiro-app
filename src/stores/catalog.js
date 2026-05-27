import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PRODUCTS as DEFAULT_PRODUCTS } from '@/data/products'
import { useCartStore } from '@/stores/cart'

export const useCatalogStore = defineStore('catalog', () => {
  const products = ref(DEFAULT_PRODUCTS)
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      const res = await fetch('/api/v1/products', { headers: { Accept: 'application/json' } })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.products)) {
          products.value = data.products
          useCartStore().syncProducts(data.products)
        }
      }
    } catch {
      products.value = DEFAULT_PRODUCTS
    } finally {
      loading.value = false
    }
  }

  return { products, loading, load }
})
