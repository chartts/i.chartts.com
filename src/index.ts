import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { parseRequest } from './parse'
import { renderSVG, renderPNG } from './render'
import { noDataError, renderError } from './errors'
import { VALID_TYPES } from './charts'

const app = new Hono()

// CORS — embeddable anywhere
app.use('*', cors())

// Health check
app.get('/health', (c) => c.json({ ok: true }))

// Landing page
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>i.chartts.com</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; max-width: 640px; margin: 60px auto; padding: 0 20px; color: #333; line-height: 1.6; }
  h1 { font-size: 1.4rem; }
  code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  pre { background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto; }
  a { color: #2563eb; }
  img { max-width: 100%; border-radius: 8px; margin: 8px 0; }
</style>
</head><body>
<h1>i.chartts.com</h1>
<p>Stateless chart image service. URL in, image out.</p>

<pre>GET /:type.:format?d=...&amp;d=...&amp;l=...&amp;w=...&amp;h=...</pre>

<p><strong>Examples:</strong></p>
<pre><code>/line.svg?d=10,20,30,40,25
/bar.png?d=10,20,30&amp;l=A,B,C
/line.svg?d=10,20,30&amp;d=5,15,25&amp;n=Sales,Costs&amp;l=Q1,Q2,Q3
/pie.svg?d=30,50,20&amp;l=Red,Blue,Green
/area.png?d=5,12,8,20,15&amp;theme=dark&amp;title=Growth</code></pre>

<p><strong>Params:</strong> <code>d</code> data (repeat for multi-series) · <code>l</code> labels · <code>n</code> series names · <code>w</code> width · <code>h</code> height · <code>title</code> · <code>theme</code> (light/dark) · <code>c</code> colors · <code>xl</code> x-label · <code>yl</code> y-label · <code>grid</code> · <code>legend</code> · <code>curve</code> (linear/monotone/step)</p>

<p><strong>Types:</strong> ${VALID_TYPES.join(', ')}</p>

<p><a href="https://chartts.com">chartts.com</a></p>
</body></html>`)
})

// Main chart endpoint: /:type.:format
app.get('/:typeAndFormat', async (c) => {
  const raw = c.req.param('typeAndFormat')
  const dotIndex = raw.lastIndexOf('.')
  if (dotIndex === -1) {
    return c.body(noDataError(), 400, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache',
    })
  }

  const type = raw.slice(0, dotIndex)
  const format = raw.slice(dotIndex + 1)
  const query = new URL(c.req.url).searchParams

  const parsed = parseRequest(type, format, query)

  if ('error' in parsed) {
    return c.body(renderError(parsed.error), 400, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache',
    })
  }

  try {
    if (parsed.format === 'png') {
      const png = await renderPNG(parsed)
      return new Response(png, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const svg = renderSVG(parsed)
    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown render error'
    return c.body(renderError(message), 500, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache',
    })
  }
})

export default app
