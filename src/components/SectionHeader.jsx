import './SectionHeader.css'

function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header">
      <div className="header-glow"></div>
      <h2>{title}</h2>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </div>
  )
}

export default SectionHeader
