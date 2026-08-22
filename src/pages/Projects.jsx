import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { projects } from '../data/projects.js'
import Cabinet3D from '../components/Cabinet3D.jsx'

export default function Projects() {
  const root = useRef(null)
  const [selected, setSelected] = useState(null)

  const active = projects.find((p) => p.id === selected) || null

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

  const detail = active ? (
    <div className="cabinet__detail" key={active.id}>
      <span className="eyebrow">
        {active.index} // {active.year}
      </span>
      <h2>{active.title}</h2>
      <p className="cabinet__sub">{active.subtitle}</p>
      <p className="cabinet__desc">{active.desc}</p>
      <div className="cabinet__tags">
        {active.tags.map((t) => (
          <span key={t} className="tag tag--accent">
            {t}
          </span>
        ))}
      </div>
      <div className="cabinet__links">
        {active.links.github && (
          <a className="btn" href={active.links.github} target="_blank" rel="noreferrer">
            GITHUB →
          </a>
        )}
        {active.links.itch && (
          <a className="btn btn--ghost" href={active.links.itch} target="_blank" rel="noreferrer">
            PLAY ON ITCH →
          </a>
        )}
      </div>
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
            <span>BRUSH VERTICAL / CLICK TO EXTRACT</span>
          </div>
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

        <div className="cabinet-detail" data-reveal>
          {detail || <div className="cabinet__empty">// PULL A FILE OUT TO READ IT</div>}
        </div>
      </div>
    </div>
  )
}
