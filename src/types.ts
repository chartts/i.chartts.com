import type { ChartTypePlugin } from '@chartts/core'

export interface ParsedChart {
  chartType: ChartTypePlugin
  typeName: string
  format: 'svg' | 'png'
  width: number
  height: number
  data: {
    labels?: string[]
    series: { name: string; values: number[]; color?: string }[]
  }
  options: {
    title?: string
    theme?: string
    xLabel?: string
    yLabel?: string
    grid?: boolean
    legend?: boolean | 'top' | 'bottom' | 'left' | 'right'
    curve?: 'linear' | 'monotone' | 'step'
    colors?: string[]
  }
}
