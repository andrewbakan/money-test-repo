import { useId, useState } from 'react'

export default function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultExpanded = true,
  className = '',
}) {
  const contentId = useId()
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <section
      className={`section profile-section${expanded ? ' profile-section--expanded' : ''}${className ? ` ${className}` : ''}`}
    >
      <button
        type="button"
        className="profile-section__trigger"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls={contentId}
      >
        <span className="profile-section__leading">
          {Icon && (
            <span className="profile-section__icon" aria-hidden="true">
              <Icon className="profile-section__svg" gradient={expanded} />
            </span>
          )}
          <span className="profile-section__title">{title}</span>
        </span>
        <span className="profile-section__chevron" aria-hidden="true">
          ›
        </span>
      </button>

      <div id={contentId} className="profile-section__content" hidden={!expanded}>
        {children}
      </div>
    </section>
  )
}
