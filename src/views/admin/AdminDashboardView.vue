<template>
  <div class="min-h-screen bg-[#F0F2F8]">

    <!-- Sidebar (desktop) + overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/40 z-20 lg:hidden"
      @click="sidebarOpen = false"
    />
    <aside
      class="fixed top-0 left-0 h-full w-64 bg-[#0057B7] z-30 flex flex-col transition-transform duration-300"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Logo -->
      <div class="px-5 pt-6 pb-5 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-white font-extrabold text-sm leading-tight truncate">{{ settings.store_name || 'Depósito Parceiro' }}</p>
            <p class="text-white/50 text-[11px]">Painel Admin</p>
          </div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <button
          v-for="item in NAV"
          :key="item.id"
          @click="activeTab = item.id; sidebarOpen = false"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
          :class="activeTab === item.id ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'"
        >
          <span class="w-5 h-5 flex-shrink-0" v-html="item.icon" />
          {{ item.label }}
          <span
            v-if="item.id === 'orders' && stats.pendingOrders > 0"
            class="ml-auto bg-amber-400 text-[#1A1A1A] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center"
          >{{ stats.pendingOrders }}</span>
        </button>
      </nav>

      <!-- Footer -->
      <div class="px-3 pb-5">
        <button
          @click="logout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:bg-white/10 hover:text-white transition-all"
        >
          <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sair
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="lg:ml-64 min-h-screen flex flex-col">

      <!-- Top bar -->
      <header class="bg-white border-b border-black/[0.06] px-4 lg:px-6 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button @click="sidebarOpen = !sidebarOpen" class="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/5">
          <svg class="w-5 h-5 text-[#1A1A1A]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <h1 class="font-extrabold text-[#1A1A1A] text-base flex-1">{{ currentTab?.label }}</h1>
        <button
          v-if="activeTab !== 'settings'"
          @click="refresh"
          class="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]/50 hover:text-[#0057B7] transition px-3 py-1.5 rounded-xl hover:bg-[#0057B7]/5"
        >
          <svg class="w-3.5 h-3.5" :class="refreshing ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.54-4.06"/>
          </svg>
          Atualizar
        </button>
      </header>

      <!-- Content -->
      <main class="flex-1 px-4 lg:px-6 py-5 space-y-5">

        <!-- ═══ DASHBOARD TAB ═══ -->
        <template v-if="activeTab === 'dashboard'">

          <!-- Stats cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="bg-white rounded-2xl p-4 border border-black/[0.05]">
              <p class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest mb-1.5">Pedidos Hoje</p>
              <p class="text-3xl font-extrabold text-[#1A1A1A]">{{ stats.todayOrders ?? '—' }}</p>
              <p class="text-xs text-[#1A1A1A]/40 mt-1">{{ stats.todayPaid ?? 0 }} pagos</p>
            </div>
            <div class="bg-white rounded-2xl p-4 border border-black/[0.05]">
              <p class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest mb-1.5">Faturamento Hoje</p>
              <p class="text-3xl font-extrabold text-[#15803D]">{{ fmt(stats.todayRevenue) }}</p>
              <p class="text-xs text-[#1A1A1A]/40 mt-1">pedidos pagos</p>
            </div>
            <div class="bg-white rounded-2xl p-4 border border-black/[0.05]">
              <p class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest mb-1.5">Aguardando PIX</p>
              <p class="text-3xl font-extrabold text-amber-500">{{ stats.pendingOrders ?? '—' }}</p>
              <p class="text-xs text-[#1A1A1A]/40 mt-1">não pagaram ainda</p>
            </div>
            <div class="bg-white rounded-2xl p-4 border border-black/[0.05]">
              <p class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest mb-1.5">Total Recebido</p>
              <p class="text-3xl font-extrabold text-[#0057B7]">{{ fmt(stats.totalRevenue) }}</p>
              <p class="text-xs text-[#1A1A1A]/40 mt-1">histórico completo</p>
            </div>
          </div>

          <!-- Funil de conversão -->
          <div class="bg-white rounded-2xl border border-black/[0.05] p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="font-extrabold text-[#1A1A1A]">Funil de Conversão</h2>
                <p class="text-xs text-[#1A1A1A]/40 mt-0.5">Últimos 7 dias · sessões únicas</p>
              </div>
              <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0057B7]/10 text-[#0057B7]">
                {{ conversionRate }}% conversão
              </span>
            </div>

            <div class="space-y-2.5">
              <div
                v-for="(step, i) in funnelSteps"
                :key="step.key"
                class="flex items-center gap-3"
              >
                <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-extrabold"
                  :class="step.count > 0 ? 'bg-[#0057B7] text-white' : 'bg-black/5 text-[#1A1A1A]/30'">
                  {{ i + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-semibold text-[#1A1A1A]">{{ step.label }}</span>
                    <span class="text-sm font-extrabold" :class="step.count > 0 ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/30'">{{ step.count }}</span>
                  </div>
                  <div class="h-2 bg-black/[0.05] rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-700"
                      :class="step.color"
                      :style="{ width: funnelSteps[0].count > 0 ? `${Math.round((step.count / funnelSteps[0].count) * 100)}%` : '0%' }"
                    />
                  </div>
                </div>
                <div class="w-12 text-right text-xs font-bold text-[#1A1A1A]/40 flex-shrink-0">
                  {{ funnelSteps[0].count > 0 ? Math.round((step.count / funnelSteps[0].count) * 100) : 0 }}%
                </div>
              </div>
            </div>

            <!-- Abandono de PIX -->
            <div class="mt-4 pt-4 border-t border-black/[0.06] flex items-center justify-between">
              <div>
                <p class="text-sm font-bold text-[#1A1A1A]">Geraram PIX mas não pagaram</p>
                <p class="text-xs text-[#1A1A1A]/40 mt-0.5">Clientes que chegaram ao pagamento e abandonaram</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-extrabold text-amber-500">{{ abandonedPix }}</p>
                <p class="text-xs text-[#1A1A1A]/40">{{ abandonedRate }}% de abandono</p>
              </div>
            </div>
          </div>

          <!-- Últimos pedidos (preview) -->
          <div class="bg-white rounded-2xl border border-black/[0.05] overflow-hidden">
            <div class="flex items-center justify-between px-5 py-4 border-b border-black/[0.06]">
              <h2 class="font-extrabold text-[#1A1A1A]">Últimos Pedidos</h2>
              <button @click="activeTab = 'orders'" class="text-xs font-bold text-[#0057B7] hover:underline">Ver todos →</button>
            </div>
            <div v-if="recentOrders.length === 0" class="py-8 text-center text-sm text-[#1A1A1A]/30">Nenhum pedido ainda</div>
            <div v-else>
              <div
                v-for="order in recentOrders.slice(0, 5)"
                :key="order.id"
                class="flex items-center gap-3 px-5 py-3 border-b border-black/[0.04] last:border-0 hover:bg-black/[0.02] cursor-pointer"
                @click="openOrder(order)"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-[#1A1A1A] truncate">{{ order.customer?.nome || '—' }}</p>
                  <p class="text-xs text-[#1A1A1A]/40">{{ formatTime(order.created_at) }} · {{ order.customer?.telefone }}</p>
                </div>
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" :class="statusClass(order.status)">{{ statusLabel(order.status) }}</span>
                <span class="font-extrabold text-[#15803D] text-sm tabular-nums flex-shrink-0">{{ fmt(order.total) }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- ═══ ORDERS TAB ═══ -->
        <template v-else-if="activeTab === 'orders'">

          <!-- Search + filters -->
          <div class="flex flex-col sm:flex-row gap-2">
            <div class="relative flex-1">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                v-model="searchQuery"
                @input="debouncedSearch"
                type="text"
                placeholder="Buscar por nome ou telefone..."
                class="w-full pl-9 pr-4 py-2.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B7]/30 focus:border-[#0057B7]"
              />
            </div>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="f in FILTERS"
                :key="f.value"
                @click="activeFilter = f.value; loadOrders()"
                class="px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap"
                :class="activeFilter === f.value ? 'bg-[#0057B7] text-white border-[#0057B7]' : 'bg-white text-[#1A1A1A]/60 border-black/10 hover:border-[#0057B7]/30'"
              >{{ f.label }}</button>
            </div>
          </div>

          <!-- Table -->
          <div class="bg-white rounded-2xl border border-black/[0.05] overflow-hidden">
            <div v-if="ordersLoading" class="flex justify-center py-16">
              <svg class="w-7 h-7 text-[#0057B7] animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            </div>
            <div v-else-if="!orders.length" class="py-16 text-center">
              <svg class="w-10 h-10 text-[#1A1A1A]/20 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
              <p class="text-sm text-[#1A1A1A]/30 font-medium">Nenhum pedido encontrado</p>
            </div>
            <template v-else>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-black/[0.06] bg-black/[0.02]">
                      <th class="text-left px-5 py-3 text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest">#</th>
                      <th class="text-left px-3 py-3 text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest">Cliente</th>
                      <th class="text-left px-3 py-3 text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest hidden md:table-cell">Bairro</th>
                      <th class="text-left px-3 py-3 text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest">Status</th>
                      <th class="text-right px-3 py-3 text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest">Total</th>
                      <th class="text-right px-5 py-3 text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest hidden sm:table-cell">Horário</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="order in orders"
                      :key="order.id"
                      class="border-b border-black/[0.04] last:border-0 hover:bg-[#0057B7]/[0.03] cursor-pointer transition-colors"
                      @click="openOrder(order)"
                    >
                      <td class="px-5 py-3.5 font-mono text-xs text-[#0057B7] font-bold">#{{ order.id.slice(-6).toUpperCase() }}</td>
                      <td class="px-3 py-3.5">
                        <p class="font-semibold text-[#1A1A1A] leading-tight">{{ order.customer?.nome || '—' }}</p>
                        <p class="text-xs text-[#1A1A1A]/40">{{ order.customer?.telefone }}</p>
                      </td>
                      <td class="px-3 py-3.5 text-xs text-[#1A1A1A]/55 hidden md:table-cell">{{ order.address?.bairro || '—' }}</td>
                      <td class="px-3 py-3.5">
                        <span class="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold" :class="statusClass(order.status)">{{ statusLabel(order.status) }}</span>
                      </td>
                      <td class="px-3 py-3.5 text-right font-extrabold text-[#15803D] tabular-nums">{{ fmt(order.total) }}</td>
                      <td class="px-5 py-3.5 text-right text-xs text-[#1A1A1A]/40 hidden sm:table-cell">{{ formatTime(order.created_at) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="totalOrders > pageSize" class="flex items-center justify-between px-5 py-3 border-t border-black/[0.06]">
                <span class="text-xs text-[#1A1A1A]/40">{{ totalOrders }} pedidos</span>
                <div class="flex gap-2">
                  <button :disabled="page === 1" @click="page--; loadOrders()" class="px-3 py-1 text-xs rounded-lg border border-black/10 disabled:opacity-30 hover:bg-black/5">← Ant.</button>
                  <button :disabled="page * pageSize >= totalOrders" @click="page++; loadOrders()" class="px-3 py-1 text-xs rounded-lg border border-black/10 disabled:opacity-30 hover:bg-black/5">Próx. →</button>
                </div>
              </div>
            </template>
          </div>
        </template>

        <!-- ═══ SETTINGS TAB ═══ -->
        <template v-else-if="activeTab === 'settings'">
          <div class="max-w-2xl space-y-4">

            <div class="bg-white rounded-2xl border border-black/[0.05] p-5">
              <h2 class="font-extrabold text-[#1A1A1A] mb-4">Identidade da Loja</h2>
              <div class="space-y-3">
                <div>
                  <label class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1.5">Nome da Loja</label>
                  <input v-model="settingsForm.store_name" type="text" class="input-field" placeholder="Depósito Parceiro" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1.5">Telefone exibido</label>
                    <input v-model="settingsForm.store_phone" type="text" class="input-field" placeholder="(11) 3026-6912" />
                  </div>
                  <div>
                    <label class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1.5">WhatsApp (só números)</label>
                    <input v-model="settingsForm.store_whatsapp" type="text" class="input-field" placeholder="5511930266912" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1.5">Cidade · UF</label>
                    <input v-model="settingsForm.store_city" type="text" class="input-field" placeholder="São Paulo · SP" />
                  </div>
                  <div>
                    <label class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1.5">Horário</label>
                    <input v-model="settingsForm.store_hours" type="text" class="input-field" placeholder="Aberto 24 horas" />
                  </div>
                </div>
                <div>
                  <label class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1.5">CNPJ</label>
                  <input v-model="settingsForm.store_cnpj" type="text" class="input-field" placeholder="00.000.000/0001-00" />
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl border border-black/[0.05] p-5">
              <h2 class="font-extrabold text-[#1A1A1A] mb-4">Entrega</h2>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1.5">Pedido Mínimo (R$)</label>
                  <input v-model="settingsForm.delivery_min" type="number" class="input-field" placeholder="40" />
                </div>
                <div>
                  <label class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1.5">Taxa de Entrega (R$)</label>
                  <input v-model="settingsForm.delivery_fee" type="number" class="input-field" placeholder="0" />
                </div>
                <div>
                  <label class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1.5">ETA Mínimo (min)</label>
                  <input v-model="settingsForm.delivery_eta_min" type="number" class="input-field" placeholder="20" />
                </div>
                <div>
                  <label class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1.5">ETA Máximo (min)</label>
                  <input v-model="settingsForm.delivery_eta_max" type="number" class="input-field" placeholder="35" />
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl border border-black/[0.05] p-5">
              <h2 class="font-extrabold text-[#1A1A1A] mb-4">Cupom de Boas-vindas</h2>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1.5">Desconto (R$)</label>
                  <input v-model="settingsForm.coupon_value" type="number" class="input-field" placeholder="15" />
                </div>
                <div>
                  <label class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1.5">Pedido mínimo (R$)</label>
                  <input v-model="settingsForm.coupon_min_order" type="number" class="input-field" placeholder="50" />
                </div>
                <div class="col-span-2 flex items-center gap-3">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="couponEnabled" class="sr-only peer" />
                    <div class="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:bg-[#0057B7] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                  </label>
                  <span class="text-sm font-semibold text-[#1A1A1A]">Cupom ativo</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                @click="saveSettings"
                :disabled="savingSettings"
                class="flex-1 sm:flex-none bg-[#0057B7] text-white font-bold py-3 px-8 rounded-xl text-sm hover:bg-[#0046a0] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <svg v-if="savingSettings" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                {{ savingSettings ? 'Salvando...' : 'Salvar configurações' }}
              </button>
              <p v-if="settingsSaved" class="text-sm font-bold text-[#15803D] flex items-center gap-1.5">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Salvo!
              </p>
            </div>
          </div>
        </template>

      </main>
    </div>

    <!-- Order detail sheet -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showDetail && selectedOrder" class="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-end">
          <div class="absolute inset-0 bg-black/50" @click="showDetail = false" />
          <div class="relative bg-white w-full sm:w-[420px] sm:h-full overflow-y-auto shadow-2xl sm:rounded-l-3xl rounded-t-3xl sm:rounded-r-none max-h-[92vh] sm:max-h-full">

            <div class="flex justify-center pt-3 sm:hidden">
              <div class="w-10 h-1 bg-black/10 rounded-full" />
            </div>

            <!-- Header -->
            <div class="sticky top-0 bg-white border-b border-black/[0.06] px-5 py-4 flex items-center justify-between z-10">
              <div>
                <p class="font-extrabold text-[#1A1A1A]">#{{ selectedOrder.id.slice(-6).toUpperCase() }}</p>
                <p class="text-xs text-[#1A1A1A]/40">{{ formatDate(selectedOrder.created_at) }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold px-2.5 py-1 rounded-full" :class="statusClass(selectedOrder.status)">{{ statusLabel(selectedOrder.status) }}</span>
                <button @click="showDetail = false" class="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                  <svg class="w-4 h-4 text-[#1A1A1A]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            <div class="px-5 py-4 space-y-4">

              <!-- Mudar status -->
              <div class="rounded-xl bg-[#F0F2F8] p-4">
                <p class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest mb-2.5">Alterar status</p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="s in STATUS_OPTIONS"
                    :key="s.value"
                    :disabled="s.value === selectedOrder.status || updatingStatus"
                    @click="updateStatus(s.value)"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all disabled:opacity-40"
                    :class="s.value === selectedOrder.status
                      ? statusClass(s.value) + ' border-transparent'
                      : 'bg-white border-black/10 text-[#1A1A1A]/60 hover:border-[#0057B7]/40'"
                  >{{ s.label }}</button>
                </div>
              </div>

              <!-- Cliente -->
              <div class="rounded-xl border border-black/[0.08] p-4 space-y-1">
                <p class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest mb-2">Cliente</p>
                <p class="font-bold text-[#1A1A1A]">{{ selectedOrder.customer?.nome }}</p>
                <p class="text-sm text-[#1A1A1A]/55">{{ selectedOrder.customer?.email }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <p class="text-sm text-[#1A1A1A]/55">{{ selectedOrder.customer?.telefone }}</p>
                  <a
                    v-if="selectedOrder.customer?.telefone"
                    :href="`https://wa.me/55${selectedOrder.customer.telefone.replace(/\D/g,'')}`"
                    target="_blank"
                    class="inline-flex items-center gap-1 text-xs font-bold text-[#15803D] bg-[#15803D]/10 px-2 py-0.5 rounded-full hover:bg-[#15803D]/20 transition"
                  >
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp
                  </a>
                </div>
                <p class="text-sm text-[#1A1A1A]/40 text-xs">CPF {{ selectedOrder.customer?.cpf }}</p>
              </div>

              <!-- Endereço -->
              <div class="rounded-xl border border-black/[0.08] p-4">
                <p class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest mb-2">Entregar em</p>
                <p class="font-bold text-[#1A1A1A]">{{ selectedOrder.address?.logradouro }}, {{ selectedOrder.address?.numero }}<span v-if="selectedOrder.address?.complemento"> · {{ selectedOrder.address?.complemento }}</span></p>
                <p class="text-sm text-[#1A1A1A]/55">{{ selectedOrder.address?.bairro }} · {{ selectedOrder.address?.cidade }}/{{ selectedOrder.address?.uf }}</p>
                <p class="text-xs text-[#1A1A1A]/40 mt-0.5">CEP {{ selectedOrder.address?.cep }}</p>
                <p v-if="selectedOrder.address?.referencia" class="text-xs text-[#1A1A1A]/55 mt-1">📍 {{ selectedOrder.address.referencia }}</p>
              </div>

              <!-- Itens -->
              <div class="rounded-xl border border-black/[0.08] p-4">
                <p class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest mb-3">Itens do pedido</p>
                <div class="space-y-2 mb-3">
                  <div v-for="item in selectedOrder.items" :key="item.productId || item.id" class="flex justify-between text-sm">
                    <span class="text-[#1A1A1A]/70">{{ item.qty || item.qtd }}× {{ item.name || item.nome }}</span>
                    <span class="font-semibold text-[#1A1A1A]">{{ fmt((item.price || item.preco) * (item.qty || item.qtd)) }}</span>
                  </div>
                </div>
                <div class="border-t border-black/[0.06] pt-2 flex justify-between items-baseline">
                  <span class="text-sm font-bold text-[#1A1A1A]">Total pago</span>
                  <span class="font-extrabold text-[#15803D] text-xl tabular-nums">{{ fmt(selectedOrder.total) }}</span>
                </div>
              </div>

              <!-- Observação -->
              <div v-if="selectedOrder.notes" class="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p class="text-[11px] font-bold text-amber-700/60 uppercase tracking-widest mb-1">Observação</p>
                <p class="text-sm text-amber-900">{{ selectedOrder.notes }}</p>
              </div>

              <!-- PIX -->
              <div v-if="selectedOrder.payment?.pix_code" class="rounded-xl border border-black/[0.08] p-4">
                <p class="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest mb-2">Código PIX gerado</p>
                <p class="text-[11px] font-mono text-[#1A1A1A]/50 break-all bg-black/[0.03] rounded-lg p-2">{{ selectedOrder.payment.pix_code }}</p>
              </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ─── State ───────────────────────────────────────────────────────────────────

const activeTab      = ref('dashboard')
const sidebarOpen    = ref(false)
const refreshing     = ref(false)
const stats          = ref({})
const orders         = ref([])
const recentOrders   = ref([])
const totalOrders    = ref(0)
const ordersLoading  = ref(false)
const page           = ref(1)
const pageSize       = 50
const activeFilter   = ref('todos')
const searchQuery    = ref('')
const showDetail     = ref(false)
const selectedOrder  = ref(null)
const updatingStatus = ref(false)
const settings       = ref({})
const settingsForm   = ref({})
const savingSettings = ref(false)
const settingsSaved  = ref(false)
const couponEnabled  = ref(true)

let searchTimeout = null

// ─── Config ──────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'dashboard', label: 'Dashboard',   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' },
  { id: 'orders',    label: 'Pedidos',     icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
  { id: 'settings',  label: 'Configurações', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
]

const FILTERS = [
  { label: 'Todos',     value: 'todos' },
  { label: '⏳ PIX',    value: 'aguardando_pagamento' },
  { label: '✓ Pagos',  value: 'pago' },
  { label: '📦 Preparo', value: 'em_preparo' },
  { label: '🏍 Rota',  value: 'em_rota' },
  { label: '✅ Entregue', value: 'entregue' },
  { label: '✕ Cancelado', value: 'cancelado' },
]

const STATUS_OPTIONS = [
  { label: 'Aguardando PIX', value: 'aguardando_pagamento' },
  { label: 'Pago',           value: 'pago' },
  { label: 'Em preparo',     value: 'em_preparo' },
  { label: 'A caminho',      value: 'em_rota' },
  { label: 'Entregue',       value: 'entregue' },
  { label: 'Cancelado',      value: 'cancelado' },
]

// ─── Computed ────────────────────────────────────────────────────────────────

const currentTab = computed(() => NAV.find(n => n.id === activeTab.value))

const funnelSteps = computed(() => {
  const u = stats.value?.uniqueFunnel || {}
  return [
    { key: 'page_view',         label: 'Visitaram o site',          count: u.page_view         || 0, color: 'bg-[#0057B7]' },
    { key: 'cart_add',          label: 'Adicionaram ao carrinho',   count: u.cart_add          || 0, color: 'bg-[#0057B7]/80' },
    { key: 'checkout_started',  label: 'Iniciaram o checkout',      count: u.checkout_started  || 0, color: 'bg-[#0057B7]/60' },
    { key: 'address_submitted', label: 'Preencheram endereço',      count: u.address_submitted || 0, color: 'bg-amber-400' },
    { key: 'pix_generated',     label: 'Chegaram ao PIX',           count: u.pix_generated     || 0, color: 'bg-amber-500' },
    { key: 'payment_confirmed', label: 'Pagaram',                   count: u.payment_confirmed || 0, color: 'bg-[#15803D]' },
  ]
})

const conversionRate = computed(() => {
  const top = funnelSteps.value[0].count
  const bot = funnelSteps.value[5].count
  if (!top) return 0
  return Math.round((bot / top) * 100)
})

const abandonedPix = computed(() => {
  const generated = funnelSteps.value[4].count
  const paid      = funnelSteps.value[5].count
  return Math.max(0, generated - paid)
})

const abandonedRate = computed(() => {
  const generated = funnelSteps.value[4].count
  if (!generated) return 0
  return Math.round((abandonedPix.value / generated) * 100)
})

// ─── Methods ─────────────────────────────────────────────────────────────────

function token() { return localStorage.getItem('dp_admin_token') || '' }
function authHeaders() { return { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` } }

async function loadStats() {
  try {
    const res = await fetch('/api/admin/stats', { headers: authHeaders() })
    if (res.status === 401) { logout(); return }
    stats.value = await res.json()
  } catch { /* ignore */ }
}

async function loadRecentOrders() {
  try {
    const res = await fetch('/api/admin/pedidos?limit=10', { headers: authHeaders() })
    if (res.ok) { const d = await res.json(); recentOrders.value = d.orders || [] }
  } catch { /* ignore */ }
}

async function loadOrders() {
  ordersLoading.value = true
  try {
    const q = new URLSearchParams({ status: activeFilter.value, page: page.value, limit: pageSize })
    if (searchQuery.value) q.set('search', searchQuery.value)
    const res = await fetch(`/api/admin/pedidos?${q}`, { headers: authHeaders() })
    if (res.status === 401) { logout(); return }
    const data = await res.json()
    orders.value      = data.orders || []
    totalOrders.value = data.total  || 0
  } finally { ordersLoading.value = false }
}

async function loadSettings() {
  try {
    const res = await fetch('/api/admin/settings', { headers: authHeaders() })
    if (res.ok) {
      settings.value     = await res.json()
      settingsForm.value = { ...settings.value }
      couponEnabled.value = settings.value.coupon_enabled !== 'false'
    }
  } catch { /* ignore */ }
}

async function saveSettings() {
  savingSettings.value = true
  try {
    const payload = { ...settingsForm.value, coupon_enabled: String(couponEnabled.value) }
    const res = await fetch('/api/admin/settings', { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(payload) })
    if (res.ok) {
      settings.value = { ...payload }
      settingsSaved.value = true
      setTimeout(() => { settingsSaved.value = false }, 3000)
    }
  } finally { savingSettings.value = false }
}

async function updateStatus(newStatus) {
  if (!selectedOrder.value) return
  updatingStatus.value = true
  try {
    const res = await fetch(`/api/admin/pedidos/${selectedOrder.value.id}/status`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      const updated = await res.json()
      selectedOrder.value = updated
      const idx = orders.value.findIndex(o => o.id === updated.id)
      if (idx !== -1) orders.value[idx] = updated
      const ridx = recentOrders.value.findIndex(o => o.id === updated.id)
      if (ridx !== -1) recentOrders.value[ridx] = updated
      await loadStats()
    }
  } finally { updatingStatus.value = false }
}

function openOrder(order) { selectedOrder.value = order; showDetail.value = true }

function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { page.value = 1; loadOrders() }, 400)
}

async function refresh() {
  refreshing.value = true
  await Promise.all([loadStats(), activeTab.value === 'orders' ? loadOrders() : loadRecentOrders()])
  refreshing.value = false
}

function logout() { localStorage.removeItem('dp_admin_token'); router.push('/admin/login') }

function fmt(v) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0) }

function formatTime(iso) { return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }

function formatDate(iso) { return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }

function statusLabel(s) {
  return { aguardando_pagamento: 'Aguardando PIX', pago: 'Pago', em_preparo: 'Em preparo', em_rota: 'A caminho', entregue: 'Entregue', cancelado: 'Cancelado' }[s] || s
}

function statusClass(s) {
  return { aguardando_pagamento: 'bg-amber-100 text-amber-700', pago: 'bg-[#0057B7]/10 text-[#0057B7]', em_preparo: 'bg-purple-100 text-purple-700', em_rota: 'bg-blue-100 text-blue-700', entregue: 'bg-[#15803D]/10 text-[#15803D]', cancelado: 'bg-red-100 text-red-600' }[s] || 'bg-gray-100 text-gray-600'
}

watch(activeTab, (tab) => {
  if (tab === 'orders') loadOrders()
  if (tab === 'settings') loadSettings()
})

let pollInterval = null

onMounted(async () => {
  if (!token()) { router.push('/admin/login'); return }
  await Promise.all([loadStats(), loadRecentOrders(), loadSettings()])
  pollInterval = setInterval(() => { loadStats(); if (activeTab.value === 'orders') loadOrders(); else loadRecentOrders() }, 30_000)
})

onUnmounted(() => { if (pollInterval) clearInterval(pollInterval) })
</script>

<style scoped>
.input-field {
  @apply w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0057B7]/30 focus:border-[#0057B7] bg-white;
}

.sheet-enter-active { transition: opacity 0.2s ease; }
.sheet-leave-active { transition: opacity 0.15s ease; }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-active > div:last-child { transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1); }
.sheet-enter-from > div:last-child { transform: translateX(100%); }
.sheet-leave-to > div:last-child { transform: translateX(100%); }
</style>
