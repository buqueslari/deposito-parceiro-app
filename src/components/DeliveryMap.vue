<template>
  <div ref="mapEl" :class="[heightClass, 'w-full rounded-xl overflow-hidden bg-slate-100 relative']">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
      <div class="flex flex-col items-center gap-2">
        <div class="w-8 h-8 rounded-full border-4 border-action border-t-transparent animate-spin"></div>
        <span class="text-xs text-slate-500">Carregando mapa…</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  address: { type: Object, default: null },
  storeLabel: { type: String, default: 'Depósito Parceiro' },
  customerLabel: { type: String, default: 'Seu endereço' },
  storeDistanceKm: { type: Number, default: 2.1 },
  customerOnly: { type: Boolean, default: false },
  approximate: { type: Boolean, default: false },
  heightClass: { type: String, default: 'h-64 sm:h-72' },
})

const mapEl = ref(null)
const loading = ref(true)

let map = null
let storeMarker = null
let customerMarker = null
let routeLine = null

// Fixed store location — Depósito Parceiro HQ
const STORE_COORDS = { lat: -23.5489, lng: -46.6388 }
const SP_FALLBACK = { lat: -23.55, lng: -46.64 }

// ─── Custom marker HTML factories ─────────────────────────────────────────────
function storeIconHtml() {
  return `
    <div style="
      width:38px;height:38px;border-radius:50%;background:#0057B7;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,.35);position:relative;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <div style="
        position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);
        width:0;height:0;
        border-left:6px solid transparent;border-right:6px solid transparent;
        border-top:8px solid #0057B7;
      "></div>
    </div>`
}

function customerIconHtml() {
  return `
    <div style="
      width:38px;height:38px;border-radius:50%;background:#fff;
      border:2.5px solid #0057B7;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,.3);position:relative;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0057B7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <div style="
        position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);
        width:0;height:0;
        border-left:6px solid transparent;border-right:6px solid transparent;
        border-top:8px solid #0057B7;
      "></div>
    </div>`
}

function approximateIconHtml() {
  return `
    <div style="
      width:38px;height:38px;border-radius:50%;background:#E08F1A;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,.3);position:relative;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <div style="
        position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);
        width:0;height:0;
        border-left:6px solid transparent;border-right:6px solid transparent;
        border-top:8px solid #E08F1A;
      "></div>
    </div>`
}

function makeStoreIcon() {
  return L.divIcon({
    html: storeIconHtml(),
    className: '',
    iconSize: [38, 46],
    iconAnchor: [19, 46],
    popupAnchor: [0, -46],
  })
}

function makeCustomerIcon(approximate) {
  return L.divIcon({
    html: approximate ? approximateIconHtml() : customerIconHtml(),
    className: '',
    iconSize: [38, 46],
    iconAnchor: [19, 46],
    popupAnchor: [0, -46],
  })
}

// ─── Geocoding with sessionStorage cache ──────────────────────────────────────
function cacheKey(addr) {
  return `depositoparceiro:geocode:cep:v1:${addr.cep}|${addr.uf}|${addr.logradouro}`
}

async function geocodeAddress(addr) {
  if (!addr || !addr.cep) return null

  const key = cacheKey(addr)
  const cached = sessionStorage.getItem(key)
  if (cached) {
    try { return JSON.parse(cached) } catch { /* ignore */ }
  }

  try {
    const cepDigits = (addr.cep || '').replace(/\D/g, '')
    const city = encodeURIComponent(addr.cidade || '')
    const uf = encodeURIComponent(addr.uf || '')
    const street = encodeURIComponent(addr.logradouro || '')
    const res = await fetch(`/api/v1/geocode/cep/${cepDigits}?city=${city}&uf=${uf}&street=${street}`)
    if (!res.ok) throw new Error('geocode failed')
    const data = await res.json()
    if (data && data.lat && data.lng) {
      sessionStorage.setItem(key, JSON.stringify({ lat: data.lat, lng: data.lng }))
      return { lat: data.lat, lng: data.lng }
    }
  } catch {
    // fall through to fallback
  }
  return null
}

// ─── Map helpers ──────────────────────────────────────────────────────────────
function clearLayers() {
  if (storeMarker) { storeMarker.remove(); storeMarker = null }
  if (customerMarker) { customerMarker.remove(); customerMarker = null }
  if (routeLine) { routeLine.remove(); routeLine = null }
}

async function updateMap() {
  if (!map) return
  loading.value = true
  clearLayers()

  let customerCoords = null

  if (props.address) {
    customerCoords = await geocodeAddress(props.address)
    if (!customerCoords) customerCoords = SP_FALLBACK
  }

  const showStore = !props.customerOnly
  const storeCoords = STORE_COORDS

  if (showStore) {
    storeMarker = L.marker([storeCoords.lat, storeCoords.lng], { icon: makeStoreIcon() })
      .addTo(map)
      .bindTooltip(props.storeLabel, { direction: 'top', offset: [0, -46] })
  }

  if (customerCoords) {
    const label = props.approximate
      ? `${props.customerLabel} (aprox.)`
      : props.customerLabel
    customerMarker = L.marker([customerCoords.lat, customerCoords.lng], {
      icon: makeCustomerIcon(props.approximate),
    })
      .addTo(map)
      .bindTooltip(label, { direction: 'top', offset: [0, -46] })
  }

  // Draw dashed route line between store and customer
  if (showStore && customerCoords) {
    routeLine = L.polyline(
      [[storeCoords.lat, storeCoords.lng], [customerCoords.lat, customerCoords.lng]],
      { color: '#0057B7', weight: 3, opacity: 0.55, dashArray: '6 8' }
    ).addTo(map)
  }

  // Fit bounds / set view
  const points = []
  if (showStore) points.push([storeCoords.lat, storeCoords.lng])
  if (customerCoords) points.push([customerCoords.lat, customerCoords.lng])

  if (points.length >= 2) {
    map.fitBounds(L.latLngBounds(points), { padding: [32, 32], maxZoom: 15 })
  } else if (points.length === 1) {
    map.setView(points[0], 15)
  } else {
    map.setView([SP_FALLBACK.lat, SP_FALLBACK.lng], 12)
  }

  loading.value = false
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await nextTick()
  if (!mapEl.value) return

  map = L.map(mapEl.value, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    keyboard: false,
    dragging: false,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map)

  await updateMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})

watch(() => props.address, updateMap, { deep: true })
watch(() => props.customerOnly, updateMap)
watch(() => props.approximate, updateMap)
</script>
