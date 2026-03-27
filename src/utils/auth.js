import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

// 当前用户
export const currentUser = ref(null)
export const authLoading = ref(true)

// 初始化：监听登录状态
export async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  currentUser.value = session?.user ?? null
  authLoading.value = false

  supabase.auth.onAuthStateChange((_event, session) => {
    currentUser.value = session?.user ?? null
  })
}

// 邮箱注册
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

// 邮箱登录
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// 退出登录
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// 是否已登录
export const isLoggedIn = computed(() => !!currentUser.value)
