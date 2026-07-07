import { useMemo, useState } from 'react'
import { useCategories } from '../contexts/CategoriesContext'
import { useLocale } from '../i18n/LocaleContext'
import { isSameDay } from '../utils/date'
import { isNonEmpty, isValidAmount, parseAmount } from '../utils/form'
import CategorySelect from './CategorySelect'
import ExpenseSheet from './ExpenseSheet'
import { IconPlus } from './icons/Icons'

export default function AddExpense({ expenses, onAdd, onUpdate, onDelete }) {
  const { t, formatAmount } = useLocale()
  const { categories, categoryLabel } = useCategories()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0]?.id ?? 'food')
  const [saved, setSaved] = useState(false)
  const [editing, setEditing] = useState(null)

  const todayExpenses = useMemo(
    () => expenses.filter((item) => isSameDay(item.date)),
    [expenses],
  )

  const todayTotal = todayExpenses.reduce((sum, item) => sum + item.amount, 0)
  const canAdd = isNonEmpty(name) && isValidAmount(amount)

  const handleSubmit = (event) => {
    event.preventDefault()

    const parsedAmount = parseAmount(amount)
    const trimmedName = name.trim()

    if (!canAdd) {
      return
    }

    onAdd({
      name: trimmedName,
      amount: parsedAmount,
      category,
    })

    setName('')
    setAmount('')
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="add-screen">
      <section className="section section--featured">
        <h2 className="section__header section__header--featured">
          <span className="section__header-icon" aria-hidden="true">
            <IconPlus className="section__header-icon__svg" gradient />
          </span>
          <span className="gradient-text">{t.newExpense}</span>
        </h2>
        <div className="group group--featured">
          <form className="form form--inset" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field__label">{t.name}</span>
              <input
                className="field__input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                required
              />
            </label>

            <label className="field">
              <span className="field__label">{t.amount}</span>
              <input
                className="field__input"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </label>

            <label className="field">
              <span className="field__label">{t.category}</span>
              <CategorySelect value={category} onChange={setCategory} />
            </label>

            {saved && (
              <p className="form__success" role="status" aria-live="polite">
                {t.added}
              </p>
            )}

            <div className="form__actions">
              <button className="button" type="submit" disabled={!canAdd}>
                {t.add}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="section">
        <h2 className="section__header">{t.addedToday}</h2>
        <div className="group">
          {todayExpenses.length > 0 && (
            <div className="list-header">
              <span className="list-header__label">{t.todayTotal}</span>
              <span className="list-header__total">{formatAmount(todayTotal)}</span>
            </div>
          )}

          {todayExpenses.length === 0 ? (
            <p className="empty">{t.emptyToday}</p>
          ) : (
            <ul className="today-list">
              {todayExpenses.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="today-item today-item--interactive"
                    onClick={() => setEditing(item)}
                    aria-label={t.editExpenseAria.replace('{name}', item.name)}
                  >
                    <div className="today-item__info">
                      <span className="today-item__name">{item.name}</span>
                      <span className="today-item__category">
                        {categoryLabel(item.category)}
                      </span>
                    </div>
                    <div className="today-item__meta">
                      <span className="today-item__amount">
                        {formatAmount(item.amount)}
                      </span>
                      <span className="today-item__chevron" aria-hidden="true">
                        ›
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <ExpenseSheet
        expense={editing}
        onClose={() => setEditing(null)}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  )
}
