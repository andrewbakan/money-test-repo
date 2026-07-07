const ACCENT_GRADIENT_ICON = 'url(#accent-gradient-icon)'

export function IconPerson({ className, gradient = false }) {
  const fill = gradient ? ACCENT_GRADIENT_ICON : 'currentColor'

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
    </svg>
  )
}

export function IconPlus({ className, gradient = false }) {
  const stroke = gradient ? ACCENT_GRADIENT_ICON : 'currentColor'

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke={stroke} strokeWidth="2" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </g>
    </svg>
  )
}

export function IconChart({ className, gradient = false }) {
  const stroke = gradient ? ACCENT_GRADIENT_ICON : 'currentColor'

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a9 9 0 1 0 9 9" />
        <path d="M12 12V3" />
        <path d="M12 12h8.2" />
      </g>
    </svg>
  )
}

export function IconSearch({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M16 16l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconLock({ className, gradient = false }) {
  const stroke = gradient ? ACCENT_GRADIENT_ICON : 'currentColor'

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 1 1 8 0v3" />
      </g>
    </svg>
  )
}

export function IconTags({ className, gradient = false }) {
  const stroke = gradient ? ACCENT_GRADIENT_ICON : 'currentColor'

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5 12.5 5H19v6.5L11.5 19 5 12.5Z" />
        <circle cx="15.5" cy="8.5" r="1.25" stroke={stroke} />
      </g>
    </svg>
  )
}

export function IconSettings({ className, gradient = false }) {
  const stroke = gradient ? ACCENT_GRADIENT_ICON : 'currentColor'

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 4.75V7.25M12 16.75V19.25M5.52 5.52 7.29 7.29M16.71 16.71 18.48 18.48M4.75 12H7.25M16.75 12H19.25M5.52 18.48 7.29 16.71M16.71 7.29 18.48 5.52" />
      </g>
    </svg>
  )
}
