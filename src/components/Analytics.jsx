import { useEffect, useMemo, useState } from 'react'
import { useCategories } from '../contexts/CategoriesContext'
import { useLocale } from '../i18n/LocaleContext'
import { getCategoryBreakdown, getCategoryExpenses, getMonthComparison } from '../utils/analytics'
import { shiftMonth } from '../utils/date'
import CategoryChart from './CategoryChart'
import ExpenseSearch from './ExpenseSearch'
import ExpenseSheet from './ExpenseSheet'
import MonthComparison from './MonthComparison'

export default function Analytics({ expenses, onUpdate, onDelete }) {
  const { t, formatAmount, formatMonth, formatMonthCompact, formatDay } = useLocale()
  const { categoryIds, categoryColor, categoryLabel } = useCategories()
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  })
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [editing, setEditing] = useState(null)

  const { total, items } = useMemo(
    () =>
      getCategoryBreakdown(
        expenses,
        selectedMonth.year,
        selectedMonth.month,
        categoryIds,
      ),
    [expenses, selectedMonth, categoryIds],
  )

  const monthComparison = useMemo(
    () =>
      getMonthComparison(
        expenses,
        selectedMonth.year,
        selectedMonth.month,
      ),
    [expenses, selectedMonth],
  )

  useEffect(() => {
    setExpandedCategory(null)
  }, [selectedMonth])

  const toggleCategory = (category) => {
    setExpandedCategory((current) =>
      current === category ? null : category,
    )
  }

  return (
    <div className="analytics">
      <ExpenseSearch
        expenses={expenses}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />

      <section className="section">
        <div className="group">
          <div className="month-nav">
          <button
            type="button"
            className="month-nav__btn"
            onClick={() =>
              setSelectedMonth((current) =>
                shiftMonth(current.year, current.month, -1),
              )
            }
            aria-label={t.prevMonth}
          >
            ‹
          </button>
          <span className="month-nav__label">
            {formatMonth(selectedMonth.year, selectedMonth.month)}
          </span>
          <button
            type="button"
            className="month-nav__btn"
            onClick={() =>
              setSelectedMonth((current) =>
                shiftMonth(current.year, current.month, 1),
              )
            }
            aria-label={t.nextMonth}
          >
            ›
          </button>
        </div>

          <div className="analytics__hero">
            <p className="analytics__label">{t.monthlyTotal}</p>
            <p className="analytics__total">{formatAmount(total)}</p>
          </div>

          {items.length === 0 ? (
            <p className="empty">{t.emptyMonth}</p>
          ) : (
            <CategoryChart
              key={`${selectedMonth.year}-${selectedMonth.month}`}
              items={items}
              total={total}
            />
          )}

          <MonthComparison
            comparison={monthComparison}
            formatMonthCompact={formatMonthCompact}
          />
        </div>
      </section>

      {items.length > 0 && (
        <section className="section">
          <h2 className="section__header">{t.details}</h2>
          <div className="group">
            <ul className="breakdown-list">
            {items.map((item) => {
              const isExpanded = expandedCategory === item.category
              const categoryExpenses = isExpanded
                ? getCategoryExpenses(
                    expenses,
                    selectedMonth.year,
                    selectedMonth.month,
                    item.category,
                    categoryIds,
                  )
                : []

              return (
                <li
                  key={item.category}
                  className={`breakdown-group${isExpanded ? ' breakdown-group--expanded' : ''}`}
                >
                  <button
                    type="button"
                    className="breakdown-item"
                    onClick={() => toggleCategory(item.category)}
                    aria-expanded={isExpanded}
                    aria-label={
                      isExpanded ? t.hideExpenses : t.showExpenses
                    }
                  >
                    <div className="breakdown-item__info">
                      <span
                        className="breakdown-item__dot"
                        style={{
                          background: categoryColor(item.category),
                        }}
                      />
                      <span className="breakdown-item__name">
                        {categoryLabel(item.category)}
                      </span>
                    </div>
                    <div className="breakdown-item__values">
                      <span className="breakdown-item__amount">
                        {formatAmount(item.amount)}
                      </span>
                      <span className="breakdown-item__percent">
                        {Math.round((item.amount / total) * 100)}%
                      </span>
                    </div>
                    <span className="breakdown-item__chevron">›</span>
                  </button>

                  {isExpanded && (
                    <ul className="category-expenses">
                      {categoryExpenses.length === 0 ? (
                        <li className="category-expenses__empty">
                          {t.emptyCategory}
                        </li>
                      ) : (
                        categoryExpenses.map((expense) => (
                          <li key={expense.id}>
                            <button
                              type="button"
                              className="category-expense category-expense--interactive"
                              onClick={() => setEditing(expense)}
                              aria-label={t.editExpenseAria.replace(
                                '{name}',
                                expense.name,
                              )}
                            >
                              <div className="category-expense__info">
                                <span className="category-expense__name">
                                  {expense.name}
                                </span>
                                <span className="category-expense__date">
                                  {formatDay(expense.date)}
                                </span>
                              </div>
                              <div className="category-expense__meta">
                                <span className="category-expense__amount">
                                  {formatAmount(expense.amount)}
                                </span>
                                <span
                                  className="category-expense__chevron"
                                  aria-hidden="true"
                                >
                                  ›
                                </span>
                              </div>
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </li>
              )
            })}
            </ul>
          </div>
        </section>
      )}
      <ExpenseSheet
        expense={editing}
        onClose={() => setEditing(null)}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  )
}
