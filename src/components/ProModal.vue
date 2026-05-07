<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      @click.self="$emit('close')"
    >
      <div class="w-full max-w-md bg-white rounded-t-3xl p-6 pb-10 animate-slide-up shadow-2xl">
        <!-- 标题 -->
        <div class="text-center mb-6">
          <div class="text-5xl mb-3">🔓</div>
          <h2 class="text-2xl font-black text-gray-800">解锁全部关卡</h2>
          <p class="text-sm text-gray-400 mt-1">初级 / 中级 + 后续持续更新</p>
        </div>

        <!-- 对比 -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="bg-gray-50 rounded-2xl p-4 text-center">
            <div class="text-sm font-bold text-gray-400 mb-2">免费版</div>
            <div class="text-3xl mb-1">🌱</div>
            <div class="text-sm text-gray-600 font-bold">启蒙关卡</div>
            <div class="text-xs text-gray-400 mt-1">49 个汉字</div>
          </div>
          <div class="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-4 text-center text-white">
            <div class="text-sm font-black mb-2">Pro 会员 ✨</div>
            <div class="text-3xl mb-1">🚀</div>
            <div class="text-sm font-bold">全部关卡</div>
            <div class="text-xs opacity-90 mt-1">255 个汉字</div>
          </div>
        </div>

        <!-- 权益列表 -->
        <ul class="space-y-2 mb-6">
          <li class="flex items-center gap-2 text-sm text-gray-600">
            <span class="text-green-500 font-bold">✓</span> 解锁初级 + 中级全部关卡
          </li>
          <li class="flex items-center gap-2 text-sm text-gray-600">
            <span class="text-green-500 font-bold">✓</span> 后续新增汉字自动解锁
          </li>
          <li class="flex items-center gap-2 text-sm text-gray-600">
            <span class="text-green-500 font-bold">✓</span> 云端进度多设备同步
          </li>
        </ul>

        <!-- 价格 + 按钮 -->
        <div class="text-center mb-4">
          <span class="text-4xl font-black text-orange-500">$9.90</span>
          <span class="text-gray-400 text-sm ml-1">/ 年</span>
        </div>

        <button
          @click="handleCheckout"
          class="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-black py-4 rounded-2xl text-lg hover:scale-[1.01] transition-all"
        >
          立即开通 Pro
        </button>

        <button
          @click="$emit('close')"
          class="w-full mt-3 text-sm text-gray-400 py-2"
        >
          先继续免费体验
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { appConfig } from '../config'

defineProps({ show: Boolean })
defineEmits(['close'])

function handleCheckout() {
  const url = appConfig.pricing.checkoutUrl
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
</script>

<style scoped>
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
