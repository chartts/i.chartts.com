# i.chartts.com

Stateless chart image service. URL in, image out.

Powered by [@chartts/core](https://github.com/chartts/chartts). Deployed as a Cloudflare Worker.

## Usage

```
GET https://i.chartts.com/:type.:format?params
```

### Path

| Part | Description | Example |
|------|-------------|---------|
| `type` | Chart type | `line`, `bar`, `pie`, `area`, `scatter`, etc. |
| `format` | Output format | `.svg` or `.png` |

### Query params

| Param | Description | Default | Example |
|-------|-------------|---------|---------|
| `d` | Data series (repeat for multiple) | required | `d=10,20,30` |
| `l` | Labels | auto | `l=Jan,Feb,Mar` |
| `n` | Series names | auto | `n=Sales,Costs` |
| `w` | Width (px) | `800` | `w=1200` |
| `h` | Height (px) | `400` | `h=600` |
| `title` | Chart title | none | `title=Revenue` |
| `theme` | Theme | `light` | `theme=dark` |
| `c` | Colors | auto | `c=red,blue` |
| `xl` | X-axis label | none | `xl=Months` |
| `yl` | Y-axis label | none | `yl=USD` |
| `grid` | Show grid | `true` | `grid=false` |
| `legend` | Show legend | auto | `legend=true` |
| `curve` | Line curve | `monotone` | `curve=step` |

## Examples

```
# Single series line chart
https://i.chartts.com/line.svg?d=10,20,30,40,25

# Bar chart with labels
https://i.chartts.com/bar.png?d=10,20,30&l=A,B,C

# Multiple series
https://i.chartts.com/line.svg?d=10,20,30&d=5,15,25&l=Q1,Q2,Q3&n=Sales,Costs

# Pie chart with colors
https://i.chartts.com/pie.svg?d=30,50,20&l=Red,Blue,Green&c=red,blue,green

# Dark theme, custom size
https://i.chartts.com/area.png?d=5,12,8,20,15&theme=dark&title=Growth&w=1200&h=600
```

## Supported chart types

`line` `bar` `stacked-bar` `horizontal-bar` `pie` `donut` `scatter` `sparkline` `area` `radar` `bubble` `gauge` `waterfall` `funnel` `heatmap` `boxplot` `histogram` `treemap` `polar` `radial-bar` `lollipop` `bullet` `dumbbell` `calendar` `combo` `step`

## Development

```bash
pnpm install
pnpm dev        # http://localhost:8787
pnpm deploy     # deploy to Cloudflare Workers
```
