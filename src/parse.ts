import type { ParsedChart } from './types'
import { CHART_TYPES } from './charts'
import {
  DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_THEME,
  MAX_WIDTH, MAX_HEIGHT, MIN_WIDTH, MIN_HEIGHT, clamp,
} from './defaults'

/**
 * Parse URL path + query params into a chart configuration.
 *
 * Path:  /:type.:format  (e.g. /line.svg, /bar.png)
 * Query: d, l, n, w, h, title, theme, c, xl, yl, grid, legend, curve
 */
export function parseRequest(
  type: string,
  format: string,
  query: URLSearchParams,
): ParsedChart | { error: string } {
  // Resolve chart type
  const chartType = CHART_TYPES[type]
  if (!chartType) {
    return { error: `Unknown chart type: "${type}". Valid types: ${Object.keys(CHART_TYPES).join(', ')}` }
  }

  // Resolve format
  const fmt = format.toLowerCase()
  if (fmt !== 'svg' && fmt !== 'png') {
    return { error: `Unknown format: "${format}". Use .svg or .png` }
  }

  // Parse data series — repeated "d" params
  const rawSeries = query.getAll('d')
  if (rawSeries.length === 0) {
    return { error: 'Missing required parameter: d (data). Example: ?d=10,20,30' }
  }

  const series = rawSeries.map((raw, i) => {
    const values = raw.split(',').map(Number).filter(v => !isNaN(v))
    const names = query.get('n')?.split(',') ?? []
    const colors = query.get('c')?.split(',') ?? []
    return {
      name: names[i] ?? `Series ${i + 1}`,
      values,
      color: colors[i] || undefined,
    }
  })

  // Parse labels
  const labelsRaw = query.get('l')
  const labels = labelsRaw ? labelsRaw.split(',') : undefined

  // Parse dimensions
  const width = clamp(
    parseInt(query.get('w') ?? '', 10) || DEFAULT_WIDTH,
    MIN_WIDTH, MAX_WIDTH,
  )
  const height = clamp(
    parseInt(query.get('h') ?? '', 10) || DEFAULT_HEIGHT,
    MIN_HEIGHT, MAX_HEIGHT,
  )

  // Parse options
  const title = query.get('title') ?? undefined
  const theme = query.get('theme') ?? DEFAULT_THEME
  const xLabel = query.get('xl') ?? undefined
  const yLabel = query.get('yl') ?? undefined
  const curve = query.get('curve') as ParsedChart['options']['curve'] ?? undefined
  const gridRaw = query.get('grid')
  const grid = gridRaw === null ? undefined : gridRaw !== 'false'
  const legendRaw = query.get('legend')
  const legend = legendRaw === null
    ? (series.length > 1 ? true : false)
    : legendRaw === 'false' ? false
    : legendRaw === 'true' ? true
    : legendRaw as 'top' | 'bottom' | 'left' | 'right'
  const colorsRaw = query.get('c')
  const colors = colorsRaw ? colorsRaw.split(',') : undefined

  return {
    chartType,
    typeName: type,
    format: fmt,
    width,
    height,
    data: { labels, series },
    options: { title, theme, xLabel, yLabel, grid, legend, curve, colors },
  }
}
