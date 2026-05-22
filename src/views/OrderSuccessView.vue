<template>
  <div class="min-h-screen bg-cream">
    <div class="max-w-lg mx-auto px-4 py-6 space-y-4">

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
        <svg class="w-10 h-10 text-action animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p class="text-ink/60 text-sm">Carregando pedido…</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
        <p class="text-red-600 font-medium">{{ error }}</p>
        <router-link to="/" class="mt-3 inline-block text-sm text-action underline">
          Voltar ao início
        </router-link>
      </div>

      <template v-else-if="order">

        <!-- Payment approved banner -->
        <div
          v-if="order.paid || ['pago', 'em_preparo', 'em_rota', 'entregue'].includes(order.status)"
          class="bg-white rounded-2xl shadow-card border border-[#15803D]/30 overflow-hidden"
        >
          <!-- Green top stripe -->
          <div class="h-1.5 bg-[#15803D]"></div>
          <div class="p-5">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 rounded-full border-2 border-[#15803D] flex items-center justify-center flex-shrink-0">
                <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#15803D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p class="text-xl font-extrabold text-ink leading-tight">Pagamento Confirmado!</p>
                <p class="text-sm text-ink/55 mt-0.5">Pedido <strong>#{{ orderId }}</strong> · {{ fmt(order.total) }}</p>
              </div>
            </div>
            <div class="rounded-xl bg-[#15803D]/[0.07] border border-[#15803D]/20 px-4 py-3 flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#15803D] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p class="text-sm font-semibold text-[#15803D]">
                {{ order.status === 'em_preparo' ? 'Seu pedido está em preparação!' : order.status === 'em_rota' ? 'Pedido a caminho!' : order.status === 'entregue' ? 'Pedido entregue!' : 'Seu pedido está em preparação!' }}
              </p>
            </div>
          </div>
        </div>

        <!-- PIX Payment card -->
        <div v-if="pixCode && !order.paid && order.status !== 'pago'" class="bg-white rounded-2xl shadow-card border border-ink/[0.06] p-5">
          <h1 class="text-2xl font-extrabold text-ink text-center leading-tight mb-2">
            Falta pouco para seu pedido chegar!
          </h1>
          <p class="text-sm text-center text-ink/55 mb-5">
            Pedido <strong>#{{ orderId }}</strong> · Total {{ fmt(order.total) }}
          </p>

          <!-- QR Code -->
          <div class="flex justify-center mb-4">
            <div class="p-3 rounded-2xl border border-ink/10 bg-white inline-block">
              <QrcodeVue :value="pixCode" :size="220" level="M" render-as="svg" />
            </div>
          </div>

          <!-- OU COPIE label -->
          <p class="text-[11px] font-bold text-ink/40 uppercase tracking-widest text-center mb-3">OU COPIE O CÓDIGO PIX</p>

          <!-- Code + copy button -->
          <div class="flex items-stretch gap-0 rounded-xl border border-ink/15 overflow-hidden mb-4">
            <div class="flex-1 px-3 py-3 text-xs font-mono text-ink/60 truncate bg-ink/[0.02]">
              {{ pixCode }}
            </div>
            <button
              @click="copyPix"
              class="flex items-center gap-1.5 px-4 bg-white border-l border-ink/15 text-sm font-bold text-ink hover:bg-ink/5 transition flex-shrink-0"
            >
              <svg class="w-4 h-4 text-ink/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              {{ copied ? 'Copiado!' : 'Copiar' }}
            </button>
          </div>

          <!-- How to pay -->
          <div class="bg-ink/[0.03] rounded-xl p-4 mb-4">
            <p class="text-sm font-bold text-ink mb-3">Como pagar:</p>
            <ol class="space-y-2">
              <li class="flex items-start gap-2.5 text-sm text-ink/70">
                <span class="w-5 h-5 rounded-full bg-action text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                Toque em <strong class="text-ink mx-0.5">Copiar</strong> acima pra copiar o código Pix.
              </li>
              <li class="flex items-start gap-2.5 text-sm text-ink/70">
                <span class="w-5 h-5 rounded-full bg-action text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                Abra o app do seu banco.
              </li>
              <li class="flex items-start gap-2.5 text-sm text-ink/70">
                <span class="w-5 h-5 rounded-full bg-action text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">3</span>
                Escolha <strong class="text-ink mx-0.5">Pix → Pix copia-e-cola</strong>, cole o código e confirme.
              </li>
            </ol>

            <!-- Waiting indicator -->
            <div v-if="!pollTimeout" class="mt-4 flex items-center gap-2 text-ink/45 text-xs">
              <svg class="w-3.5 h-3.5 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/>
              </svg>
              Aguardando confirmação automática...
            </div>
            <div v-else class="mt-3 text-xs text-amber-700">
              Confirmação demorando mais que o esperado. Entre em contato se já pagou.
            </div>
          </div>
        </div>

        <!-- Tracking card -->
        <div class="bg-white rounded-2xl shadow-card border border-ink/[0.06] p-5">
          <h2 class="text-xl font-extrabold text-ink mb-1">Acompanhe seu pedido</h2>
          <p class="text-sm text-ink/50 mb-4">{{ statusLabel }}</p>

          <!-- Progress bar -->
          <div class="w-full h-1 bg-ink/10 rounded-full overflow-hidden mb-5">
            <div
              class="h-full bg-action rounded-full transition-all duration-700"
              :style="{ width: progressWidth }"
            ></div>
          </div>

          <!-- Status icons -->
          <div class="grid grid-cols-4 gap-1">
            <div
              v-for="(st, idx) in STATUS_STEPS"
              :key="st.key"
              class="flex flex-col items-center gap-1.5"
            >
              <div
                class="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
                :class="idx <= currentStepIndex
                  ? 'bg-action/15'
                  : 'bg-ink/[0.05]'"
              >
                <component
                  :is="st.icon"
                  :active="idx <= currentStepIndex"
                />
              </div>
              <span
                class="text-[9px] font-bold uppercase tracking-wide text-center leading-tight"
                :class="idx <= currentStepIndex ? 'text-action' : 'text-ink/30'"
              >{{ st.label }}</span>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div v-if="order.address" class="bg-white rounded-2xl shadow-card overflow-hidden border border-ink/[0.06]">
          <DeliveryMap :address="order.address" height-class="h-52" />
        </div>

        <!-- ENTREGAR EM -->
        <div v-if="order.address" class="bg-white rounded-2xl shadow-card border border-ink/[0.06] p-4">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-action flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <div>
              <p class="text-[11px] font-bold text-ink/45 uppercase tracking-widest mb-1">ENTREGAR EM</p>
              <p class="text-sm font-bold text-ink">
                {{ order.address.logradouro }}, {{ order.address.numero }}
                <span v-if="order.address.complemento"> · {{ order.address.complemento }}</span>
              </p>
              <p class="text-sm text-ink/55">{{ order.address.bairro }} · {{ order.address.cidade }}/{{ order.address.uf }}</p>
              <p class="text-sm text-ink/40">CEP {{ order.address.cep }}</p>
            </div>
          </div>
        </div>

        <!-- PAGAMENTO -->
        <div class="bg-white rounded-2xl shadow-card border border-ink/[0.06] p-4">
          <div class="flex items-center gap-3">
            <!-- Pix logo -->
            <svg width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M342.6,170.1L256,83.5l-86.6,86.6c-9.4,9.4-9.4,24.6,0,34L256,290.7l86.6-86.6C351.9,194.7,351.9,179.5,342.6,170.1z" fill="#32BCAD"/>
              <path d="M169.4,341.9L256,428.5l86.6-86.6c9.4-9.4,9.4-24.6,0-34L256,221.3l-86.6,86.6C160.1,317.3,160.1,332.5,169.4,341.9z" fill="#32BCAD"/>
              <path d="M83.5,169.4L170.1,256L83.5,342.6c-9.4-9.4-24.6,9.4-34,0l0,0c-9.4-9.4-9.4-24.6,0-34l86.6-86.6L49.5,135.4c-9.4-9.4-9.4-24.6,0-34l0,0C59,92.1,74.1,92.1,83.5,101.5L83.5,169.4z" fill="#32BCAD"/>
              <path d="M428.5,169.4L341.9,256l86.6,86.6c9.4,9.4,24.6,9.4,34,0l0,0c9.4-9.4,9.4-24.6,0-34l-86.6-86.6l86.6-86.6c9.4-9.4,9.4-24.6,0-34l0,0C453.1,92.1,437.9,92.1,428.5,101.5L428.5,169.4z" fill="#32BCAD"/>
            </svg>
            <div>
              <p class="text-[11px] font-bold text-ink/45 uppercase tracking-widest mb-0.5">PAGAMENTO</p>
              <p class="text-sm font-bold text-ink">Pix</p>
              <p
                class="text-xs font-semibold"
                :class="(order.paid || ['pago','em_preparo','em_rota','entregue'].includes(order.status)) ? 'text-[#15803D]' : 'text-ink/40'"
              >{{ (order.paid || ['pago','em_preparo','em_rota','entregue'].includes(order.status)) ? 'Confirmado ✓' : 'Aguardando confirmação' }}</p>
            </div>
          </div>
        </div>

        <!-- Resumo do pedido -->
        <div class="bg-white rounded-2xl shadow-card border border-ink/[0.06] p-5">
          <h2 class="text-lg font-extrabold text-ink mb-4">Resumo do pedido</h2>
          <div class="space-y-2 mb-4">
            <div
              v-for="item in order.items"
              :key="item.produto_id || item.id"
              class="flex justify-between text-sm"
            >
              <span class="text-ink/70">{{ item.qtd || item.qty }}× {{ item.nome || item.name }}</span>
              <span class="text-ink font-medium">{{ fmt((item.preco || item.price) * (item.qtd || item.qty)) }}</span>
            </div>
          </div>
          <div class="border-t border-ink/8 pt-3 flex justify-between items-baseline">
            <span class="text-base font-bold text-ink">Total</span>
            <span class="text-2xl font-extrabold text-ink tabular-nums">{{ fmt(order.total) }}</span>
          </div>
        </div>

      </template>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import { orderApi } from '@/api'
import DeliveryMap from '@/components/DeliveryMap.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useTracking } from '@/composables/useTracking'

const route = useRoute()
const rawId = route.params.id || ''
// Format as GAS-XXXXX
const orderId = computed(() => {
  const num = String(rawId).replace(/\D/g, '').slice(-5).padStart(5, '0')
  return `GAS-${num}`
})

const { track } = useTracking()

const order       = ref(null)
const loading     = ref(true)
const error       = ref(null)
const pollTimeout = ref(false)
const copied      = ref(false)

// Status steps config
const STATUS_STEPS = [
  {
    key: 'recebido',
    label: 'RECEBIDO',
    icon: (props) => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: props.active ? '#0057B7' : '#aaa', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'w-5 h-5' }, [
      h('polyline', { points: '20 6 9 17 4 12' })
    ])
  },
  {
    key: 'em_preparo',
    label: 'EM SEPARAÇÃO',
    icon: (props) => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: props.active ? '#0057B7' : '#aaa', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'w-5 h-5' }, [
      h('path', { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' })
    ])
  },
  {
    key: 'em_rota',
    label: 'A CAMINHO',
    icon: (props) => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: props.active ? '#0057B7' : '#aaa', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'w-5 h-5' }, [
      h('circle', { cx: '18.5', cy: '17.5', r: '3.5' }),
      h('circle', { cx: '5.5', cy: '17.5', r: '3.5' }),
      h('path', { d: 'M15 6H5L3 17' }),
      h('path', { d: 'M15 6l3 11' }),
    ])
  },
  {
    key: 'entregue',
    label: 'ENTREGUE',
    icon: (props) => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: props.active ? '#0057B7' : '#aaa', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'w-5 h-5' }, [
      h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
      h('polyline', { points: '9 22 9 12 15 12 15 22' })
    ])
  },
]

const STATUS_LABELS = {
  aguardando_pagamento: 'Aguardando confirmação do pagamento...',
  pagamento_recusado:   'Pagamento recusado. Tente novamente.',
  pago:                 'Pagamento confirmado. Preparando seu pedido…',
  em_preparo:           'Seu pedido está em separação…',
  em_rota:              'Pedido a caminho — chega em breve!',
  entregue:             'Pedido entregue. Obrigado pela preferência!',
  cancelado:            'Pedido cancelado.',
}

const TERMINAL_STATUSES = new Set(['pago', 'entregue', 'cancelado'])

const statusLabel = computed(() =>
  STATUS_LABELS[order.value?.status] ?? 'Atualizando status…'
)

const currentStepIndex = computed(() => {
  const s = order.value?.status
  if (s === 'em_rota')  return 2
  if (s === 'entregue') return 3
  if (['pago', 'em_preparo'].includes(s)) return 1
  return 0
})

const progressWidth = computed(() => {
  const pct = (currentStepIndex.value / (STATUS_STEPS.length - 1)) * 100
  return `${pct}%`
})

const pixCode = computed(() => order.value?.payment?.pix_code ?? null)

function fmt(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val ?? 0)
}

async function copyPix() {
  if (!pixCode.value) return
  try {
    await navigator.clipboard.writeText(pixCode.value)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = pixCode.value
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

let pollInterval  = null
let timeoutHandle = null

function stopPolling() {
  if (pollInterval)  { clearInterval(pollInterval);  pollInterval  = null }
  if (timeoutHandle) { clearTimeout(timeoutHandle);  timeoutHandle = null }
}

async function startPolling() {
  timeoutHandle = setTimeout(() => {
    stopPolling()
    pollTimeout.value = true
  }, 900_000)

  pollInterval = setInterval(async () => {
    try {
      const statusData = await orderApi.status(rawId)
      const status     = statusData?.status ?? statusData
      if (order.value) order.value.status = status
      const isPaid = order.value?.paid || status === 'pago'
      if (isPaid || TERMINAL_STATUSES.has(status)) {
        stopPolling()
        if (isPaid || status === 'pago') {
          const fresh = await orderApi.get(rawId)
          order.value = fresh
          track('payment_confirmed', { order_id: rawId, total: fresh?.total })
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {
              send_to: 'AW-18181769409/1eoICJ_O6LEcEMGR391D',
              value: fresh?.total ?? 0,
              currency: 'BRL',
              transaction_id: rawId,
            })
          }
        }
      }
    } catch { /* ignore */ }
  }, 3000)
}

onMounted(async () => {
  try {
    order.value = await orderApi.get(rawId)
  } catch (e) {
    error.value = e.message || 'Não foi possível carregar o pedido.'
  } finally {
    loading.value = false
  }
  if (order.value && !order.value.paid && !TERMINAL_STATUSES.has(order.value?.status)) {
    startPolling()
  }
})

onUnmounted(() => stopPolling())
</script>
