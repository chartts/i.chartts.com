/** Always return a valid SVG image, never JSON errors. */

function errorSVG(message: string, width = 800, height = 400): string {
  const escaped = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#fafafa" rx="8"/>
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="#e5e5e5" stroke-width="1" stroke-dasharray="6 4" rx="6"/>
  <text x="${width / 2}" y="${height / 2 - 12}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#a3a3a3">chartts</text>
  <text x="${width / 2}" y="${height / 2 + 16}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#d4d4d4">${escaped}</text>
</svg>`
}

export function noDataError(): string {
  return errorSVG('No data provided — add ?d=10,20,30')
}

export function unknownTypeError(type: string, validTypes: string[]): string {
  const suggestion = validTypes.slice(0, 8).join(', ')
  return errorSVG(`Unknown type: "${type}". Try: ${suggestion}...`)
}

export function renderError(message: string): string {
  return errorSVG(`Render error: ${message}`)
}
