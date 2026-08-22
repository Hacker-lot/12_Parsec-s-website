import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import GlitchEffect from '../components/originkit/ui/glitch-text.tsx'
import ScanAction from '../components/ScanAction.jsx'

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

function TeapotPortrait() {
  return (
    <div className="teapot-error" role="img" aria-label="HTTP 418: I'm a teapot. Portrait data intentionally unavailable.">
      <div className="teapot-error__grid" aria-hidden="true" />
      <div className="teapot-error__noise" aria-hidden="true" />
      <div className="teapot-error__header">
        <span>IDENT // REDACTED</span>
        <span>RFC 2324</span>
      </div>

      <div className="teapot-error__pot" aria-hidden="true">
        <svg viewBox="0 0 180 130" fill="none">
          <path d="M47 48h76l-8 55H57L47 48Z" />
          <path d="M55 48c3-18 12-27 31-27h4c19 0 28 9 31 27" />
          <path d="M69 21V10h39v11" />
          <path d="M120 55c30-7 39 1 36 15-3 16-20 24-39 22" />
          <path d="M49 57 20 71l30 8" />
          <path d="M65 104v12m41-12v12M55 116h62" />
          <path className="teapot-error__steam" d="M76 7c-8-9 8-12 0-22M100 7c8-9-8-12 0-22" />
        </svg>
      </div>

      <div className="teapot-error__code">
        <span className="teapot-error__code-base" aria-hidden="true">418</span>
        <GlitchEffect
          text="418"
          color="#fff8e7"
          font={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: 104,
            fontWeight: 900,
            letterSpacing: -7,
            lineHeight: 0.82,
          }}
          playMode="enter"
          startAlign="top"
          infinite
          shake={{ enabled: true, intensity: 7, x: 5, y: 2 }}
          slice={{ enabled: true, intensity: 9, minHeight: 8, maxHeight: 46 }}
        />
      </div>

      <p className="teapot-error__message" data-text="I'M A TEAPOT">I'M A TEAPOT</p>
      <p className="teapot-error__sub">PORTRAIT REQUEST REFUSED<br />THE SUBJECT IS BREWING.</p>
      <div className="teapot-error__status">
        <span>ERR // SHORT_AND_STOUT</span>
        <i />
        <span>IDENTITY LEAK: 0.00%</span>
      </div>

      <span className="teapot-error__slice teapot-error__slice--one" aria-hidden="true">418 // TEAPOT</span>
      <span className="teapot-error__slice teapot-error__slice--two" aria-hidden="true">PORTRAIT NULL</span>
      <span className="teapot-error__slice teapot-error__slice--three" aria-hidden="true">RFC 2324</span>
    </div>
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
            <TeapotPortrait />
            <span className="film__label">{negative ? 'POS' : 'NEG'}</span>
          </div>
          <div className="film__sprockets" />
          <ScanAction
            label={`▸ DEVELOP AS ${negative ? 'POSITIVE' : 'NEGATIVE'}`}
            onClick={() => setNegative((v) => !v)}
            tone="ghost"
            compact
            fullWidth
            className="film__toggle"
          />
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
            <ScanAction
              label="GITHUB →"
              href="https://github.com/Hacker-lot"
              newTab
            />
            <ScanAction
              label="ITCH.IO →"
              href="https://12-parsec.itch.io/"
              newTab
              tone="ghost"
            />
            {orderUnlocked && (
              <ScanAction label="ASTEROID INTERCEPT →" onClick={onLaunchGame} className="about__game-launch" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
