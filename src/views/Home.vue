<template>
  <div class="min-h-screen px-4 py-8 sm:px-6">
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <!-- Hero -->
      <section class="relative overflow-hidden rounded-[2rem] bg-white/90 p-6 shadow-xl ring-1 ring-white/70 sm:p-8 lg:p-10">
        <div class="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-orange-200/50 blur-3xl"></div>
        <div class="absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-sky-200/50 blur-3xl"></div>

        <div class="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-500">
              <span>🌟</span>
              <span>3–6 岁汉字启蒙</span>
            </div>

            <h1 class="mb-4 text-4xl font-black text-gray-800 sm:text-5xl">认字乐园</h1>
            <p class="mb-3 text-lg font-bold text-blue-500 sm:text-xl">每天 5 分钟，用游戏方式轻松认识常见汉字</p>
            <p class="mb-6 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              给家长一个更省心的识字启蒙工具：孩子点一点就能学，系统会自动记录学习进度，把需要复习和需要强化的字优先安排出来。
            </p>

            <div class="mb-6 flex flex-wrap gap-3 text-sm font-bold text-gray-600">
              <div class="rounded-2xl bg-orange-50 px-4 py-3 text-orange-500">⏱️ 每次约 5 分钟</div>
              <div class="rounded-2xl bg-blue-50 px-4 py-3 text-blue-500">🎮 游戏化互动答题</div>
              <div class="rounded-2xl bg-green-50 px-4 py-3 text-green-600">🔁 自动复习机制</div>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row">
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
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div class="rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 p-5 shadow-sm">
              <div class="mb-2 text-sm font-bold text-orange-500">适合谁用</div>
              <div class="text-2xl font-black text-gray-800">学前儿童汉字启蒙</div>
              <p class="mt-2 text-sm leading-6 text-gray-500">适合刚开始接触常见汉字、喜欢图像和互动游戏的孩子。</p>
            </div>

            <div class="rounded-3xl bg-gradient-to-br from-sky-50 to-indigo-50 p-5 shadow-sm">
              <div class="mb-2 text-sm font-bold text-blue-500">家长能看到</div>
              <div class="text-2xl font-black text-gray-800">进度、复习、强化</div>
              <p class="mt-2 text-sm leading-6 text-gray-500">不用猜孩子学到了哪一步，打开家长中心就能快速查看。</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div class="rounded-3xl bg-white p-4 text-center shadow-sm">
          <div class="text-3xl font-black text-green-500">{{ stats.mastered }}</div>
          <div class="mt-1 text-sm text-gray-400">已掌握</div>
        </div>
        <div class="rounded-3xl bg-white p-4 text-center shadow-sm">
          <div class="text-3xl font-black text-yellow-500">{{ stats.review }}</div>
          <div class="mt-1 text-sm text-gray-400">需复习</div>
        </div>
        <div class="rounded-3xl bg-white p-4 text-center shadow-sm">
          <div class="text-3xl font-black text-red-500">{{ stats.strengthen }}</div>
          <div class="mt-1 text-sm text-gray-400">需强化</div>
        </div>
        <div class="rounded-3xl bg-white p-4 text-center shadow-sm">
          <div class="text-3xl font-black text-gray-400">{{ stats.unlearned }}</div>
          <div class="mt-1 text-sm text-gray-400">未学过</div>
        </div>
      </section>

      <!-- Benefits -->
      <section class="grid gap-4 lg:grid-cols-3">
        <article class="rounded-3xl bg-white p-6 shadow-sm">
          <div class="mb-3 text-3xl">📚</div>
          <h2 class="mb-2 text-xl font-black text-gray-800">认字启蒙更轻松</h2>
          <p class="text-sm leading-6 text-gray-500">
            从孩子熟悉的数字、颜色、动物、家庭成员等常见内容入手，降低识字门槛。
          </p>
        </article>

        <article class="rounded-3xl bg-white p-6 shadow-sm">
          <div class="mb-3 text-3xl">🧠</div>
          <h2 class="mb-2 text-xl font-black text-gray-800">边玩边记，不容易枯燥</h2>
          <p class="text-sm leading-6 text-gray-500">
            看字选图、看图选字两种互动题型交替出现，让孩子在游戏反馈里自然重复记忆。
          </p>
        </article>

        <article class="rounded-3xl bg-white p-6 shadow-sm">
          <div class="mb-3 text-3xl">📈</div>
          <h2 class="mb-2 text-xl font-black text-gray-800">自动记录学习进度</h2>
          <p class="text-sm leading-6 text-gray-500">
            系统会把孩子答题结果分成已掌握、需复习、需强化，帮助家长快速知道下一步重点。
          </p>
        </article>
      </section>

      <!-- Steps -->
      <section class="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <div class="mb-5 flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-bold text-purple-500">怎么使用</p>
            <h2 class="text-2xl font-black text-gray-800">三步开始识字练习</h2>
          </div>
          <div class="hidden rounded-2xl bg-purple-50 px-4 py-2 text-sm font-bold text-purple-500 sm:block">共 {{ total }} 个常见汉字</div>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <div class="rounded-3xl bg-orange-50 p-5">
            <div class="mb-3 text-sm font-black text-orange-500">STEP 1</div>
            <h3 class="mb-2 text-lg font-black text-gray-800">开始学习</h3>
            <p class="text-sm leading-6 text-gray-500">点击“开始学习”，进入一轮轻量练习，适合碎片时间完成。</p>
          </div>
          <div class="rounded-3xl bg-blue-50 p-5">
            <div class="mb-3 text-sm font-black text-blue-500">STEP 2</div>
            <h3 class="mb-2 text-lg font-black text-gray-800">听、看、选</h3>
            <p class="text-sm leading-6 text-gray-500">孩子通过图像、拼音和发音提示完成题目，形成多感官记忆。</p>
          </div>
          <div class="rounded-3xl bg-green-50 p-5">
            <div class="mb-3 text-sm font-black text-green-600">STEP 3</div>
            <h3 class="mb-2 text-lg font-black text-gray-800">家长查看进度</h3>
            <p class="text-sm leading-6 text-gray-500">在家长中心查看掌握情况，把复习重点留给真正容易错的字。</p>
          </div>
        </div>
      </section>

      <p class="text-center text-sm text-gray-400">认字乐园 · 让孩子每天进步一点点 ✨</p>

      <PasswordModal
        v-if="showPasswordModal"
        @close="showPasswordModal = false"
        @success="goParent"
      />
    </div>
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
