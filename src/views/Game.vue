<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <!-- 进度条 -->
    <div class="w-full max-w-md mb-6">
      <div class="flex justify-between items-center mb-2">
        <button @click="$router.push('/')" class="text-gray-400 hover:text-gray-600 text-2xl">←</button>
        <div class="flex gap-1">
          <span
            v-for="i in questionCount"
            :key="i"
            class="w-6 h-6 rounded-full transition-all duration-300"
            :class="i <= currentIndex ? 'bg-orange-400' : 'bg-gray-200'"
          ></span>
        </div>
        <div class="text-lg font-bold text-orange-400">⭐ {{ stars }}</div>
      </div>
    </div>

    <!-- 结果页 -->
    <div v-if="gameOver" class="text-center animate-bounce-in w-full max-w-md">
      <div class="text-7xl mb-4">{{ resultEmoji }}</div>
      <h2 class="text-4xl font-black text-orange-500 mb-2">太棒了！</h2>
      <p class="text-xl text-gray-500 mb-4">{{ resultText }}</p>

      <div class="mb-6 rounded-3xl bg-white p-5 shadow-lg text-left">
        <div class="mb-4 flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-bold text-orange-400">本轮学习报告</p>
            <h3 class="text-2xl font-black text-gray-800">这次学会了什么？</h3>
          </div>
          <div class="rounded-2xl bg-orange-50 px-3 py-2 text-right">
            <div class="text-2xl font-black text-orange-500">{{ sessionSummary.correctCount }}</div>
            <div class="text-xs text-orange-400">答对题数</div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 mb-4 text-center">
          <div class="rounded-2xl bg-green-50 p-3">
            <div class="text-2xl font-black text-green-500">{{ sessionSummary.newlyMastered.length }}</div>
            <div class="text-xs text-green-600">新掌握</div>
          </div>
          <div class="rounded-2xl bg-yellow-50 p-3">
            <div class="text-2xl font-black text-yellow-500">{{ sessionSummary.needReview.length }}</div>
            <div class="text-xs text-yellow-600">待复习</div>
          </div>
          <div class="rounded-2xl bg-red-50 p-3">
            <div class="text-2xl font-black text-red-500">{{ sessionSummary.needStrengthen.length }}</div>
            <div class="text-xs text-red-600">待强化</div>
          </div>
        </div>

        <div class="space-y-3 text-sm">
          <div v-if="sessionSummary.newlyMastered.length">
            <div class="mb-1 font-bold text-green-600">✅ 这轮表现很棒</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="item in sessionSummary.newlyMastered"
                :key="item.char"
                class="rounded-full bg-green-100 px-3 py-1 font-bold text-green-700"
              >{{ item.char }} · {{ item.pinyin }}</span>
            </div>
          </div>

          <div v-if="sessionSummary.needReview.length">
            <div class="mb-1 font-bold text-yellow-600">🟡 下一轮建议复习</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="item in sessionSummary.needReview"
                :key="item.char"
                class="rounded-full bg-yellow-100 px-3 py-1 font-bold text-yellow-700"
              >{{ item.char }} · {{ item.pinyin }}</span>
            </div>
          </div>

          <div v-if="sessionSummary.needStrengthen.length">
            <div class="mb-1 font-bold text-red-500">🔴 这几个字建议重点强化</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="item in sessionSummary.needStrengthen"
                :key="item.char"
                class="rounded-full bg-red-100 px-3 py-1 font-bold text-red-600"
              >{{ item.char }} · {{ item.pinyin }}</span>
            </div>
          </div>

          <p class="rounded-2xl bg-blue-50 px-4 py-3 leading-6 text-blue-600 font-bold">
            {{ sessionAdvice }}
          </p>
        </div>
      </div>

      <div class="flex justify-center gap-1 mb-8">
        <span v-for="i in TOTAL_QUESTIONS" :key="i" class="text-4xl">
          {{ i <= stars ? '⭐' : '☆' }}
        </span>
      </div>
      <p v-if="checkin.streak > 0" class="text-sm text-orange-400 mb-4 font-bold">
        🔥 已连续打卡 {{ checkin.streak }} 天
      </p>
      <div v-if="nextLevelHint" class="mb-4 rounded-3xl bg-purple-50 border border-purple-100 p-4 text-left">
        <div class="flex items-start justify-between gap-3 mb-2">
          <div>
            <div class="text-sm text-purple-500 font-black mb-1">🚀 升级提示</div>
            <div class="text-lg font-black text-purple-700">{{ nextLevelHint.title }}</div>
          </div>
          <div class="text-3xl">{{ nextLevelHint.emoji }}</div>
        </div>
        <p class="text-sm text-purple-600">{{ nextLevelHint.description }}</p>
      </div>
      <div class="flex flex-col gap-3 w-full">
        <button
          v-if="nextLevelHint"
          @click="goNextLevel"
          class="btn-primary bg-gradient-to-r from-purple-500 to-indigo-500"
        >
          {{ nextLevelHint.buttonText }}
        </button>
        <button @click="restartGame" class="btn-primary bg-gradient-to-r from-orange-400 to-pink-500">
          🔄 再来一局
        </button>
        <button @click="$router.push('/parent')" class="btn-secondary bg-blue-100 text-blue-600 border-2 border-blue-200">
          👨👩👧 看家长中心
        </button>
        <button @click="$router.push('/')" class="btn-secondary bg-white text-gray-500 border-2 border-gray-200">
          🏠 回首页
        </button>
      </div>
    </div>

    <!-- 题目区域 -->
    <div v-else class="w-full max-w-md">
      <!-- 星星动画层 -->
      <div class="relative">
        <div
          v-for="star in flyingStars"
          :key="star.id"
          class="fixed text-3xl pointer-events-none z-50"
          :style="{
            left: star.x + 'px',
            top: star.y + 'px',
            '--tx': star.tx + 'px',
            '--ty': star.ty + 'px',
            animation: 'star-fly 0.8s ease-out forwards'
          }"
        >⭐</div>
      </div>

      <!-- 题目卡 -->
      <div class="bg-white rounded-3xl shadow-xl p-6 mb-6">
        <div v-if="currentQ.type === 'char-to-image'" class="text-center">
          <div class="text-2xl text-blue-400 font-bold mb-1">{{ currentQ.char.pinyin }}</div>
          <div class="text-9xl font-black text-gray-800 leading-none mb-2">{{ currentQ.char.char }}</div>
          <button
            @click="speakChar(currentQ.char.char)"
            class="text-3xl hover:scale-110 transition-transform"
            title="点我听发音"
          >🔊</button>
        </div>

        <div v-else class="text-center">
          <div class="text-9xl mb-2">{{ currentQ.char.emoji }}</div>
          <div class="text-lg text-gray-400">{{ currentQ.char.description }}</div>
        </div>
      </div>

      <p class="text-center text-gray-400 mb-4 text-lg">
        {{ currentQ.type === 'char-to-image' ? '👇 选出正确的图片' : '👇 选出正确的汉字' }}
      </p>

      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="opt in currentQ.options"
          :key="opt.char"
          @click="selectAnswer(opt)"
          :disabled="answered"
          class="option-card bg-white shadow-md"
          :class="[
            getOptionClass(opt),
            currentQ.type === 'char-to-image' ? 'h-24 text-5xl' : 'h-24 text-4xl font-black text-gray-800'
          ]"
        >
          {{ currentQ.type === 'char-to-image' ? opt.emoji : opt.char }}
        </button>
      </div>

      <div v-if="feedback" class="mt-4 text-center">
        <p v-if="feedback === 'correct'" class="text-green-500 font-bold text-xl animate-bounce">✅ 真棒，答对了！</p>
        <p v-else-if="feedback === 'wrong1'" class="text-orange-400 font-bold text-xl">🤔 再试试～</p>
        <p v-else-if="feedback === 'wrong2'" class="text-red-400 font-bold text-xl">
          没关系！正确答案是
          <span class="text-red-600">{{ currentQ.type === 'char-to-image' ? currentQ.char.emoji : currentQ.char.char }}</span>
        </p>
        <button v-if="feedback !== 'wrong1'" @click="nextQuestion" class="mt-3 btn-secondary bg-orange-400 text-white">
          {{ currentIndex < questionCount ? '下一题 →' : '看结果 🎉' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { characters } from '../data/characters'
import { getCharStatus, recordAnswer, saveLearningSession } from '../utils/storage'
import { speak, playCorrectSound, playWrongSound } from '../utils/speech'
import { checkinToday, evaluateAchievements, getAchievements, getLevelProgress, saveAppState } from '../utils/progression'

const TOTAL_QUESTIONS = 5
const route = useRoute()
const router = useRouter()

const questions = ref([])
const currentIndex = ref(0)
const stars = ref(0)
const answered = ref(false)
const feedback = ref(null)
const selectedOpt = ref(null)
const gameOver = ref(false)
const flyingStars = ref([])
const wrongCount = ref(0)
const questionResults = ref([])
const sessionSummary = ref({ newlyMastered: [], needReview: [], needStrengthen: [], correctCount: 0 })

const currentQ = computed(() => questions.value[currentIndex.value] || {})
const currentLevel = computed(() => route.query.level || 'starter')
const currentMode = computed(() => (route.query.mode === 'review' ? 'review' : 'normal'))
const currentLevelMeta = computed(() => getLevelMeta(currentLevel.value))
const currentLevelIndex = computed(() => levels.findIndex(level => level.key === currentLevel.value))
const nextLevel = computed(() => levels[currentLevelIndex.value + 1] || null)
const levelCharacters = computed(() => {
  const list = getCharactersByLevel(currentLevel.value)
  return list.length ? list : getCharactersByLevel('starter')
})
const questionCount = computed(() => questions.value.length || TOTAL_QUESTIONS)
const levelProgress = computed(() => getLevelProgress(levels, characters, getCharStatus))
const currentLevelProgress = computed(() => levelProgress.value.find(level => level.key === currentLevel.value) || null)
const nextLevelProgress = computed(() => nextLevel.value
  ? levelProgress.value.find(level => level.key === nextLevel.value.key) || null
  : null)
const nextLevelHint = computed(() => {
  if (!currentLevelProgress.value || !nextLevel.value || !nextLevelProgress.value) return null
  if (!currentLevelProgress.value.unlocked) return null
  if (currentLevelProgress.value.ratio < 0.8) return null
  if (!nextLevelProgress.value.unlocked) return null

  return {
    emoji: nextLevel.value.emoji,
    title: `${nextLevel.value.name} 已可挑战`,
    description: `${currentLevelMeta.value?.name || '当前关卡'} 已达到升级条件，现在可以开始挑战下一关。`,
    buttonText: `挑战${nextLevel.value.name}`,
  }
})

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5)
}

function buildQuestion(char, pool) {
  const type = Math.random() > 0.5 ? 'char-to-image' : 'image-to-char'
  const sameLevelWrongPool = shuffle(pool.filter(c => c.char !== char.char))
  const fallbackWrongPool = shuffle(
    characters.filter(c => c.char !== char.char && !sameLevelWrongPool.some(item => item.char === c.char))
  )
  const wrongOptions = [...sameLevelWrongPool, ...fallbackWrongPool].slice(0, 2)
  const options = shuffle([char, ...wrongOptions])
  return { char, type, options }
}

function generateQuestions() {
  const pool = levelCharacters.value
  const reviewChars = pool.filter(c => {
    const s = getCharStatus(c.char)
    return s === 'strengthen' || s === 'review'
  })
  const otherChars = pool.filter(c => {
    const s = getCharStatus(c.char)
    return s !== 'strengthen' && s !== 'review'
  })

  const shufflePri = [...prioritized].sort(() => Math.random() - 0.5)
  const shuffleOth = [...others].sort(() => Math.random() - 0.5)
  const pool = [...shufflePri, ...shuffleOth].slice(0, TOTAL_QUESTIONS)

  return pool.map(char => {
    const type = Math.random() > 0.5 ? 'char-to-image' : 'image-to-char'
    const wrongPool = characters.filter(c => c.char !== char.char).sort(() => Math.random() - 0.5)
    const options = [char, ...wrongPool.slice(0, 2)].sort(() => Math.random() - 0.5)
    return { char, type, options }
  })
}

function restartGame() {
  questions.value = generateQuestions()
  currentIndex.value = 0
  stars.value = 0
  answered.value = false
  feedback.value = null
  selectedOpt.value = null
  gameOver.value = false
  wrongCount.value = 0
  questionResults.value = []
  sessionSummary.value = { newlyMastered: [], needReview: [], needStrengthen: [], correctCount: 0 }
}

restartGame()

function speakChar(char) {
  speak(char)
}

function getOptionClass(opt) {
  if (!answered.value && selectedOpt.value?.char !== opt.char) return ''
  if (opt.char === currentQ.value.char.char) return 'option-correct'
  if (selectedOpt.value?.char === opt.char) return 'option-wrong'
  return ''
}

function selectAnswer(opt) {
  if (answered.value) return
  selectedOpt.value = opt
  const isCorrect = opt.char === currentQ.value.char.char

  if (isCorrect) {
    feedback.value = 'correct'
    answered.value = true
    stars.value++
    playCorrectSound()
    speak(currentQ.value.char.char)
    spawnStars()
    recordAnswer(currentQ.value.char.char, true)
    questionResults.value.push({
      char: currentQ.value.char.char,
      pinyin: currentQ.value.char.pinyin,
      category: currentQ.value.char.category,
      correct: true,
      wrongAttempts: wrongCount.value,
      finalStatus: getCharStatus(currentQ.value.char.char),
    })
  } else {
    wrongCount.value++
    playWrongSound()
    if (wrongCount.value < 2) {
      feedback.value = 'wrong1'
      setTimeout(() => {
        selectedOpt.value = null
        feedback.value = null
      }, 800)
    } else {
      feedback.value = 'wrong2'
      answered.value = true
      recordAnswer(currentQ.value.char.char, false)
      questionResults.value.push({
        char: currentQ.value.char.char,
        pinyin: currentQ.value.char.pinyin,
        category: currentQ.value.char.category,
        correct: false,
        wrongAttempts: wrongCount.value,
        finalStatus: getCharStatus(currentQ.value.char.char),
      })
    }
  }
}

function spawnStars() {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const dist = 120 + Math.random() * 80
    flyingStars.value.push({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
    })
  }
  setTimeout(() => {
    flyingStars.value = []
  }, 900)
}

function finalizeGame() {
  if (finalized.value) return
  finalized.value = true

  const gameStats = recordGamePlayed()
  const checkinResult = checkinToday()
  checkin.value = checkinResult.data

  const counts = getCounts(characters)
  const achievementState = evaluateAchievements({
    stars: stars.value,
    masteredCount: counts.mastered,
    reviewCount: counts.review,
    strengthenCount: counts.strengthen,
    streak: checkin.value.streak,
    playedGames: gameStats.playedGames || 0,
  })

  if (achievementState.recentUnlocked) {
    recentAchievement.value = getAchievements().find(item => item.id === achievementState.recentUnlocked) || null
  }
}

function buildSessionSummary() {
  const newlyMastered = questionResults.value.filter(item => item.correct && item.finalStatus === 'mastered')
  const needReview = questionResults.value.filter(item => item.finalStatus === 'review')
  const needStrengthen = questionResults.value.filter(item => item.finalStatus === 'strengthen' || !item.correct)

  sessionSummary.value = {
    newlyMastered,
    needReview,
    needStrengthen,
    correctCount: questionResults.value.filter(item => item.correct).length,
  }

  saveLearningSession({
    totalQuestions: TOTAL_QUESTIONS,
    stars: stars.value,
    correctCount: sessionSummary.value.correctCount,
    newlyMastered,
    needReview,
    needStrengthen,
  })
}

function nextQuestion() {
  if (currentIndex.value >= TOTAL_QUESTIONS - 1) {
    buildSessionSummary()
    gameOver.value = true
    return
  }
  currentIndex.value++
  answered.value = false
  feedback.value = null
  selectedOpt.value = null
  wrongCount.value = 0
}

function goNextLevel() {
  if (!nextLevel.value) return
  saveAppState({ selectedLevel: nextLevel.value.key })
  router.push({ path: '/game', query: { level: nextLevel.value.key, mode: 'normal' } })
}

const resultEmoji = computed(() => {
  if (stars.value === questions.value.length) return '🏆'
  if (stars.value >= Math.ceil(questions.value.length * 0.6)) return '🎉'
  return '💪'
})

const resultText = computed(() => {
  if (stars.value === questions.value.length) return '满分！你真是小天才！'
  if (stars.value >= Math.ceil(questions.value.length * 0.6)) return `答对了 ${stars.value} 题，继续加油！`
  return '没关系，多练习就会了！'
})

const sessionAdvice = computed(() => {
  if (sessionSummary.value.needStrengthen.length) {
    return '建议下一轮优先复习红色强化字，连续多玩 1～2 轮，记忆会更稳。'
  }
  if (sessionSummary.value.needReview.length) {
    return '这一轮整体不错，下一轮把待复习的字再过一遍，容易变成“已掌握”。'
  }
  if (sessionSummary.value.newlyMastered.length) {
    return '这一轮表现很棒，已经有新掌握的字了，可以继续挑战下一轮。'
  }
  return '继续保持每天 5 分钟的节奏，慢慢积累就会看到明显进步。'
})
</script>
