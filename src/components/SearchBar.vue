<template>
  <div class="px-3 py-2 sticky top-[41px] z-20 bg-cream">
    <div class="relative flex items-center">
      <!-- Magnifying glass icon -->
      <span class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink/40">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      <!-- Input -->
      <input
        :value="modelValue"
        type="search"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        placeholder="Buscar produtos…"
        class="w-full rounded-xl bg-white border border-ink/10 pl-9 pr-8 py-2 text-sm text-ink placeholder-ink/40
               focus:outline-none focus:border-action focus:ring-2 focus:ring-action/20
               transition-shadow"
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <!-- Clear button -->
      <Transition name="fade">
        <button
          v-if="modelValue && modelValue.length > 0"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70 transition-colors"
          aria-label="Limpar busca"
          @click="$emit('update:modelValue', '')"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </Transition>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Remove browser default search cancel button */
input[type='search']::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
