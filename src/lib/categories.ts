export const NAV_CATEGORIES = ['HOME', 'MEMORIES', 'INFO'] as const

export type Category = (typeof NAV_CATEGORIES)[number]
