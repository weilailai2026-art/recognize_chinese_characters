<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-green-50 via-white to-emerald-50">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 text-center">
      <div class="text-6xl mb-4">🎉</div>
      <div class="text-sm font-black text-green-500 mb-2">购买成功回流页</div>
      <h1 class="text-3xl font-black text-gray-800 mb-3">欢迎来到认字乐园会员</h1>
      <p class="text-gray-500 mb-4">
        如果你是刚完成购买，建议现在先登录账号，后续会员权益、学习进度和多设备同步会更稳。
      </p>

      <div class="rounded-3xl bg-green-50 border border-green-100 p-4 text-left mb-4">
        <div class="font-black text-green-600 mb-2">你现在可以做的 3 件事</div>
        <ul class="text-sm text-gray-600 space-y-2">
          <li>1. 登录 / 注册账号，绑定学习进度</li>
          <li>2. 先完成 1 局学习，确认流程正常</li>
          <li>3. 到家长中心查看当前掌握情况</li>
        </ul>
      </div>

      <div class="flex flex-col gap-3">
        <button
          @click="goHome"
          class="btn-primary bg-gradient-to-r from-green-500 to-emerald-500 text-center"
        >
          开始使用
        </button>
        <button
          @click="goParent"
          class="btn-secondary bg-white text-gray-500 border-2 border-gray-200 text-center"
        >
          去家长中心
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { trackEvent } from '../utils/analytics'

const router = useRouter()

function goHome() {
  trackEvent('purchase_success_cta_click', { target: 'home' })
  router.push('/')
}

function goParent() {
  trackEvent('purchase_success_cta_click', { target: 'parent' })
  router.push('/parent')
}

onMounted(() => {
  trackEvent('purchase_success_view')
})
</script>
