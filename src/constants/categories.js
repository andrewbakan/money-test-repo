export const OTHER_CATEGORY_ID = 'other'

export const SYSTEM_CATEGORY_IDS = [
  'food',
  'transport',
  'entertainment',
  'shopping',
  OTHER_CATEGORY_ID,
]

export const SYSTEM_CATEGORY_COLORS = {
  food: '#f59e0b',
  transport: '#3b82f6',
  entertainment: '#a855f7',
  shopping: '#ec4899',
  other: '#8494a7',
}

export const CUSTOM_CATEGORY_COLORS = [
  '#14b8a6',
  '#ef4444',
  '#84cc16',
  '#6366f1',
  '#f97316',
  '#06b6d4',
  '#d946ef',
  '#eab308',
]

/** @deprecated use categoryColor from CategoriesContext */
export const CATEGORY_COLORS = SYSTEM_CATEGORY_COLORS

export function isSystemCategory(id) {
  return SYSTEM_CATEGORY_IDS.includes(id)
}

export function pickCustomCategoryColor(usedColors) {
  const used = new Set(usedColors)
  const available = CUSTOM_CATEGORY_COLORS.find((color) => !used.has(color))
  return available ?? CUSTOM_CATEGORY_COLORS[Math.floor(Math.random() * CUSTOM_CATEGORY_COLORS.length)]
}
