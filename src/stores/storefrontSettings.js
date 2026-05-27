import { defineStore } from 'pinia'
import { ref } from 'vue'

const SETTINGS_CACHE_KEY = 'depositomaisbarato:storefront-settings:v1'

export const DEFAULT_STOREFRONT_SETTINGS = {
  store_name: 'Depósito Mais Barato',
  store_phone: '55 11 94821-9943',
  store_whatsapp: '5511948219943',
  store_city: 'Entregas em 30 Min',
  store_hours: 'Diariamente · Aberto 24 horas',
  store_cnpj: '01.875.479/0001-72',
  delivery_min: '40',
  delivery_fee: '0',
  delivery_eta_min: '20',
  delivery_eta_max: '35',
}

function readCachedSettings() {
  try {
    const cached = JSON.parse(localStorage.getItem(SETTINGS_CACHE_KEY) || 'null')
    return cached && typeof cached === 'object'
      ? { ...DEFAULT_STOREFRONT_SETTINGS, ...cached }
      : DEFAULT_STOREFRONT_SETTINGS
  } catch {
    return DEFAULT_STOREFRONT_SETTINGS
  }
}

export const useStorefrontSettingsStore = defineStore('storefrontSettings', () => {
  const settings = ref(readCachedSettings())
  const loading = ref(false)
  const loaded = ref(false)

  async function load({ force = false } = {}) {
    if (loading.value || (loaded.value && !force)) return settings.value

    loading.value = true
    try {
      const res = await fetch('/api/v1/storefront/settings', {
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        const remote = await res.json()
        settings.value = { ...DEFAULT_STOREFRONT_SETTINGS, ...remote }
        localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings.value))
      }
    } catch {
      // Keep cached/default settings visible; never fall back to old brand data.
    } finally {
      loaded.value = true
      loading.value = false
    }

    return settings.value
  }

  function setFromAdmin(nextSettings) {
    settings.value = { ...DEFAULT_STOREFRONT_SETTINGS, ...(nextSettings || {}) }
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings.value))
  }

  return { settings, loading, loaded, load, setFromAdmin }
})
