<template>
  <div class="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        支付已取消
      </h1>
      
      <p class="text-gray-600 mb-8">
        您已取消支付，没有产生任何费用。<br>
        如有疑问，欢迎随时联系我们。
      </p>
      
      <div class="space-y-3">
        <router-link
          to="/pricing"
          class="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          重新选择套餐
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
</template>

<script setup>
// 支付取消页面，无需额外逻辑
</script>
