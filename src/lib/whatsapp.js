import { DEFAULT_STOREFRONT_SETTINGS } from '@/stores/storefrontSettings'

const FALLBACK_WHATSAPP = DEFAULT_STOREFRONT_SETTINGS.store_whatsapp
const SETTINGS_CACHE_KEY = 'depositomaisbarato:storefront-settings:v1'

let cachedStorefrontSettings = null

function digitsOnly(value) {
  return String(value || '').replace(/\D+/g, '')
}

function fmt(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value ?? 0)
}

function addressLine(address) {
  if (!address) return ''

  const street = [address.logradouro, address.numero].filter(Boolean).join(', ')
  const complement = address.complemento ? ` - ${address.complemento}` : ''
  const neighborhood = address.bairro ? `, ${address.bairro}` : ''
  const city = [address.cidade, address.uf].filter(Boolean).join('/')
  const cep = address.cep ? ` - CEP ${address.cep}` : ''
  const line = `${street}${complement}${neighborhood}${city ? ` - ${city}` : ''}${cep}`.trim()

  return line || ''
}

async function getStorefrontSettings() {
  if (cachedStorefrontSettings) return cachedStorefrontSettings

  try {
    const cached = JSON.parse(localStorage.getItem(SETTINGS_CACHE_KEY) || 'null')
    if (cached && typeof cached === 'object') cachedStorefrontSettings = { ...DEFAULT_STOREFRONT_SETTINGS, ...cached }
  } catch {
    cachedStorefrontSettings = null
  }

  try {
    const res = await fetch('/api/v1/storefront/settings', {
      headers: { Accept: 'application/json' },
    })
    if (res.ok) {
      cachedStorefrontSettings = { ...DEFAULT_STOREFRONT_SETTINGS, ...(await res.json()) }
      localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(cachedStorefrontSettings))
      return cachedStorefrontSettings
    }
  } catch {
    // Keep the WhatsApp shortcut available even when the API is offline.
  }

  cachedStorefrontSettings = cachedStorefrontSettings || DEFAULT_STOREFRONT_SETTINGS
  return cachedStorefrontSettings
}

function buildUrl(phone, message) {
  const cleanPhone = digitsOnly(phone) || FALLBACK_WHATSAPP
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

function openWhatsApp(url) {
  if (typeof window.gtag_report_conversion === 'function') {
    window.gtag_report_conversion(url)
    return
  }

  const opened = window.open(url, '_blank', 'noopener,noreferrer')
  if (!opened) window.location.href = url
}

export async function openProductWhatsApp(product, { qty = 1, address = null } = {}) {
  if (!product) return

  const settings = await getStorefrontSettings()
  const quantity = Math.max(1, Number(qty) || 1)
  const deliveryAddress = addressLine(address)

  const lines = [
    `Olá! Quero comprar pelo WhatsApp:`,
    '',
    `${quantity}x ${product.name}`,
    `Valor: ${fmt(product.price * quantity)}`,
  ]

  if (deliveryAddress) {
    lines.push('', `Endereço: ${deliveryAddress}`)
  }

  lines.push('', 'Pode confirmar disponibilidade e entrega?')
  openWhatsApp(buildUrl(settings.store_whatsapp, lines.join('\n')))
}

export async function openCartWhatsApp(cart) {
  if (!cart?.items?.length) return

  const settings = await getStorefrontSettings()
  const deliveryAddress = addressLine(cart.savedAddress)
  const lines = [
    `Olá! Quero finalizar este pedido pelo WhatsApp:`,
    '',
    ...cart.items.map(item => `${item.qty}x ${item.name} - ${fmt(item.price * item.qty)}`),
    '',
    `Total: ${fmt(cart.total)}`,
  ]

  if (cart.notes) lines.push(`Observação: ${cart.notes}`)
  if (deliveryAddress) lines.push(`Endereço: ${deliveryAddress}`)

  lines.push('', 'Pode confirmar disponibilidade e entrega?')
  openWhatsApp(buildUrl(settings.store_whatsapp, lines.join('\n')))
}

export async function openStoreWhatsApp({ address = null } = {}) {
  const settings = await getStorefrontSettings()
  const deliveryAddress = addressLine(address)
  const lines = [
    'Ola! Quero comprar pelo WhatsApp.',
    'Pode me ajudar a montar meu pedido?',
  ]

  if (deliveryAddress) {
    lines.push('', `Endereco: ${deliveryAddress}`)
  }

  openWhatsApp(buildUrl(settings.store_whatsapp, lines.join('\n')))
}

export async function openPaymentProofWhatsApp(order, displayOrderId) {
  if (!order) return

  const settings = await getStorefrontSettings()
  const customer = order.customer?.nome ? `Cliente: ${order.customer.nome}` : ''
  const phone = order.customer?.telefone ? `Telefone: ${order.customer.telefone}` : ''
  const lines = [
    'Ola! Acabei de pagar o Pix do meu pedido.',
    `Pedido: #${displayOrderId || order.id}`,
    `Total: ${fmt(order.total)}`,
  ]

  if (customer) lines.push(customer)
  if (phone) lines.push(phone)

  lines.push('', 'Segue o comprovante de pagamento em anexo.')
  openWhatsApp(buildUrl(settings.store_whatsapp, lines.join('\n')))
}
