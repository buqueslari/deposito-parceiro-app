<template>
  <div class="min-h-screen bg-cream pb-24">
    <AddressConfirmModal @confirmed="onAddressConfirmed" @detected="onLocationDetected" />
    <StoreCover
      :confirmed-address="confirmedAddress"
      :detected-city="detectedCity"
      :detected-state="detectedState"
    />
    <SearchBar v-model="searchQuery" />
    <CategoryNav :categories="CATEGORIES" v-model:activeCategory="activeCategory" />

    <main>
      <template v-if="searchQuery">
        <div class="px-4 pt-4 pb-2">
          <p class="text-sm text-ink/60">
            {{ filteredProducts.length }} resultado(s) para "{{ searchQuery }}"
          </p>
        </div>
        <div
          class="bg-white rounded-2xl mx-3 shadow-card overflow-hidden"
          v-if="filteredProducts.length"
        >
          <ProductCard
            v-for="p in filteredProducts"
            :key="p.id"
            :product="p"
            :qty="cart.getQty(p.id)"
            @add="cart.add(p)"
            @remove="cart.remove(p.id)"
            @select="selectedProduct = $event"
          />
        </div>
        <div v-else class="text-center py-12 text-ink/40">
          Nenhum produto encontrado.
        </div>
      </template>

      <template v-else>
        <CategorySection
          v-for="cat in CATEGORIES"
          :key="cat.id"
          :category="cat"
          :products="productsByCategory[cat.id] || []"
          :isCombo="cat.id === 'combos'"
          @select="selectedProduct = $event"
        />
      </template>
    </main>

    <ReviewsBlock />
    <AppFooter />
    <FloatingCart />

    <ProductDetailModal
      :product="selectedProduct"
      :qty="selectedProduct ? cart.getQty(selectedProduct.id) : 0"
      @close="selectedProduct = null"
      @add="selectedProduct && cart.add(selectedProduct)"
      @remove="selectedProduct && cart.remove(selectedProduct.id)"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { CATEGORIES, PRODUCTS } from '@/data/products'
import { useCartStore } from '@/stores/cart'
import { useTracking } from '@/composables/useTracking'

import AddressConfirmModal from '@/components/AddressConfirmModal.vue'
import StoreCover from '@/components/StoreCover.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryNav from '@/components/CategoryNav.vue'
import CategorySection from '@/components/CategorySection.vue'
import ProductCard from '@/components/ProductCard.vue'
import ReviewsBlock from '@/components/ReviewsBlock.vue'
import AppFooter from '@/components/AppFooter.vue'
import FloatingCart from '@/components/FloatingCart.vue'
import ProductDetailModal from '@/components/ProductDetailModal.vue'

const cart = useCartStore()
const { track } = useTracking()

const searchQuery    = ref('')
const activeCategory = ref(CATEGORIES[0].id)
const selectedProduct = ref(null)

onMounted(() => track('page_view'))

// Location state — fed by the address modal
const confirmedAddress = ref(cart.savedAddress || null)
const detectedCity     = ref(cart.savedAddress?.cidade || '')
const detectedState    = ref(cart.savedAddress?.uf     || '')

function onAddressConfirmed(addr) {
  cart.setAddress(addr)
  confirmedAddress.value = addr
  detectedCity.value     = addr.cidade
  detectedState.value    = addr.uf
}

function onLocationDetected({ city, state }) {
  if (!confirmedAddress.value) {
    detectedCity.value  = city
    detectedState.value = state
  }
}

// Filter products by search query against name and description
const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []
  return PRODUCTS.filter(p => {
    const name = (p.name || '').toLowerCase()
    const desc = (p.description || '').toLowerCase()
    return name.includes(q) || desc.includes(q)
  })
})

// Group all products by their categoryId
const productsByCategory = computed(() => {
  return PRODUCTS.reduce((acc, p) => {
    if (!acc[p.categoryId]) acc[p.categoryId] = []
    acc[p.categoryId].push(p)
    return acc
  }, {})
})

// When active category changes, smooth-scroll to that section
watch(activeCategory, (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})
</script>
