<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useStorefrontSettingsStore } from '@/stores/storefrontSettings'

const storefrontSettings = useStorefrontSettingsStore()

onMounted(() => {
  storefrontSettings.load()
})
</script>
