import { useEffect, useState } from 'react'
import { useCategories } from '../contexts/CategoriesContext'
import { useLocale } from '../i18n/LocaleContext'
import CategorySelect from './CategorySelect'

export default function ExpenseSheet({ expense, onClose, onUpdate, onDelete }) {
  const { t } = useLocale()
  const { categories } = useCategories()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0]?.id ?? 'food')
  const [date, setDate] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!expense) {
      return
    }

    setName(expense.name)
    setAmount(String(expense.amount))
    setCategory(expense.category)
    setDate(expense.date)
    setConfirmDelete(false)
  }, [expense])

  useEffect(() => {
    if (!expense) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [expense, onClose])

  if (!expense) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const parsedAmount = parseFloat(amount.replace(',', '.'))
    const trimmedName = name.trim()

    if (!trimmedName || Number.isNaN(parsedAmount) || parsedAmount <= 0 || !date) {
      return
    }

    onUpdate(expense.id, {
      name: trimmedName,
      amount: parsedAmount,
      category,
      date,
    })
    onClose()
  }

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    onDelete(expense.id)
    onClose()
  }

  return (
    <div className="expense-sheet" role="dialog" aria-modal="true" aria-labelledby="expense-sheet-title">
      <button
        type="button"
        className="expense-sheet__backdrop"
        onClick={onClose}
        aria-label={t.cancel}
      />
      <div className="expense-sheet__panel">
        <div className="expense-sheet__header">
          <h2 id="expense-sheet-title" className="expense-sheet__title">
            {t.editExpense}
          </h2>
          <button type="button" className="expense-sheet__close" onClick={onClose}>
            {t.cancel}
          </button>
        </div>

        <form className="form form--inset expense-sheet__form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">{t.name}</span>
            <input
              className="field__input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              required
            />
          </label>

          <label className="field">
            <span className="field__label">{t.category}</span>
            <CategorySelect value={category} onChange={setCategory} />
          </label>

          <label className="field">
            <span className="field__label">{t.date}</span>
            <input
              className="field__input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <div className="expense-sheet__actions">
            <button className="button" type="submit">
              {t.saveChanges}
            </button>
          </div>
        </form>

        <div className="expense-sheet__delete">
          {confirmDelete ? (
            <div className="expense-sheet__confirm">
              <p className="expense-sheet__confirm-text">{t.deleteConfirm}</p>
              <div className="expense-sheet__confirm-actions">
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => setConfirmDelete(false)}
                >
                  {t.cancel}
                </button>
                <button type="button" className="button button--danger" onClick={handleDelete}>
                  {t.deleteExpense}
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="button button--danger" onClick={handleDelete}>
              {t.deleteExpense}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
