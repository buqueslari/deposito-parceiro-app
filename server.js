import express from 'express'
import cors from 'cors'
import { randomUUID } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(express.json())
app.use(cors())

// ─── Config ──────────────────────────────────────────────────────────────────

const BLACKCAT_API_KEY = process.env.BLACKCAT_API_KEY || ''
const BLACKCAT_BASE    = 'https://api.blackcatpay.com.br'
const SUPABASE_URL     = process.env.SUPABASE_URL
const SUPABASE_KEY     = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_PASSWORD   = process.env.ADMIN_PASSWORD   || 'Deposito@2025'
const JWT_SECRET       = process.env.ADMIN_JWT_SECRET || 'dp-secret'

const db = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─── Local JSON fallback (used when Supabase table doesn't exist) ─────────────

const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json')

function jsonReadOrders() {
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')) } catch { return [] }
}

function jsonWriteOrders(orders) {
  fs.mkdirSync(path.dirname(ORDERS_FILE), { recursive: true })
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2))
}

// Returns { data, error } — mirrors supabase-js shape
const localOrders = {
  insert(order) {
    try {
      const orders = jsonReadOrders()
      const row = { ...order, created_at: new Date().toISOString() }
      orders.push(row)
      jsonWriteOrders(orders)
      return { data: row, error: null }
    } catch (e) { return { data: null, error: e } }
  },
  findById(id) {
    const orders = jsonReadOrders()
    const row = orders.find(o => o.id === id)
    return { data: row || null, error: row ? null : { message: 'not found' } }
  },
  updateById(id, patch) {
    try {
      const orders = jsonReadOrders()
      const idx = orders.findIndex(o => o.id === id)
      if (idx === -1) return { data: null, error: { message: 'not found' } }
      orders[idx] = { ...orders[idx], ...patch }
      jsonWriteOrders(orders)
      return { data: orders[idx], error: null }
    } catch (e) { return { data: null, error: e } }
  },
  updateByTransactionId(txId, patch) {
    try {
      const orders = jsonReadOrders()
      orders.forEach((o, i) => { if (o.transaction_id === txId) orders[i] = { ...o, ...patch } })
      jsonWriteOrders(orders)
      return { error: null }
    } catch (e) { return { error: e } }
  },
  list({ status, search, from = 0, to = 49 } = {}) {
    try {
      let orders = jsonReadOrders().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      if (status && status !== 'todos') orders = orders.filter(o => o.status === status)
      if (search) {
        const s = search.toLowerCase()
        orders = orders.filter(o => (o.customer?.nome || '').toLowerCase().includes(s) || (o.customer?.telefone || '').includes(s))
      }
      const count = orders.length
      return { data: orders.slice(from, to + 1), count, error: null }
    } catch (e) { return { data: [], count: 0, error: e } }
  },
  listAll() { return jsonReadOrders() },
}

function isTableMissing(err) {
  return err && (err.code === 'PGRST205' || (err.message || '').includes('does not exist'))
}

// ─── PIX BR Code generator (BACEN EMV spec) ──────────────────────────────────

function crc16ccitt(str) {
  let crc = 0xFFFF
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1)
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
}

function pf(id, value) { return `${id}${String(value.length).padStart(2, '0')}${value}` }

function buildPixBRCode(key, amountReais, txId, recipientName, city) {
  const normalize = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9 ]/g, ' ').trim()
  const mai  = pf('00', 'BR.GOV.BCB.PIX') + pf('01', key.trim())
  const txid = (txId || '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 25) || 'pedido'
  let payload = '000201' + '010212'
  payload += pf('26', mai)
  payload += '52040000' + '5303986'
  if (amountReais > 0) payload += pf('54', amountReais.toFixed(2))
  payload += '5802BR'
  payload += pf('59', normalize(recipientName).substring(0, 25))
  payload += pf('60', normalize(city || 'SAO PAULO').substring(0, 15))
  payload += pf('62', pf('05', txid))
  payload += '6304'
  return payload + crc16ccitt(payload)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function blackcatFetch(path, options = {}) {
  const res = await fetch(`${BLACKCAT_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-API-Key': BLACKCAT_API_KEY, ...options.headers },
  })
  const text = await res.text()
  let data = null
  try { data = JSON.parse(text) } catch { data = text }
  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `BlackcatPay HTTP ${res.status}`)
    err.status = res.status; err.body = data; throw err
  }
  return data
}

function normalizeStatus(s) {
  switch ((s || '').toUpperCase()) {
    case 'PAID':      return 'pago'
    case 'PENDING':   return 'aguardando_pagamento'
    case 'CANCELLED': return 'cancelado'
    case 'REFUNDED':  return 'cancelado'
    default:          return 'aguardando_pagamento'
  }
}

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'Não autorizado.' })
  try { req.admin = jwt.verify(token, JWT_SECRET); next() }
  catch { return res.status(401).json({ message: 'Token inválido ou expirado.' }) }
}

// ─── Client Routes ────────────────────────────────────────────────────────────

// Track funnel events (fire-and-forget from frontend)
app.post('/api/v1/events', async (req, res) => {
  const { session_id, event, metadata } = req.body || {}
  if (!session_id || !event) return res.status(400).json({ message: 'session_id e event obrigatórios.' })
  db.from('events').insert({ session_id, event, metadata: metadata || null }).then(() => {}).catch(() => {})
  return res.json({ ok: true })
})

// Create order
app.post('/api/v1/pedidos', async (req, res) => {
  try {
    const { items = [], customer = {}, address = {}, notes, total: passedTotal, couponDiscount = 0, session_id } = req.body
    if (!items.length) return res.status(400).json({ message: 'Carrinho vazio.' })

    const subtotal   = items.reduce((s, i) => s + ((i.price || 0) * (i.qty || i.qtd || 1)), 0)
    const totalReais = passedTotal != null ? Number(passedTotal) : Math.max(0, subtotal - couponDiscount)
    const totalCents = Math.round(totalReais * 100)
    if (totalCents < 4000) return res.status(400).json({ message: 'Pedido mínimo de R$ 40,00.' })

    // Read pix_mode from settings
    const { data: settingsRows } = await db.from('settings').select('key, value')
    const cfg = {}; (settingsRows || []).forEach(r => { cfg[r.key] = r.value })
    const pixMode = cfg.pix_mode || 'api'

    const orderId = randomUUID()
    let transactionId, pixCode, pixBase64, paymentMode

    if (pixMode === 'manual') {
      const pixKey  = cfg.pix_manual_key || ''
      const pixName = cfg.pix_manual_name || cfg.store_name || 'Deposito Parceiro'
      const pixCity = (cfg.store_city || 'SAO PAULO').split('·')[0].trim()
      if (!pixKey) return res.status(400).json({ message: 'Chave PIX não configurada. Configure no painel admin.' })
      transactionId = orderId
      pixCode       = buildPixBRCode(pixKey, totalReais, orderId, pixName, pixCity)
      pixBase64     = null
      paymentMode   = 'manual'
    } else {
      const bcRes = await blackcatFetch('/api/sales/create-sale', {
        method: 'POST',
        body: JSON.stringify({
          amount: totalCents, paymentMethod: 'PIX',
          customer: { name: customer.nome || 'Cliente', email: customer.email || 'cliente@depositoparceiro.online', phone: (customer.telefone || '').replace(/\D/g, ''), document: { number: (customer.cpf || '').replace(/\D/g, ''), type: 'cpf' } },
          items: items.map(i => ({ title: i.nome || i.name || 'Produto', quantity: i.qty || i.qtd || 1, unitPrice: Math.round((i.price || 0) * 100), tangible: false })),
        }),
      })
      transactionId = bcRes?.data?.transactionId || bcRes?.transactionId
      pixCode       = bcRes?.data?.paymentData?.copyPaste || bcRes?.data?.paymentData?.qrCode || null
      pixBase64     = bcRes?.data?.paymentData?.qrCodeBase64 || null
      paymentMode   = 'api'
      if (!transactionId) return res.status(502).json({ message: 'Falha ao gerar cobrança PIX.' })
    }

    const order = { id: orderId, transaction_id: transactionId, status: 'aguardando_pagamento', paid: false, total: totalReais, total_cents: totalCents, customer, address, notes: notes || null, items, payment: { method: 'pix', mode: paymentMode, pix_code: pixCode, pix_base64: pixBase64 } }

    let { error: dbErr } = await db.from('orders').insert(order)
    if (isTableMissing(dbErr)) { const fb = localOrders.insert(order); dbErr = fb.error }
    if (dbErr) return res.status(500).json({ message: 'Erro ao salvar pedido.' })

    if (session_id) db.from('events').insert({ session_id, event: 'pix_generated', metadata: { order_id: orderId, total: totalReais } }).then(() => {}).catch(() => {})

    return res.status(201).json({ id: orderId, status: order.status, total: totalReais, payment: order.payment })
  } catch (err) {
    console.error('POST /api/v1/pedidos error:', err)
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno.' })
  }
})

// Get order
app.get('/api/v1/pedidos/:id', async (req, res) => {
  let { data: order, error } = await db.from('orders').select('*').eq('id', req.params.id).single()
  if (isTableMissing(error)) { const fb = localOrders.findById(req.params.id); order = fb.data; error = fb.error }
  if (error || !order) return res.status(404).json({ message: 'Pedido não encontrado.' })
  return res.json({ ...order, transactionId: order.transaction_id, totalCents: order.total_cents, createdAt: order.created_at })
})

// Poll order status
app.get('/api/v1/pedidos/:id/status', async (req, res) => {
  let { data: order, error: orderErr } = await db.from('orders').select('id, transaction_id, status, payment').eq('id', req.params.id).single()
  if (isTableMissing(orderErr)) { const fb = localOrders.findById(req.params.id); order = fb.data }
  if (!order) return res.status(404).json({ message: 'Pedido não encontrado.' })
  // Manual PIX: confirmation is done by admin, just return current DB status
  if (order.payment?.mode === 'manual') return res.json({ status: order.status })
  try {
    const bcRes  = await blackcatFetch(`/api/sales/${order.transaction_id}/status`)
    const normalized = normalizeStatus(bcRes?.data?.status || bcRes?.status)
    const patch = { status: normalized, paid: normalized === 'pago' }
    const { error: upErr } = await db.from('orders').update(patch).eq('id', order.id)
    if (isTableMissing(upErr)) localOrders.updateById(order.id, patch)
    return res.json({ status: normalized })
  } catch { return res.json({ status: order.status }) }
})

// Webhook
app.post('/api/v1/webhook', async (req, res) => {
  const { event, data } = req.body || {}
  if (event === 'payment.confirmed' && data?.transactionId) {
    const { error: whErr } = await db.from('orders').update({ status: 'pago', paid: true }).eq('transaction_id', data.transactionId)
    if (isTableMissing(whErr)) localOrders.updateByTransactionId(data.transactionId, { status: 'pago', paid: true })
  }
  return res.json({ ok: true })
})

// CEP
app.get('/api/v1/geocode/cep/:cep', async (req, res) => {
  const cep = req.params.cep.replace(/\D/g, '')
  if (cep.length !== 8) return res.status(400).json({ message: 'CEP inválido.' })
  try {
    const data = await (await fetch(`https://viacep.com.br/ws/${cep}/json/`)).json()
    if (data.erro) return res.status(404).json({ message: 'CEP não encontrado.' })
    return res.json({ cep: data.cep, street: data.logradouro, neighborhood: data.bairro, city: data.localidade, state: data.uf })
  } catch { return res.status(502).json({ message: 'CEP indisponível.' }) }
})

// Storefront
app.get('/api/v1/storefront/location', (_req, res) => {
  return res.json({ available: true, distanceKm: 2.1, deliveryFee: 0, minOrder: 40, etaMinutes: { min: 20, max: 35 } })
})

// ─── Admin Routes ─────────────────────────────────────────────────────────────

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {}
  if (!password || password !== ADMIN_PASSWORD) return res.status(401).json({ message: 'Senha incorreta.' })
  return res.json({ token: jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' }) })
})

// Stats + funnel
app.get('/api/admin/stats', requireAdmin, async (_req, res) => {
  const today = new Date(); today.setHours(0, 0, 0, 0)

  const [r0, r1, r2, r3] = await Promise.all([
    db.from('orders').select('total, status').gte('created_at', today.toISOString()),
    db.from('orders').select('total').eq('paid', true),
    db.from('orders').select('id').eq('status', 'aguardando_pagamento'),
    db.from('events').select('event').gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
  ])

  // Fallback to local JSON if orders table is missing
  let todayRows = r0.data, paidRows = r1.data, pendingRows = r2.data, funnelRows = r3.data
  if (isTableMissing(r0.error) || isTableMissing(r1.error) || isTableMissing(r2.error)) {
    const allOrders = localOrders.listAll()
    const todayISO  = today.toISOString()
    todayRows   = allOrders.filter(o => (o.created_at || '') >= todayISO)
    paidRows    = allOrders.filter(o => o.paid)
    pendingRows = allOrders.filter(o => o.status === 'aguardando_pagamento')
  }

  const todayRevenue  = (todayRows || []).reduce((s, o) => s + Number(o.total || 0), 0)
  const totalRevenue  = (paidRows  || []).reduce((s, o) => s + Number(o.total || 0), 0)
  const todayOrders   = (todayRows || []).length
  const todayPaid     = (todayRows || []).filter(o => o.paid || o.status === 'pago').length

  // Funnel counts (last 7 days)
  const evCount = (name) => (funnelRows || []).filter(e => e.event === name).length
  const funnel = {
    page_view:          evCount('page_view'),
    cart_add:           evCount('cart_add'),
    checkout_started:   evCount('checkout_started'),
    address_submitted:  evCount('address_submitted'),
    pix_generated:      evCount('pix_generated'),
    payment_confirmed:  evCount('payment_confirmed'),
  }

  // Unique sessions per step
  const sessions = {}
  ;(funnelRows || []).forEach(e => { if (!sessions[e.event]) sessions[e.event] = new Set(); sessions[e.event].add(e.session_id) })
  const uniqueFunnel = Object.fromEntries(Object.entries(sessions).map(([k, v]) => [k, v.size]))

  return res.json({ todayOrders, todayRevenue, todayPaid, totalRevenue, pendingOrders: (pendingRows || []).length, funnel, uniqueFunnel })
})

// List orders
app.get('/api/admin/pedidos', requireAdmin, async (req, res) => {
  const { status, search, page = 1, limit = 50 } = req.query
  const from = (Number(page) - 1) * Number(limit), to = from + Number(limit) - 1

  let query = db.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
  if (status && status !== 'todos') query = query.eq('status', status)
  if (search) query = query.or(`customer->>nome.ilike.%${search}%,customer->>telefone.ilike.%${search}%`)

  let { data, error, count } = await query
  if (isTableMissing(error)) {
    const fb = localOrders.list({ status, search, from, to })
    data = fb.data; count = fb.count; error = fb.error
  }
  if (error) return res.status(500).json({ message: error.message })
  return res.json({ orders: data || [], total: count || 0 })
})

// Get single order
app.get('/api/admin/pedidos/:id', requireAdmin, async (req, res) => {
  let { data, error } = await db.from('orders').select('*').eq('id', req.params.id).single()
  if (isTableMissing(error)) { const fb = localOrders.findById(req.params.id); data = fb.data; error = fb.error }
  if (error || !data) return res.status(404).json({ message: 'Pedido não encontrado.' })
  return res.json(data)
})

// Update order status
app.patch('/api/admin/pedidos/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body || {}
  const allowed = ['aguardando_pagamento', 'pago', 'em_preparo', 'em_rota', 'entregue', 'cancelado']
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Status inválido.' })
  const isPaid = ['pago', 'em_preparo', 'em_rota', 'entregue'].includes(status)
  let { data, error } = await db.from('orders').update({ status, paid: isPaid }).eq('id', req.params.id).select().single()
  if (isTableMissing(error)) { const fb = localOrders.updateById(req.params.id, { status, paid: isPaid }); data = fb.data; error = fb.error }
  if (error) return res.status(500).json({ message: error.message })
  return res.json(data)
})

// Get settings
app.get('/api/admin/settings', requireAdmin, async (_req, res) => {
  const { data } = await db.from('settings').select('key, value')
  const obj = {}; (data || []).forEach(r => { obj[r.key] = r.value })
  return res.json(obj)
})

// Update settings
app.patch('/api/admin/settings', requireAdmin, async (req, res) => {
  const updates = req.body || {}
  const rows = Object.entries(updates).map(([key, value]) => ({ key, value: String(value) }))
  if (!rows.length) return res.json({ ok: true })
  const { error } = await db.from('settings').upsert(rows, { onConflict: 'key' })
  if (error) return res.status(500).json({ message: error.message })
  return res.json({ ok: true })
})

// ─── Start (local only) ──────────────────────────────────────────────────────

export default app

// Only listen when run directly (not imported by Vercel serverless)
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const PORT = process.env.PORT || 8000
  app.listen(PORT, () => {
    console.log(`Depósito Parceiro API → http://localhost:${PORT}`)
    console.log(`Supabase: ${SUPABASE_URL ? 'conectado' : 'SEM CONFIGURAÇÃO'}`)
  })
}
