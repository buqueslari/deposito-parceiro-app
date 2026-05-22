<template>
  <div class="min-h-screen bg-[#0057B7] flex items-center justify-center px-4">
    <div class="w-full max-w-sm">

      <!-- Logo / título -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <h1 class="text-2xl font-extrabold text-white">Depósito Parceiro</h1>
        <p class="text-white/60 text-sm mt-1">Painel Administrativo</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-3xl p-6 shadow-2xl">
        <h2 class="text-lg font-extrabold text-[#1A1A1A] mb-5">Entrar no painel</h2>

        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-widest mb-1.5">Senha</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full border border-[#1A1A1A]/15 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0057B7]/40 focus:border-[#0057B7]"
              autofocus
            />
          </div>

          <p v-if="error" class="text-sm text-red-500 font-medium">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[#0057B7] text-white font-bold py-3.5 rounded-xl text-sm hover:bg-[#0046a0] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/>
            </svg>
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </div>

      <p class="text-center text-white/30 text-xs mt-6">Depósito Parceiro © {{ new Date().getFullYear() }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router   = useRouter()
const password = ref('')
const loading  = ref(false)
const error    = ref('')

async function login() {
  error.value   = ''
  loading.value = true
  try {
    const res = await fetch('/api/admin/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password: password.value }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erro ao entrar.')
    localStorage.setItem('dp_admin_token', data.token)
    router.push('/admin')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
