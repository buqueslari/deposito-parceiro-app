<template>
  <div class="bg-white rounded-2xl shadow-card border border-ink/[0.06] p-5">
    <h2 class="text-xl font-extrabold text-ink mb-5">Forma de pagamento</h2>

    <div class="space-y-3 mb-5">
      <div
        @click="selectedMethod = 'pix'"
        class="flex items-center gap-4 rounded-2xl p-4 border-2 cursor-pointer transition"
        :class="selectedMethod === 'pix' ? 'border-action' : 'border-ink/10 hover:border-action/30'"
        :style="selectedMethod === 'pix' ? 'background:rgba(0,87,183,0.03)' : ''"
      >
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
              INSTANTANEO
            </span>
          </div>
          <p class="text-sm text-ink/50 mt-0.5">Aprovacao imediata</p>
        </div>
      </div>

      <div
        v-if="creditCardEnabled"
        @click="selectedMethod = 'credit_card'"
        class="flex items-center gap-4 rounded-2xl p-4 border-2 cursor-pointer transition"
        :class="selectedMethod === 'credit_card' ? 'border-action' : 'border-ink/10 hover:border-action/30'"
        :style="selectedMethod === 'credit_card' ? 'background:rgba(0,87,183,0.03)' : ''"
      >
        <div class="w-12 h-12 rounded-xl bg-white border border-ink/10 flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg class="w-6 h-6 text-action" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-base text-ink">Cartao de credito</span>
          </div>
          <p class="text-sm text-ink/50 mt-0.5">Pagamento online seguro em 1x</p>
        </div>
      </div>

      <div v-if="selectedMethod === 'credit_card' && creditCardEnabled" class="rounded-2xl border border-ink/10 bg-ink/[0.02] p-4 space-y-3">
        <div>
          <label class="block text-sm font-semibold text-ink mb-1.5">Nome impresso no cartao</label>
          <input v-model="card.holderName" type="text" autocomplete="cc-name" class="input-card" placeholder="Nome completo" />
          <p v-if="errors.holderName" class="text-danger text-xs mt-1">{{ errors.holderName }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-ink mb-1.5">Numero do cartao</label>
          <input v-model="card.number" @input="card.number = formatCardNumber(card.number)" type="text" inputmode="numeric" autocomplete="cc-number" maxlength="19" class="input-card" placeholder="0000 0000 0000 0000" />
          <p v-if="errors.number" class="text-danger text-xs mt-1">{{ errors.number }}</p>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-sm font-semibold text-ink mb-1.5">Mes</label>
            <input v-model="card.expMonth" @input="card.expMonth = onlyDigits(card.expMonth).slice(0, 2)" type="text" inputmode="numeric" autocomplete="cc-exp-month" maxlength="2" class="input-card" placeholder="MM" />
            <p v-if="errors.expMonth" class="text-danger text-xs mt-1">{{ errors.expMonth }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-ink mb-1.5">Ano</label>
            <input v-model="card.expYear" @input="card.expYear = onlyDigits(card.expYear).slice(0, 4)" type="text" inputmode="numeric" autocomplete="cc-exp-year" maxlength="4" class="input-card" placeholder="AAAA" />
            <p v-if="errors.expYear" class="text-danger text-xs mt-1">{{ errors.expYear }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-ink mb-1.5">CVV</label>
            <input v-model="card.cvv" @input="card.cvv = onlyDigits(card.cvv).slice(0, 4)" type="text" inputmode="numeric" autocomplete="cc-csc" maxlength="4" class="input-card" placeholder="123" />
            <p v-if="errors.cvv" class="text-danger text-xs mt-1">{{ errors.cvv }}</p>
          </div>
        </div>

        <div class="rounded-xl bg-white border border-ink/10 px-4 py-3">
          <p class="text-sm font-semibold text-ink">Pagamento em 1x</p>
        </div>
      </div>

      <div class="flex items-center gap-4 rounded-2xl p-4 border-2 border-transparent bg-ink/[0.02] opacity-60 cursor-not-allowed">
        <div class="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-ink/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="11" y2="15"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-sm text-ink/50">Pagar na maquininha</span>
            <span class="inline-flex items-center gap-0.5 bg-ink/5 text-ink/35 text-[10px] font-bold px-1.5 py-0.5 rounded">INDISPONIVEL</span>
          </div>
          <p class="text-xs text-ink/40 mt-0.5">Desabilitado pelo fornecedor</p>
        </div>
      </div>

      <div class="flex items-center gap-4 rounded-2xl p-4 border-2 border-transparent bg-ink/[0.02] opacity-60 cursor-not-allowed">
        <div class="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-ink/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-sm text-ink/50">Pagar em dinheiro</span>
            <span class="inline-flex items-center gap-0.5 bg-ink/5 text-ink/35 text-[10px] font-bold px-1.5 py-0.5 rounded">INDISPONIVEL</span>
          </div>
          <p class="text-xs text-ink/40 mt-0.5">Desabilitado pelo fornecedor</p>
        </div>
      </div>
    </div>

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
        {{ selectedMethod === 'credit_card' ? 'Processando cartao...' : 'Gerando Pix...' }}
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
import { reactive, ref, onMounted } from 'vue'

defineProps({
  submitting: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'back'])

const selectedMethod = ref('pix')
const creditCardEnabled = ref(true)
const card = reactive({
  holderName: '',
  number: '',
  expMonth: '',
  expYear: '',
  cvv: '',
})
const errors = reactive({})

function onlyDigits(value) {
  return String(value || '').replace(/\D+/g, '')
}

function formatCardNumber(value) {
  return onlyDigits(value).slice(0, 19).replace(/(.{4})/g, '$1 ').trim()
}

function validateCard() {
  Object.keys(errors).forEach(key => { errors[key] = '' })
  const number = onlyDigits(card.number)
  const expMonth = Number(card.expMonth)
  const expYear = Number(card.expYear.length === 2 ? `20${card.expYear}` : card.expYear)
  let ok = true

  if (!card.holderName.trim()) { errors.holderName = 'Informe o nome do cartao.'; ok = false }
  if (number.length < 13 || number.length > 19) { errors.number = 'Informe um cartao valido.'; ok = false }
  if (expMonth < 1 || expMonth > 12) { errors.expMonth = 'Mes invalido.'; ok = false }
  if (!expYear || expYear < new Date().getFullYear()) { errors.expYear = 'Ano invalido.'; ok = false }
  if (onlyDigits(card.cvv).length < 3) { errors.cvv = 'CVV invalido.'; ok = false }

  return ok
}

function confirm() {
  if (selectedMethod.value === 'credit_card') {
    if (!validateCard()) return
    emit('confirm', {
      method: 'credit_card',
      card: {
        holderName: card.holderName.trim(),
        number: onlyDigits(card.number),
        expMonth: card.expMonth.padStart(2, '0'),
        expYear: card.expYear.length === 2 ? `20${card.expYear}` : card.expYear,
        cvv: onlyDigits(card.cvv),
        installments: 1,
      },
    })
    return
  }

  emit('confirm', { method: 'pix' })
}

onMounted(async () => {
  try {
    const res = await fetch('/api/v1/storefront/settings', { headers: { Accept: 'application/json' } })
    const settings = await res.json()
    creditCardEnabled.value = settings.credit_card_enabled !== 'false'
  } catch {
    creditCardEnabled.value = true
  }
})
</script>

<style scoped>
.input-card {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgba(26, 26, 26, 0.15);
  background: #fff;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  color: rgb(26, 26, 26);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.input-card:focus {
  border-color: rgb(0, 87, 183);
  box-shadow: 0 0 0 1px rgb(0, 87, 183);
}
</style>
