<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6">
    <!-- 用户状态栏 -->
    <div class="absolute top-4 right-4">
      <button
        v-if="!isLoggedIn"
        @click="showAuth = true"
        class="text-sm bg-white shadow rounded-2xl px-4 py-2 text-orange-500 font-bold hover:scale-105 transition-all"
      >
        🔑 登录 / 注册
      </button>
      <div v-else class="flex items-center gap-2">
        <span class="text-sm text-gray-400 bg-white shadow rounded-2xl px-3 py-2">
          👤 {{ userEmail }}
        </span>
        <button @click="handleSignOut" class="text-sm text-gray-400 hover:text-red-400 font-bold">退出</button>
      </div>
    </div>

    <!-- 云同步提示 -->
    <div v-if="isLoggedIn" class="absolute top-4 left-4 text-xs text-green-500 bg-green-50 rounded-xl px-3 py-1 font-bold">
      ☁️ 进度云同步中
    </div>

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
        👨👩👧 家长中心
      </button>
    </div>

    <!-- 未登录提示 -->
    <div v-if="!isLoggedIn" class="mt-6 text-center">
      <p class="text-gray-400 text-xs">
        💡 <button @click="showAuth = true" class="text-orange-400 underline font-bold">登录</button> 后可跨设备同步学习进度
      </p>
    </div>

    <!-- 总字数 -->
    <p class="mt-4 text-gray-400 text-sm">共 {{ total }} 个汉字等你来认识 ✨</p>

    <!-- 密码弹窗 -->
    <PasswordModal
      v-if="showPasswordModal"
      @close="showPasswordModal = false"
      @success="goParent"
    />

    <!-- 登录/注册弹窗 -->
    <AuthModal
      v-if="showAuth"
      @close="showAuth = false"
      @success="onLoginSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { characters } from '../data/characters'
import { getCharStatus } from '../utils/storage'
import { currentUser, isLoggedIn, signOut } from '../utils/auth'
import PasswordModal from '../components/PasswordModal.vue'
import AuthModal from '../components/AuthModal.vue'

const router = useRouter()
const showPasswordModal = ref(false)
const showAuth = ref(false)

const total = characters.length

const userEmail = computed(() => {
  return currentUser.value?.email?.split('@')[0] || ''
})

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

async function handleSignOut() {
  await signOut()
}

function onLoginSuccess() {
  // 刷新统计数据
}
</script>
