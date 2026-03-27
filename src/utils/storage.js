import { supabase } from '../lib/supabase'
import { currentUser } from './auth'

const STORAGE_KEY = 'hanzi_progress'
const SETTINGS_KEY = 'hanzi_settings'

// ==================== 进度管理（本地 + 云端同步）====================

// 获取所有进度（优先本地缓存，快速响应）
export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

// 从云端同步进度到本地
export async function syncProgressFromCloud() {
  if (!currentUser.value) return
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('char, correct, wrong, history, updated_at')
      .eq('user_id', currentUser.value.id)
    if (error) throw error

    const progress = {}
    data.forEach(row => {
      progress[row.char] = {
        correct: row.correct,
        wrong: row.wrong,
        history: row.history || [],
      }
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    return progress
  } catch (e) {
    console.error('同步失败', e)
  }
}

// 记录答题结果（本地立即更新，云端异步同步）
export async function recordAnswer(char, correct) {
  // 1. 本地立即更新
  const progress = getProgress()
  if (!progress[char]) {
    progress[char] = { correct: 0, wrong: 0, history: [] }
  }
  if (correct) {
    progress[char].correct++
  } else {
    progress[char].wrong++
  }
  progress[char].history.push({ time: Date.now(), correct })
  if (progress[char].history.length > 20) {
    progress[char].history = progress[char].history.slice(-20)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))

  // 2. 云端异步同步（已登录才同步）
  if (currentUser.value) {
    supabase.from('user_progress').upsert({
      user_id: currentUser.value.id,
      char,
      correct: progress[char].correct,
      wrong: progress[char].wrong,
      history: progress[char].history,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,char' }).then(({ error }) => {
      if (error) console.error('云端同步失败', error)
    })
  }
}

// 获取单字状态
export function getCharStatus(char) {
  const progress = getProgress()
  const data = progress[char]
  if (!data) return 'unlearned'
  if (data.correct >= 2) return 'mastered'
  if (data.correct === 1) return 'review'
  if (data.wrong >= 2) return 'strengthen'
  return 'review'
}

// 获取状态颜色class
export function getStatusColor(status) {
  const map = {
    unlearned: 'bg-gray-200 text-gray-500',
    strengthen: 'bg-red-200 text-red-700',
    review: 'bg-yellow-200 text-yellow-700',
    mastered: 'bg-green-200 text-green-700',
  }
  return map[status] || map.unlearned
}

// 重置所有进度
export async function resetProgress() {
  localStorage.removeItem(STORAGE_KEY)
  if (currentUser.value) {
    await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', currentUser.value.id)
  }
}

// ==================== 设置管理 ====================

export function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{"password":"1234"}')
  } catch {
    return { password: '1234' }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
