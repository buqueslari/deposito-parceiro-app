<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="product"
        class="fixed inset-0 z-50 flex flex-col justify-end"
        @click.self="$emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />

        <!-- Sheet -->
        <div class="relative bg-white rounded-t-3xl overflow-hidden max-h-[92vh] flex flex-col">

          <!-- Drag handle -->
          <div class="flex justify-center pt-3 pb-0 flex-shrink-0 bg-white">
            <div class="w-10 h-1 bg-ink/15 rounded-full"></div>
          </div>

          <!-- Scrollable content -->
          <div class="overflow-y-auto flex-1">

            <!-- Image area -->
            <div class="relative bg-white">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full object-contain bg-white"
                style="max-height: 280px; min-height: 200px;"
              />
              <!-- Discount badge -->
              <div
                v-if="discountPct > 0"
                class="absolute top-3 right-3 bg-seal text-white text-xs font-extrabold px-2.5 py-1 rounded"
              >
                {{ discountPct }}% OFF
              </div>
            </div>

            <!-- Info -->
            <div class="px-5 pt-4 pb-6">
              <!-- Name -->
              <h2 class="font-extrabold text-ink text-xl leading-snug mb-1.5">
                {{ product.name }}
              </h2>

              <!-- Description -->
              <p v-if="product.description" class="text-sm text-ink/55 leading-relaxed mb-4">
                {{ product.description }}
              </p>

              <div class="border-t border-ink/[0.06] mb-4"></div>

              <!-- Price -->
              <div class="mb-5">
                <span
                  v-if="product.oldPrice"
                  class="block text-sm line-through text-ink/35 mb-0.5"
                >
                  {{ fmt(product.oldPrice) }}
                </span>
                <span class="text-4xl font-extrabold tabular-nums" style="color:#15803D">
                  {{ fmt(product.price) }}
                </span>
              </div>

              <!-- Add to cart button -->
              <button
                @click="handleAdd"
                class="w-full flex items-center justify-center gap-2 bg-action text-white font-bold py-4 rounded-2xl text-base shadow-cta hover:bg-action-deep active:scale-[0.98] transition-all"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Adicionar ao carrinho
              </button>

              <button
                @click="handleWhatsAppBuy"
                class="mt-3 w-full flex items-center justify-center gap-2 bg-[#008A00] text-white font-bold py-4 rounded-2xl text-base shadow-cta hover:bg-[#007A00] active:scale-[0.98] transition-all"
              >
                <svg class="w-5 h-5" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                  <path d="M16.02 3C8.86 3 3.04 8.7 3.04 15.72c0 2.4.68 4.74 1.98 6.76L3 29l6.72-1.96a13.26 13.26 0 0 0 6.3 1.59C23.18 28.63 29 22.93 29 15.9S23.18 3 16.02 3Zm0 23.45c-1.93 0-3.82-.52-5.47-1.5l-.39-.23-3.98 1.16 1.18-3.82-.25-.4a10.46 10.46 0 0 1-1.66-5.94c0-5.82 4.74-10.55 10.57-10.55s10.57 4.73 10.57 10.55-4.74 10.73-10.57 10.73Zm5.8-7.9c-.32-.16-1.88-.91-2.17-1.02-.29-.1-.5-.16-.71.16-.21.31-.82 1.01-1 1.22-.19.2-.37.23-.69.08-.32-.16-1.34-.49-2.56-1.55-.94-.83-1.58-1.86-1.77-2.18-.18-.31-.02-.48.14-.64.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.1-.2.05-.39-.03-.55-.08-.16-.71-1.68-.98-2.3-.26-.6-.52-.52-.71-.53h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.06-1.1 2.58s1.13 3 1.29 3.2c.16.21 2.22 3.33 5.38 4.67.75.32 1.34.51 1.8.65.76.23 1.45.2 1.99.12.61-.09 1.88-.75 2.14-1.48.27-.73.27-1.35.19-1.48-.08-.13-.29-.2-.61-.36Z"/>
                </svg>
                Comprar pelo WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useTracking } from '@/composables/useTracking'
import { useCartStore } from '@/stores/cart'
import { openProductWhatsApp } from '@/lib/whatsapp'

const props = defineProps({
  product: { type: Object, default: null },
  qty:     { type: Number, default: 0 },
})

const emit = defineEmits(['close', 'add', 'remove'])
const cart = useCartStore()

const discountPct = computed(() => {
  if (!props.product?.oldPrice || !props.product?.price) return 0
  return Math.round((1 - props.product.price / props.product.oldPrice) * 100)
})

function fmt(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

const { track } = useTracking()

function handleAdd() {
  track('cart_add', { product_id: props.product?.id, product_name: props.product?.name, price: props.product?.price })
  emit('add')
  emit('close')
}

function handleWhatsAppBuy() {
  const qty = props.qty > 0 ? props.qty : 1
  track('whatsapp_buy', { source: 'product_modal', product_id: props.product?.id, product_name: props.product?.name, price: props.product?.price, qty })
  openProductWhatsApp(props.product, { qty, address: cart.savedAddress })
}
</script>

<style scoped>
.sheet-enter-active { transition: opacity 0.25s ease; }
.sheet-leave-active { transition: opacity 0.2s ease; }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }

.sheet-enter-active .relative,
.sheet-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from .relative  { transform: translateY(100%); }
.sheet-leave-to   .relative  { transform: translateY(100%); }
</style>
