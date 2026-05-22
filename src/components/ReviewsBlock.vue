<template>
  <section class="px-3 py-4">
    <h3 class="font-display font-black text-base px-1 mb-3 text-ink">
      O que nossos clientes dizem
    </h3>

    <div class="space-y-2">
      <div
        v-for="review in visible"
        :key="review.id"
        class="bg-white rounded-2xl p-3 shadow-card"
      >
        <!-- Header: avatar + name + time -->
        <div class="flex items-center gap-2.5 mb-1.5">
          <!-- Initials avatar -->
          <span
            class="w-9 h-9 rounded-full bg-action/10 text-action font-bold text-sm flex items-center justify-center flex-shrink-0 uppercase"
          >
            {{ initials(review.name) }}
          </span>

          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm text-ink leading-tight truncate">
              {{ review.name }}
            </p>
            <p class="text-xs text-ink/40 leading-tight">{{ review.timeAgo }}</p>
          </div>
        </div>

        <!-- Star rating -->
        <div class="flex items-center gap-0.5 mb-1.5">
          <span
            v-for="i in 5"
            :key="i"
            class="text-base leading-none"
            :class="i <= review.rating ? 'text-gold' : 'text-ink/20'"
          >★</span>
        </div>

        <!-- Comment -->
        <p class="text-sm text-ink/70 leading-relaxed">
          {{ review.comment }}
        </p>
      </div>
    </div>

    <!-- Show all button -->
    <button
      class="mt-3 text-action font-semibold text-sm w-full text-center hover:underline"
      @click="showAll"
    >
      Ver todas as avaliações →
    </button>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import Swal from 'sweetalert2'
import { REVIEWS } from '@/data/reviews'

const PREVIEW_COUNT = 5

const visible = computed(() => REVIEWS.slice(0, PREVIEW_COUNT))

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]
  return parts[0][0] + parts[parts.length - 1][0]
}

function starsHtml(rating) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span style="color:${i < rating ? '#F5A524' : '#d1d5db'}">★</span>`
  ).join('')
}

function reviewCardHtml(r) {
  return `
    <div style="background:#fff;border-radius:16px;padding:12px 14px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,0.07);text-align:left;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <div style="width:36px;height:36px;border-radius:50%;background:#EFF6FF;color:#0057B7;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;text-transform:uppercase;">
          ${initials(r.name)}
        </div>
        <div>
          <div style="font-weight:600;font-size:14px;color:#1A1A1A;">${r.name}</div>
          <div style="font-size:12px;color:#9ca3af;">${r.timeAgo}</div>
        </div>
      </div>
      <div style="margin-bottom:6px;font-size:16px;line-height:1;">${starsHtml(r.rating)}</div>
      <p style="font-size:13px;color:#444;line-height:1.5;margin:0;">${r.comment}</p>
    </div>
  `
}

async function showAll() {
  const html = REVIEWS.map(reviewCardHtml).join('')

  await Swal.fire({
    title: 'Avaliações dos clientes',
    html: `<div style="max-height:60vh;overflow-y:auto;padding-right:4px;">${html}</div>`,
    showConfirmButton: true,
    confirmButtonText: 'Fechar',
    confirmButtonColor: '#0057B7',
    width: '90%',
    customClass: {
      popup: 'rounded-2xl',
      title: 'text-lg font-bold text-gray-900',
      confirmButton: 'rounded-xl font-semibold',
    },
  })
}
</script>
