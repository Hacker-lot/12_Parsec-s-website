import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const SKILLS = [
  'Python',
  'JavaScript',
  'React',
  'Godot',
  'Unity',
  'Three.js',
  'HTML / CSS',
  'Markov chains',
  'Networking',
  'Git',
]

const SPECS = [
  ['ALIAS', '12_Parsec'],
  ['STATUS', 'STUDENT // applying for Computer Science'],
  ['LOCATION', 'SOL SYSTEM // planet Earth'],
  ['FOCUS', 'WEB · ML · CREATIVE CODE'],
  ['OPERATING ON', 'JS · PYTHON · GODOT'],
  ['CODENAME', 'MILLENNIUM FALCON'],
]

function Portrait() {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="portrait-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2a2a2a" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="#161616" />
      <rect width="400" height="400" fill="url(#portrait-grid)" />

      {/* head silhouette */}
      <circle cx="200" cy="160" r="86" fill="#fff8e7" />
      <rect x="114" y="160" width="172" height="150" fill="#fff8e7" />

      {/* visor / helmet slit */}
      <rect x="128" y="138" width="144" height="40" fill="#00ff66" />
      <rect x="132" y="142" width="136" height="32" fill="#0d0d0d" opacity="0.5" />

      {/* antenna */}
      <line x1="200" y1="74" x2="200" y2="40" stroke="#00ff66" strokeWidth="3" />
      <circle cx="200" cy="34" r="8" fill="#00ff66" />

      <text x="24" y="52" fill="#00ff66" fontSize="20" fontFamily="'Space Mono', monospace" letterSpacing="2">
        SELF-PORTRAIT // PLACEHOLDER
      </text>
      <text x="24" y="376" fill="#8a8a8a" fontSize="13" fontFamily="'Space Mono', monospace" letterSpacing="2">
        DROP A REAL PHOTO HERE
      </text>
    </svg>
  )
}

export default function About({ orderUnlocked = false, onLaunchGame }) {
  const root = useRef(null)
  const [negative, setNegative] = useState(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.fromTo(
        '.about [data-reveal]',
        { y: reducedMotion ? 0 : 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.75,
          ease: 'power4.out',
          stagger: reducedMotion ? 0 : 0.07,
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="about">
      <div className="container about__head">
        <p className="eyebrow" data-reveal>
          // WHO AM I
        </p>
        <h1 className="section-title" data-reveal>
          HUMAN
          <br />
          <span className="accent">.EXE</span>
        </h1>
      </div>

      <div className="container about__grid">
        <div className="film" data-reveal>
          <div className="film__sprockets" />
          <div className={`film__frame${negative ? ' is-negative' : ''}`}>
            <Portrait />
            <span className="film__label">{negative ? 'POS' : 'NEG'}</span>
          </div>
          <div className="film__sprockets" />
          <button className="film__toggle" onClick={() => setNegative((v) => !v)}>
            ▸ DEVELOP AS {negative ? 'POSITIVE' : 'NEGATIVE'}
          </button>
        </div>

        <div className="about__body">
          <h1 data-reveal>
            I'M <span className="accent">12_PARSEC</span> —<br />A STUDENT WHO BUILDS.
          </h1>

          <p className="about__lead" data-reveal>
            Hi. I'm 12_Parsec — an alias, a one-man studio, and a student. I build for
            the <em>web</em>, train <em>small models</em>, and make <em>games</em> when
            the mood hits. I'm applying for Computer Science because I want to spend my
            life turning weird ideas into working machines.
          </p>

          <p className="about__focus" data-reveal>
            FOREGROUND — <b>WEB / FULL-STACK</b> · <b>AI / ML</b> · <b>CREATIVE CODE</b>
          </p>

          <p className="about__lead" data-reveal style={{ marginTop: '18px' }}>
            Raised on 80s culture and Star Wars — which is why this place runs on neon,
            monospace, and a ship that made the Kessel Run in less than twelve parsecs.
          </p>

          <div className="specs" data-reveal>
            {SPECS.map(([k, v]) => (
              <div className="specs__row" key={k}>
                <div className="specs__key">{k}</div>
                <div className="specs__val">{v}</div>
              </div>
            ))}
          </div>

          <div className="about__skills" data-reveal>
            <h2>// ARSENAL</h2>
            <div className="stack">
              {SKILLS.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="about__contact" data-reveal>
            <a className="btn" href="https://github.com/Hacker-lot" target="_blank" rel="noreferrer">
              GITHUB →
            </a>
            <a className="btn btn--ghost" href="https://12-parsec.itch.io/" target="_blank" rel="noreferrer">
              ITCH.IO →
            </a>
            {orderUnlocked && (
              <button type="button" className="btn about__game-launch" onClick={onLaunchGame} data-cursor>
                ASTEROID INTERCEPT →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
