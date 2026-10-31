export default function Card({ children, className = '', hover = true, style, ...props }) {
  return (
    <div
      className={`card ${hover ? 'card--hover' : ''} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}
