<template>
  <div class="bg-white rounded-2xl shadow-card border border-ink/[0.06] overflow-hidden">

    <!-- Total do pedido collapsible row -->
    <button
      @click="orderOpen = !orderOpen"
      class="w-full flex items-center justify-between px-4 py-3.5 border-b border-ink/[0.06]"
    >
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-ink/5 flex items-center justify-center">
          <svg class="w-4 h-4 text-ink/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <span class="text-sm font-semibold text-ink">Total do pedido</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-base font-bold text-seal">{{ fmt(cart.total) }}</span>
        <svg class="w-4 h-4 text-ink/40 transition-transform" :class="orderOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </button>

    <!-- Order summary expanded -->
    <div v-if="orderOpen" class="px-4 py-3 border-b border-ink/[0.06] bg-ink/[0.02] space-y-1.5">
      <div v-for="item in cart.items" :key="item.productId" class="flex justify-between text-sm">
        <span class="text-ink/60">{{ item.qty }}× {{ item.name }}</span>
        <span class="text-ink font-medium">{{ fmt(item.price * item.qty) }}</span>
      </div>
    </div>

    <div class="px-4 pt-5 pb-4 space-y-5">
      <!-- Section heading -->
      <h2 class="text-xl font-extrabold text-ink">Detalhes de entrega</h2>

      <!-- Nome completo -->
      <div>
        <label class="block text-sm font-medium text-ink/70 mb-1.5">Nome completo</label>
        <input
          v-model="customer.nome"
          type="text"
          autocomplete="name"
          placeholder="Nome Completo"
          class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition"
          :class="errors.nome ? 'border-danger' : ''"
        />
        <p v-if="errors.nome" class="text-danger text-xs mt-1">{{ errors.nome }}</p>
      </div>

      <!-- E-mail -->
      <div>
        <label class="block text-sm font-medium text-ink/70 mb-1.5">E-mail</label>
        <input
          v-model="customer.email"
          type="email"
          autocomplete="email"
          placeholder="seu@email.com"
          class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition"
          :class="errors.email ? 'border-danger' : ''"
        />
        <p v-if="errors.email" class="text-danger text-xs mt-1">{{ errors.email }}</p>
      </div>

      <!-- Telefone + CPF -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-ink/70 mb-1.5">Telefone (WhatsApp)</label>
          <input
            v-model="telefoneMasked"
            type="tel"
            autocomplete="tel"
            placeholder="(11) 99999-9999"
            maxlength="15"
            inputmode="tel"
            class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition"
            :class="errors.telefone ? 'border-danger' : ''"
            @input="onTelefoneInput"
          />
          <p v-if="errors.telefone" class="text-danger text-xs mt-1">{{ errors.telefone }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-ink/70 mb-1.5">CPF</label>
          <input
            v-model="cpfMasked"
            type="text"
            autocomplete="off"
            placeholder="000.000.000-00"
            maxlength="14"
            inputmode="numeric"
            class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition"
            :class="errors.cpf ? 'border-danger' : ''"
            @input="onCpfInput"
          />
          <p v-if="errors.cpf" class="text-danger text-xs mt-1">{{ errors.cpf }}</p>
        </div>
      </div>

      <!-- Pin divider -->
      <div class="flex items-center gap-3">
        <div class="flex-1 h-px bg-ink/10"></div>
        <div class="w-9 h-9 rounded-full bg-action/10 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-action" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="flex-1 h-px bg-ink/10"></div>
      </div>

      <!-- CEP -->
      <div>
        <label class="block text-sm font-medium text-ink/70 mb-1.5">CEP</label>
        <div class="relative w-1/2">
          <input
            v-model="cepMasked"
            type="text"
            autocomplete="postal-code"
            placeholder="00000-000"
            maxlength="9"
            inputmode="numeric"
            class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition pr-10"
            :class="errors.cep ? 'border-danger' : ''"
            @input="onCepInput"
            @blur="fetchCep"
          />
          <div v-if="cepLoading" class="absolute right-3 top-1/2 -translate-y-1/2">
            <div class="w-4 h-4 rounded-full border-2 border-action border-t-transparent animate-spin"></div>
          </div>
        </div>
        <p v-if="errors.cep" class="text-danger text-xs mt-1">{{ errors.cep }}</p>
      </div>

      <!-- Rua / Avenida -->
      <div>
        <label class="block text-sm font-medium text-ink/70 mb-1.5">Rua / Avenida</label>
        <input
          v-model="address.logradouro"
          type="text"
          autocomplete="street-address"
          placeholder="Ex: Rua das Flores"
          class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition"
          :class="errors.logradouro ? 'border-danger' : ''"
        />
        <p v-if="errors.logradouro" class="text-danger text-xs mt-1">{{ errors.logradouro }}</p>
      </div>

      <!-- Número + Complemento -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-ink/70 mb-1.5">Número</label>
          <input
            v-model="address.numero"
            type="text"
            inputmode="numeric"
            placeholder="123"
            class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition"
            :class="errors.numero ? 'border-danger' : ''"
          />
          <p v-if="errors.numero" class="text-danger text-xs mt-1">{{ errors.numero }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-ink/70 mb-1.5">Complemento</label>
          <input
            v-model="address.complemento"
            type="text"
            placeholder="Casa ou apartamento"
            class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition"
          />
        </div>
      </div>

      <!-- Bairro -->
      <div>
        <label class="block text-sm font-medium text-ink/70 mb-1.5">Bairro</label>
        <input
          v-model="address.bairro"
          type="text"
          placeholder="Ex: Centro"
          class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition"
          :class="errors.bairro ? 'border-danger' : ''"
        />
        <p v-if="errors.bairro" class="text-danger text-xs mt-1">{{ errors.bairro }}</p>
      </div>

      <!-- Cidade + UF -->
      <div class="grid grid-cols-3 gap-3">
        <div class="col-span-2">
          <label class="block text-sm font-medium text-ink/70 mb-1.5">Cidade</label>
          <input
            v-model="address.cidade"
            type="text"
            class="w-full rounded-xl border border-ink/10 bg-ink/[0.03] px-4 py-3.5 text-sm text-ink cursor-default"
            readonly
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-ink/70 mb-1.5">UF</label>
          <input
            v-model="address.uf"
            type="text"
            class="w-full rounded-xl border border-ink/10 bg-ink/[0.03] px-4 py-3.5 text-sm text-ink cursor-default"
            readonly
          />
        </div>
      </div>

      <!-- Ponto de referência -->
      <div>
        <label class="block text-sm font-medium text-ink/70 mb-1.5">Ponto de referência (opcional)</label>
        <input
          v-model="address.referencia"
          type="text"
          placeholder="Ex.: ao lado da padaria"
          class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition"
        />
      </div>

      <!-- Submit button -->
      <button
        @click="handleSubmit"
        class="w-full bg-action text-white font-bold py-4 rounded-2xl text-base shadow-cta hover:bg-action-deep active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        Confirmar Endereço
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useTracking } from '@/composables/useTracking'

const cart = useCartStore()
const { track } = useTracking()

const props = defineProps({
  address:  { type: Object, default: () => ({}) },
  customer: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:address', 'update:customer', 'next'])

const orderOpen = ref(false)

const _addr = props.address && Object.keys(props.address).length ? props.address : {}
const _cust = props.customer && Object.keys(props.customer).length ? props.customer : {}

const customer = reactive({
  nome:     _cust.nome     || '',
  email:    _cust.email    || '',
  telefone: _cust.telefone || '',
  cpf:      _cust.cpf      || '',
})

const address = reactive({
  cep:         _addr.cep         || '',
  logradouro:  _addr.logradouro  || '',
  numero:      _addr.numero      || '',
  complemento: _addr.complemento || '',
  bairro:      _addr.bairro      || '',
  referencia:  _addr.referencia  || '',
  cidade:      _addr.cidade      || 'São Paulo',
  uf:          _addr.uf          || 'SP',
})

const telefoneMasked = ref(formatTelefone(customer.telefone))
const cpfMasked      = ref(formatCpf(customer.cpf))
const cepMasked      = ref(formatCep(address.cep))
const cepLoading     = ref(false)

const errors = reactive({
  nome: '', email: '', telefone: '', cpf: '',
  cep: '', logradouro: '', numero: '', bairro: '',
})

function fmt(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0)
}

function formatTelefone(digits) {
  const d = (digits || '').replace(/\D/g, '').slice(0, 11)
  if (!d) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function formatCpf(digits) {
  const d = (digits || '').replace(/\D/g, '').slice(0, 11)
  if (!d) return ''
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

function formatCep(digits) {
  const d = (digits || '').replace(/\D/g, '').slice(0, 8)
  if (!d) return ''
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`
}

function onTelefoneInput(e) {
  const digits = e.target.value.replace(/\D/g, '').slice(0, 11)
  customer.telefone = digits
  telefoneMasked.value = formatTelefone(digits)
  e.target.value = telefoneMasked.value
}

function onCpfInput(e) {
  const digits = e.target.value.replace(/\D/g, '').slice(0, 11)
  customer.cpf = digits
  cpfMasked.value = formatCpf(digits)
  e.target.value = cpfMasked.value
}

function onCepInput(e) {
  const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
  address.cep = digits
  cepMasked.value = formatCep(digits)
  e.target.value = cepMasked.value
}

async function fetchCep() {
  const digits = address.cep.replace(/\D/g, '')
  if (digits.length !== 8) return
  errors.cep = ''
  cepLoading.value = true
  try {
    const res  = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
    const data = await res.json()
    if (data.erro) {
      errors.cep = 'CEP não encontrado.'
    } else {
      address.logradouro = data.logradouro || address.logradouro
      address.bairro     = data.bairro     || address.bairro
      address.cidade     = data.localidade || address.cidade
      address.uf         = data.uf         || address.uf
    }
  } catch {
    errors.cep = 'Não foi possível consultar o CEP.'
  } finally {
    cepLoading.value = false
  }
}

function validarCPF(cpf) {
  const d = cpf.replace(/\D/g, '')
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i)
  let r = (sum * 10) % 11
  if (r === 10 || r === 11) r = 0
  if (r !== parseInt(d[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i)
  r = (sum * 10) % 11
  if (r === 10 || r === 11) r = 0
  return r === parseInt(d[10])
}

function validate() {
  let valid = true

  if (customer.nome.trim().split(/\s+/).filter(Boolean).length < 2) {
    errors.nome = 'Informe nome e sobrenome.'
    valid = false
  } else { errors.nome = '' }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(customer.email.trim())) {
    errors.email = 'Informe um e-mail válido.'
    valid = false
  } else { errors.email = '' }

  if (customer.telefone.replace(/\D/g, '').length < 10) {
    errors.telefone = 'Informe um telefone válido com DDD.'
    valid = false
  } else { errors.telefone = '' }

  if (!validarCPF(customer.cpf)) {
    errors.cpf = 'CPF inválido.'
    valid = false
  } else { errors.cpf = '' }

  if (address.cep.replace(/\D/g, '').length !== 8) {
    errors.cep = 'Informe o CEP com 8 dígitos.'
    valid = false
  } else { errors.cep = '' }

  if (!address.logradouro.trim()) {
    errors.logradouro = 'Informe o logradouro.'
    valid = false
  } else { errors.logradouro = '' }

  if (!address.numero.trim()) {
    errors.numero = 'Informe o número.'
    valid = false
  } else { errors.numero = '' }

  if (!address.bairro.trim()) {
    errors.bairro = 'Informe o bairro.'
    valid = false
  } else { errors.bairro = '' }

  return valid
}

function handleSubmit() {
  if (!validate()) return

  emit('update:address', {
    cep:         address.cep.replace(/\D/g, ''),
    logradouro:  address.logradouro.trim(),
    numero:      address.numero.trim(),
    complemento: address.complemento.trim(),
    bairro:      address.bairro.trim(),
    referencia:  address.referencia.trim(),
    cidade:      address.cidade.trim(),
    uf:          address.uf.trim(),
  })
  emit('update:customer', {
    nome:     customer.nome.trim(),
    email:    customer.email.trim(),
    telefone: customer.telefone.replace(/\D/g, ''),
    cpf:      customer.cpf.replace(/\D/g, ''),
  })
  track('address_submitted', { city: address.cidade, state: address.uf })
  emit('next')
}
</script>
