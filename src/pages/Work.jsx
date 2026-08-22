import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Storm3D from '../components/Storm3D.jsx'
import { stormImages } from '../lib/stormImages.js'

export default function Work() {
  const root = useRef(null)
  const [selected, setSelected] = useState(null) // desktop 3D selection
  const [lightbox, setLightbox] = useState(null) // mobile lightbox image

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.work [data-reveal]',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power4.out', stagger: 0.07 },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="work">
      <div className="work__head container" data-reveal>
        <p className="eyebrow">// PHOTO STORM</p>
      </div>

      <div className="storm3d-wrap">
        <Storm3D images={stormImages} selectedId={selected} onSelect={setSelected} />
        {selected != null && (
          <button className="storm3d__close" onClick={() => setSelected(null)} data-cursor>
            ✕ CLOSE
          </button>
        )}
      </div>

      {/* mobile fallback — a photo grid */}
      <div className="storm-mobile">
        {stormImages.map((img) => (
          <button
            key={img.id}
            className="storm-mobile__photo"
            onClick={() => setLightbox(img)}
            data-cursor
          >
            <img src={img.url} alt="" loading="lazy" />
          </button>
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox__close" aria-label="Close">
            ✕
          </button>
          <img src={lightbox.url} alt="" />
        </div>
      )}
    </div>
  )
}
