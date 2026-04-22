<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">

      <!-- 标题 -->
      <div class="text-center mb-6">
        <div class="text-4xl mb-2">{{ isLogin ? '👋' : '🌟' }}</div>
        <h2 class="text-2xl font-black text-gray-800">{{ isLogin ? '欢迎回来' : '创建账号' }}</h2>
        <p class="text-gray-400 text-sm mt-1">{{ isLogin ? '登录后进度云端同步' : '免费注册，进度永久保存' }}</p>
      </div>

      <!-- 表单 -->
      <div class="space-y-3">
        <input
          v-model="email"
          type="email"
          placeholder="邮箱地址"
          class="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-orange-400"
        />
        <input
          v-model="password"
          type="password"
          placeholder="密码（至少6位）"
          class="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-orange-400"
        />
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMsg" class="mt-3 text-red-500 text-sm text-center bg-red-50 rounded-xl py-2 px-3">
        {{ errorMsg }}
      </div>

      <!-- 成功提示 -->
      <div v-if="successMsg" class="mt-3 text-green-500 text-sm text-center bg-green-50 rounded-xl py-2 px-3">
        {{ successMsg }}
      </div>

      <!-- 按钮 -->
      <button
        @click="handleSubmit"
        :disabled="loading"
        class="mt-4 w-full py-3 rounded-2xl font-black text-white text-lg transition-all"
        :class="loading ? 'bg-gray-300' : 'bg-gradient-to-r from-orange-400 to-pink-500 hover:scale-105'"
      >
        {{ loading ? '处理中...' : (isLogin ? '登录' : '注册') }}
      </button>

      <!-- 切换登录/注册 -->
      <button @click="isLogin = !isLogin; errorMsg = ''" class="mt-3 w-full text-center text-gray-400 text-sm hover:text-gray-600">
        {{ isLogin ? '还没有账号？点击注册' : '已有账号？点击登录' }}
      </button>

      <!-- 关闭 -->
      <button @click="$emit('close')" class="mt-2 w-full text-center text-gray-300 text-sm hover:text-gray-400">
        暂不登录
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signIn, signUp } from '../utils/auth'
import { syncProgressFromCloud } from '../utils/storage'

const emit = defineEmits(['close', 'success'])

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function handleSubmit() {
  if (!email.value || !password.value) {
    errorMsg.value = '请填写邮箱和密码'
    return
  }
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    if (isLogin.value) {
      await signIn(email.value, password.value)
      await syncProgressFromCloud()
      emit('success')
      emit('close')
    } else {
      await signUp(email.value, password.value)
      successMsg.value = '注册成功！请检查邮箱验证链接，然后登录。'
      isLogin.value = true
    }
  } catch (e) {
    const msgMap = {
      'Invalid login credentials': '邮箱或密码错误',
      'Email not confirmed': '请先验证邮箱后再登录',
      'User already registered': '该邮箱已注册，请直接登录',
      'Password should be at least 6 characters': '密码至少需要6位',
    }
    errorMsg.value = msgMap[e.message] || e.message
  } finally {
    loading.value = false
  }
}
</script>
