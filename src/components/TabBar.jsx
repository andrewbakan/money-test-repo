import { IconChart, IconPlus } from './icons/Icons'

const TABS = ['add', 'analytics']

const TAB_ICON_COMPONENTS = {
  add: IconPlus,
  analytics: IconChart,
}

export default function TabBar({ activeTab, onChange, labels }) {
  return (
    <nav className="tab-bar" role="tablist">
      {TABS.map((tab) => {
        const Icon = TAB_ICON_COMPONENTS[tab]
        const isActive = activeTab === tab

        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`tab-bar__btn${isActive ? ' tab-bar__btn--active' : ''}`}
            onClick={() => onChange(tab)}
          >
            <span className="tab-bar__icon" aria-hidden="true">
              <Icon className="tab-bar__svg" gradient={isActive} />
            </span>
            <span className={`tab-bar__label${isActive ? ' gradient-text' : ''}`}>
              {labels[tab]}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
