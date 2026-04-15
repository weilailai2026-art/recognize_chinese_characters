<template>
  <div v-if="achievement" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center animate-bounce-in">
      <div class="text-6xl mb-3">{{ achievement.icon }}</div>
      <div class="text-sm font-bold text-orange-400 mb-2">成就解锁</div>
      <h3 class="text-2xl font-black text-gray-800 mb-2">{{ achievement.name }}</h3>
      <p class="text-gray-500 mb-6">{{ achievement.description }}</p>
      <button @click="$emit('close')" class="w-full btn-primary bg-gradient-to-r from-yellow-400 to-orange-500">
        太棒了
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  achievement: {
    type: Object,
    default: null,
  },
})
</script>
