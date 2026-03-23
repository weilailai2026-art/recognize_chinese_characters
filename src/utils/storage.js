const STORAGE_KEY = 'hanzi_progress'
const SETTINGS_KEY = 'hanzi_settings'

// 获取所有进度
export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

// 记录答题结果
export function recordAnswer(char, correct) {
  const progress = getProgress()
  if (!progress[char]) {
    progress[char] = { correct: 0, wrong: 0, history: [] }
  }
  if (correct) {
    progress[char].correct++
  } else {
    progress[char].wrong++
  }
  progress[char].history.push({
    time: Date.now(),
    correct,
  })
  // 只保留最近20条历史
  if (progress[char].history.length > 20) {
    progress[char].history = progress[char].history.slice(-20)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

// 获取单字状态
export function getCharStatus(char) {
  const progress = getProgress()
  const data = progress[char]
  if (!data) return 'unlearned' // 灰：未学
  if (data.correct >= 2) return 'mastered'  // 绿：已掌握
  if (data.correct === 1) return 'review'   // 黄：需复习
  if (data.wrong >= 2) return 'strengthen'  // 红：需强化
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
export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY)
}

// 设置管理
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
