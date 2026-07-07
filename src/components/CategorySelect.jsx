import { useState } from 'react'
import { useCategories } from '../contexts/CategoriesContext'
import { useLocale } from '../i18n/LocaleContext'

const ADD_OPTION = '__add_category__'

export default function CategorySelect({ value, onChange, id }) {
  const { t } = useLocale()
  const { categories, categoryLabel, addCategory } = useCategories()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')

  const handleSelectChange = (event) => {
    const next = event.target.value

    if (next === ADD_OPTION) {
      setShowAddForm(true)
      setError('')
      return
    }

    setShowAddForm(false)
    onChange(next)
  }

  const handleAdd = () => {
    setError('')

    const result = addCategory(newName)
    if (!result.ok) {
      setError(
        result.error === 'duplicate' ? t.categoryErrorDuplicate : t.categoryErrorEmpty,
      )
      return
    }

    onChange(result.id)
    setNewName('')
    setShowAddForm(false)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setNewName('')
    setError('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="category-select">
      <select
        id={id}
        className="field__input"
        value={value}
        onChange={handleSelectChange}
      >
        {categories.map((item) => (
          <option key={item.id} value={item.id}>
            {categoryLabel(item.id)}
          </option>
        ))}
        <option disabled value="__separator__">
          ────────
        </option>
        <option value={ADD_OPTION}>{t.categoryAddNew}</option>
      </select>

      {showAddForm && (
        <div className="category-select__add">
          <input
            className="field__input category-select__input"
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value)
              setError('')
            }}
            onKeyDown={handleKeyDown}
            placeholder={t.categoryNamePlaceholder}
            maxLength={32}
            autoFocus
          />
          <div className="category-select__actions">
            <button type="button" className="button button--secondary" onClick={handleCancel}>
              {t.cancel}
            </button>
            <button type="button" className="button category-select__submit" onClick={handleAdd}>
              {t.categoryAdd}
            </button>
          </div>
          {error && <p className="form__error category-select__error">{error}</p>}
        </div>
      )}
    </div>
  )
}
