import { useState } from 'react'
import { useCategories } from '../contexts/CategoriesContext'
import { useLocale } from '../i18n/LocaleContext'
import { isNonEmpty } from '../utils/form'

export default function CategorySettings() {
  const { t } = useLocale()
  const { categories, categoryLabel, addCategory, deleteCategory } = useCategories()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const canAdd = isNonEmpty(name)

  const handleAdd = (event) => {
    event.preventDefault()
    setError('')

    if (!canAdd) {
      return
    }

    const result = addCategory(name)
    if (!result.ok) {
      setError(result.error === 'duplicate' ? t.categoryErrorDuplicate : t.categoryErrorEmpty)
      return
    }

    setName('')
  }

  const handleDelete = (id) => {
    if (deletingId !== id) {
      setDeletingId(id)
      return
    }

    deleteCategory(id)
    setDeletingId(null)
  }

  return (
    <div className="category-settings">
      <form className="category-settings__add" onSubmit={handleAdd}>
        <input
          className="field__input category-settings__input"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
          placeholder={t.categoryNamePlaceholder}
          maxLength={32}
        />
        <button
          className="button category-settings__add-btn"
          type="submit"
          disabled={!canAdd}
        >
          {t.categoryAdd}
        </button>
      </form>

      {error && <p className="form__error category-settings__error">{error}</p>}

      <ul className="category-settings__list">
        {categories.map((item) => (
          <li key={item.id} className="category-settings__item">
            <div className="category-settings__info">
              <span
                className="category-settings__dot"
                style={{ background: item.color }}
                aria-hidden="true"
              />
              <span className="category-settings__name">{categoryLabel(item.id)}</span>
              {item.isSystem && (
                <span className="category-settings__badge">{t.categorySystem}</span>
              )}
            </div>

            {!item.isSystem && (
              <div className="category-settings__actions">
                {deletingId === item.id ? (
                  <>
                    <button
                      type="button"
                      className="button button--plain category-settings__cancel"
                      onClick={() => setDeletingId(null)}
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="button"
                      className="button button--plain category-settings__delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      {t.categoryDeleteConfirm}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="button button--plain category-settings__delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    {t.deleteExpense}
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="category-settings__hint">{t.categoryDeleteHint}</p>
    </div>
  )
}
