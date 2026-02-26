import { renderToString } from '@chartts/core'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
// @ts-expect-error — wasm asset import
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm'
import type { ParsedChart } from './types'

const FONT_URL = 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff2'
const FONT_BOLD_URL = 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.woff2'

let wasmReady = false
let fontData: Uint8Array | null = null
let fontBoldData: Uint8Array | null = null

async function ensureWasm() {
  if (!wasmReady) {
    await initWasm(resvgWasm)
    wasmReady = true
  }
}

async function ensureFonts() {
  if (fontData && fontBoldData) return

  const cache = await caches.open('fonts')

  // Regular
  let res = await cache.match(FONT_URL)
  if (!res) {
    res = await fetch(FONT_URL)
    await cache.put(FONT_URL, res.clone())
  }
  fontData = new Uint8Array(await res.arrayBuffer())

  // Bold/semibold
  let resBold = await cache.match(FONT_BOLD_URL)
  if (!resBold) {
    resBold = await fetch(FONT_BOLD_URL)
    await cache.put(FONT_BOLD_URL, resBold.clone())
  }
  fontBoldData = new Uint8Array(await resBold.arrayBuffer())
}

/**
 * Strip CSS var() from font-family so resvg can resolve fonts.
 * e.g. `var(--font-sans, -apple-system, ...)` → `Inter, sans-serif`
 */
function resolveFonts(svg: string): string {
  return svg.replace(/font-family="[^"]*"/g, 'font-family="Inter, sans-serif"')
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
  await Promise.all([ensureWasm(), ensureFonts()])
  const svg = resolveFonts(renderSVG(chart))
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: chart.width },
    font: {
      fontBuffers: [fontData!, fontBoldData!],
      defaultFontFamily: 'Inter',
    },
  })
  const rendered = resvg.render()
  return rendered.asPng()
}
