import { useMemo } from 'react'
import { useCategories } from '../contexts/CategoriesContext'
import { useLocale } from '../i18n/LocaleContext'
import { filterExpensesByQuery } from '../utils/search'
import { IconSearch } from './icons/Icons'

export default function ExpenseSearch({
  expenses,
  year,
  month,
  query,
  onQueryChange,
  onSelect,
}) {
  const { t, formatAmount, formatDay } = useLocale()
  const { categoryColor, categoryLabel } = useCategories()

  const results = useMemo(
    () => filterExpensesByQuery(expenses, query, { year, month }),
    [expenses, query, year, month],
  )

  const isSearching = query.trim().length > 0

  return (
    <>
      <div className="search-field">
        <IconSearch className="search-field__icon" />
        <input
          className="field__input search-field__input"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.search}
          enterKeyHint="search"
          autoComplete="off"
        />
        {isSearching && (
          <button
            type="button"
            className="search-field__clear"
            onClick={() => onQueryChange('')}
            aria-label={t.searchClear}
          >
            ×
          </button>
        )}
      </div>

      {isSearching && (
        <div className="search-results">
          {results.length === 0 ? (
            <p className="empty">{t.emptySearch}</p>
          ) : (
            <>
              <p className="search-results__count">
                {t.searchResultsCount.replace('{count}', String(results.length))}
              </p>
              <ul className="search-results__list">
                {results.map((expense) => (
                  <li key={expense.id}>
                    <button
                      type="button"
                      className="category-expense category-expense--interactive"
                      onClick={() => onSelect(expense)}
                      aria-label={t.editExpenseAria.replace('{name}', expense.name)}
                    >
                      <div className="category-expense__info">
                        <span className="category-expense__name">{expense.name}</span>
                        <span className="search-results__meta-line">
                          <span>{formatDay(expense.date)}</span>
                          <span
                            className="search-results__dot"
                            style={{ background: categoryColor(expense.category) }}
                            aria-hidden="true"
                          />
                          <span>{categoryLabel(expense.category)}</span>
                        </span>
                      </div>
                      <div className="category-expense__meta">
                        <span className="category-expense__amount">
                          {formatAmount(expense.amount)}
                        </span>
                        <span className="category-expense__chevron" aria-hidden="true">
                          ›
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </>
  )
}
