<template>
  <!-- Floating mini bar (when drawer is closed) -->
  <Transition name="slide-up">
    <div v-if="cart.totalQty > 0 && !isOpen" class="fixed bottom-4 left-3 right-3 z-40">
      <button
        class="bg-action rounded-2xl shadow-floating flex items-center px-4 py-3 gap-3 w-full hover:bg-action/95 active:scale-[0.98] transition-transform"
        @click="isOpen = true"
      >
        <span class="w-7 h-7 rounded-full bg-white text-action font-black text-sm flex items-center justify-center flex-shrink-0 tabular-nums">
          {{ cart.totalQty }}
        </span>
        <span class="flex-1 text-left text-white text-sm font-semibold">Ver carrinho</span>
        <span class="text-white font-extrabold text-base tabular-nums flex-shrink-0">{{ fmt(cart.total) }}</span>
      </button>
    </div>
  </Transition>

  <!-- Bottom sheet drawer -->
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex flex-col justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40" @click="isOpen = false" />

        <!-- Sheet -->
        <div class="relative bg-white rounded-t-3xl shadow-floating max-h-[90vh] flex flex-col">
          <!-- Drag handle -->
          <div class="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div class="w-10 h-1 bg-ink/15 rounded-full"></div>
          </div>

          <!-- Header -->
          <div class="flex items-start justify-between px-4 pb-3 flex-shrink-0">
            <div>
              <p class="text-[11px] font-semibold text-ink/45 uppercase tracking-widest">SEU PEDIDO EM</p>
              <p class="text-lg font-extrabold text-ink leading-tight">{{ settings.store_name }}</p>
            </div>
            <button
              @click="isOpen = false"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-ink/5 mt-0.5"
            >
              <svg class="w-4 h-4 text-ink/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Free delivery progress -->
          <div class="px-4 pb-3 flex-shrink-0">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-sm font-semibold text-seal">🎉 Frete grátis liberado!</span>
              <span class="text-xs font-bold text-ink/40">100%</span>
            </div>
            <div class="w-full h-1.5 bg-ink/10 rounded-full overflow-hidden">
              <div class="h-full bg-seal rounded-full" style="width:100%"></div>
            </div>
          </div>

          <!-- Scrollable content -->
          <div class="overflow-y-auto flex-1 px-4 pb-2">
            <!-- Product rows -->
            <div class="space-y-4 py-2">
              <div
                v-for="item in cart.items"
                :key="item.productId"
                class="flex items-center gap-3"
              >
                <!-- Product image -->
                <div class="w-14 h-14 rounded-xl bg-ink/5 overflow-hidden flex-shrink-0">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                    @error="e => e.target.style.display='none'"
                  />
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-ink leading-tight truncate">{{ item.name }}</p>
                  <p class="text-sm font-bold text-seal mt-0.5">{{ fmt(item.price) }}</p>
                  <!-- Qty controls -->
                  <div class="flex items-center gap-2 mt-2">
                    <button
                      @click="cart.remove(item.productId)"
                      class="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center text-ink/60 hover:border-action hover:text-action transition"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                    <span class="text-sm font-bold text-ink w-5 text-center tabular-nums">{{ item.qty }}</span>
                    <button
                      @click="cart.add({ id: item.productId, name: item.name, price: item.price, image: item.image })"
                      class="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center text-ink/60 hover:border-action hover:text-action transition"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                </div>

                <!-- Trash -->
                <button
                  @click="removeAll(item.productId)"
                  class="flex-shrink-0 text-ink/25 hover:text-danger transition"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="border-t border-ink/8 my-3"></div>

            <!-- Observação -->
            <div class="mb-4">
              <label class="block text-[11px] font-bold text-ink/45 uppercase tracking-widest mb-2">OBSERVAÇÃO PARA O ENTREGADOR</label>
              <textarea
                :value="cart.notes"
                @input="cart.setNotes($event.target.value)"
                maxlength="200"
                rows="3"
                placeholder="Ex.: portão azul, deixar com o porteiro..."
                class="w-full rounded-xl bg-ink/[0.04] border-0 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-1 focus:ring-action resize-none"
              ></textarea>
              <p class="text-xs text-ink/35 text-right mt-1">{{ (cart.notes || '').length }}/200</p>
            </div>

            <!-- Clear cart -->
            <button
              @click="cart.clear()"
              class="flex items-center justify-center gap-1.5 w-full text-sm text-ink/40 hover:text-danger transition mb-4"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              </svg>
              Limpar carrinho
            </button>
          </div>

          <!-- Fixed bottom: totals + checkout -->
          <div class="flex-shrink-0 px-4 pt-3 pb-6 border-t border-ink/8 bg-white">
            <div class="space-y-1.5 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-ink/60">Subtotal</span>
                <span class="text-ink font-medium">{{ fmt(cart.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-ink/60">Entrega</span>
                <span class="font-bold text-seal">Grátis</span>
              </div>
              <div class="flex justify-between items-baseline">
                <span class="text-base font-bold text-ink">Total</span>
                <span class="text-2xl font-extrabold text-ink tabular-nums">{{ fmt(cart.total) }}</span>
              </div>
            </div>

            <button
              @click="goCheckout"
              class="w-full bg-action text-white font-bold py-4 rounded-2xl text-base shadow-cta hover:bg-action-deep active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Finalizar compra · {{ fmt(cart.total) }}
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>

            <button
              @click="buyCartOnWhatsApp"
              class="mt-3 w-full bg-[#008A00] text-white font-bold py-4 rounded-2xl text-base shadow-cta hover:bg-[#007A00] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <path d="M16.02 3C8.86 3 3.04 8.7 3.04 15.72c0 2.4.68 4.74 1.98 6.76L3 29l6.72-1.96a13.26 13.26 0 0 0 6.3 1.59C23.18 28.63 29 22.93 29 15.9S23.18 3 16.02 3Zm0 23.45c-1.93 0-3.82-.52-5.47-1.5l-.39-.23-3.98 1.16 1.18-3.82-.25-.4a10.46 10.46 0 0 1-1.66-5.94c0-5.82 4.74-10.55 10.57-10.55s10.57 4.73 10.57 10.55-4.74 10.73-10.57 10.73Zm5.8-7.9c-.32-.16-1.88-.91-2.17-1.02-.29-.1-.5-.16-.71.16-.21.31-.82 1.01-1 1.22-.19.2-.37.23-.69.08-.32-.16-1.34-.49-2.56-1.55-.94-.83-1.58-1.86-1.77-2.18-.18-.31-.02-.48.14-.64.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.1-.2.05-.39-.03-.55-.08-.16-.71-1.68-.98-2.3-.26-.6-.52-.52-.71-.53h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.06-1.1 2.58s1.13 3 1.29 3.2c.16.21 2.22 3.33 5.38 4.67.75.32 1.34.51 1.8.65.76.23 1.45.2 1.99.12.61-.09 1.88-.75 2.14-1.48.27-.73.27-1.35.19-1.48-.08-.13-.29-.2-.61-.36Z"/>
              </svg>
              Comprar pelo WhatsApp
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useStorefrontSettingsStore } from '@/stores/storefrontSettings'
import { useRouter } from 'vue-router'
import { useTracking } from '@/composables/useTracking'
import { openCartWhatsApp } from '@/lib/whatsapp'

const cart   = useCartStore()
const storefrontSettings = useStorefrontSettingsStore()
const settings = computed(() => storefrontSettings.settings)
const router = useRouter()
const isOpen = ref(false)
const { track } = useTracking()

function fmt(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0)
}

function removeAll(productId) {
  const item = cart.items.find(i => i.productId === productId)
  if (!item) return
  for (let i = 0; i < item.qty; i++) cart.remove(productId)
}

function goCheckout() {
  track('checkout_started', { total: cart.total, qty: cart.totalQty })
  isOpen.value = false
  router.push('/checkout')
}

function buyCartOnWhatsApp() {
  track('whatsapp_buy', { source: 'cart_drawer', total: cart.total, qty: cart.totalQty })
  openCartWhatsApp(cart)
}
</script>

<style scoped>
.slide-up-enter-active { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease; }
.slide-up-leave-active { transition: transform 0.2s ease-in, opacity 0.15s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(120%); opacity: 0; }

.drawer-enter-active { transition: opacity 0.25s ease; }
.drawer-leave-active { transition: opacity 0.2s ease; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-active .relative, .drawer-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.drawer-enter-from .relative { transform: translateY(100%); }
.drawer-leave-to .relative { transform: translateY(100%); }
</style>
