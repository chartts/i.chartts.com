import { renderToString } from '@chartts/core'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
// @ts-expect-error — wasm asset import
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm'
import type { ParsedChart } from './types'

let wasmReady = false

async function ensureWasm() {
  if (!wasmReady) {
    await initWasm(resvgWasm)
    wasmReady = true
  }
}

/** Render a parsed chart config to an SVG string */
export function renderSVG(chart: ParsedChart): string {
  return renderToString(chart.chartType, {
    labels: chart.data.labels,
    series: chart.data.series,
  }, {
    width: chart.width,
    height: chart.height,
    theme: chart.options.theme,
    xLabel: chart.options.xLabel,
    yLabel: chart.options.yLabel,
    xGrid: chart.options.grid,
    yGrid: chart.options.grid,
    legend: chart.options.legend,
    curve: chart.options.curve,
    colors: chart.options.colors,
    ariaLabel: chart.options.title ?? `${chart.typeName} chart`,
  })
}

/** Render a parsed chart config to a PNG buffer */
export async function renderPNG(chart: ParsedChart): Promise<Uint8Array> {
  await ensureWasm()
  const svg = renderSVG(chart)
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: chart.width },
  })
  const rendered = resvg.render()
  return rendered.asPng()
}
