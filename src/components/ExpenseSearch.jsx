import { useMemo, useState } from 'react'
import { useCategories } from '../contexts/CategoriesContext'
import { useLocale } from '../i18n/LocaleContext'
import { filterExpensesByQuery } from '../utils/search'
import ExpenseSheet from './ExpenseSheet'

export default function ExpenseSearch({ expenses, onUpdate, onDelete }) {
  const { t, formatAmount, formatDay } = useLocale()
  const { categoryColor, categoryLabel } = useCategories()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)

  const results = useMemo(
    () => filterExpensesByQuery(expenses, query),
    [expenses, query],
  )

  const isSearching = query.trim().length > 0

  return (
    <section className="section">
      <h2 className="section__header">{t.search}</h2>
      <div className="group">
        <div className="search-bar">
          <input
            className="search-bar__input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.search}
            enterKeyHint="search"
            autoComplete="off"
          />
          {isSearching && (
            <button
              type="button"
              className="search-bar__clear"
              onClick={() => setQuery('')}
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
                        onClick={() => setEditing(expense)}
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
      </div>

      <ExpenseSheet
        expense={editing}
        onClose={() => setEditing(null)}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </section>
  )
}
