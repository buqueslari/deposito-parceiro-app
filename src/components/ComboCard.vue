<template>
  <article class="w-44 flex-shrink-0 rounded-2xl bg-white shadow-card overflow-hidden snap-start cursor-pointer" @click="$emit('select', product)">
    <!-- Product image -->
    <img
      :src="product.image"
      :alt="product.name"
      class="w-full h-40 object-cover bg-slate-100"
      loading="lazy"
    />

    <!-- Card content -->
    <div class="px-3 pb-3 pt-2">
      <!-- Badge -->
      <div v-if="product.badge" class="mb-1">
        <span
          class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md"
          :class="badgeClasses"
        >
          {{ badgeLabel }}
        </span>
      </div>

      <!-- Product name -->
      <p class="font-bold text-sm text-ink line-clamp-2 leading-snug mb-1">
        {{ product.name }}
      </p>

      <!-- Old price -->
      <span
        v-if="product.oldPrice"
        class="block text-xs line-through text-ink/40"
      >
        {{ formatPrice(product.oldPrice) }}
      </span>

      <!-- Current price -->
      <span class="block font-extrabold text-base text-ink leading-none mb-2.5">
        {{ formatPrice(product.price) }}
      </span>

      <!-- Add / Qty controls — full width -->
      <div class="w-full" @click.stop>
        <!-- qty === 0: full-width add button -->
        <button
          v-if="qty === 0"
          class="w-full h-8 rounded-xl bg-action text-white text-sm font-semibold flex items-center justify-center gap-1 hover:bg-action/90 active:scale-95 transition-transform shadow-sm"
          :disabled="product.maxQty !== undefined && qty >= product.maxQty"
          aria-label="Adicionar ao carrinho"
          @click="$emit('add')"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar
        </button>

        <!-- qty > 0: - / qty / + row -->
        <div
          v-else
          class="flex items-center justify-between gap-1"
        >
          <button
            class="w-8 h-8 rounded-xl border-2 border-action text-action flex items-center justify-center hover:bg-action/10 active:scale-95 transition-transform flex-shrink-0"
            aria-label="Remover um item"
            @click="$emit('remove')"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <span class="flex-1 text-center font-bold text-sm text-ink tabular-nums">
            {{ qty }}
          </span>

          <button
            class="w-8 h-8 rounded-xl bg-action text-white flex items-center justify-center hover:bg-action/90 active:scale-95 transition-transform flex-shrink-0"
            :disabled="product.maxQty !== undefined && qty >= product.maxQty"
            aria-label="Adicionar mais um item"
            @click="$emit('add')"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  qty: {
    type: Number,
    default: 0,
  },
})

defineEmits(['add', 'remove', 'select'])

const badgeClasses = computed(() => {
  switch (props.product.badge) {
    case 'top':
      return 'bg-blue-50 text-action'
    case 'limited':
      return 'bg-amber-50 text-amber-700'
    case 'water':
      return 'bg-cyan-50 text-blue-700'
    default:
      return 'bg-slate-100 text-ink/60'
  }
})

const badgeLabel = computed(() => {
  switch (props.product.badge) {
    case 'top':
      return 'Top de vendas'
    case 'limited':
      return 'Estoque limitado'
    case 'water':
      return 'Mineral'
    default:
      return props.product.badge
  }
})

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
</script>
