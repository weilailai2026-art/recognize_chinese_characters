<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6">
    <!-- Logo & Title -->
    <div class="text-center mb-10 animate-bounce-in">
      <div class="text-8xl mb-4">🌟</div>
      <h1 class="text-5xl font-black text-orange-500 mb-2">认字乐园</h1>
      <p class="text-xl text-blue-400 font-bold">快乐学汉字，天天进步！</p>
    </div>

    <!-- Stats summary -->
    <div class="flex gap-4 mb-8">
      <div class="bg-white rounded-2xl px-4 py-2 shadow text-center">
        <div class="text-2xl font-black text-green-500">{{ stats.mastered }}</div>
        <div class="text-xs text-gray-400">已掌握</div>
      </div>
      <div class="bg-white rounded-2xl px-4 py-2 shadow text-center">
        <div class="text-2xl font-black text-yellow-500">{{ stats.review }}</div>
        <div class="text-xs text-gray-400">需复习</div>
      </div>
      <div class="bg-white rounded-2xl px-4 py-2 shadow text-center">
        <div class="text-2xl font-black text-red-500">{{ stats.strengthen }}</div>
        <div class="text-xs text-gray-400">需强化</div>
      </div>
      <div class="bg-white rounded-2xl px-4 py-2 shadow text-center">
        <div class="text-2xl font-black text-gray-400">{{ stats.unlearned }}</div>
        <div class="text-xs text-gray-400">未学过</div>
      </div>
    </div>

    <!-- Main buttons -->
    <div class="flex flex-col gap-4 w-full max-w-xs">
      <button
        @click="$router.push('/game')"
        class="btn-primary bg-gradient-to-r from-orange-400 to-pink-500 text-center"
      >
        🎮 开始学习
      </button>
      <button
        @click="showPasswordModal = true"
        class="btn-primary bg-gradient-to-r from-blue-400 to-purple-500 text-center"
      >
        👨‍👩‍👧 家长中心
      </button>
    </div>

    <!-- 总字数 -->
    <p class="mt-8 text-gray-400 text-sm">共 {{ total }} 个汉字等你来认识 ✨</p>

    <!-- 密码弹窗 -->
    <PasswordModal
      v-if="showPasswordModal"
      @close="showPasswordModal = false"
      @success="goParent"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { characters } from '../data/characters'
import { getCharStatus } from '../utils/storage'
import PasswordModal from '../components/PasswordModal.vue'

const router = useRouter()
const showPasswordModal = ref(false)

const total = characters.length

const stats = computed(() => {
  const counts = { mastered: 0, review: 0, strengthen: 0, unlearned: 0 }
  characters.forEach(c => {
    const s = getCharStatus(c.char)
    counts[s]++
  })
  return counts
})

function goParent() {
  showPasswordModal.value = false
  router.push('/parent')
}
</script>
