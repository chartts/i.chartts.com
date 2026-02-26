export const DEFAULT_WIDTH = 800
export const DEFAULT_HEIGHT = 400
export const DEFAULT_FORMAT = 'svg' as const
export const DEFAULT_THEME = 'light'

export const MAX_WIDTH = 2000
export const MAX_HEIGHT = 2000
export const MIN_WIDTH = 100
export const MIN_HEIGHT = 100

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
