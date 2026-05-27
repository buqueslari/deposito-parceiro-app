<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-[3px]" />

        <!-- Card -->
        <div class="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-floating px-6 pt-8 pb-10 sm:pb-8 sm:mx-4">

          <!-- Stage 1: Form -->
          <template v-if="stage === 1">
            <!-- Pin icon -->
            <div class="flex justify-center mb-5">
              <div class="w-14 h-14 rounded-full flex items-center justify-center" style="background:rgba(0,87,183,0.10)">
                <svg class="w-7 h-7 text-action" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
            </div>

            <h2 class="text-center font-extrabold text-ink text-xl leading-tight mb-2">
              Confirme o endereço de entrega
            </h2>
            <p class="text-center text-sm text-ink/55 leading-relaxed mb-5">
              Informe seu endereço para calcular o tempo de entrega
            </p>

            <!-- Location banner -->
            <div class="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-5" style="background:rgba(0,87,183,0.07)">
              <svg class="w-4 h-4 text-action flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div v-if="detecting" class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full border-2 border-action border-t-transparent animate-spin"></div>
                <p class="text-sm text-ink/70">Pedindo sua localização…</p>
              </div>
              <p v-else class="text-sm text-ink leading-snug">
                Você está em <strong>{{ detectedCity }} · {{ detectedState }}</strong>? Confirme seu endereço abaixo.
              </p>
            </div>

            <!-- Fields -->
            <div class="space-y-4">
              <!-- CEP -->
              <div>
                <label class="block text-sm font-semibold text-ink mb-1.5">CEP</label>
                <div class="relative">
                  <input
                    v-model="cepDisplay"
                    type="text"
                    inputmode="numeric"
                    placeholder="00000-000"
                    maxlength="9"
                    class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition"
                    :class="errors.cep ? 'border-danger focus:border-danger focus:ring-danger' : ''"
                    @input="onCepInput"
                    @blur="fetchCep"
                  />
                  <div v-if="cepLoading" class="absolute right-3 top-1/2 -translate-y-1/2">
                    <div class="w-4 h-4 rounded-full border-2 border-action border-t-transparent animate-spin"></div>
                  </div>
                </div>
                <p v-if="errors.cep" class="text-danger text-xs mt-1">{{ errors.cep }}</p>
              </div>

              <!-- Número + Complemento -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-semibold text-ink mb-1.5">Número</label>
                  <input
                    v-model="form.numero"
                    type="text"
                    inputmode="numeric"
                    placeholder="123"
                    class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition"
                    :class="errors.numero ? 'border-danger focus:border-danger focus:ring-danger' : ''"
                  />
                  <p v-if="errors.numero" class="text-danger text-xs mt-1">{{ errors.numero }}</p>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-ink mb-1.5">Complemento</label>
                  <input
                    v-model="form.complemento"
                    type="text"
                    placeholder="Casa ou apartamento"
                    class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition"
                  />
                </div>
              </div>
            </div>

            <button
              @click="confirm"
              class="mt-6 w-full bg-action text-white font-bold py-4 rounded-2xl text-base shadow-cta hover:bg-action-deep active:scale-[0.98] transition-all"
            >
              Confirmar endereço
            </button>
          </template>

          <!-- Stage 2: Searching -->
          <template v-else-if="stage === 2">
            <div class="flex justify-center mb-5">
              <div class="relative w-20 h-20 flex items-center justify-center">
                <div class="absolute inset-0 rounded-full" style="background:rgba(0,87,183,0.08)"></div>
                <div class="absolute w-14 h-14 rounded-full" style="background:rgba(0,87,183,0.12)"></div>
                <div class="w-9 h-9 rounded-full border-[3px] border-action border-t-transparent animate-spin"></div>
              </div>
            </div>

            <h2 class="text-center font-extrabold text-ink text-xl leading-tight mb-2">
              Buscando unidade mais próxima
            </h2>
            <p class="text-center text-sm text-ink/55 mb-5">
              Estamos localizando o depósito ideal pra você
            </p>

            <div class="flex items-start gap-3 rounded-xl border border-ink/10 px-4 py-3.5">
              <svg class="w-4 h-4 text-action flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div class="text-sm text-ink leading-snug">
                <p class="font-medium">{{ form.logradouro }}, {{ form.numero }}<span v-if="form.complemento"> — {{ form.complemento }}</span></p>
                <p class="text-ink/55">{{ form.bairro }} · {{ form.cidade }} · {{ form.uf }} · {{ cepDisplay }}</p>
              </div>
            </div>
          </template>

          <!-- Stage 3: Found -->
          <template v-else-if="stage === 3">
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 rounded-full flex items-center justify-center" style="background:rgba(21,128,61,0.12)">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#15803D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
            </div>

            <p class="text-center text-xs font-bold tracking-widest mb-2" style="color:#15803D">UNIDADE ENCONTRADA</p>

            <div class="flex items-center justify-center gap-2 mb-1">
              <h2 class="text-center font-extrabold text-ink text-xl">Depósito Mais Barato</h2>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" class="w-5 h-5 shrink-0">
                <path fill="#00D566" d="M99.5,52.8l-1.9,4.7c-0.6,1.6-0.6,3.3,0,4.9l1.9,4.7c1.1,2.8,0.2,6-2.3,7.8L93,77.8c-1.4,1-2.3,2.5-2.7,4.1l-0.9,5c-0.6,3-3.1,5.2-6.1,5.3l-5.1,0.2c-1.7,0.1-3.3,0.8-4.5,2l-3.5,3.7c-2.1,2.2-5.4,2.7-8,1.2l-4.4-2.6c-1.5-0.9-3.2-1.1-4.9-0.7l-5,1.2c-2.9,0.7-6-0.7-7.4-3.4l-2.3-4.6c-0.8-1.5-2.1-2.7-3.7-3.2l-4.8-1.6c-2.9-1-4.7-3.8-4.4-6.8l0.5-5.1c0.2-1.7-0.3-3.4-1.4-4.7l-3.2-4c-1.9-2.4-1.9-5.7,0-8.1l3.2-4c1.1-1.3,1.6-3,1.4-4.7l-0.5-5.1c-0.3-3,1.5-5.8,4.4-6.8l4.8-1.6c1.6-0.5,2.9-1.7,3.7-3.2l2.3-4.6c1.4-2.7,4.4-4.1,7.4-3.4l5,1.2c1.6,0.4,3.4,0.2,4.9-0.7l4.4-2.6c2.6-1.5,5.9-1.1,8,1.2l3.5,3.7c1.2,1.2,2.8,2,4.5,2l5.1,0.2c3,0.1,5.6,2.3,6.1,5.3l0.9,5c0.3,1.7,1.3,3.2,2.7,4.1l4.2,2.9C99.7,46.8,100.7,50,99.5,52.8z"/>
                <polyline points="42,62 54,74 78,48" fill="none" stroke="white" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <p class="text-center text-sm text-ink/55 mb-5">
              Entrega em {{ form.cidade }} · <strong class="text-ink/70">{{ form.uf }}</strong>
            </p>

            <div class="grid grid-cols-2 gap-3 mb-5">
              <div class="flex flex-col items-center gap-1.5 rounded-xl border border-ink/10 py-4 px-3">
                <svg class="w-5 h-5 text-action" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span class="text-[10px] font-semibold text-ink/50 uppercase tracking-wider">DISTÂNCIA</span>
                <span class="text-base font-extrabold text-ink">2,1 km</span>
              </div>
              <div class="flex flex-col items-center gap-1.5 rounded-xl border border-ink/10 py-4 px-3">
                <svg class="w-5 h-5 text-seal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/>
                  <path d="M15 6H5L3 17"/><path d="M15 6l3 11"/><path d="M9 6l-1 5"/><path d="M13 8H9"/>
                </svg>
                <span class="text-[10px] font-semibold text-ink/50 uppercase tracking-wider">ENTREGA</span>
                <span class="text-base font-extrabold text-ink">20–35 min</span>
              </div>
            </div>

            <button
              @click="verOfertas"
              class="w-full bg-action text-white font-bold py-4 rounded-2xl text-base shadow-cta hover:bg-action-deep active:scale-[0.98] transition-all"
            >
              Ver ofertas
            </button>
          </template>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { geocodeApi } from '@/api'

const STORAGE_KEY = 'depositoparceiro:address:v1'

const visible      = ref(false)
const detecting    = ref(true)
const stage        = ref(1)
const detectedCity  = ref('São Paulo')
const detectedState = ref('SP')

const cepDisplay  = ref('')
const cepLoading  = ref(false)

const form = reactive({
  cep:        '',
  logradouro: '',
  bairro:     '',
  cidade:     'São Paulo',
  uf:         'SP',
  numero:     '',
  complemento:'',
})

const errors = reactive({ cep: '', numero: '' })

const emit = defineEmits(['confirmed', 'detected'])

// ─── Geolocation ─────────────────────────────────────────────────────────────

function getBrowserPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation unavailable'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 10 * 60 * 1000,
    })
  })
}

async function detectLocationByBrowser() {
  const position = await getBrowserPosition()
  const { latitude, longitude } = position.coords || {}
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Invalid coordinates')
  }

  const data = await geocodeApi.reverse({ lat: latitude, lng: longitude })
  if (!data?.city || !data?.state) throw new Error('City not found')
  return { city: data.city, state: data.state }
}

async function detectLocationByIp() {
  const apis = [
    () => fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
          .then(r => r.json())
          .then(d => ({ city: d.city, state: d.region_code })),
    () => fetch('https://ip-api.com/json/?fields=city,regionName,region', { signal: AbortSignal.timeout(4000) })
          .then(r => r.json())
          .then(d => ({ city: d.city, state: d.region })),
    () => fetch('https://freeipapi.com/api/json', { signal: AbortSignal.timeout(4000) })
          .then(r => r.json())
          .then(d => ({ city: d.cityName, state: d.regionCode })),
  ]

  for (const api of apis) {
    try {
      const { city, state } = await api()
      if (city && state) {
        return { city, state: state.length > 2 ? abbreviateState(state) : state.toUpperCase() }
      }
    } catch { /* try next */ }
  }
  return { city: 'São Paulo', state: 'SP' }
}

async function detectCustomerLocation() {
  try {
    return await detectLocationByBrowser()
  } catch {
    return await detectLocationByIp()
  }
}

const BR_STATES = {
  'Acre':'AC','Alagoas':'AL','Amapá':'AP','Amazonas':'AM','Bahia':'BA','Ceará':'CE',
  'Distrito Federal':'DF','Espírito Santo':'ES','Goiás':'GO','Maranhão':'MA',
  'Mato Grosso':'MT','Mato Grosso do Sul':'MS','Minas Gerais':'MG','Pará':'PA',
  'Paraíba':'PB','Paraná':'PR','Pernambuco':'PE','Piauí':'PI','Rio de Janeiro':'RJ',
  'Rio Grande do Norte':'RN','Rio Grande do Sul':'RS','Rondônia':'RO','Roraima':'RR',
  'Santa Catarina':'SC','São Paulo':'SP','Sergipe':'SE','Tocantins':'TO',
}

function abbreviateState(name) {
  if (!name) return 'SP'
  if (name.length === 2) return name.toUpperCase()
  return BR_STATES[name] || name.slice(0, 2).toUpperCase()
}

// ─── CEP helpers ─────────────────────────────────────────────────────────────

function formatCep(digits) {
  const d = (digits || '').replace(/\D/g, '').slice(0, 8)
  if (!d) return ''
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`
}

function onCepInput(e) {
  const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
  form.cep     = digits
  cepDisplay.value = formatCep(digits)
  e.target.value   = cepDisplay.value
}

async function fetchCep() {
  const digits = form.cep.replace(/\D/g, '')
  if (digits.length !== 8) return
  errors.cep   = ''
  cepLoading.value = true
  try {
    const res  = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
    const data = await res.json()
    if (data.erro) {
      errors.cep = 'CEP não encontrado.'
    } else {
      form.logradouro = data.logradouro || ''
      form.bairro     = data.bairro     || ''
      form.cidade     = data.localidade || detectedCity.value
      form.uf         = data.uf         || detectedState.value
    }
  } catch {
    errors.cep = 'Não foi possível consultar o CEP.'
  } finally {
    cepLoading.value = false
  }
}

// ─── Confirm ─────────────────────────────────────────────────────────────────

function confirm() {
  let valid = true
  if (form.cep.replace(/\D/g, '').length !== 8) {
    errors.cep = 'Informe o CEP com 8 dígitos.'
    valid = false
  } else { errors.cep = '' }

  if (!form.numero.trim()) {
    errors.numero = 'Informe o número.'
    valid = false
  } else { errors.numero = '' }

  if (!valid) return

  // Move to stage 2 (searching)
  stage.value = 2

  // After 2 seconds, move to stage 3 (found)
  setTimeout(() => {
    stage.value = 3
  }, 2000)
}

function verOfertas() {
  const saved = {
    cep:         form.cep.replace(/\D/g, ''),
    logradouro:  form.logradouro,
    numero:      form.numero.trim(),
    complemento: form.complemento.trim(),
    bairro:      form.bairro,
    cidade:      form.cidade || detectedCity.value,
    uf:          form.uf     || detectedState.value,
    confirmedAt: Date.now(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  emit('confirmed', saved)
  visible.value = false
}

// ─── Init ─────────────────────────────────────────────────────────────────────

onMounted(async () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const saved = JSON.parse(raw)
      emit('confirmed', saved)
      emit('detected', { city: saved.cidade, state: saved.uf })
      return
    } catch { /* ignore bad data */ }
  }

  setTimeout(() => { visible.value = true }, 300)

  const { city, state } = await detectCustomerLocation()
  detectedCity.value  = city
  detectedState.value = state
  form.cidade         = city
  form.uf             = state
  detecting.value     = false
  emit('detected', { city, state })
})
</script>

<style scoped>
.modal-enter-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-enter-from { opacity: 0; transform: translateY(48px); }
.modal-leave-to   { opacity: 0; transform: translateY(24px); }
@media (min-width: 640px) {
  .modal-enter-from { transform: scale(0.94) translateY(0); }
  .modal-leave-to   { transform: scale(0.96) translateY(0); }
}
</style>
