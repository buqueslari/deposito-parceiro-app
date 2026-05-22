<template>
  <div class="min-h-screen bg-cream">
    <div class="max-w-2xl mx-auto px-4 py-8">

      <!-- Back link -->
      <router-link
        to="/"
        class="inline-flex items-center gap-1.5 text-action text-sm font-medium hover:underline mb-6"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar ao início
      </router-link>

      <!-- Page header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-ink mb-1">Política de Privacidade</h1>
        <p class="text-sm text-ink/40">Última atualização: 28/04/2026</p>
      </div>

      <!-- Sections -->
      <div class="space-y-8">

        <!-- 1. Dados coletados -->
        <section>
          <h2 class="font-bold text-lg text-ink mb-2">1. Dados coletados</h2>
          <p class="text-ink/70 leading-relaxed">
            Nome, e-mail, telefone, CPF e endereço de entrega são coletados para processamento
            do pedido.
          </p>
        </section>

        <!-- 2. Finalidade -->
        <section>
          <h2 class="font-bold text-lg text-ink mb-2">2. Finalidade</h2>
          <p class="text-ink/70 leading-relaxed">
            Os dados são utilizados exclusivamente para entrega do pedido e contato sobre o
            status.
          </p>
        </section>

        <!-- 3. Compartilhamento -->
        <section>
          <h2 class="font-bold text-lg text-ink mb-2">3. Compartilhamento</h2>
          <p class="text-ink/70 leading-relaxed">
            Os dados não são vendidos ou compartilhados com terceiros, exceto quando necessário
            para a entrega.
          </p>
        </section>

        <!-- 4. Direitos do titular -->
        <section>
          <h2 class="font-bold text-lg text-ink mb-2">4. Direitos do titular</h2>
          <p class="text-ink/70 leading-relaxed">
            Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento
            pelo WhatsApp.
          </p>
        </section>

      </div>

      <!-- Footer note -->
      <div class="mt-10 pt-6 border-t border-ink/10">
        <p class="text-xs text-ink/40 leading-relaxed">
          Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD —
          Lei nº 13.709/2018). Em caso de dúvidas, entre em contato pelo nosso WhatsApp.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
// Static page — no reactive state needed
</script>
