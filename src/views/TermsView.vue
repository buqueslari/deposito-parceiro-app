<template>
  <div class="min-h-screen bg-cream">
    <header class="bg-white border-b border-ink/[0.06] px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
      <RouterLink to="/" class="w-9 h-9 flex items-center justify-center rounded-full bg-cream hover:bg-slate-100 transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </RouterLink>
      <h1 class="font-bold text-base text-ink">Termos de Uso</h1>
    </header>
    <main class="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <p class="text-xs text-ink/40">Atualizado em 28/04/2026</p>

      <section>
        <h2 class="font-bold text-base text-ink mb-2">1. Pedido mínimo</h2>
        <p class="text-sm text-ink/70 leading-relaxed">O valor mínimo para realização de pedidos é de R$ 40,00.</p>
      </section>

      <section>
        <h2 class="font-bold text-base text-ink mb-2">2. Prazo de entrega</h2>
        <p class="text-sm text-ink/70 leading-relaxed">O prazo estimado é de até 40 minutos. Condições climáticas ou de tráfego podem alterar o tempo de entrega.</p>
      </section>

      <section>
        <h2 class="font-bold text-base text-ink mb-2">3. Pagamento</h2>
        <p class="text-sm text-ink/70 leading-relaxed">Aceitamos Pix (aprovação imediata). Cartão de débito/crédito e dinheiro podem estar disponíveis na entrega conforme disponibilidade do entregador. Para pagamento em dinheiro, informe o troco necessário ao realizar o pedido.</p>
      </section>

      <section>
        <h2 class="font-bold text-base text-ink mb-2">4. Cancelamento</h2>
        <p class="text-sm text-ink/70 leading-relaxed">Pedidos podem ser cancelados em até 5 minutos após a confirmação, via WhatsApp. Após esse prazo, o pedido já pode estar em rota de entrega.</p>
      </section>

      <section>
        <h2 class="font-bold text-base text-ink mb-2">5. Responsabilidades</h2>
        <p class="text-sm text-ink/70 leading-relaxed">Todos os botijões são lacrados e certificados conforme normas da ANP (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis). Não nos responsabilizamos por danos causados por mau uso dos produtos.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
