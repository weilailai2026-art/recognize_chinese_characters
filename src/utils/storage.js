import { supabase } from '../lib/supabase'
import { currentUser } from './auth'

const STORAGE_KEY = 'hanzi_progress'
const SETTINGS_KEY = 'hanzi_settings'
const SESSION_KEY = 'hanzi_sessions'

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function getGameStats() {
  try {
    return JSON.parse(localStorage.getItem(GAME_STATS_KEY) || '{"playedGames":0}')
  } catch {
    return { playedGames: 0 }
  }
}

export function recordGamePlayed() {
  const stats = getGameStats()
  const next = { ...stats, playedGames: (stats.playedGames || 0) + 1 }
  localStorage.setItem(GAME_STATS_KEY, JSON.stringify(next))
  return next
}

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

export async function recordAnswer(char, correct) {
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

export function getCharStatus(char) {
  const progress = getProgress()
  const data = progress[char]
  if (!data) return 'unlearned' // 灰：未学
  if (data.correct >= 2) return 'mastered' // 绿：已掌握
  if (data.correct === 1) return 'review' // 黄：需复习
  if (data.wrong >= 2) return 'strengthen' // 红：需强化
  return 'review'
}

export function getCounts(characters) {
  const counts = { mastered: 0, review: 0, strengthen: 0, unlearned: 0 }
  characters.forEach(ch => {
    counts[getCharStatus(ch.char)]++
  })
  return counts
}

export function getStatusColor(status) {
  const map = {
    unlearned: 'bg-gray-200 text-gray-500',
    strengthen: 'bg-red-200 text-red-700',
    review: 'bg-yellow-200 text-yellow-700',
    mastered: 'bg-green-200 text-green-700',
  }
  return map[status] || map.unlearned
}

export function saveLearningSession(session) {
  try {
    const sessions = JSON.parse(localStorage.getItem(SESSION_KEY) || '[]')
    sessions.unshift({
      ...session,
      time: session.time || Date.now(),
    })
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessions.slice(0, 30)))
  } catch {
    localStorage.setItem(SESSION_KEY, JSON.stringify([{ ...session, time: Date.now() }]))
  }
}

export function getLearningSessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || '[]')
  } catch {
    return []
  }
}

// 重置所有进度
export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(SESSION_KEY)
}

// ==================== 设置管理 ====================

export function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{"password":"1234","sound":true}')
  } catch {
    return { password: '1234', sound: true }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function isSoundEnabled() {
  return getSettings().sound !== false
}
