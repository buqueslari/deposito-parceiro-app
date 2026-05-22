<template>
  <!-- Combo layout: horizontal scroll with snap -->
  <section v-if="isCombo" :id="category.id">
    <div class="px-4 pt-4 pb-2">
      <h2 class="font-display font-black text-lg tracking-carved text-ink">
        {{ category.name }}
      </h2>
      <p v-if="category.subtitle" class="text-xs text-ink/50 mt-0.5">
        {{ category.subtitle }}
      </p>
    </div>

    <div class="flex gap-3 px-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-none"
         style="scrollbar-width: none; -webkit-overflow-scrolling: touch;">
      <ComboCard
        v-for="p in products"
        :key="p.id"
        :product="p"
        :qty="cart.getQty(p.id)"
        @add="cart.add(p)"
        @remove="cart.remove(p.id)"
        @select="$emit('select', $event)"
      />
      <!-- Trailing spacer so last card doesn't hug the edge -->
      <div class="w-1 flex-shrink-0" aria-hidden="true" />
    </div>
  </section>

  <!-- Standard row layout -->
  <section v-else :id="category.id">
    <div class="px-4 pt-4 pb-2">
      <h2 class="font-display font-black text-lg tracking-carved text-ink">
        {{ category.name }}
      </h2>
      <p v-if="category.subtitle" class="text-xs text-ink/50 mt-0.5">
        {{ category.subtitle }}
      </p>
    </div>

    <div class="bg-white rounded-2xl mx-3 shadow-card overflow-hidden">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
        :qty="cart.getQty(p.id)"
        @add="cart.add(p)"
        @remove="cart.remove(p.id)"
        @select="$emit('select', $event)"
      />
    </div>
  </section>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import ProductCard from '@/components/ProductCard.vue'
import ComboCard from '@/components/ComboCard.vue'

defineProps({
  category: {
    type: Object,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
  isCombo: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])

const cart = useCartStore()
</script>

<style scoped>
/* Hide scrollbar inside combo scroll container */
div::-webkit-scrollbar {
  display: none;
}
</style>
