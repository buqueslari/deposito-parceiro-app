<template>
  <div class="min-h-screen bg-cream">

    <!-- Header -->
    <header class="bg-cream px-4 py-4">
      <button
        @click="handleBack"
        class="flex items-center gap-1.5 text-ink text-sm font-medium"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>
    </header>

    <div class="max-w-lg mx-auto px-4 pb-6">

      <!-- Step indicator card -->
      <div class="bg-white rounded-2xl shadow-card border border-ink/[0.06] p-4 mb-4">
        <div class="relative flex items-center justify-between">
          <!-- Background line -->
          <div class="absolute left-0 right-0 top-4 h-0.5 bg-ink/10 z-0"></div>
          <!-- Completed line segment 1→2 -->
          <div
            v-if="visualStep >= 2"
            class="absolute left-0 top-4 h-0.5 bg-seal z-0 transition-all duration-500"
            style="width: calc(50%)"
          ></div>
          <!-- Completed line segment 2→3 -->
          <div
            v-if="visualStep >= 3"
            class="absolute right-0 top-4 h-0.5 bg-seal z-0 transition-all duration-500"
            style="width: calc(50%)"
          ></div>

          <!-- Step 1: IDENTIFICAÇÃO -->
          <div class="relative z-10 flex flex-col items-center gap-1.5 flex-1">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm transition-all duration-300"
              :class="visualStep > 1
                ? 'bg-seal text-white'
                : visualStep === 1
                  ? 'bg-action text-white'
                  : 'bg-ink/10 text-ink/30'"
            >
              <svg v-if="visualStep > 1" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>1</span>
            </div>
            <span
              class="text-[10px] font-bold uppercase tracking-wider text-center"
              :class="visualStep === 1 ? 'text-action' : visualStep > 1 ? 'text-seal' : 'text-ink/35'"
            >IDENTIFICAÇÃO</span>
          </div>

          <!-- Step 2: REVISÃO -->
          <div class="relative z-10 flex flex-col items-center gap-1.5 flex-1">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm transition-all duration-300"
              :class="visualStep > 2
                ? 'bg-seal text-white'
                : visualStep === 2
                  ? 'bg-action text-white'
                  : 'bg-ink/10 text-ink/30'"
            >
              <svg v-if="visualStep > 2" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>2</span>
            </div>
            <span
              class="text-[10px] font-bold uppercase tracking-wider text-center"
              :class="visualStep === 2 ? 'text-action' : visualStep > 2 ? 'text-seal' : 'text-ink/35'"
            >REVISÃO</span>
          </div>

          <!-- Step 3: PAGAMENTO -->
          <div class="relative z-10 flex flex-col items-center gap-1.5 flex-1">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm transition-all duration-300"
              :class="visualStep === 3 ? 'bg-action text-white' : 'bg-ink/10 text-ink/30'"
            >
              <span>3</span>
            </div>
            <span
              class="text-[10px] font-bold uppercase tracking-wider text-center"
              :class="visualStep === 3 ? 'text-action' : 'text-ink/35'"
            >PAGAMENTO</span>
          </div>
        </div>
      </div>

      <!-- Error banner -->
      <transition name="slide-down">
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4 flex items-start gap-2"
        >
          <svg class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p class="text-sm text-red-700 leading-snug">{{ error }}</p>
        </div>
      </transition>

      <!-- Step content -->
      <transition name="fade" mode="out-in">
        <component
          :is="currentStepComponent"
          :key="step"
          :address="address"
          :customer="customer"
          :couponApplied="couponApplied"
          :submitting="placing"
          @update:address="address = $event"
          @update:customer="customer = $event"
          @update:coupon="couponApplied = $event"
          @update:couponApplied="couponApplied = $event"
          @next="nextStep"
          @back="prevStep"
          @confirm="placeOrder"
        />
      </transition>

      <!-- LGPD footer -->
      <p class="text-center text-xs text-ink/35 mt-6 flex items-center justify-center gap-1.5">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Seus dados são tratados com segurança · LGPD
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { orderApi } from '@/api'
import { useTracking } from '@/composables/useTracking'

import AddressStep    from '@/components/checkout/AddressStep.vue'
import DeliveryLoader from '@/components/checkout/DeliveryLoader.vue'
import DeliveryMatch  from '@/components/checkout/DeliveryMatch.vue'
import ReviewStep     from '@/components/checkout/ReviewStep.vue'
import PaymentStep    from '@/components/checkout/PaymentStep.vue'

const router = useRouter()
const { sessionId } = useTracking()

const STEP_COMPONENTS = [
  AddressStep,
  DeliveryLoader,
  DeliveryMatch,
  ReviewStep,
  PaymentStep,
]

const step = ref(0)

const _savedAddr = useCartStore().savedAddress
const address = ref({
  cidade:      _savedAddr?.cidade      || 'São Paulo',
  uf:          _savedAddr?.uf          || 'SP',
  cep:         _savedAddr?.cep         || '',
  logradouro:  _savedAddr?.logradouro  || '',
  numero:      _savedAddr?.numero      || '',
  complemento: _savedAddr?.complemento || '',
  bairro:      _savedAddr?.bairro      || '',
  referencia:  '',
})

const customer = ref({
  nome:     '',
  email:    '',
  telefone: '',
  cpf:      '',
})

const couponApplied = ref(false)
const placing       = ref(false)
const error         = ref(null)

const currentStepComponent = computed(() => STEP_COMPONENTS[step.value])

// Visual step: 1 = IDENTIFICAÇÃO, 2 = REVISÃO, 3 = PAGAMENTO
const visualStep = computed(() => {
  if (step.value === 0) return 1
  if (step.value <= 3) return 2
  return 3
})

function nextStep() {
  error.value = null
  if (step.value < STEP_COMPONENTS.length - 1) {
    step.value++
  }
}

function prevStep() {
  error.value = null
  if (step.value > 0) {
    if (step.value === 2) {
      step.value = 0
    } else {
      step.value--
    }
  }
}

function handleBack() {
  if (step.value === 0) {
    router.push('/')
  } else {
    prevStep()
  }
}

async function placeOrder(draftPayment) {
  placing.value = true
  error.value   = null
  const cart    = useCartStore()

  try {
    const result = await orderApi.create({
      items: cart.items.map(i => ({
        produto_id: i.productId,
        qtd:        i.qty,
        qty:        i.qty,
        nome:       i.name,
        name:       i.name,
        preco:      i.price,
        price:      i.price,
        image:      i.image,
      })),
      customer: {
        nome:     customer.value.nome,
        email:    customer.value.email,
        telefone: customer.value.telefone,
        cpf:      customer.value.cpf,
      },
      address: {
        cep:         (address.value.cep || '').replace(/\D+/g, ''),
        logradouro:  address.value.logradouro,
        numero:      address.value.numero,
        complemento: address.value.complemento || null,
        bairro:      address.value.bairro,
        cidade:      address.value.cidade,
        uf:          address.value.uf,
        referencia:  address.value.referencia || null,
      },
      notes:          cart.notes || null,
      total:          cart.total,
      couponApplied:  couponApplied.value,
      couponDiscount: cart.couponDiscount,
      session_id:     sessionId.value,
    })

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-18181769409/1eoICJ_O6LEcEMGR391D',
        value: cart.total ?? 0,
        currency: 'BRL',
        transaction_id: result.id,
      })
    }
    cart.clear()
    router.push(`/pedido/${result.id}`)
  } catch (e) {
    error.value   = e.message || 'Erro ao realizar pedido. Tente novamente.'
    placing.value = false
  }
}

onMounted(() => {
  const cart = useCartStore()
  if (!cart.items || cart.items.length === 0) {
    router.replace('/')
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from { opacity: 0; transform: translateX(16px); }
.fade-leave-to   { opacity: 0; transform: translateX(-16px); }

.slide-down-enter-active, .slide-down-leave-active {
  transition: opacity 0.2s ease, max-height 0.25s ease;
  max-height: 120px;
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
