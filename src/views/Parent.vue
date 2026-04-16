<template>
  <div class="min-h-screen p-4">
    <!-- 头部 -->
    <div class="flex items-center justify-between mb-6 max-w-2xl mx-auto">
      <button @click="$router.push('/')" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">← 返回</button>
      <h1 class="text-2xl font-black text-purple-600">👨‍👩‍👧 家长中心</h1>
      <div class="w-12"></div>
    </div>

    <!-- Tab -->
    <div class="flex gap-2 mb-6 max-w-2xl mx-auto">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="flex-1 py-2 rounded-2xl font-bold transition-all"
        :class="activeTab === tab.key
          ? 'bg-purple-500 text-white shadow-md'
          : 'bg-white text-gray-400 border border-gray-200'"
      >{{ tab.label }}</button>
    </div>

    <!-- 进度总览 -->
    <div v-if="activeTab === 'progress'" class="max-w-2xl mx-auto">
      <div class="mb-4 bg-white rounded-3xl shadow-sm p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-black text-gray-700">关卡总览</h3>
          <span class="text-xs text-gray-400">看每关掌握情况</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            v-for="level in levelSummaries"
            :key="level.key"
            @click="selectedLevel = level.key"
            class="rounded-3xl border p-4 text-left transition-all hover:scale-[1.01]"
            :class="selectedLevel === level.key
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 bg-white'"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="font-black text-gray-800">{{ level.emoji }} {{ level.name }}</div>
              <div class="text-xs font-bold px-2 py-1 rounded-full"
                   :class="level.ratio >= 0.8 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'">
                {{ Math.round(level.ratio * 100) }}%
              </div>
            </div>
            <div class="text-xs text-gray-500 mb-2">已掌握 {{ level.mastered }}/{{ level.total }}</div>
            <div class="h-2 rounded-full bg-gray-100 overflow-hidden mb-2">
              <div class="h-full bg-gradient-to-r from-purple-400 to-indigo-500" :style="{ width: (level.ratio * 100) + '%' }"></div>
            </div>
            <div class="flex flex-wrap gap-2 text-[11px] text-gray-500">
              <span class="px-2 py-1 rounded-full bg-green-50 text-green-600 font-bold">掌握 {{ level.counts.mastered }}</span>
              <span class="px-2 py-1 rounded-full bg-yellow-50 text-yellow-600 font-bold">复习 {{ level.counts.review }}</span>
              <span class="px-2 py-1 rounded-full bg-red-50 text-red-600 font-bold">强化 {{ level.counts.strengthen }}</span>
            </div>
          </button>
        </div>
      </div>

      <div class="mb-4 bg-white rounded-3xl shadow-sm p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-black text-gray-700">按关卡查看</h3>
          <span class="text-xs text-gray-400">当前：{{ selectedLevelMeta?.name || '全部关卡' }}</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectedLevel = 'all'"
            class="px-3 py-2 rounded-2xl text-sm font-bold transition-all border"
            :class="selectedLevel === 'all'
              ? 'bg-purple-500 text-white border-purple-500'
              : 'bg-gray-50 text-gray-500 border-gray-200'"
          >全部</button>
          <button
            v-for="level in levels"
            :key="level.key"
            @click="selectedLevel = level.key"
            class="px-3 py-2 rounded-2xl text-sm font-bold transition-all border"
            :class="selectedLevel === level.key
              ? 'bg-purple-500 text-white border-purple-500'
              : 'bg-white text-gray-600 border-gray-200'"
          >{{ level.emoji }} {{ level.name }}</button>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-2 mb-3">
        <div
          v-for="s in statusList"
          :key="s.key"
          class="rounded-2xl p-3 text-center shadow-sm cursor-pointer transition-all hover:scale-105"
          :class="s.bg"
          @click="filterStatus = filterStatus === s.key ? null : s.key"
        >
          <div class="text-2xl font-black" :class="s.textColor">{{ counts[s.key] }}</div>
          <div class="text-xs" :class="s.textColor">{{ s.label }}</div>
        </div>
      </div>

      <p class="text-xs text-gray-400 mb-6 text-center">
        当前范围：{{ selectedLevelMeta?.name || '全部关卡' }} · 共 {{ scopedCharacters.length }} 个汉字
      </p>

      <div v-if="filterStatus" class="mb-3 text-center">
        <span class="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-bold">
          筛选：{{ statusList.find(s => s.key === filterStatus)?.label }}
          <button @click="filterStatus = null" class="ml-2">✕</button>
        </span>
      </div>

      <div class="grid grid-cols-5 gap-2">
        <div
          v-for="c in filteredChars"
          :key="c.char"
          class="rounded-2xl p-2 text-center cursor-pointer shadow-sm hover:scale-110 transition-all"
          :class="getStatusBg(getCharStatus(c.char))"
          @click="selectedChar = c"
        >
          <div class="text-2xl font-black">{{ c.char }}</div>
          <div class="text-xs opacity-70">{{ c.pinyin }}</div>
        </div>
      </div>

      <div v-if="filteredChars.length === 0" class="mt-6 text-center text-gray-400 text-sm">
        当前筛选下还没有匹配的汉字
      </div>
    </div>

    <!-- 设置 -->
    <div v-if="activeTab === 'settings'" class="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-6">
      <h3 class="text-xl font-black text-gray-700 mb-4">🔊 学习声音</h3>
      <div class="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 mb-6">
        <div>
          <div class="font-bold text-gray-700">发音与答题音效</div>
          <div class="text-sm text-gray-400">关闭后将不再播放读音和对错提示音</div>
        </div>
        <button
          @click="toggleSound"
          class="px-4 py-2 rounded-2xl font-bold transition-all"
          :class="settings.sound ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'"
        >
          {{ settings.sound ? '已开启' : '已关闭' }}
        </button>
      </div>

      <h3 class="text-xl font-black text-gray-700 mb-4">🔑 修改密码</h3>
      <input
        v-model="newPassword"
        type="text"
        maxlength="4"
        pattern="[0-9]*"
        placeholder="输入新的4位数字密码"
        class="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg text-center tracking-widest mb-3 focus:outline-none focus:border-purple-400"
      />
      <button @click="changePassword" class="w-full btn-primary bg-purple-500 mb-6">保存密码</button>

      <h3 class="text-xl font-black text-gray-700 mb-2">⚠️ 重置进度</h3>
      <p class="text-gray-400 text-sm mb-3">清除所有答题记录，重新开始</p>
      <button @click="confirmReset = true" class="w-full btn-secondary bg-red-100 text-red-500 border-2 border-red-200">
        🗑️ 重置所有进度
      </button>

      <div v-if="confirmReset" class="mt-4 bg-red-50 rounded-2xl p-4 text-center">
        <p class="text-red-600 font-bold mb-3">确定要清空所有进度吗？</p>
        <div class="flex gap-2">
          <button @click="doReset" class="flex-1 btn-secondary bg-red-500 text-white">确定清空</button>
          <button @click="confirmReset = false" class="flex-1 btn-secondary bg-gray-100 text-gray-500">取消</button>
        </div>
      </div>

      <div v-if="settingMsg" class="mt-3 text-center text-green-500 font-bold">{{ settingMsg }}</div>
    </div>

    <div v-if="selectedChar" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" @click.self="selectedChar = null">
      <div class="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <div class="text-center mb-4">
          <div class="text-8xl font-black text-gray-800">{{ selectedChar.char }}</div>
          <div class="text-xl text-blue-400 font-bold">{{ selectedChar.pinyin }}</div>
          <div class="text-4xl mt-1">{{ selectedChar.emoji }}</div>
          <div class="mt-2 text-sm text-gray-400">{{ levelName(selectedChar.level) }}</div>
        </div>
        <div class="mb-4 flex items-center justify-between gap-2">
          <span class="inline-block px-3 py-1 rounded-full font-bold text-sm" :class="getStatusBg(getCharStatus(selectedChar.char))">
            {{ statusLabel(getCharStatus(selectedChar.char)) }}
          </span>
          <span class="text-xs text-purple-500 bg-purple-50 px-3 py-1 rounded-full font-bold">
            {{ levelName(selectedChar.level) }}
          </span>
        </div>
        <div class="text-sm text-gray-500">
          <div class="flex justify-between py-1 border-b border-gray-100">
            <span>答对次数</span>
            <span class="font-bold text-green-500">{{ charProgress(selectedChar.char).correct }}</span>
          </div>
          <div class="flex justify-between py-1">
            <span>答错次数</span>
            <span class="font-bold text-red-400">{{ charProgress(selectedChar.char).wrong }}</span>
          </div>
        </div>
        <button @click="selectedChar = null" class="mt-4 w-full btn-secondary bg-gray-100 text-gray-500">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { characters, levels, getLevelMeta } from '../data/characters'
import { getCharStatus, getProgress, resetProgress, getSettings, saveSettings } from '../utils/storage'

const activeTab = ref('progress')
const filterStatus = ref(null)
const selectedLevel = ref('all')
const selectedChar = ref(null)
const confirmReset = ref(false)
const settingMsg = ref('')
const newPassword = ref('')
const settings = ref(getSettings())

const tabs = [
  { key: 'progress', label: '📊 学习进度' },
  { key: 'settings', label: '⚙️ 设置' },
]

const statusList = [
  { key: 'mastered', label: '已掌握', bg: 'bg-green-100', textColor: 'text-green-600' },
  { key: 'review', label: '需复习', bg: 'bg-yellow-100', textColor: 'text-yellow-600' },
  { key: 'strengthen', label: '需强化', bg: 'bg-red-100', textColor: 'text-red-600' },
  { key: 'unlearned', label: '未学过', bg: 'bg-gray-100', textColor: 'text-gray-500' },
]

const selectedLevelMeta = computed(() => {
  if (selectedLevel.value === 'all') return null
  return getLevelMeta(selectedLevel.value)
})

const scopedCharacters = computed(() => {
  if (selectedLevel.value === 'all') return characters
  return characters.filter(item => item.level === selectedLevel.value)
})

const counts = computed(() => {
  const c = { mastered: 0, review: 0, strengthen: 0, unlearned: 0 }
  scopedCharacters.value.forEach(ch => {
    c[getCharStatus(ch.char)]++
  })
  return c
})

const levelSummaries = computed(() => {
  return levels.map(level => {
    const chars = characters.filter(item => item.level === level.key)
    const levelCounts = { mastered: 0, review: 0, strengthen: 0, unlearned: 0 }

    chars.forEach(ch => {
      levelCounts[getCharStatus(ch.char)]++
    })

    const total = chars.length || 1
    const mastered = levelCounts.mastered
    const ratio = mastered / total

    return {
      ...level,
      total: chars.length,
      mastered,
      ratio,
      counts: levelCounts,
    }
  })
})

const filteredChars = computed(() => {
  const base = scopedCharacters.value
  if (!filterStatus.value) return base
  return base.filter(c => getCharStatus(c.char) === filterStatus.value)
})

function getStatusBg(status) {
  const map = {
    mastered: 'bg-green-100 text-green-700',
    review: 'bg-yellow-100 text-yellow-700',
    strengthen: 'bg-red-100 text-red-700',
    unlearned: 'bg-gray-100 text-gray-500',
  }
  return map[status] || map.unlearned
}

function statusLabel(status) {
  const map = {
    mastered: '✅ 已掌握',
    review: '🟡 需复习',
    strengthen: '🔴 需强化',
    unlearned: '⬜ 未学过',
  }
  return map[status] || '未学过'
}

function levelName(levelKey) {
  return getLevelMeta(levelKey)?.name || '未分级'
}

function charProgress(char) {
  const p = getProgress()
  return p[char] || { correct: 0, wrong: 0 }
}

function toggleSound() {
  settings.value = {
    ...settings.value,
    sound: !settings.value.sound,
  }
  saveSettings(settings.value)
  settingMsg.value = settings.value.sound ? '声音已开启 ✅' : '声音已关闭 ✅'
  setTimeout(() => {
    settingMsg.value = ''
  }, 2000)
}

function changePassword() {
  if (!/^\d{4}$/.test(newPassword.value)) {
    settingMsg.value = '请输入4位数字密码'
    return
  }
  const next = { ...settings.value, password: newPassword.value }
  settings.value = next
  saveSettings(next)
  settingMsg.value = '密码已保存 ✅'
  newPassword.value = ''
  setTimeout(() => {
    settingMsg.value = ''
  }, 2000)
}

function doReset() {
  resetProgress()
  confirmReset.value = false
  settingMsg.value = '进度已重置 ✅'
  setTimeout(() => {
    settingMsg.value = ''
  }, 2000)
}
</script>
