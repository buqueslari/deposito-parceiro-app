<template>
  <div class="bg-white rounded-2xl shadow-card border border-ink/[0.06] p-8 text-center">
    <!-- Amber pulsing ripple circles -->
    <div class="flex justify-center mb-6">
      <div class="relative w-32 h-32 flex items-center justify-center">
        <!-- Ripple ring 1 (outermost) -->
        <div class="absolute inset-0 rounded-full ripple-1" style="background:rgba(245,165,36,0.10)"></div>
        <!-- Ripple ring 2 -->
        <div class="absolute w-24 h-24 rounded-full ripple-2" style="background:rgba(245,165,36,0.18)"></div>
        <!-- Ripple ring 3 -->
        <div class="absolute w-16 h-16 rounded-full ripple-3" style="background:rgba(245,165,36,0.28)"></div>
        <!-- Inner solid amber circle -->
        <div class="absolute w-10 h-10 rounded-full" style="background:#F5A524"></div>
      </div>
    </div>

    <h2 class="text-xl font-extrabold text-ink mb-2 leading-tight">
      Buscando o entregador mais próximo...
    </h2>
    <p class="text-sm text-ink/55 mb-5 leading-relaxed">
      Estamos localizando o melhor entregador para o seu endereço:
    </p>

    <div v-if="address" class="text-sm font-bold text-ink leading-relaxed">
      <p>{{ address.logradouro }}, {{ address.numero }}<span v-if="address.complemento"> · {{ address.complemento }}</span></p>
      <p>{{ address.bairro }} · {{ address.cidade }}/{{ address.uf }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  address: { type: Object, default: null },
})

const emit = defineEmits(['next'])

onMounted(() => {
  setTimeout(() => emit('next'), 4000)
})
</script>

<style scoped>
@keyframes ripple {
  0%   { transform: scale(0.85); opacity: 1; }
  60%  { transform: scale(1.1);  opacity: 0.6; }
  100% { transform: scale(0.85); opacity: 1; }
}

.ripple-1 { animation: ripple 2.2s ease-in-out infinite; }
.ripple-2 { animation: ripple 2.2s ease-in-out infinite 0.3s; }
.ripple-3 { animation: ripple 2.2s ease-in-out infinite 0.6s; }
</style>
