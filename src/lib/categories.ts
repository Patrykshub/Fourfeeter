export const NAV_CATEGORIES = ['HOME', 'MEMORIES', 'GALLERY', 'INFO'] as const

export type Category = (typeof NAV_CATEGORIES)[number]
