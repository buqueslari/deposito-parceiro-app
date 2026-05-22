<template>
  <div class="space-y-3">
    <div class="bg-white rounded-2xl shadow-card border border-ink/[0.06] overflow-hidden">

      <!-- Title -->
      <div class="px-5 pt-5 pb-3 text-center">
        <h2 class="text-xl font-extrabold text-ink mb-1">Entregador disponível!</h2>
        <p class="text-sm text-ink/55 leading-relaxed">
          Nosso parceiro está aguardando a confirmação do pagamento.
        </p>
      </div>

      <!-- Map -->
      <div class="overflow-hidden">
        <DeliveryMap
          :address="address"
          customer-label="Seu endereço"
          :customer-only="true"
          :approximate="true"
          height-class="h-52"
        />
      </div>

      <!-- Driver photo — negative margin to overlap map bottom -->
      <div class="flex justify-center -mt-10 relative" style="z-index:500">
        <div class="relative">
          <div class="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200">
            <img
              v-if="!avatarFailed"
              src="/drivers/leandro.png"
              alt="Leandro Batista Moreira"
              class="w-full h-full object-cover"
              @error="avatarFailed = true"
            />
            <div v-else class="w-full h-full bg-action/10 flex items-center justify-center text-action font-bold text-2xl">
              LB
            </div>
          </div>
          <!-- Green verified badge -->
          <div class="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#15803D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Driver info -->
      <div class="px-5 pt-4 pb-5">
        <!-- Name + rating -->
        <div class="text-center mb-4">
          <p class="text-base font-extrabold text-ink tracking-wide">LEANDRO BATISTA MOREIRA</p>
          <div class="flex items-center justify-center gap-1 mt-1">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="#F5A524" stroke="#F5A524" stroke-width="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span class="text-sm font-bold text-ink">4.9</span>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-3 gap-2 mb-4">
          <div class="rounded-xl border border-ink/10 p-3 text-center">
            <p class="text-[10px] font-semibold text-ink/45 uppercase tracking-wider mb-1">DISTÂNCIA</p>
            <p class="text-sm font-extrabold text-ink">3.9 km</p>
          </div>
          <div class="rounded-xl border border-ink/10 p-3 text-center">
            <p class="text-[10px] font-semibold text-ink/45 uppercase tracking-wider mb-0.5 leading-tight">TEMPO ESTIMADO</p>
            <p class="text-sm font-extrabold text-ink">~9 min</p>
          </div>
          <div class="rounded-xl border border-ink/10 p-3 text-center">
            <p class="text-[10px] font-semibold text-ink/45 uppercase tracking-wider mb-1">VEÍCULO</p>
            <p class="text-sm font-extrabold text-ink leading-tight">Honda CG 160</p>
          </div>
        </div>

        <!-- License plate -->
        <div class="flex justify-center mb-4">
          <div class="rounded-xl overflow-hidden border-2 border-action shadow-sm">
            <div class="bg-action px-4 py-0.5 text-center">
              <span class="text-white text-[9px] font-bold tracking-[0.2em]">BRASIL</span>
            </div>
            <div class="bg-white px-6 py-2 text-center">
              <span class="font-mono font-black text-ink text-xl tracking-[0.15em]">LYO-4B46</span>
            </div>
          </div>
        </div>

        <!-- Verified + CNPJ -->
        <div class="flex items-center justify-center gap-2 mb-4">
          <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#15803D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span class="text-sm font-semibold text-seal">Distribuidor Verificado</span>
          <span class="text-ink/30 text-sm">·</span>
          <span class="text-sm text-ink/50">CNPJ 01.875.479/0001-72</span>
        </div>

        <!-- ENTREGAR EM card -->
        <div class="rounded-xl border border-ink/10 px-4 py-3 mb-3">
          <p class="text-[11px] font-bold text-ink/40 uppercase tracking-widest mb-1">ENTREGAR EM:</p>
          <p class="text-sm font-bold text-ink">
            {{ address?.logradouro }}, {{ address?.numero }}<span v-if="address?.complemento"> · {{ address?.complemento }}</span>
          </p>
          <p class="text-sm text-ink/55">{{ address?.bairro }} · {{ address?.cidade }}/{{ address?.uf }}</p>
        </div>

        <!-- Amber notice -->
        <div class="rounded-xl border border-[#F5A524]/40 bg-[#FFF8EC] px-4 py-3 mb-5 flex items-start gap-2">
          <svg class="w-4 h-4 text-[#c27d00] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p class="text-xs text-ink/65 leading-relaxed">
            A localização exibida é aproximada. O entregador receberá o endereço completo com número e complemento.
          </p>
        </div>

        <!-- Continuar button -->
        <button
          @click="emit('next')"
          class="w-full bg-action text-white font-bold py-4 rounded-2xl text-base shadow-cta hover:bg-action-deep active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Continuar
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DeliveryMap from '@/components/DeliveryMap.vue'

const props = defineProps({
  address:  { type: Object, default: null },
  customer: { type: Object, default: null },
})

const emit = defineEmits(['next', 'back'])

const avatarFailed = ref(false)
</script>
