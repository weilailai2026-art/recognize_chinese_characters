<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-orange-50 via-yellow-50 to-pink-50">
    <div v-if="loading" class="mb-6 text-sm text-orange-500 bg-orange-100 px-4 py-2 rounded-full font-bold">
      正在准备学习数据...
    </div>

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

    <div v-if="isLoggedIn" class="absolute top-4 left-4 text-xs text-green-500 bg-green-50 rounded-xl px-3 py-1 font-bold">
      ☁️ 进度云同步中
    </div>

    <div class="text-center mb-6 animate-bounce-in">
      <div class="text-8xl mb-4">🌟</div>
      <h1 class="text-5xl font-black text-orange-500 mb-2">认字乐园</h1>
      <p class="text-xl text-blue-400 font-bold">快乐学汉字，天天进步！</p>
    </div>

    <div class="w-full max-w-md mb-6 bg-white rounded-3xl shadow-lg p-5">
      <div class="flex items-center justify-between mb-3">
        <div>
          <div class="text-sm text-gray-400">当前等级</div>
          <div class="text-2xl font-black text-purple-600">{{ userLevel.icon }} {{ userLevel.name }}</div>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-400">连续打卡</div>
          <div class="text-2xl font-black text-orange-500">🔥 {{ checkin.streak }}</div>
        </div>
      </div>
      <div v-if="userLevel.next" class="text-xs text-gray-400 mb-2">
        再掌握 {{ Math.max(userLevel.next - stats.mastered, 0) }} 个汉字即可升级
      </div>
      <div class="h-3 rounded-full bg-gray-100 overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all"
          :style="{ width: levelProgressWidth + '%' }"
        ></div>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-3 mb-6 w-full max-w-md">
      <div class="bg-white rounded-2xl px-3 py-3 shadow text-center">
        <div class="text-2xl font-black text-green-500">{{ stats.mastered }}</div>
        <div class="text-xs text-gray-400">已掌握</div>
      </div>
      <div class="bg-white rounded-2xl px-3 py-3 shadow text-center">
        <div class="text-2xl font-black text-yellow-500">{{ stats.review }}</div>
        <div class="text-xs text-gray-400">需复习</div>
      </div>
      <div class="bg-white rounded-2xl px-3 py-3 shadow text-center">
        <div class="text-2xl font-black text-red-500">{{ stats.strengthen }}</div>
        <div class="text-xs text-gray-400">需强化</div>
      </div>
      <div class="bg-white rounded-2xl px-3 py-3 shadow text-center">
        <div class="text-2xl font-black text-gray-400">{{ stats.unlearned }}</div>
        <div class="text-xs text-gray-400">未学过</div>
      </div>
    </div>

    <div v-if="nextLevelHint" class="w-full max-w-md mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-3xl shadow-lg p-5">
      <div class="flex items-start justify-between gap-3 mb-3">
        <div>
          <div class="text-sm font-black opacity-90 mb-1">🚀 升级提示</div>
          <div class="text-lg font-black">{{ nextLevelHint.title }}</div>
        </div>
        <div class="text-3xl">{{ nextLevelHint.emoji }}</div>
      </div>
      <p class="text-sm opacity-90 mb-4">{{ nextLevelHint.description }}</p>
      <button
        @click="goNextLevelFromHome"
        class="w-full rounded-2xl bg-white text-purple-600 font-black py-3 hover:scale-[1.01] transition-all"
      >
        {{ nextLevelHint.buttonText }}
      </button>
    </div>

    <div class="w-full max-w-md mb-6 bg-white rounded-3xl shadow-lg p-5 border border-emerald-100">
      <div class="flex items-start justify-between gap-3 mb-3">
        <div>
          <div class="text-sm text-emerald-500 font-black mb-1">✅ 今日任务完成度</div>
          <div class="text-lg font-black text-gray-800">{{ dailyTaskStatus.title }}</div>
        </div>
        <div class="text-3xl">{{ dailyTaskStatus.emoji }}</div>
      </div>
      <p class="text-sm text-gray-500 mb-4">{{ dailyTaskStatus.description }}</p>
      <div class="mb-3 flex items-center justify-between text-xs text-gray-400">
        <span>今日进度</span>
        <span>{{ dailyTaskProgress.done }}/{{ dailyTaskProgress.total }}</span>
      </div>
      <div class="h-3 rounded-full bg-gray-100 overflow-hidden mb-4">
        <div
          class="h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all"
          :style="{ width: dailyTaskProgress.percent + '%' }"
        ></div>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="rounded-2xl px-3 py-2 font-bold"
             :class="dailyTaskProgress.gameDone ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'">
          {{ dailyTaskProgress.gameDone ? '✅ 今天已练过' : '🎮 今天先完成 1 局' }}
        </div>
        <div class="rounded-2xl px-3 py-2 font-bold"
             :class="dailyTaskProgress.reviewDone ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'">
          {{ dailyTaskProgress.reviewDone ? '✅ 当前关卡较稳' : '📘 还可继续处理推荐任务' }}
        </div>
      </div>
    </div>

    <div class="w-full max-w-md mb-6 bg-white rounded-3xl shadow-lg p-5 border border-orange-100">
      <div class="flex items-start justify-between gap-3 mb-3">
        <div>
          <div class="text-sm text-orange-400 font-black mb-1">✨ 今日推荐练习</div>
          <div class="text-lg font-black text-gray-800">{{ recommendedPlan.title }}</div>
        </div>
        <div class="text-3xl">{{ recommendedPlan.emoji }}</div>
      </div>
      <p class="text-sm text-gray-500 mb-4">{{ recommendedPlan.description }}</p>
      <div class="flex items-center gap-2 text-xs mb-4 flex-wrap">
        <span class="px-3 py-1 rounded-full bg-orange-50 text-orange-500 font-bold">
          当前关卡：{{ selectedLevelMeta?.name || '启蒙级' }}
        </span>
        <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-500 font-bold">
          推荐题数：{{ recommendedQuestionCount }} 题
        </span>
      </div>
      <button
        @click="startGame(recommendedPlan.mode)"
        class="w-full btn-primary text-center"
        :class="recommendedPlan.mode === 'review'
          ? 'bg-gradient-to-r from-blue-400 to-purple-500'
          : 'bg-gradient-to-r from-orange-400 to-pink-500'"
      >
        {{ recommendedPlan.buttonText }}
      </button>
    </div>

    <div class="w-full max-w-md mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-black text-gray-700">选择学习关卡</h2>
        <span class="text-xs text-gray-400">共 {{ total }} 个汉字</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="level in levelProgress"
          :key="level.key"
          @click="selectLevel(level)"
          class="rounded-3xl p-4 text-left shadow transition-all border-2"
          :class="selectedLevel === level.key ? 'border-orange-400 bg-orange-50 scale-[1.02]' : 'border-transparent bg-white'"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="text-2xl">{{ level.emoji }}</div>
            <div v-if="!level.unlocked" class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">未解锁</div>
          </div>
          <div class="font-black text-gray-800 mb-1">{{ level.name }}</div>
          <div class="text-xs text-gray-500 mb-2">{{ level.description }}</div>
          <div class="text-xs text-gray-400">已掌握 {{ level.mastered }}/{{ level.total }}</div>
          <div class="h-2 rounded-full bg-gray-100 overflow-hidden mt-2">
            <div class="h-full bg-gradient-to-r from-green-400 to-emerald-500" :style="{ width: (level.ratio * 100) + '%' }"></div>
          </div>
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-4 w-full max-w-md">
      <button
        @click="startGame('normal')"
        class="btn-primary bg-gradient-to-r from-orange-400 to-pink-500 text-center"
      >
        🎮 开始学习
      </button>
      <button
        @click="startGame('review')"
        class="btn-primary bg-gradient-to-r from-blue-400 to-purple-500 text-center"
      >
        📘 专项复习（{{ stats.review + stats.strengthen }}）
      </button>
      <button
        @click="showPasswordModal = true"
        class="btn-primary bg-white text-gray-600 border-2 border-gray-200 text-center"
      >
        👨👩👧 家长中心
      </button>
    </div>

    <div v-if="!isLoggedIn" class="mt-6 text-center">
      <p class="text-gray-400 text-xs">
        💡 <button @click="showAuth = true" class="text-orange-400 underline font-bold">登录</button> 后可跨设备同步学习进度
      </p>
    </div>

    <p class="mt-4 text-gray-400 text-sm">当前关卡 {{ selectedLevelMeta?.name || '启蒙级' }} · 共 {{ selectedLevelCount }} 个汉字</p>

    <div v-if="errorMsg" class="mt-3 text-sm text-red-500 bg-red-50 px-4 py-2 rounded-2xl">{{ errorMsg }}</div>

    <PasswordModal
      v-if="showPasswordModal"
      @close="showPasswordModal = false"
      @success="goParent"
    />

    <AuthModal
      v-if="showAuth"
      @close="showAuth = false"
      @success="onLoginSuccess"
    />

    <OnboardingModal v-if="showOnboarding" @finish="finishOnboarding" />
    <AchievementUnlock :achievement="recentAchievement" @close="recentAchievement = null" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { characters, levels, getLevelMeta } from '../data/characters'
import { getCharStatus, getCounts, syncProgressFromCloud } from '../utils/storage'
import { currentUser, isLoggedIn, signOut } from '../utils/auth'
import {
  consumeRecentAchievement,
  getAchievements,
  getAppState,
  getCheckinData,
  getLevelProgress,
  getTodayString,
  getUserLevelTitle,
  saveAppState,
} from '../utils/progression'
import PasswordModal from '../components/PasswordModal.vue'
import AuthModal from '../components/AuthModal.vue'
import OnboardingModal from '../components/OnboardingModal.vue'
import AchievementUnlock from '../components/AchievementUnlock.vue'

const router = useRouter()
const showPasswordModal = ref(false)
const showAuth = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const recentAchievement = ref(null)
const appState = ref(getAppState())
const checkin = ref(getCheckinData())
const achievements = ref(getAchievements())
const showOnboarding = ref(!appState.value.onboardingDone)

const total = characters.length
const selectedLevel = computed(() => appState.value.selectedLevel || 'starter')
const selectedLevelMeta = computed(() => getLevelMeta(selectedLevel.value))
const selectedLevelIndex = computed(() => levels.findIndex(level => level.key === selectedLevel.value))
const nextLevel = computed(() => levels[selectedLevelIndex.value + 1] || null)
const selectedLevelChars = computed(() => characters.filter(item => item.level === selectedLevel.value))
const selectedLevelCount = computed(() => selectedLevelChars.value.length)
const selectedLevelStats = computed(() => getCounts(selectedLevelChars.value))

const userEmail = computed(() => currentUser.value?.email?.split('@')[0] || '')
const stats = computed(() => getCounts(characters))
const userLevel = computed(() => getUserLevelTitle(stats.value.mastered))
const levelProgress = computed(() => getLevelProgress(levels, characters, getCharStatus))
const currentLevelProgress = computed(() => levelProgress.value.find(level => level.key === selectedLevel.value) || null)
const nextLevelProgress = computed(() => nextLevel.value
  ? levelProgress.value.find(level => level.key === nextLevel.value.key) || null
  : null)
const levelProgressWidth = computed(() => {
  if (!userLevel.value.next) return 100
  const prevThreshold = userLevel.value.next === 10 ? 0 : userLevel.value.next === 30 ? 10 : userLevel.value.next === 60 ? 30 : 60
  const span = userLevel.value.next - prevThreshold
  const current = Math.max(stats.value.mastered - prevThreshold, 0)
  return Math.min((current / span) * 100, 100)
})

const recommendedPlan = computed(() => {
  const levelName = selectedLevelMeta.value?.name || '当前关卡'
  const levelStats = selectedLevelStats.value
  const reviewTotal = levelStats.review + levelStats.strengthen

  if (levelStats.strengthen > 0) {
    return {
      mode: 'review',
      emoji: '🚑',
      title: `先补强 ${levelName}`,
      description: `这个关卡还有 ${levelStats.strengthen} 个汉字需要重点强化，先把容易错的字补起来更划算。`,
      buttonText: `优先补强（${reviewTotal}）`,
    }
  }

  if (reviewTotal > 0) {
    return {
      mode: 'review',
      emoji: '📘',
      title: `先复习 ${levelName}`,
      description: `这个关卡还有 ${reviewTotal} 个汉字待复习，先巩固再学新字，记得更稳。`,
      buttonText: `开始复习（${reviewTotal}）`,
    }
  }

  if (levelStats.unlearned > 0) {
    return {
      mode: 'normal',
      emoji: '🌱',
      title: `继续解锁 ${levelName}`,
      description: `这个关卡还有 ${levelStats.unlearned} 个汉字还没学过，适合继续往前推进。`,
      buttonText: '学习新字',
    }
  }

  return {
    mode: 'normal',
    emoji: '🏆',
    title: `${levelName} 已完成得不错`,
    description: '当前关卡已经比较稳了，可以再来一轮巩固手感，或者切换到下一个关卡。',
    buttonText: '再练一轮',
  }
})

const recommendedQuestionCount = computed(() => Math.min(selectedLevelCount.value || 0, 5))

const nextLevelHint = computed(() => {
  if (!currentLevelProgress.value || !nextLevel.value || !nextLevelProgress.value) return null
  if (!currentLevelProgress.value.unlocked) return null
  if (currentLevelProgress.value.ratio < 0.8) return null
  if (!nextLevelProgress.value.unlocked) return null

  return {
    emoji: nextLevel.value.emoji,
    title: `${nextLevel.value.name} 已可挑战`,
    description: `${selectedLevelMeta.value?.name || '当前关卡'} 已达到升级条件，可以开始挑战下一关了。`,
    buttonText: `切换到${nextLevel.value.name}`,
  }
})

const dailyTaskProgress = computed(() => {
  const today = getTodayString()
  const gameDone = checkin.value.lastCheckin === today
  const reviewDone = (selectedLevelStats.value.review + selectedLevelStats.value.strengthen) === 0
  const done = Number(gameDone) + Number(reviewDone)
  const total = 2
  return {
    gameDone,
    reviewDone,
    done,
    total,
    percent: (done / total) * 100,
  }
})

const dailyTaskStatus = computed(() => {
  const progress = dailyTaskProgress.value

  if (progress.done === progress.total) {
    return {
      emoji: '🎉',
      title: '今天的任务完成了',
      description: '今天已经练过，而且当前关卡该复习的内容也处理得不错，可以轻松收工。',
    }
  }

  if (progress.gameDone) {
    return {
      emoji: '💪',
      title: '再冲一下推荐练习',
      description: '今天已经完成打卡了，再把当前关卡的推荐内容处理掉，今天就很完整。',
    }
  }

  return {
    emoji: '🚀',
    title: '今天先完成 1 局',
    description: `先开始一局 ${selectedLevelMeta.value?.name || '当前关卡'} 练习，打卡和今日任务都会一起推进。`,
  }
})

function selectLevel(level) {
  if (!level.unlocked) {
    errorMsg.value = `先完成上一级 80% 后，才能解锁${level.name}`
    setTimeout(() => { errorMsg.value = '' }, 2200)
    return
  }
  appState.value = saveAppState({ selectedLevel: level.key })
}

function goNextLevelFromHome() {
  if (!nextLevel.value) return
  appState.value = saveAppState({ selectedLevel: nextLevel.value.key })
}

function startGame(mode) {
  router.push({ path: '/game', query: { level: selectedLevel.value, mode } })
}

function goParent() {
  showPasswordModal.value = false
  router.push('/parent')
}

async function handleSignOut() {
  await signOut()
}

async function onLoginSuccess() {
  showAuth.value = false
  await refreshCloudData()
}

function finishOnboarding() {
  appState.value = saveAppState({ onboardingDone: true })
  showOnboarding.value = false
}

async function refreshCloudData() {
  if (!isLoggedIn.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    await syncProgressFromCloud()
  } catch (error) {
    errorMsg.value = '云端同步失败，先使用本地进度继续学习吧'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  recentAchievement.value = consumeRecentAchievement()
  achievements.value = getAchievements()
  checkin.value = getCheckinData()
  if (isLoggedIn.value) {
    await refreshCloudData()
  }
})
</script>
