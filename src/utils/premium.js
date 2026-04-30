import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { currentUser } from './auth'

export const isPremium = ref(false)
export const premiumLoading = ref(false)

export const FREE_LEVELS = ['starter']

export function isLevelLocked(levelKey) {
  return !FREE_LEVELS.includes(levelKey) && !isPremium.value
}

export async function fetchPremiumStatus() {
  if (!currentUser.value) {
    isPremium.value = false
    return
  }
  premiumLoading.value = true
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('status, expires_at')
      .eq('user_id', currentUser.value.id)
      .maybeSingle()
    if (error) throw error
    if (data && data.status === 'active') {
      if (data.expires_at) {
        isPremium.value = new Date(data.expires_at) > new Date()
      } else {
        isPremium.value = true
      }
    } else {
      isPremium.value = false
    }
  } catch (e) {
    console.error('fetchPremiumStatus error', e)
    isPremium.value = false
  } finally {
    premiumLoading.value = false
  }
}
