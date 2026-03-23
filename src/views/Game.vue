<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">

    <!-- 进度条 -->
    <div class="w-full max-w-md mb-6">
      <div class="flex justify-between items-center mb-2">
        <button @click="$router.push('/')" class="text-gray-400 hover:text-gray-600 text-2xl">←</button>
        <div class="flex gap-1">
          <span
            v-for="i in TOTAL_QUESTIONS" :key="i"
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
      <div class="flex justify-center gap-1 mb-8">
        <span v-for="i in TOTAL_QUESTIONS" :key="i" class="text-4xl">
          {{ i <= stars ? '⭐' : '☆' }}
        </span>
      </div>
      <div class="flex flex-col gap-3 w-full">
        <button @click="restartGame" class="btn-primary bg-gradient-to-r from-orange-400 to-pink-500">
          🔄 再来一局
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
          v-for="star in flyingStars" :key="star.id"
          class="fixed text-3xl pointer-events-none z-50"
          :style="{
            left: star.x + 'px', top: star.y + 'px',
            '--tx': star.tx + 'px', '--ty': star.ty + 'px',
            animation: 'star-fly 0.8s ease-out forwards'
          }"
        >⭐</div>
      </div>

      <!-- 题目卡 -->
      <div class="bg-white rounded-3xl shadow-xl p-6 mb-6">

        <!-- 看字选图：显示大汉字 -->
        <div v-if="currentQ.type === 'char-to-image'" class="text-center">
          <div class="text-2xl text-blue-400 font-bold mb-1">{{ currentQ.char.pinyin }}</div>
          <div class="text-9xl font-black text-gray-800 leading-none mb-2">{{ currentQ.char.char }}</div>
          <button
            @click="speakChar(currentQ.char.char)"
            class="text-3xl hover:scale-110 transition-transform"
            title="点我听发音"
          >🔊</button>
        </div>

        <!-- 看图选字：显示大号emoji -->
        <div v-else class="text-center">
          <div class="text-9xl mb-2">{{ currentQ.char.emoji }}</div>
          <div class="text-lg text-gray-400">{{ currentQ.char.description }}</div>
        </div>
      </div>

      <!-- 提示文字 -->
      <p class="text-center text-gray-400 mb-4 text-lg">
        {{ currentQ.type === 'char-to-image' ? '👇 选出正确的图片' : '👇 选出正确的汉字' }}
      </p>

      <!-- 选项区 -->
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

      <!-- 提示信息 -->
      <div v-if="feedback" class="mt-4 text-center">
        <p v-if="feedback === 'correct'" class="text-green-500 font-bold text-xl animate-bounce">✅ 真棒，答对了！</p>
        <p v-else-if="feedback === 'wrong1'" class="text-orange-400 font-bold text-xl">🤔 再试试～</p>
        <p v-else-if="feedback === 'wrong2'" class="text-red-400 font-bold text-xl">
          没关系！正确答案是
          <span class="text-red-600">{{ currentQ.type === 'char-to-image' ? currentQ.char.emoji : currentQ.char.char }}</span>
        </p>
        <button v-if="feedback !== 'wrong1'" @click="nextQuestion" class="mt-3 btn-secondary bg-orange-400 text-white">
          {{ currentIndex < TOTAL_QUESTIONS ? '下一题 →' : '看结果 🎉' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { characters } from '../data/characters'
import { getCharStatus, recordAnswer } from '../utils/storage'
import { speak, playCorrectSound, playWrongSound } from '../utils/speech'

const TOTAL_QUESTIONS = 5

const questions = ref([])
const currentIndex = ref(0)
const stars = ref(0)
const answered = ref(false)
const feedback = ref(null)
const selectedOpt = ref(null)
const gameOver = ref(false)
const flyingStars = ref([])
const wrongCount = ref(0) // 当前题答错次数

const currentQ = computed(() => questions.value[currentIndex.value] || {})

// 生成题目：优先抽需强化/复习的字
function generateQuestions() {
  const prioritized = characters.filter(c => {
    const s = getCharStatus(c.char)
    return s === 'strengthen' || s === 'review'
  })
  const others = characters.filter(c => {
    const s = getCharStatus(c.char)
    return s !== 'strengthen' && s !== 'review'
  })

  // 打乱优先词
  const shufflePri = [...prioritized].sort(() => Math.random() - 0.5)
  const shuffleOth = [...others].sort(() => Math.random() - 0.5)
  const pool = [...shufflePri, ...shuffleOth].slice(0, TOTAL_QUESTIONS)

  return pool.map(char => {
    const type = Math.random() > 0.5 ? 'char-to-image' : 'image-to-char'
    // 生成3个错误选项
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
}

// 初始化
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
  } else {
    wrongCount.value++
    playWrongSound()
    if (wrongCount.value < 2) {
      feedback.value = 'wrong1'
      // 短暂抖动后清除选中状态
      setTimeout(() => {
        selectedOpt.value = null
        feedback.value = null
      }, 800)
    } else {
      feedback.value = 'wrong2'
      answered.value = true
      recordAnswer(currentQ.value.char.char, false)
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
  setTimeout(() => { flyingStars.value = [] }, 900)
}

function nextQuestion() {
  if (currentIndex.value >= TOTAL_QUESTIONS - 1) {
    gameOver.value = true
    return
  }
  currentIndex.value++
  answered.value = false
  feedback.value = null
  selectedOpt.value = null
  wrongCount.value = 0
}

const resultEmoji = computed(() => {
  if (stars.value === 5) return '🏆'
  if (stars.value >= 3) return '🎉'
  return '💪'
})

const resultText = computed(() => {
  if (stars.value === 5) return '满分！你真是小天才！'
  if (stars.value >= 3) return '答对了 ' + stars.value + ' 题，继续加油！'
  return '没关系，多练习就会了！'
})
</script>
