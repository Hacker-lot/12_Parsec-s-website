import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { projects } from '../data/projects.js'
import Cabinet3D from '../components/Cabinet3D.jsx'

export default function Projects() {
  const root = useRef(null)
  const [selected, setSelected] = useState(null)

  const active = projects.find((p) => p.id === selected) || null

  useEffect(() => {
    if (!active) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [active])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.fromTo(
        '.projects [data-reveal]',
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

  const dossier = active ? (
    <div
      className="cabinet-popup"
      key={active.id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-${active.id}-title`}
    >
      <div className="cabinet-popup__tab" aria-hidden="true">
        {active.codeName || active.title}
      </div>
      <button
        type="button"
        className="cabinet-popup__close"
        onClick={() => setSelected(null)}
        aria-label="Close project file"
        data-cursor
      >
        ×
      </button>

      <div className="cabinet-popup__meta">
        <span>FILE // {active.index}</span>
        <span>{active.year}</span>
      </div>
      <p className="cabinet-popup__classification">PROJECT DOSSIER</p>
      <h2 id={`project-${active.id}-title`}>{active.title}</h2>
      <p className="cabinet-popup__sub">{active.subtitle}</p>
      <div className="cabinet-popup__rule" aria-hidden="true" />
      <p className="cabinet-popup__desc">{active.desc}</p>
      <div className="cabinet-popup__tags">
        {active.tags.map((t) => (
          <span key={t} className="cabinet-popup__tag">
            {t}
          </span>
        ))}
      </div>
      <div className="cabinet-popup__links">
        {active.links.site && (
          <a className="btn cabinet-popup__link" href={active.links.site} target="_blank" rel="noreferrer">
            OPEN SITE →
          </a>
        )}
        {active.links.github && (
          <a className="btn cabinet-popup__link" href={active.links.github} target="_blank" rel="noreferrer">
            GITHUB →
          </a>
        )}
        {active.links.itch && (
          <a className="btn cabinet-popup__link cabinet-popup__link--ghost" href={active.links.itch} target="_blank" rel="noreferrer">
            PLAY ON ITCH →
          </a>
        )}
      </div>
      <div className="cabinet-popup__stamp" aria-hidden="true">CLEARED // 12P</div>
    </div>
  ) : null

  return (
    <div ref={root} className="projects">
      <div className="container projects__head" data-reveal>
        <p className="eyebrow">// ARCHIVE</p>
        <h1 className="section-title">
          FILE
          <br />
          CABINET
        </h1>
      </div>

      <div className="container">
        <div className="cabinet3d-wrap" data-reveal>
          <Cabinet3D projects={projects} selectedId={selected} onSelect={setSelected} />
          <div className="cabinet3d__hud cabinet3d__hud--top" aria-hidden="true">
            <span>DRAWER 01</span>
            <span>SEC // PROJECTS</span>
          </div>
          <div className="cabinet3d__gesture" aria-hidden="true">
            <span className="cabinet3d__gesture-line" />
            <span>SCROLL OR BRUSH VERTICAL / CLICK TO EXTRACT</span>
          </div>
          {active && (
            <button
              type="button"
              className="cabinet-popup__veil"
              onClick={() => setSelected(null)}
              aria-label="Close project file"
            />
          )}
          {dossier}
        </div>

        <div className="cabinet-tabs" data-reveal aria-label="Project files">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className={`cabinet-tab${selected === project.id ? ' is-active' : ''}`}
              onClick={() => setSelected(selected === project.id ? null : project.id)}
              aria-pressed={selected === project.id}
              data-cursor
            >
              <span>{project.index}</span>
              {project.codeName || project.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
