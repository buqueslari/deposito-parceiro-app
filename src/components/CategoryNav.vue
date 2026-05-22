<template>
  <nav class="sticky top-0 z-30 bg-cream border-b border-ink/[0.06]">
    <div
      ref="scrollContainer"
      class="flex overflow-x-auto scrollbar-none gap-0"
      style="-webkit-overflow-scrolling: touch; scrollbar-width: none; msOverflowStyle: none;"
    >
      <button
        v-for="cat in categories"
        :key="cat.id"
        :ref="el => setTabRef(cat.id, el)"
        class="flex-shrink-0 px-4 py-2.5 text-sm whitespace-nowrap transition-colors relative"
        :class="
          activeCategory === cat.id
            ? 'text-action font-bold'
            : 'text-ink/60 font-medium hover:text-ink'
        "
        @click="selectCategory(cat.id)"
      >
        {{ cat.shortName }}
        <!-- Active bottom border -->
        <span
          v-if="activeCategory === cat.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-action rounded-t-full"
        />
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  activeCategory: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:activeCategory'])

const scrollContainer = ref(null)
const tabRefs = {}

function setTabRef(id, el) {
  if (el) {
    tabRefs[id] = el
  }
}

function selectCategory(id) {
  emit('update:activeCategory', id)

  // Smooth scroll the section into view
  nextTick(() => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

// When active category changes, scroll the nav tab into view within the nav bar
watch(
  () => props.activeCategory,
  (id) => {
    nextTick(() => {
      const tab = tabRefs[id]
      const container = scrollContainer.value
      if (!tab || !container) return

      const tabLeft = tab.offsetLeft
      const tabWidth = tab.offsetWidth
      const containerWidth = container.offsetWidth
      const scrollLeft = container.scrollLeft

      const targetScroll = tabLeft - containerWidth / 2 + tabWidth / 2

      container.scrollTo({ left: targetScroll, behavior: 'smooth' })
    })
  }
)
</script>

<style scoped>
/* Hide scrollbar across all browsers */
div::-webkit-scrollbar {
  display: none;
}
</style>
