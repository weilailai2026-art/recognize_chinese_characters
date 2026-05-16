<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- 加载中 -->
      <div v-if="loading" class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p class="text-gray-600">正在验证支付...</p>
      </div>

      <!-- 成功 -->
      <div v-else-if="success" class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          支付成功！
        </h1>
        
        <p class="text-gray-600 mb-8">
          感谢您的购买，会员权益已激活。<br>
          现在可以开始学习全部 500+ 汉字了！
        </p>
        
        <div class="space-y-3">
          <router-link
            to="/game"
            class="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            开始学习
          </router-link>
          
          <router-link
            to="/parent"
            class="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            查看学习进度
          </router-link>
        </div>
      </div>

      <!-- 失败 -->
      <div v-else class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          支付验证失败
        </h1>
        
        <p class="text-gray-600 mb-8">
          {{ errorMessage || '无法验证您的支付，请联系客服。' }}
        </p>
        
        <div class="space-y-3">
          <router-link
            to="/pricing"
            class="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            重新购买
          </router-link>
          
          <router-link
            to="/"
            class="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { activateMembership } from '../utils/membership'

const route = useRoute()
const loading = ref(true)
const success = ref(false)
const errorMessage = ref('')

// API 基础 URL
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://recognize-chinese-characters-api.your-subdomain.workers.dev'
  : 'http://localhost:8787'

onMounted(async () => {
  // 从 URL 获取 token（PayPal 返回的订单 ID）
  const token = route.query.token
  
  if (!token) {
    loading.value = false
    errorMessage.value = '缺少订单信息'
    return
  }
  
  try {
    // 调用后端 API 验证并捕获订单
    const response = await fetch(`${API_BASE_URL}/api/orders/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId: token }),
    })
    
    if (!response.ok) {
      throw new Error('支付验证失败')
    }
    
    const result = await response.json()
    
    // 检查支付状态
    if (result.status === 'COMPLETED') {
      success.value = true
      
      // 激活会员权益
      const planId = result.purchase_units[0].description.includes('年度') ? 'yearly' : 'monthly'
      await activateMembership(result, planId)
    } else {
      throw new Error('支付未完成')
    }
    
  } catch (error) {
    console.error('Error:', error)
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
})
</script>
