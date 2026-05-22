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

const props = defineProps({
  product: { type: Object, default: null },
  qty:     { type: Number, default: 0 },
})

const emit = defineEmits(['close', 'add', 'remove'])

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
