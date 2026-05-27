<template>
  <div class="relative px-4 sm:px-0">
    <!-- Cover image -->
    <div class="relative h-36 sm:h-52 lg:h-60 -mx-4 sm:mx-0 sm:mt-4 sm:rounded-2xl overflow-hidden bg-gradient-to-br from-action via-action-deep to-blue-900">
      <img
        src="/cover.png"
        :alt="settings.store_name"
        class="w-full h-full object-cover object-center"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <!-- Status badge top-right -->
      <div class="absolute top-3 right-3">
        <span class="inline-flex items-center gap-1.5 bg-seal/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          {{ settings.store_hours || 'Aberto 24 horas' }}
        </span>
      </div>
    </div>

    <!-- Store info card -->
    <div class="-mt-12 sm:-mt-14 relative">
      <div class="bg-white rounded-2xl shadow-card border border-ink/[0.06] p-4 sm:p-5">
        <!-- Logo + store info row -->
        <div class="flex items-start gap-3 sm:gap-4">
          <!-- Logo -->
          <div class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white flex items-center justify-center shadow-cta-deep shrink-0 ring-4 ring-white overflow-hidden">
            <img src="/logo.png" alt="Logo" class="w-full h-full object-cover" />
          </div>

          <!-- Store details -->
          <div class="flex-1 min-w-0 pt-1">
            <!-- Name + verified badge -->
            <h1 class="font-extrabold text-ink text-xl sm:text-2xl leading-tight tracking-carved flex items-center gap-1.5">
              <span>{{ settings.store_name }}</span>
              <VerifiedStoreBadge class="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            </h1>

            <!-- Location line -->
            <p class="text-sm text-ink/55 mt-0.5">
              Distribuidora ·
              <span v-if="locationReady">{{ city }} · <strong class="text-ink/70 font-semibold">{{ state }}</strong></span>
              <span v-else class="inline-flex items-center gap-1">
                <span class="w-3 h-3 rounded-full border-2 border-ink/30 border-t-transparent animate-spin inline-block"></span>
                Localizando…
              </span>
            </p>

            <!-- Rating + distance row -->
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm">
              <span class="flex items-center gap-1 text-ink">
                <span class="text-gold-400">★</span>
                <span class="font-bold">4.9</span>
                <span class="text-ink/55 font-medium">(1.368)</span>
              </span>
              <span class="flex items-center gap-1 text-ink/65 font-medium">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                2.1 km
              </span>
            </div>
          </div>
        </div>

        <!-- Delivery / Pickup tabs -->
        <div class="mt-4 grid grid-cols-2 bg-ink/[0.05] rounded-xl p-1 gap-1">
          <button class="py-2 text-sm font-semibold text-ink bg-white rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5">
            <!-- Bike icon -->
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/>
              <path d="M15 6H5L3 17"/><path d="M15 6l3 11"/><path d="M9 6l-1 5"/><path d="M13 8H9"/>
            </svg>
            Entrega
          </button>
          <button
            class="py-2 text-sm font-medium text-ink/40 rounded-lg cursor-not-allowed select-none transition-all flex items-center justify-center gap-1.5"
            @click="showPickupTooltip"
          >
            <!-- Shopping bag icon -->
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Retirada
          </button>
        </div>

        <!-- Delivery info row — BELOW tabs -->
        <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span class="flex items-center gap-1 text-ink font-bold">
            <svg class="w-4 h-4 text-ink/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            20–35 min
          </span>
          <span class="text-ink/30">·</span>
          <span class="flex items-center gap-1 text-seal font-bold">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            Frete grátis acima R$ 40,00
          </span>
        </div>

        <!-- Pickup tooltip -->
        <Transition name="fade">
          <div
            v-if="pickupTooltipVisible"
            class="mt-2 flex items-start gap-2 text-xs bg-gold/10 text-gold-600 border border-gold/30 px-3 py-2.5 rounded-xl"
            role="status"
            aria-live="polite"
          >
            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Retirada indisponível para sua localização</span>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import VerifiedStoreBadge from '@/components/VerifiedStoreBadge.vue'
import { DEFAULT_STOREFRONT_SETTINGS } from '@/stores/storefrontSettings'

const props = defineProps({
  confirmedAddress: { type: Object, default: null },
  detectedCity:     { type: String, default: '' },
  detectedState:    { type: String, default: '' },
  settings:         { type: Object, default: () => DEFAULT_STOREFRONT_SETTINGS },
})

const pickupTooltipVisible = ref(false)
let tooltipTimer = null

function showPickupTooltip() {
  pickupTooltipVisible.value = true
  clearTimeout(tooltipTimer)
  tooltipTimer = setTimeout(() => { pickupTooltipVisible.value = false }, 3000)
}

const city = computed(() => {
  return props.confirmedAddress?.cidade || props.detectedCity || 'São Paulo'
})

const state = computed(() => {
  return props.confirmedAddress?.uf || props.detectedState || 'SP'
})

const locationReady = computed(() => {
  return !!(props.confirmedAddress?.cidade || props.detectedCity)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
