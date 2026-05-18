<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <!-- 顶部导航 -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="text-2xl font-bold text-blue-600">
            认字乐园
          </router-link>
          <router-link to="/" class="text-gray-600 hover:text-gray-900">
            返回首页
          </router-link>
        </div>
      </div>
    </nav>

    <!-- 主内容 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          选择适合您的套餐
        </h1>
        <p class="text-xl text-gray-600">
          解锁全部 500+ 汉字，让孩子的识字之旅更精彩
        </p>
      </div>

      <!-- 套餐卡片 -->
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <!-- 月度套餐 -->
        <div class="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-blue-500 transition-all">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">月度会员</h3>
            <div class="flex items-baseline justify-center">
              <span class="text-5xl font-bold text-blue-600">$9.9</span>
              <span class="text-gray-600 ml-2">/月</span>
            </div>
          </div>
          
          <ul class="space-y-4 mb-8">
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-gray-700">解锁全部 500+ 汉字</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-gray-700">智能学习路径</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-gray-700">学习进度追踪</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-gray-700">30 天有效期</span>
            </li>
          </ul>
          
          <button
            @click="selectPlan('monthly')"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading && selectedPlan === 'monthly' ? '处理中...' : '立即购买' }}
          </button>
        </div>

        <!-- 年度套餐（推荐） -->
        <div class="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-500 relative hover:shadow-2xl transition-all">
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              最超值
            </span>
          </div>
          
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">年度会员</h3>
            <div class="flex items-baseline justify-center">
              <span class="text-5xl font-bold text-blue-600">$19.9</span>
              <span class="text-gray-600 ml-2">/年</span>
            </div>
            <p class="text-green-600 font-semibold mt-2">
              相当于每月 $1.66，节省 83%
            </p>
          </div>
          
          <ul class="space-y-4 mb-8">
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-gray-700">解锁全部 500+ 汉字</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-gray-700">智能学习路径</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-gray-700">学习进度追踪</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-gray-700 font-semibold">365 天有效期</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-gray-700 font-semibold">优先客服支持</span>
            </li>
          </ul>
          
          <button
            @click="selectPlan('yearly')"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading && selectedPlan === 'yearly' ? '处理中...' : '立即购买' }}
          </button>
        </div>
      </div>

      <!-- 常见问题 -->
      <div class="mt-16 max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">
          常见问题
        </h2>
        
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-semibold text-lg text-gray-900 mb-2">
              支付安全吗？
            </h3>
            <p class="text-gray-600">
              我们使用 PayPal 作为支付平台，您的支付信息完全由 PayPal 处理，我们不会存储任何支付信息。
            </p>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-semibold text-lg text-gray-900 mb-2">
              可以退款吗？
            </h3>
            <p class="text-gray-600">
              如果您在购买后 7 天内对产品不满意，可以联系我们申请全额退款。
            </p>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-semibold text-lg text-gray-900 mb-2">
              会自动续费吗？
            </h3>
            <p class="text-gray-600">
              不会。我们采用一次性付费模式，到期后需要手动续费，不会自动扣款。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const selectedPlan = ref(null)

// API 基础 URL（根据环境切换）
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://recognize-chinese-characters-api.weilailai2026.workers.dev'
  : 'http://localhost:8787'

// 选择套餐并创建订单
async function selectPlan(planId) {
  if (loading.value) return
  
  loading.value = true
  selectedPlan.value = planId
  
  try {
    // 调用后端 API 创建订单
    const response = await fetch(`${API_BASE_URL}/api/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId }),
    })
    
    if (!response.ok) {
      throw new Error('创建订单失败')
    }
    
    const order = await response.json()
    
    // 跳转到 PayPal 支付页面
    const approveUrl = order.links.find(link => link.rel === 'approve')?.href
    if (approveUrl) {
      window.location.href = approveUrl
    } else {
      throw new Error('无法获取支付链接')
    }
    
  } catch (error) {
    console.error('Error:', error)
    alert('创建订单失败，请稍后重试')
    loading.value = false
    selectedPlan.value = null
  }
}
</script>
