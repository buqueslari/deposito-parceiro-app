<template>
  <div class="min-h-screen bg-cream pb-24">
    <AddressConfirmModal @confirmed="onAddressConfirmed" @detected="onLocationDetected" />
    <StoreCover
      :confirmed-address="confirmedAddress"
      :detected-city="detectedCity"
      :detected-state="detectedState"
      :settings="storeSettings"
    />
    <div class="px-4 pt-3">
      <button
        @click="handleTopWhatsApp"
        class="w-full h-14 rounded-2xl bg-[#008A00] text-white shadow-cta flex items-center justify-center gap-2 font-extrabold text-base hover:bg-[#007A00] active:scale-[0.98] transition-all"
      >
        <svg class="w-5 h-5" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16.02 3C8.86 3 3.04 8.7 3.04 15.72c0 2.4.68 4.74 1.98 6.76L3 29l6.72-1.96a13.26 13.26 0 0 0 6.3 1.59C23.18 28.63 29 22.93 29 15.9S23.18 3 16.02 3Zm0 23.45c-1.93 0-3.82-.52-5.47-1.5l-.39-.23-3.98 1.16 1.18-3.82-.25-.4a10.46 10.46 0 0 1-1.66-5.94c0-5.82 4.74-10.55 10.57-10.55s10.57 4.73 10.57 10.55-4.74 10.73-10.57 10.73Zm5.8-7.9c-.32-.16-1.88-.91-2.17-1.02-.29-.1-.5-.16-.71.16-.21.31-.82 1.01-1 1.22-.19.2-.37.23-.69.08-.32-.16-1.34-.49-2.56-1.55-.94-.83-1.58-1.86-1.77-2.18-.18-.31-.02-.48.14-.64.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.1-.2.05-.39-.03-.55-.08-.16-.71-1.68-.98-2.3-.26-.6-.52-.52-.71-.53h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.06-1.1 2.58s1.13 3 1.29 3.2c.16.21 2.22 3.33 5.38 4.67.75.32 1.34.51 1.8.65.76.23 1.45.2 1.99.12.61-.09 1.88-.75 2.14-1.48.27-.73.27-1.35.19-1.48-.08-.13-.29-.2-.61-.36Z"/>
        </svg>
        Comprar pelo WhatsApp
      </button>
    </div>
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
import { CATEGORIES } from '@/data/products'
import { useCartStore } from '@/stores/cart'
import { useCatalogStore } from '@/stores/catalog'
import { useStorefrontSettingsStore } from '@/stores/storefrontSettings'
import { useTracking } from '@/composables/useTracking'
import { openStoreWhatsApp } from '@/lib/whatsapp'

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
const catalog = useCatalogStore()
const storefrontSettings = useStorefrontSettingsStore()
const { track } = useTracking()

const searchQuery    = ref('')
const activeCategory = ref(CATEGORIES[0].id)
const selectedProduct = ref(null)
const storeSettings = computed(() => storefrontSettings.settings)

onMounted(() => {
  track('page_view')
  catalog.load()
  storefrontSettings.load()
})

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

function handleTopWhatsApp() {
  track('whatsapp_buy', { source: 'home_top' })
  openStoreWhatsApp({ address: cart.savedAddress })
}

// Filter products by search query against name and description
const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []
  return catalog.products.filter(p => {
    const name = (p.name || '').toLowerCase()
    const desc = (p.description || '').toLowerCase()
    return name.includes(q) || desc.includes(q)
  })
})

// Group all products by their categoryId
const productsByCategory = computed(() => {
  return catalog.products.reduce((acc, p) => {
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
