/**
 * subscription.js
 * 订阅状态管理 — 从 Supabase user_profiles 读取
 */
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

// 免费可玩的关卡：starter = 49字
export const FREE_LEVELS = ['starter']

export const subscriptionStatus = ref('free') // 'free' | 'pro' | 'expired'
export const subscriptionLoading = ref(false)

/**
 * 从 Supabase 拉取当前用户的订阅状态
 * 登录后调用一次，或需要刷新时调用
 */
export async function fetchSubscriptionStatus() {
  subscriptionLoading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      subscriptionStatus.value = 'free'
      return 'free'
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('subscription_status, current_period_end')
      .eq('id', user.id)
      .single()

    if (error || !data) {
      subscriptionStatus.value = 'free'
      return 'free'
    }

    // 检查是否过期
    if (data.subscription_status === 'pro' && data.current_period_end) {
      const expiry = new Date(data.current_period_end)
      if (expiry < new Date()) {
        subscriptionStatus.value = 'expired'
        return 'expired'
      }
    }

    subscriptionStatus.value = data.subscription_status || 'free'
    return subscriptionStatus.value
  } catch (e) {
    subscriptionStatus.value = 'free'
    return 'free'
  } finally {
    subscriptionLoading.value = false
  }
}

/** 是否是 Pro 用户 */
export function isPro() {
  return subscriptionStatus.value === 'pro'
}

/**
 * 某个关卡是否对当前用户可用
 * @param {string} levelKey
 */
export function isLevelUnlocked(levelKey) {
  if (isPro()) return true
  return FREE_LEVELS.includes(levelKey)
}
