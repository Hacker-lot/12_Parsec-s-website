import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import Marquee from '../components/Marquee.jsx'

const MARQUEE = ['WEB', 'ML', 'CREATIVE CODE', 'GAMES', 'STUDENT', 'HYPERSPACE', '12 PARSECS']

const STACK = [
  'Python',
  'JavaScript',
  'React',
  'Godot',
  'Unity',
  'Three.js',
  'HTML/CSS',
  'Markov chains',
  'Networking',
]

export default function Home() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero [data-reveal]',
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power4.out', stagger: 0.08, delay: 0.1 },
      )
      gsap.fromTo('.grid-horizon', { opacity: 0 }, { opacity: 1, duration: 1.4, delay: 0.5 })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root}>
      <section className="hero container">
        <p className="eyebrow" data-reveal>
          // ASSET ID 12_PARSEC — SOLO STUDIO
        </p>

        <h1 className="hero__title" data-reveal>
          <span className="outline">12_PARSEC</span>
          <br />
          <span className="accent">STUDIO</span>
        </h1>

        <p className="hero__tagline" data-reveal>
          Made the Kessel Run in <em>less than twelve parsecs</em>.
        </p>

        <p className="hero__body" data-reveal>
          A one-man studio. Student, builder, 80s kid. I make things for the web, train
          small models, and ship games when the mood hits — somewhere between a terminal
          and hyperspace.
        </p>

        <div className="hero__cta" data-reveal>
          <Link to="/work" className="btn">
            VIEW WORK →
          </Link>
          <Link to="/about" className="btn btn--ghost">
            WHO AM I →
          </Link>
        </div>

        <div className="hero__meta" data-reveal>
          <div>
            FOCUS — <b>WEB · ML · CREATIVE</b>
          </div>
          <div>
            STATUS — <b>APPLYING FOR CS</b>
          </div>
          <div>
            SHIP — <b>MILLENNIUM FALCON</b>
          </div>
        </div>

        <div className="grid-horizon" aria-hidden="true" />
      </section>

      <Marquee items={MARQUEE} />

      <section className="container" style={{ padding: '56px 0 96px' }}>
        <p className="eyebrow">// FREQUENTLY USED</p>
        <div className="stack" style={{ marginTop: '18px' }}>
          {STACK.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
