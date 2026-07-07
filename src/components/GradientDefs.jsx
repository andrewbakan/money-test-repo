export default function GradientDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="gradient-defs">
      <defs>
        <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="gradient-defs__stop gradient-defs__stop--0" />
          <stop offset="52%" className="gradient-defs__stop gradient-defs__stop--1" />
          <stop offset="100%" className="gradient-defs__stop gradient-defs__stop--2" />
        </linearGradient>

        <linearGradient
          id="accent-gradient-icon"
          gradientUnits="userSpaceOnUse"
          x1="2"
          y1="22"
          x2="22"
          y2="2"
        >
          <stop offset="0%" className="gradient-defs__stop gradient-defs__stop--0" />
          <stop offset="52%" className="gradient-defs__stop gradient-defs__stop--1" />
          <stop offset="100%" className="gradient-defs__stop gradient-defs__stop--2" />
        </linearGradient>
      </defs>
    </svg>
  )
}
