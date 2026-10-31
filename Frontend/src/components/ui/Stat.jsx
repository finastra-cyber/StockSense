/**
 * KPI stat card
 */
import Sparkline from './Sparkline.jsx'

export default function Stat({ label, value, sub, sparkData, icon, accent, loading }) {
  return (
    <div className="kpi-card">
      {accent && <div className="kpi-card__accent" style={{ background: accent }} />}
      <div className="kpi-card__head">
        {icon && <span className="kpi-card__icon">{icon}</span>}
        <span className="kpi-card__label">{label}</span>
      </div>
      <div className="kpi-card__value">
        {loading
          ? <span className="skeleton" style={{ height: 28, width: '70%', display: 'block' }} />
          : value}
      </div>
      {sub && <div className="kpi-card__sub">{loading ? <span className="skeleton" style={{ height: 11, width: '50%' }} /> : sub}</div>}
      {sparkData && !loading && (
        <div style={{ marginTop: '8px' }}>
          <Sparkline data={sparkData} height={36} />
        </div>
      )}
    </div>
  )
}
