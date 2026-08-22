export default function Marquee({ items }) {
  const content = items.map((t, i) => (
    <span key={i}>
      <b>//</b> {t}
    </span>
  ))

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {content}
        {content}
      </div>
    </div>
  )
}
