import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const CART_KEY    = 'depositoparceiro:cart:v1'
const NOTES_KEY   = 'depositoparceiro:cart-notes:v1'
const ADDRESS_KEY = 'depositoparceiro:address:v1'

export const MIN_ORDER = 40
export const FREE_DELIVERY_ABOVE = 40
export const COUPON_CODE = 'BEMVINDO15'
export const COUPON_DISCOUNT = 15
export const COUPON_MIN_ORDER = 50

function load() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') } catch { return [] }
}
function save(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

function loadAddress() {
  try { return JSON.parse(localStorage.getItem(ADDRESS_KEY) || 'null') } catch { return null }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(load())
  const notes = ref(localStorage.getItem(NOTES_KEY) || '')
  const couponApplied = ref(false)
  const savedAddress = ref(loadAddress())

  const totalQty = computed(() => items.value.reduce((s, i) => s + i.qty, 0))

  const subtotal = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))

  const couponDiscount = computed(() =>
    couponApplied.value && subtotal.value >= COUPON_MIN_ORDER ? COUPON_DISCOUNT : 0
  )

  const deliveryFee = computed(() => 0)

  const total = computed(() => Math.max(0, subtotal.value - couponDiscount.value + deliveryFee.value))

  const meetsMinimum = computed(() => subtotal.value >= MIN_ORDER)

  function add(product) {
    const existing = items.value.find(i => i.productId === product.id)
    const max = product.maxQty ?? 99
    if (existing) {
      existing.qty = Math.min(existing.qty + 1, max)
    } else {
      items.value.push({ productId: product.id, name: product.name, price: product.price, image: product.image, qty: 1, maxQty: max })
    }
    save(items.value)
  }

  function remove(productId) {
    const idx = items.value.findIndex(i => i.productId === productId)
    if (idx === -1) return
    if (items.value[idx].qty > 1) items.value[idx].qty--
    else items.value.splice(idx, 1)
    save(items.value)
  }

  function setQty(productId, qty) {
    const item = items.value.find(i => i.productId === productId)
    if (!item) return
    if (qty <= 0) items.value.splice(items.value.indexOf(item), 1)
    else item.qty = Math.min(qty, item.maxQty ?? 99)
    save(items.value)
  }

  function clear() {
    items.value = []
    notes.value = ''
    couponApplied.value = false
    localStorage.removeItem(CART_KEY)
    localStorage.removeItem(NOTES_KEY)
  }

  function applyCoupon() {
    if (subtotal.value < COUPON_MIN_ORDER) return false
    couponApplied.value = true
    return true
  }

  function setNotes(v) {
    notes.value = v
    localStorage.setItem(NOTES_KEY, v)
  }

  function setAddress(addr) {
    savedAddress.value = addr
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(addr))
  }

  function getQty(productId) {
    return items.value.find(i => i.productId === productId)?.qty ?? 0
  }

  return { items, notes, couponApplied, savedAddress, totalQty, subtotal, couponDiscount, deliveryFee, total, meetsMinimum, add, remove, setQty, clear, applyCoupon, setNotes, setAddress, getQty }
})
