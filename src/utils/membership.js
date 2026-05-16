/**
 * 会员权益管理工具
 * 用于检查和管理用户的会员状态
 */

import { supabase } from '../lib/supabase'

/**
 * 检查用户是否为会员
 * @returns {Promise<{active: boolean, expiresAt: string|null, plan: string|null}>}
 */
export async function checkMembership() {
  try {
    // 1. 从 localStorage 获取临时会员状态（用于演示）
    const localMembership = localStorage.getItem('membership')
    if (localMembership) {
      const data = JSON.parse(localMembership)
      const now = new Date()
      const expiresAt = new Date(data.expiresAt)
      
      if (expiresAt > now) {
        return {
          active: true,
          expiresAt: data.expiresAt,
          plan: data.plan || 'unknown',
        }
      }
    }
    
    // 2. 从 Supabase 获取真实会员状态
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { active: false, expiresAt: null, plan: null }
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('subscription_status, current_period_end')
      .eq('id', user.id)
      .single()
    
    if (error || !data) {
      return { active: false, expiresAt: null, plan: null }
    }
    
    // 检查是否过期
    if (data.subscription_status === 'pro' && data.current_period_end) {
      const expiry = new Date(data.current_period_end)
      if (expiry < new Date()) {
        return { active: false, expiresAt: null, plan: null }
      }
      
      return {
        active: true,
        expiresAt: data.current_period_end,
        plan: 'pro',
      }
    }
    
    return { active: false, expiresAt: null, plan: null }
    
  } catch (error) {
    console.error('Error checking membership:', error)
    return { active: false, expiresAt: null, plan: null }
  }
}

/**
 * 激活会员（支付成功后调用）
 * @param {Object} paymentData - PayPal 支付数据
 * @param {string} planId - 套餐 ID
 */
export async function activateMembership(paymentData, planId) {
  try {
    // 计算到期时间
    const duration = planId === 'yearly' ? 365 : 30
    const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
    
    // 1. 临时保存到 localStorage（用于演示）
    const membership = {
      active: true,
      expiresAt: expiresAt.toISOString(),
      plan: planId,
      orderId: paymentData.id,
    }
    localStorage.setItem('membership', JSON.stringify(membership))
    
    // 2. 保存到 Supabase
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // 更新用户订阅状态
      await supabase.from('user_profiles').upsert({
        id: user.id,
        subscription_status: 'pro',
        current_period_end: expiresAt.toISOString(),
      })
      
      // 记录支付记录（如果有 payment_records 表）
      try {
        await supabase.from('payment_records').insert({
          user_id: user.id,
          order_id: paymentData.id,
          amount: paymentData.purchase_units[0].amount.value,
          currency: paymentData.purchase_units[0].amount.currency_code,
          status: paymentData.status,
          plan_id: planId,
          paypal_data: paymentData,
        })
      } catch (e) {
        console.warn('Failed to save payment record:', e)
      }
    }
    
    return { success: true }
    
  } catch (error) {
    console.error('Error activating membership:', error)
    throw error
  }
}

/**
 * 获取剩余天数
 * @param {string} expiresAt - 到期时间
 * @returns {number} 剩余天数
 */
export function getRemainingDays(expiresAt) {
  if (!expiresAt) return 0
  
  const now = new Date()
  const expires = new Date(expiresAt)
  const diff = expires - now
  
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/**
 * 是否是 Pro 用户
 */
export async function isPro() {
  const membership = await checkMembership()
  return membership.active
}
