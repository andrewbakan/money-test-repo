import { CATEGORY_COLORS } from '../constants/categories'
import { useCategories } from '../contexts/CategoriesContext'
import { buildChartSegments } from '../utils/analytics'

const SIZE = 216
const CENTER = SIZE / 2
const OUTER = 98
const INNER = 60

function polarPoint(r, degrees) {
  const rad = ((degrees - 90) * Math.PI) / 180
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  }
}

function donutSlicePath(startDeg, endDeg) {
  const sweep = endDeg - startDeg
  if (sweep <= 0) {
    return ''
  }

  const largeArc = sweep > 180 ? 1 : 0
  const outerStart = polarPoint(OUTER, startDeg)
  const outerEnd = polarPoint(OUTER, endDeg)
  const innerEnd = polarPoint(INNER, endDeg)
  const innerStart = polarPoint(INNER, startDeg)

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER} ${OUTER} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER} ${INNER} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

export default function CategoryChart({ items, total }) {
  const { categoryColor } = useCategories()
  const segments = buildChartSegments(items, total)

  if (segments.length === 0) {
    return null
  }

  const gap = segments.length > 1 ? 1.2 : 0
  const gapHalf = gap / 2

  return (
    <div className="chart">
      <div className="chart__aura" aria-hidden="true" />
      <svg
        className="chart__svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-hidden="true"
      >
        {segments.map((segment) => {
          const startDeg = (segment.start / 100) * 360 + gapHalf
          const endDeg = (segment.end / 100) * 360 - gapHalf

          return (
            <path
              key={segment.category}
              d={donutSlicePath(startDeg, endDeg)}
              fill={categoryColor(segment.category) ?? CATEGORY_COLORS.other}
            />
          )
        })}
      </svg>
    </div>
  )
}
