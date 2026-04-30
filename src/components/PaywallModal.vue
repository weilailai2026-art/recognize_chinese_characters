<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">

      <!-- 标题区 -->
      <div class="text-center mb-6">
        <div class="text-4xl mb-2">🔒</div>
        <h2 class="text-2xl font-black text-gray-800">解锁全部关卡</h2>
        <p class="text-gray-400 text-sm mt-1">解锁初级、中级、高级全部 360 个汉字</p>
      </div>

      <!-- 登录提示 -->
      <div v-if="showLoginHint" class="mb-4 rounded-2xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-700 font-bold">
        💡 请先登录，购买后进度将绑定到您的账号
      </div>

      <!-- 卖点列表 -->
      <div class="mb-6 space-y-3">
        <div class="flex items-start gap-3 rounded-2xl bg-orange-50 px-4 py-3">
          <span class="text-xl">✨</span>
          <div>
            <div class="font-black text-gray-800">初级 201 字</div>
            <div class="text-sm text-gray-500">食物、动作、方位等生活常用字</div>
          </div>
        </div>
        <div class="flex items-start gap-3 rounded-2xl bg-blue-50 px-4 py-3">
          <span class="text-xl">📘</span>
          <div>
            <div class="font-black text-gray-800">中级 140 字</div>
            <div class="text-sm text-gray-500">时间、学习、情绪等进阶表达</div>
          </div>
        </div>
        <div class="flex items-start gap-3 rounded-2xl bg-purple-50 px-4 py-3">
          <span class="text-xl">🏆</span>
          <div>
            <div class="font-black text-gray-800">高级关卡持续更新</div>
            <div class="text-sm text-gray-500">更多内容陆续上线</div>
          </div>
        </div>
      </div>

      <!-- 立即解锁按钮 -->
      <button
        @click="handleUnlock"
        class="w-full py-4 rounded-2xl font-black text-white text-lg bg-gradient-to-r from-orange-400 to-pink-500 hover:scale-105 transition-all shadow-lg"
      >
        🚀 立即解锁
      </button>

      <!-- 底部小字 -->
      <p class="mt-3 text-center text-xs text-gray-400">支付后请刷新页面，进度自动同步</p>

      <!-- 关闭 -->
      <button @click="$emit('close')" class="mt-2 w-full text-center text-gray-300 text-sm hover:text-gray-400">
        暂不解锁
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  showLoginHint: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

function handleUnlock() {
  window.open('https://lemonsqueezy.com', '_blank')
}
</script>
