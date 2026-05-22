<template>
  <footer class="bg-white border-t border-ink/[0.06] px-4 pt-6 pb-8 mt-4">

    <!-- Logo + brand -->
    <div class="flex items-center gap-2.5 mb-3">
      <div class="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
        <img src="/logo.png" alt="Logo Depósito Parceiro" class="w-full h-full object-cover" />
      </div>
      <span class="font-extrabold text-ink text-base">Depósito Parceiro</span>
    </div>

    <!-- Tagline -->
    <p class="text-ink/60 text-sm mb-5 leading-relaxed">
      Distribuidora autorizada de gás e água em São Paulo. Botijão lacrado e certificado, entrega em até 35 minutos.
    </p>

    <!-- CONTATO -->
    <p class="text-[11px] font-bold text-ink/40 uppercase tracking-widest mb-3">CONTATO</p>
    <div class="flex flex-col gap-2.5 mb-5">
      <a href="tel:+551130266912" class="flex items-center gap-2.5 text-action font-semibold text-sm">
        <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        (11) 3026-6912
      </a>
      <div class="flex items-center gap-2.5 text-sm text-ink/60">
        <svg class="w-4 h-4 flex-shrink-0 text-ink/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        <span>São Paulo · SP</span>
      </div>
      <div class="flex items-center gap-2.5 text-sm text-ink/60">
        <svg class="w-4 h-4 flex-shrink-0 text-ink/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>Diariamente · Aberto 24 horas</span>
      </div>
    </div>

    <!-- INSTITUCIONAL -->
    <p class="text-[11px] font-bold text-ink/40 uppercase tracking-widest mb-3">INSTITUCIONAL</p>
    <div class="flex flex-col gap-2 mb-5">
      <RouterLink to="/politica-privacidade" class="text-sm text-ink/70 hover:text-action transition-colors">
        Política de Privacidade
      </RouterLink>
      <RouterLink to="/termos-de-uso" class="text-sm text-ink/70 hover:text-action transition-colors">
        Termos de Uso
      </RouterLink>
      <p class="text-sm text-ink/40">CNPJ 01.875.479/0001-72</p>
    </div>

    <!-- Copyright -->
    <p class="text-xs text-ink/35 text-center">
      © {{ currentYear }} · Depósito Parceiro
    </p>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const currentYear = new Date().getFullYear()
</script>
