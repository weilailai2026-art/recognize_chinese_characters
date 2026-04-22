<template>
  <div class="min-h-screen p-4">
    <!-- 头部 -->
    <div class="flex items-center justify-between mb-6 max-w-5xl mx-auto">
      <button @click="$router.push('/')" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">← 返回</button>
      <h1 class="text-2xl font-black text-purple-600">👨‍👩‍👧 家长中心</h1>
      <div class="w-12"></div>
    </div>

    <!-- Tab -->
    <div class="flex gap-2 mb-6 max-w-5xl mx-auto">
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
    <div v-if="activeTab === 'progress'" class="max-w-5xl mx-auto space-y-6">
      <!-- 总览卡 -->
      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-3xl bg-white p-5 shadow-sm">
          <div class="text-sm font-bold text-purple-500 mb-2">最近学习</div>
          <div class="text-2xl font-black text-gray-800">{{ latestStudyText }}</div>
          <p class="mt-2 text-sm text-gray-400">最近一次学习时间</p>
        </div>
        <div class="rounded-3xl bg-white p-5 shadow-sm">
          <div class="text-sm font-bold text-blue-500 mb-2">累计轮次</div>
          <div class="text-2xl font-black text-gray-800">{{ sessions.length }} 次</div>
          <p class="mt-2 text-sm text-gray-400">孩子一共完成的学习轮数</p>
        </div>
        <div class="rounded-3xl bg-white p-5 shadow-sm">
          <div class="text-sm font-bold text-orange-500 mb-2">平均表现</div>
          <div class="text-2xl font-black text-gray-800">{{ averageCorrectText }}</div>
          <p class="mt-2 text-sm text-gray-400">按每轮答对题数估算</p>
        </div>
      </div>

      <!-- 学习建议 -->
      <div class="rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white shadow-lg">
        <div class="text-sm font-bold text-white/80 mb-2">学习建议</div>
        <div class="text-2xl font-black mb-2">{{ parentAdvice.title }}</div>
        <p class="leading-7 text-white/90">{{ parentAdvice.desc }}</p>
      </div>

      <!-- 状态统计 -->
      <div>
        <h2 class="text-lg font-black text-gray-700 mb-3">整体掌握情况</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="s in statusList" :key="s.key"
            class="rounded-2xl p-4 text-center shadow-sm cursor-pointer transition-all hover:scale-105"
            :class="s.bg"
            @click="filterStatus = filterStatus === s.key ? null : s.key"
          >
            <div class="text-3xl font-black" :class="s.textColor">{{ counts[s.key] }}</div>
            <div class="text-sm" :class="s.textColor">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <!-- 分类掌握 -->
      <div>
        <h2 class="text-lg font-black text-gray-700 mb-3">分类掌握情况</h2>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="item in categorySummary"
            :key="item.category"
            class="rounded-3xl bg-white p-5 shadow-sm"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-black text-gray-800">{{ item.category }}</h3>
              <span class="text-sm font-bold text-purple-500">{{ item.mastered }}/{{ item.total }}</span>
            </div>
            <div class="h-3 rounded-full bg-gray-100 overflow-hidden mb-3">
              <div class="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400" :style="{ width: item.percent + '%' }"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-400">
              <span>已掌握 {{ item.mastered }}</span>
              <span>待复习/强化 {{ item.review + item.strengthen }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 错题 Top -->
      <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="rounded-3xl bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-black text-gray-700">错题 Top 5</h2>
            <span class="text-sm text-gray-400">按累计答错次数排序</span>
          </div>

          <div v-if="topWrongChars.length" class="space-y-3">
            <div
              v-for="(item, idx) in topWrongChars"
              :key="item.char"
              class="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3"
            >
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 font-black text-red-500">{{ idx + 1 }}</div>
                <div>
                  <div class="text-lg font-black text-gray-800">{{ item.char }} · {{ item.pinyin }}</div>
                  <div class="text-xs text-gray-400">{{ item.category }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xl font-black text-red-500">{{ item.wrong }}</div>
                <div class="text-xs text-red-400">累计答错</div>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400">还没有明显的高频错题，继续保持～</p>
        </div>

        <div class="rounded-3xl bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-black text-gray-700">最近学习记录</h2>
            <span class="text-sm text-gray-400">最近 5 次</span>
          </div>

          <div v-if="recentSessions.length" class="space-y-3">
            <div
              v-for="session in recentSessions"
              :key="session.time"
              class="rounded-2xl bg-blue-50 px-4 py-3"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-blue-600">{{ formatDateTime(session.time) }}</span>
                <span class="text-sm font-black text-orange-500">⭐ {{ session.stars }}/{{ session.totalQuestions }}</span>
              </div>
              <div class="text-sm text-gray-500">
                答对 {{ session.correctCount }} 题
                <span v-if="session.newlyMastered?.length"> · 新掌握 {{ session.newlyMastered.length }} 个</span>
                <span v-if="session.needStrengthen?.length"> · 待强化 {{ session.needStrengthen.length }} 个</span>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400">还没有学习记录，先去玩一轮吧。</p>
        </div>
      </div>

      <!-- 筛选提示 -->
      <div v-if="filterStatus" class="text-center">
        <span class="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-bold">
          筛选：{{ statusList.find(s => s.key === filterStatus)?.label }}
          <button @click="filterStatus = null" class="ml-2">✕</button>
        </span>
      </div>

      <!-- 字卡网格 -->
      <div>
        <h2 class="text-lg font-black text-gray-700 mb-3">全部汉字详情</h2>
        <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
          <div
            v-for="c in filteredChars" :key="c.char"
            class="rounded-2xl p-2 text-center cursor-pointer shadow-sm hover:scale-110 transition-all"
            :class="getStatusBg(getCharStatus(c.char))"
            @click="selectedChar = c"
          >
            <div class="text-2xl font-black">{{ c.char }}</div>
            <div class="text-xs opacity-70">{{ c.pinyin }}</div>
          </div>
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
        <div class="text-sm text-gray-500 space-y-2">
          <div class="flex justify-between py-1 border-b border-gray-100">
            <span>答对次数</span>
            <span class="font-bold text-green-500">{{ charProgress(selectedChar.char).correct }}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-gray-100">
            <span>答错次数</span>
            <span class="font-bold text-red-400">{{ charProgress(selectedChar.char).wrong }}</span>
          </div>
          <div class="flex justify-between py-1">
            <span>所属分类</span>
            <span class="font-bold text-gray-700">{{ selectedChar.category }}</span>
          </div>
        </div>
        <button @click="selectedChar = null" class="mt-4 w-full btn-secondary bg-gray-100 text-gray-500">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { characters } from '../data/characters'
import {
  getCharStatus,
  getProgress,
  resetProgress,
  getSettings,
  saveSettings,
  getLearningSessions,
} from '../utils/storage'

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

const sessions = computed(() => getLearningSessions())
const recentSessions = computed(() => sessions.value.slice(0, 5))

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

const latestStudyText = computed(() => {
  if (!sessions.value.length) return '还没有记录'
  return formatDateTime(sessions.value[0].time)
})

const averageCorrectText = computed(() => {
  if (!sessions.value.length) return '暂无数据'
  const total = sessions.value.reduce((sum, item) => sum + (item.correctCount || 0), 0)
  return (total / sessions.value.length).toFixed(1) + ' / 5 题'
})

const categorySummary = computed(() => {
  const grouped = {}
  characters.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = {
        category: item.category,
        total: 0,
        mastered: 0,
        review: 0,
        strengthen: 0,
      }
    }
    grouped[item.category].total++
    const status = getCharStatus(item.char)
    if (status === 'mastered') grouped[item.category].mastered++
    if (status === 'review') grouped[item.category].review++
    if (status === 'strengthen') grouped[item.category].strengthen++
  })

  return Object.values(grouped)
    .map(item => ({
      ...item,
      percent: item.total ? Math.round((item.mastered / item.total) * 100) : 0,
    }))
    .sort((a, b) => b.percent - a.percent)
})

const topWrongChars = computed(() => {
  return characters
    .map(item => {
      const p = charProgress(item.char)
      return {
        ...item,
        wrong: p.wrong || 0,
        correct: p.correct || 0,
      }
    })
    .filter(item => item.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong || a.correct - b.correct)
    .slice(0, 5)
})

const parentAdvice = computed(() => {
  if (!sessions.value.length) {
    return {
      title: '先开始第一轮学习',
      desc: '建议先让孩子完成 1～2 轮轻量练习，家长中心才会逐步出现更有价值的学习数据。',
    }
  }

  if (counts.value.strengthen >= 5) {
    return {
      title: '先集中强化高频错字',
      desc: '当前需要强化的字偏多，建议这两天优先短时高频重复，不要一次学太多新字。',
    }
  }

  if (counts.value.review >= 6) {
    return {
      title: '下一步以复习巩固为主',
      desc: '说明孩子已经接触过不少字，但还没完全稳定。建议每天保持 5 分钟，把黄字逐步转成绿字。',
    }
  }

  if (counts.value.mastered >= 15) {
    return {
      title: '整体节奏不错，可以继续扩量',
      desc: '已掌握字数量在提升，可以继续稳定练习，并逐步加入更多新字，避免停在舒适区。',
    }
  }

  return {
    title: '保持轻量高频最重要',
    desc: '当前阶段不用追求一次学很多，稳定坚持每天 5 分钟，比偶尔一次学很久更有效。',
  }
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

function formatDateTime(ts) {
  if (!ts) return '暂无记录'
  const date = new Date(ts)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getMonth() + 1}-${date.getDate()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
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
