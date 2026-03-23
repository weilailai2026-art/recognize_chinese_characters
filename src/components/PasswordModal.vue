<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-3xl p-8 w-full max-w-xs shadow-2xl text-center animate-bounce-in">
      <div class="text-5xl mb-3">🔑</div>
      <h3 class="text-2xl font-black text-gray-700 mb-1">家长验证</h3>
      <p class="text-gray-400 text-sm mb-6">请输入4位数字密码</p>

      <!-- 密码格 -->
      <div class="flex gap-3 justify-center mb-4">
        <div
          v-for="i in 4" :key="i"
          class="w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all"
          :class="password.length >= i ? 'border-purple-400 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-200'"
        >
          {{ password.length >= i ? '●' : '○' }}
        </div>
      </div>

      <!-- 错误提示 -->
      <p v-if="error" class="text-red-400 text-sm mb-3 animate-shake">密码错误，请重试</p>

      <!-- 数字键盘 -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <button
          v-for="n in ['1','2','3','4','5','6','7','8','9','','0','⌫']" :key="n"
          @click="pressKey(n)"
          class="h-12 rounded-2xl text-xl font-bold transition-all active:scale-90"
          :class="n === '' ? 'invisible' : 'bg-gray-100 hover:bg-purple-100 hover:text-purple-600'"
        >{{ n }}</button>
      </div>

      <button @click="$emit('close')" class="text-gray-400 text-sm hover:text-gray-600">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getSettings } from '../utils/storage'

const emit = defineEmits(['close', 'success'])
const password = ref('')
const error = ref(false)

function pressKey(key) {
  if (key === '⌫') {
    password.value = password.value.slice(0, -1)
    error.value = false
    return
  }
  if (key === '' || password.value.length >= 4) return
  password.value += key

  if (password.value.length === 4) {
    const settings = getSettings()
    if (password.value === settings.password) {
      emit('success')
    } else {
      error.value = true
      setTimeout(() => {
        password.value = ''
        error.value = false
      }, 800)
    }
  }
}
</script>
