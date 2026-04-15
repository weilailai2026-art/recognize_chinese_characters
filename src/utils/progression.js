const CHECKIN_KEY = 'hanzi_checkin'
const ACHIEVEMENTS_KEY = 'hanzi_achievements'
const APP_STATE_KEY = 'hanzi_app_state'

const achievementDefinitions = [
  { id: 'first_win', name: '开门红', icon: '🌟', description: '第一次完成一局游戏' },
  { id: 'perfect_round', name: '满星达人', icon: '🏆', description: '单局拿到满星' },
  { id: 'streak_3', name: '坚持三天', icon: '🔥', description: '连续打卡 3 天' },
  { id: 'streak_7', name: '坚持一周', icon: '💪', description: '连续打卡 7 天' },
  { id: 'master_10', name: '认字新星', icon: '📚', description: '掌握 10 个汉字' },
  { id: 'master_30', name: '认字能手', icon: '🎓', description: '掌握 30 个汉字' },
  { id: 'master_60', name: '识字达人', icon: '👑', description: '掌握 60 个汉字' },
  { id: 'review_clear', name: '复习小英雄', icon: '🛡️', description: '需复习和需强化汉字总数不超过 5 个' },
]

function safeRead(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback))
  } catch {
    return fallback
  }
}

function safeWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getTodayString() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Shanghai' })
}

export function getCheckinData() {
  return safeRead(CHECKIN_KEY, {
    streak: 0,
    totalDays: 0,
    lastCheckin: null,
    history: [],
  })
}

export function checkinToday() {
  const today = getTodayString()
  const data = getCheckinData()
  if (data.lastCheckin === today) {
    return { updated: false, data }
  }

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toLocaleDateString('sv-SE', { timeZone: 'Asia/Shanghai' })

  const streak = data.lastCheckin === yesterday ? data.streak + 1 : 1
  const next = {
    streak,
    totalDays: data.totalDays + 1,
    lastCheckin: today,
    history: [...data.history.filter(item => item !== today), today].slice(-30),
  }
  safeWrite(CHECKIN_KEY, next)
  return { updated: true, data: next }
}

export function getAchievementState() {
  return safeRead(ACHIEVEMENTS_KEY, {
    unlocked: [],
    recentUnlocked: null,
  })
}

export function unlockAchievements(ids = []) {
  const state = getAchievementState()
  const nextUnlocked = [...state.unlocked]
  let recentUnlocked = null

  ids.forEach(id => {
    if (!nextUnlocked.includes(id)) {
      nextUnlocked.push(id)
      recentUnlocked = id
    }
  })

  const next = {
    unlocked: nextUnlocked,
    recentUnlocked,
  }
  safeWrite(ACHIEVEMENTS_KEY, next)
  return next
}

export function consumeRecentAchievement() {
  const state = getAchievementState()
  if (!state.recentUnlocked) return null
  const achievement = achievementDefinitions.find(item => item.id === state.recentUnlocked) || null
  safeWrite(ACHIEVEMENTS_KEY, { ...state, recentUnlocked: null })
  return achievement
}

export function getAchievements() {
  const state = getAchievementState()
  return achievementDefinitions.map(item => ({
    ...item,
    unlocked: state.unlocked.includes(item.id),
  }))
}

export function getAppState() {
  return safeRead(APP_STATE_KEY, {
    selectedLevel: 'starter',
    onboardingDone: false,
  })
}

export function saveAppState(partial) {
  const next = {
    ...getAppState(),
    ...partial,
  }
  safeWrite(APP_STATE_KEY, next)
  return next
}

export function getLevelProgress(levels, characters, getCharStatus) {
  return levels.map(level => {
    const chars = characters.filter(item => item.level === level.key)
    const mastered = chars.filter(item => getCharStatus(item.char) === 'mastered').length
    const total = chars.length || 1
    const ratio = mastered / total
    const unlocked = !level.unlockRequirement
      ? true
      : (() => {
          const previousLevelChars = characters.filter(item => item.level === level.unlockRequirement.previous)
          const previousMastered = previousLevelChars.filter(item => getCharStatus(item.char) === 'mastered').length
          return previousLevelChars.length > 0 && previousMastered / previousLevelChars.length >= level.unlockRequirement.ratio
        })()

    return {
      ...level,
      total: chars.length,
      mastered,
      ratio,
      unlocked,
    }
  })
}

export function getUserLevelTitle(masteredCount) {
  if (masteredCount >= 120) return { name: '汉字大师', icon: '👑', next: null }
  if (masteredCount >= 60) return { name: '识字达人', icon: '🏆', next: 120 }
  if (masteredCount >= 30) return { name: '认字能手', icon: '⭐', next: 60 }
  if (masteredCount >= 10) return { name: '小小学徒', icon: '🌿', next: 30 }
  return { name: '识字萌新', icon: '🐣', next: 10 }
}

export function evaluateAchievements({ stars, masteredCount, reviewCount, strengthenCount, streak, playedGames }) {
  const unlockIds = []
  if (playedGames >= 1) unlockIds.push('first_win')
  if (stars >= 5) unlockIds.push('perfect_round')
  if (streak >= 3) unlockIds.push('streak_3')
  if (streak >= 7) unlockIds.push('streak_7')
  if (masteredCount >= 10) unlockIds.push('master_10')
  if (masteredCount >= 30) unlockIds.push('master_30')
  if (masteredCount >= 60) unlockIds.push('master_60')
  if ((reviewCount + strengthenCount) <= 5 && masteredCount >= 10) unlockIds.push('review_clear')
  return unlockAchievements(unlockIds)
}
