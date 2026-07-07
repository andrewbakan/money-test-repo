import { useLocale } from '../i18n/LocaleContext'

function fill(template, values) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, value),
    template,
  )
}

export default function MonthComparison({ comparison, formatMonthCompact }) {
  const { t } = useLocale()
  const { currentTotal, previousTotal, diff, previousMonth } = comparison

  if (currentTotal === 0 && previousTotal === 0) {
    return null
  }

  const previousLabel = formatMonthCompact(
    previousMonth.year,
    previousMonth.month,
  )

  let tone = 'neutral'
  let deltaLabel = '0%'
  let fillWidth = '100%'
  let showArrow = false
  let ariaLabel = fill(t.compareSameShort, { month: previousLabel })

  if (previousTotal === 0 && currentTotal > 0) {
    tone = 'up'
    deltaLabel = '—'
    fillWidth = '100%'
    ariaLabel = t.compareNoBaseline
  } else if (previousTotal > 0) {
    const ratio = currentTotal / previousTotal
    fillWidth = `${Math.min(ratio * 100, 100)}%`

    if (diff > 0) {
      tone = 'up'
      const percent = Math.round((diff / previousTotal) * 100)
      deltaLabel = `+${percent}%`
      fillWidth = '100%'
      showArrow = true
      ariaLabel = fill(t.compareUpAria, {
        percent: String(percent),
        month: previousLabel,
      })
    } else if (diff < 0) {
      tone = 'down'
      const percent = Math.round((Math.abs(diff) / previousTotal) * 100)
      deltaLabel = `−${percent}%`
      showArrow = true
      ariaLabel = fill(t.compareDownAria, {
        percent: String(percent),
        month: previousLabel,
      })
    }
  }

  return (
    <div
      className={`month-compare month-compare--${tone}`}
      aria-label={ariaLabel}
    >
      <span className="month-compare__label">{previousLabel}</span>

      <div className="month-compare__track">
        <div
          className="month-compare__fill"
          style={{ width: fillWidth }}
        />
      </div>

      <div className="month-compare__meta">
        {showArrow && (
          <span className="month-compare__arrow">
            {tone === 'up' ? '↑' : '↓'}
          </span>
        )}
        <span className="month-compare__value">{deltaLabel}</span>
      </div>
    </div>
  )
}
