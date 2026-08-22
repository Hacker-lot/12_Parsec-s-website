import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Storm3D from '../components/Storm3D.jsx'
import { stormImages } from '../lib/stormImages.js'
import ScanAction from '../components/ScanAction.jsx'

export default function Work() {
  const root = useRef(null)
  const [selected, setSelected] = useState(null) // desktop 3D selection
  const [lightbox, setLightbox] = useState(null) // mobile lightbox image

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.fromTo(
        '.work [data-reveal]',
        { y: reducedMotion ? 0 : 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.7,
          ease: 'power4.out',
          stagger: reducedMotion ? 0 : 0.07,
        },
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
          <ScanAction label="✕ CLOSE" onClick={() => setSelected(null)} tone="ghost" compact className="storm3d__close" style={{ position: 'absolute' }} />
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
          <ScanAction label="✕" onClick={() => setLightbox(null)} ariaLabel="Close" tone="ghost" square className="lightbox__close" style={{ position: 'absolute' }} />
          <img src={lightbox.url} alt="" />
        </div>
      )}
    </div>
  )
}
