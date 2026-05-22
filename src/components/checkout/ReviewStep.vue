<template>
  <div class="space-y-3">

    <div class="bg-white rounded-2xl shadow-card border border-ink/[0.06] p-5">
      <h2 class="text-xl font-extrabold text-ink mb-4">Revisar pedido</h2>

      <!-- SEUS DADOS -->
      <div class="rounded-xl border border-ink/10 p-4 mb-3">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-full bg-ink/5 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-ink/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p class="text-[11px] font-bold text-ink/45 uppercase tracking-widest mb-1">SEUS DADOS</p>
              <p class="text-sm font-bold text-ink">{{ customer?.nome }}</p>
              <p class="text-sm text-ink/55">{{ customer?.email }}</p>
              <p class="text-sm text-ink/55">{{ maskedTelefone }} · CPF {{ maskedCpf }}</p>
            </div>
          </div>
          <button @click="emit('back')" class="flex-shrink-0 text-action">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- ENDEREÇO -->
      <div class="rounded-xl border border-ink/10 p-4 mb-3">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-full bg-ink/5 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-ink/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <p class="text-[11px] font-bold text-ink/45 uppercase tracking-widest mb-1">ENDEREÇO</p>
              <p class="text-sm font-bold text-ink">
                {{ address?.logradouro }}, {{ address?.numero }}<span v-if="address?.complemento"> · {{ address?.complemento }}</span>
              </p>
              <p class="text-sm text-ink/55">{{ address?.bairro }} · {{ address?.cidade }}/{{ address?.uf }} · CEP {{ address?.cep }}</p>
            </div>
          </div>
          <button @click="emit('back')" class="flex-shrink-0 text-action">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Coupon -->
    <div class="rounded-2xl border border-[#F5A524]/40 bg-[#FFF8EC] p-4">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-[#F5A524]/15 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-[#c27d00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold text-ink mb-0.5">Sua primeira vez por aqui? Toma cupom ;)</p>
          <p class="text-xs text-ink/50 italic mb-3">*Válido apenas para pedidos acima de R$ 50,00</p>
          <template v-if="!couponApplied">
            <button
              @click="handleCoupon"
              class="w-full py-3 rounded-xl font-bold text-sm text-ink"
              style="background:#F5A524"
            >
              Cupom de R$ 15,00 aqui
            </button>
          </template>
          <template v-else>
            <div class="w-full py-3 rounded-xl bg-seal/10 border border-seal/30 text-seal font-bold text-sm text-center flex items-center justify-center gap-1.5">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Aplicado!
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Items + totals -->
    <div class="bg-white rounded-2xl shadow-card border border-ink/[0.06] p-4">
      <div class="flex items-center justify-between mb-3">
        <span class="text-[11px] font-bold text-ink/45 uppercase tracking-widest">ITENS DO PEDIDO</span>
        <span class="text-[11px] text-ink/45">{{ cart.totalQty }} {{ cart.totalQty === 1 ? 'item' : 'itens' }}</span>
      </div>

      <div class="space-y-2 mb-4">
        <div
          v-for="item in cart.items"
          :key="item.productId"
          class="flex justify-between text-sm"
        >
          <span class="text-ink/70">{{ item.qty }}× {{ item.name }}</span>
          <span class="text-ink font-medium">{{ fmt(item.price * item.qty) }}</span>
        </div>
      </div>

      <div class="border-t border-ink/8 pt-3 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-ink/60">Subtotal</span>
          <span class="text-ink">{{ fmt(cart.subtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-ink/60">Entrega</span>
          <span class="font-bold text-seal">Grátis</span>
        </div>
        <div v-if="couponApplied" class="flex justify-between text-sm">
          <span class="text-ink/60">Cupom de boas-vindas</span>
          <span class="font-bold text-red-500">-{{ fmt(15) }}</span>
        </div>
      </div>

      <div class="border-t border-ink/10 mt-3 pt-3 flex justify-between items-baseline">
        <span class="text-base font-bold text-ink">Total</span>
        <span class="text-2xl font-extrabold text-ink tabular-nums">{{ fmt(cart.total) }}</span>
      </div>

      <div class="flex items-center gap-1.5 mt-2">
        <svg class="w-3.5 h-3.5 text-ink/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <p class="text-xs text-ink/40">Entrega em até 35 minutos</p>
      </div>

      <!-- CTA -->
      <button
        @click="emit('next')"
        class="mt-4 w-full bg-action text-white font-bold py-4 rounded-2xl text-base shadow-cta hover:bg-action-deep active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        Ir para pagamento
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Swal from 'sweetalert2'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  address:       { type: Object,  default: null },
  customer:      { type: Object,  default: null },
  couponApplied: { type: Boolean, default: false },
})

const emit = defineEmits(['next', 'back', 'update:coupon', 'update:couponApplied'])

const cart = useCartStore()

function fmt(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0)
}

const maskedTelefone = computed(() => {
  const t = (props.customer?.telefone || '').replace(/\D/g, '')
  if (!t || t.length < 4) return '—'
  if (t.length === 11) return `(${t.slice(0, 2)}) ${t.slice(2, 7)}-${t.slice(7)}`
  if (t.length === 10) return `(${t.slice(0, 2)}) ${t.slice(2, 6)}-${t.slice(6)}`
  return t
})

const maskedCpf = computed(() => {
  const d = (props.customer?.cpf || '').replace(/\D/g, '')
  if (d.length !== 11) return '—'
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
})

async function handleCoupon() {
  if (cart.subtotal >= 50) {
    cart.applyCoupon()
    emit('update:coupon', true)
    emit('update:couponApplied', true)
    await Swal.fire({
      html: `
        <div style="padding:8px 0">
          <div style="width:72px;height:72px;border-radius:50%;border:2px solid #15803D;display:flex;align-items:center;justify-content:center;margin:0 auto 20px">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#15803D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p style="font-size:22px;font-weight:800;color:#1A1A1A;margin-bottom:12px">Cupom Resgatado!</p>
          <p style="font-size:15px;color:#666;line-height:1.5">Seu desconto de <strong>R$ 15,00</strong> foi aplicado ao total do pedido.</p>
        </div>
      `,
      confirmButtonColor: '#0057B7',
      confirmButtonText: 'OK',
      showClass: { popup: 'swal2-show' },
    })
  } else {
    await Swal.fire({
      icon: 'error',
      title: 'Valor mínimo não atingido',
      text: 'Para usar este cupom, o valor do pedido deve ser de pelo menos R$ 50,00.',
      confirmButtonColor: '#0057B7',
      confirmButtonText: 'Entendi',
    })
  }
}
</script>
