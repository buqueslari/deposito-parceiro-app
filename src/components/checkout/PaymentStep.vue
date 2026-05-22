<template>
  <div class="bg-white rounded-2xl shadow-card border border-ink/[0.06] p-5">
    <h2 class="text-xl font-extrabold text-ink mb-5">Forma de pagamento</h2>

    <div class="space-y-3 mb-5">
      <!-- PIX - active, selected -->
      <div
        class="flex items-center gap-4 rounded-2xl p-4 border-2 border-action cursor-pointer transition"
        style="background:rgba(0,87,183,0.03)"
      >
        <!-- Pix logo -->
        <div class="w-12 h-12 rounded-xl bg-white border border-ink/10 flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg width="28" height="28" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M342.6,170.1L256,83.5l-86.6,86.6c-9.4,9.4-9.4,24.6,0,34L256,290.7l86.6-86.6C351.9,194.7,351.9,179.5,342.6,170.1z" fill="#32BCAD"/>
            <path d="M169.4,341.9L256,428.5l86.6-86.6c9.4-9.4,9.4-24.6,0-34L256,221.3l-86.6,86.6C160.1,317.3,160.1,332.5,169.4,341.9z" fill="#32BCAD"/>
            <path d="M83.5,169.4L170.1,256L83.5,342.6c-9.4,9.4-24.6,9.4-34,0l0,0c-9.4-9.4-9.4-24.6,0-34l86.6-86.6L49.5,135.4c-9.4-9.4-9.4-24.6,0-34l0,0C59,92.1,74.1,92.1,83.5,101.5L83.5,169.4z" fill="#32BCAD"/>
            <path d="M428.5,169.4L341.9,256l86.6,86.6c9.4,9.4,24.6,9.4,34,0l0,0c9.4-9.4,9.4-24.6,0-34l-86.6-86.6l86.6-86.6c9.4-9.4,9.4-24.6,0-34l0,0C453.1,92.1,437.9,92.1,428.5,101.5L428.5,169.4z" fill="#32BCAD"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-base text-ink">Pix</span>
            <span class="inline-flex items-center gap-0.5 bg-seal/10 text-seal text-[10px] font-bold px-1.5 py-0.5 rounded">
              <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              INSTANTÂNEO
            </span>
          </div>
          <p class="text-sm text-ink/50 mt-0.5">Aprovação imediata</p>
        </div>
      </div>

      <!-- Cartão - disabled -->
      <div class="flex items-center gap-4 rounded-2xl p-4 border-2 border-transparent bg-ink/[0.02] opacity-60 cursor-not-allowed">
        <div class="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-ink/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-sm text-ink/50">Cartão de crédito</span>
            <span class="inline-flex items-center gap-0.5 bg-ink/5 text-ink/35 text-[10px] font-bold px-1.5 py-0.5 rounded">
              <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              INDISPONÍVEL
            </span>
          </div>
          <p class="text-xs text-ink/40 mt-0.5">Desabilitado pelo fornecedor</p>
        </div>
      </div>

      <!-- Maquininha - disabled -->
      <div class="flex items-center gap-4 rounded-2xl p-4 border-2 border-transparent bg-ink/[0.02] opacity-60 cursor-not-allowed">
        <div class="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-ink/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="11" y2="15"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-sm text-ink/50">Pagar na maquininha</span>
            <span class="inline-flex items-center gap-0.5 bg-ink/5 text-ink/35 text-[10px] font-bold px-1.5 py-0.5 rounded">
              <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              INDISPONÍVEL
            </span>
          </div>
          <p class="text-xs text-ink/40 mt-0.5">Desabilitado pelo fornecedor</p>
        </div>
      </div>

      <!-- Dinheiro - disabled -->
      <div class="flex items-center gap-4 rounded-2xl p-4 border-2 border-transparent bg-ink/[0.02] opacity-60 cursor-not-allowed">
        <div class="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-ink/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-sm text-ink/50">Pagar em dinheiro</span>
            <span class="inline-flex items-center gap-0.5 bg-ink/5 text-ink/35 text-[10px] font-bold px-1.5 py-0.5 rounded">
              <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              INDISPONÍVEL
            </span>
          </div>
          <p class="text-xs text-ink/40 mt-0.5">Desabilitado pelo fornecedor</p>
        </div>
      </div>
    </div>

    <!-- Confirm button -->
    <button
      @click="confirm"
      :disabled="submitting"
      class="w-full flex items-center justify-center gap-2 bg-action text-white font-bold text-base rounded-2xl py-4 shadow-cta transition disabled:opacity-70 disabled:cursor-not-allowed hover:bg-action-deep active:scale-[0.98]"
    >
      <template v-if="submitting">
        <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Gerando Pix…
      </template>
      <template v-else>
        Confirmar pedido
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </template>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  submitting: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'back'])

function confirm() {
  emit('confirm', { method: 'pix' })
}
</script>
