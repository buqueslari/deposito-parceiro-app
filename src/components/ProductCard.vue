<template>
  <article class="relative flex items-center px-5 py-3 sm:py-4 bg-white border-b border-ink/[0.06] last:border-b-0 gap-3 cursor-pointer" @click="$emit('select', product)">
    <!-- Left: content -->
    <div class="relative z-10 flex-1 min-w-0 pr-1 flex flex-col">
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
      <p class="font-bold text-ink text-base leading-snug line-clamp-2">
        {{ product.name }}
      </p>

      <!-- Description -->
      <p
        v-if="product.description"
        class="text-xs text-ink/55 mt-0.5 line-clamp-2 leading-relaxed"
      >
        {{ product.description }}
      </p>

      <!-- Price row -->
      <div class="mt-1.5 flex flex-col gap-0.5">
        <span
          v-if="product.oldPrice"
          class="text-xs line-through text-ink/40"
        >
          {{ formatPrice(product.oldPrice) }}
        </span>
        <span class="font-extrabold text-seal-deep tabular-nums text-base leading-none">
          {{ formatPrice(product.price) }}
        </span>
      </div>

      <!-- Add / Qty controls (below price on left side) -->
      <div class="mt-2 flex" @click.stop>
        <!-- qty === 0: single + button -->
        <button
          v-if="qty === 0"
          class="w-8 h-8 rounded-full bg-action text-white flex items-center justify-center shadow-sm hover:bg-action/90 active:scale-95 transition-transform"
          :disabled="product.maxQty !== undefined && qty >= product.maxQty"
          aria-label="Adicionar ao carrinho"
          @click="$emit('add')"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <!-- qty > 0: - / qty / + row -->
        <div v-else class="flex items-center gap-1">
          <button
            class="w-7 h-7 rounded-full border-2 border-action text-action flex items-center justify-center hover:bg-action/10 active:scale-95 transition-transform"
            aria-label="Remover um item"
            @click="$emit('remove')"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <span class="w-5 text-center font-bold text-sm text-ink tabular-nums">
            {{ qty }}
          </span>

          <button
            class="w-7 h-7 rounded-full bg-action text-white flex items-center justify-center hover:bg-action/90 active:scale-95 transition-transform"
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

    <!-- Right: image -->
    <div class="relative z-10 shrink-0 w-28 sm:w-32 self-stretch flex items-center">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-28 sm:w-32 h-28 sm:h-32 rounded-xl object-cover bg-slate-100"
        loading="lazy"
      />
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
